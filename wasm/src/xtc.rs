/// XTC (GROMACS trajectory) binary format parser.
///
/// Port of the xdrfile BSD-licensed decompression algorithm
/// (Erik Lindahl & David van der Spoel, 2009-2014).

/// Magic number that identifies an XTC frame header.
const XTC_MAGIC: i32 = 1995;

const FIRSTIDX: usize = 9;

#[rustfmt::skip]
static MAGICINTS: [u32; 73] = [
    0,        0,        0,        0,        0,        0,        0,        0,        0,        8,
    10,       12,       16,       20,       25,       32,       40,       50,       64,       80,
    101,      128,      161,      203,      256,      322,      406,      512,      645,      812,
    1024,     1290,     1625,     2048,     2580,     3250,     4096,     5060,     6501,     8192,
    10321,    13003,    16384,    20642,    26007,    32768,    41285,    52015,    65536,    82570,
    104031,   131072,   165140,   208063,   262144,   330280,   416127,   524287,   660561,   832255,
    1048576,  1321122,  1664510,  2097152,  2642245,  3329021,  4194304,  5284491,  6658042,  8388607,
    10568983, 13316085, 16777216,
];

/// Parsed XTC trajectory data.
pub struct XtcData {
    pub n_atoms: usize,
    pub n_frames: usize,
    pub timestep_ps: f32,
    pub box_matrix: Option<[f32; 9]>,
    pub frame_positions: Vec<Vec<f32>>,
}

// ---------- XDR primitive readers ----------

struct XdrReader<'a> {
    data: &'a [u8],
    pos: usize,
}

impl<'a> XdrReader<'a> {
    fn new(data: &'a [u8]) -> Self {
        Self { data, pos: 0 }
    }

    fn remaining(&self) -> usize {
        self.data.len().saturating_sub(self.pos)
    }

    fn read_i32(&mut self) -> Result<i32, String> {
        if self.pos + 4 > self.data.len() {
            return Err("unexpected end of data reading i32".into());
        }
        let val = i32::from_be_bytes([
            self.data[self.pos],
            self.data[self.pos + 1],
            self.data[self.pos + 2],
            self.data[self.pos + 3],
        ]);
        self.pos += 4;
        Ok(val)
    }

    fn read_f32(&mut self) -> Result<f32, String> {
        Ok(f32::from_bits(self.read_i32()? as u32))
    }

    fn read_u32(&mut self) -> Result<u32, String> {
        Ok(self.read_i32()? as u32)
    }

    /// Read `n` raw bytes, advancing position (XDR pads to 4-byte boundary).
    fn read_opaque(&mut self, n: usize) -> Result<&'a [u8], String> {
        let padded = (n + 3) & !3;
        if self.pos + padded > self.data.len() {
            return Err("unexpected end of data reading opaque".into());
        }
        let slice = &self.data[self.pos..self.pos + n];
        self.pos += padded;
        Ok(slice)
    }
}

// ---------- Bitstream reader for compressed coords ----------

struct BitReader {
    buf: Vec<u8>,
    cnt: usize,
    lastbits: u32,
    lastbyte: u32,
}

impl BitReader {
    fn new(data: &[u8]) -> Self {
        Self {
            buf: data.to_vec(),
            cnt: 0,
            lastbits: 0,
            lastbyte: 0,
        }
    }

    fn decode_bits(&mut self, mut num_of_bits: u32) -> u32 {
        let mask = (1u32 << num_of_bits) - 1;
        let mut num: u32 = 0;

        while num_of_bits >= 8 {
            self.lastbyte = (self.lastbyte << 8) | self.buf[self.cnt] as u32;
            self.cnt += 1;
            num |= (self.lastbyte >> self.lastbits) << (num_of_bits - 8);
            num_of_bits -= 8;
        }
        if num_of_bits > 0 {
            if self.lastbits < num_of_bits {
                self.lastbits += 8;
                self.lastbyte = (self.lastbyte << 8) | self.buf[self.cnt] as u32;
                self.cnt += 1;
            }
            self.lastbits -= num_of_bits;
            num |= (self.lastbyte >> self.lastbits) & ((1u32 << num_of_bits) - 1);
        }
        num & mask
    }

    fn decode_ints(&mut self, num_of_ints: usize, num_of_bits: u32, sizes: &[u32]) -> Vec<i32> {
        let mut bytes = [0u32; 32];
        let mut num_of_bytes: usize = 0;
        let mut remaining_bits = num_of_bits;

        while remaining_bits > 8 {
            bytes[num_of_bytes] = self.decode_bits(8);
            num_of_bytes += 1;
            remaining_bits -= 8;
        }
        if remaining_bits > 0 {
            bytes[num_of_bytes] = self.decode_bits(remaining_bits);
            num_of_bytes += 1;
        }

        let mut nums = vec![0i32; num_of_ints];
        for i in (1..num_of_ints).rev() {
            let mut num: u32 = 0;
            for j in (0..num_of_bytes).rev() {
                num = (num << 8) | bytes[j];
                let p = num / sizes[i];
                bytes[j] = p;
                num -= p * sizes[i];
            }
            nums[i] = num as i32;
        }
        nums[0] = (bytes[0]
            | (bytes[1] << 8)
            | (bytes[2] << 16)
            | (bytes[3] << 24)) as i32;

        nums
    }
}

// ---------- Helper functions ----------

fn sizeofint(size: u32) -> u32 {
    let mut num: u32 = 1;
    let mut bits: u32 = 0;
    while size >= num && bits < 32 {
        bits += 1;
        num <<= 1;
    }
    bits
}

fn sizeofints(num_of_ints: usize, sizes: &[u32]) -> u32 {
    let mut bytes = [0u32; 32];
    let mut num_of_bytes: usize = 1;
    bytes[0] = 1;

    for i in 0..num_of_ints {
        let mut tmp: u64 = 0;
        for bytecnt in 0..num_of_bytes {
            tmp = bytes[bytecnt] as u64 * sizes[i] as u64 + tmp;
            bytes[bytecnt] = (tmp & 0xff) as u32;
            tmp >>= 8;
        }
        while tmp != 0 {
            bytes[num_of_bytes] = (tmp & 0xff) as u32;
            num_of_bytes += 1;
            tmp >>= 8;
        }
    }

    let mut num: u32 = 1;
    let mut num_of_bits: u32 = 0;
    let last = num_of_bytes - 1;
    while bytes[last] >= num {
        num_of_bits += 1;
        num *= 2;
    }
    num_of_bits + last as u32 * 8
}

// ---------- Decompress one frame's coordinates ----------

fn decompress_coords(xdr: &mut XdrReader, natoms: usize) -> Result<Vec<f32>, String> {
    // Read lsize (number of atoms in coordinate block)
    let lsize = xdr.read_i32()? as usize;
    if lsize != natoms {
        return Err(format!(
            "coord block size {} != natoms {}",
            lsize, natoms
        ));
    }

    let size3 = natoms * 3;

    // Small atom count: plain XDR floats
    if natoms <= 9 {
        let mut coords = Vec::with_capacity(size3);
        for _ in 0..size3 {
            coords.push(xdr.read_f32()?);
        }
        return Ok(coords);
    }

    // Read precision
    let precision = xdr.read_f32()?;
    if precision == 0.0 {
        return Err("zero precision in XTC".into());
    }
    let inv_precision = 1.0f32 / precision;

    // Read min/max integer coords
    let mut minint = [0i32; 3];
    let mut maxint = [0i32; 3];
    for v in &mut minint {
        *v = xdr.read_i32()?;
    }
    for v in &mut maxint {
        *v = xdr.read_i32()?;
    }

    let mut sizeint = [0u32; 3];
    for i in 0..3 {
        sizeint[i] = (maxint[i] - minint[i] + 1) as u32;
    }

    // Determine encoding mode
    let mut bitsizeint = [0u32; 3];
    let bitsize;
    if (sizeint[0] | sizeint[1] | sizeint[2]) > 0x00ff_ffff {
        bitsizeint[0] = sizeofint(sizeint[0]);
        bitsizeint[1] = sizeofint(sizeint[1]);
        bitsizeint[2] = sizeofint(sizeint[2]);
        bitsize = 0;
    } else {
        bitsize = sizeofints(3, &sizeint);
    }

    let mut smallidx = xdr.read_i32()? as usize;
    let tmp_idx = if smallidx > 0 { smallidx - 1 } else { 0 };
    let tmp_idx = if FIRSTIDX > tmp_idx {
        FIRSTIDX
    } else {
        tmp_idx
    };
    let mut smaller = MAGICINTS[tmp_idx] / 2;
    let mut smallnum = MAGICINTS[smallidx] / 2;
    let mut sizesmall = [MAGICINTS[smallidx]; 3];

    // Read compressed bitstream
    let nbytes = xdr.read_u32()? as usize;
    let bitstream_data = xdr.read_opaque(nbytes)?;

    let mut bits = BitReader::new(bitstream_data);

    // Decompress
    let mut coords = vec![0i32; size3];
    let mut output = Vec::with_capacity(size3);
    let mut prevcoord = [0i32; 3];

    let mut i: usize = 0;
    while i < natoms {
        // Read large (absolute) coordinate
        let this = i * 3;
        if bitsize == 0 {
            coords[this] = bits.decode_bits(bitsizeint[0]) as i32;
            coords[this + 1] = bits.decode_bits(bitsizeint[1]) as i32;
            coords[this + 2] = bits.decode_bits(bitsizeint[2]) as i32;
        } else {
            let decoded = bits.decode_ints(3, bitsize, &sizeint);
            coords[this] = decoded[0];
            coords[this + 1] = decoded[1];
            coords[this + 2] = decoded[2];
        }

        i += 1;
        coords[this] += minint[0];
        coords[this + 1] += minint[1];
        coords[this + 2] += minint[2];

        prevcoord[0] = coords[this];
        prevcoord[1] = coords[this + 1];
        prevcoord[2] = coords[this + 2];

        // Read run-length flag
        let flag = bits.decode_bits(1);
        let mut is_smaller: i32 = 0;
        let mut run: usize = 0;
        if flag == 1 {
            let run_val = bits.decode_bits(5) as i32;
            is_smaller = run_val % 3;
            run = (run_val - is_smaller) as usize;
            is_smaller -= 1;
        }

        // Decode run of small (delta) coordinates
        if run > 0 {
            for k in (0..run).step_by(3) {
                let ri = i * 3;
                let decoded = bits.decode_ints(3, smallidx as u32, &sizesmall);
                coords[ri] = decoded[0];
                coords[ri + 1] = decoded[1];
                coords[ri + 2] = decoded[2];
                i += 1;

                coords[ri] += prevcoord[0] - smallnum as i32;
                coords[ri + 1] += prevcoord[1] - smallnum as i32;
                coords[ri + 2] += prevcoord[2] - smallnum as i32;

                if k == 0 {
                    // Swap first run coord with the large coord
                    let swap0 = coords[ri];
                    coords[ri] = prevcoord[0];
                    prevcoord[0] = swap0;
                    let swap1 = coords[ri + 1];
                    coords[ri + 1] = prevcoord[1];
                    prevcoord[1] = swap1;
                    let swap2 = coords[ri + 2];
                    coords[ri + 2] = prevcoord[2];
                    prevcoord[2] = swap2;

                    output.push(prevcoord[0] as f32 * inv_precision);
                    output.push(prevcoord[1] as f32 * inv_precision);
                    output.push(prevcoord[2] as f32 * inv_precision);
                } else {
                    prevcoord[0] = coords[ri];
                    prevcoord[1] = coords[ri + 1];
                    prevcoord[2] = coords[ri + 2];
                }
                output.push(coords[ri] as f32 * inv_precision);
                output.push(coords[ri + 1] as f32 * inv_precision);
                output.push(coords[ri + 2] as f32 * inv_precision);
            }
        } else {
            output.push(coords[this] as f32 * inv_precision);
            output.push(coords[this + 1] as f32 * inv_precision);
            output.push(coords[this + 2] as f32 * inv_precision);
        }

        // Adjust smallidx
        smallidx = (smallidx as i32 + is_smaller) as usize;
        if is_smaller < 0 {
            smallnum = smaller;
            if smallidx > FIRSTIDX {
                smaller = MAGICINTS[smallidx - 1] / 2;
            } else {
                smaller = 0;
            }
        } else if is_smaller > 0 {
            smaller = smallnum;
            smallnum = MAGICINTS[smallidx] / 2;
        }
        sizesmall = [MAGICINTS[smallidx]; 3];
        if sizesmall[0] == 0 {
            return Err("invalid sizesmall in xdr3dfcoord".into());
        }
    }

    // GROMACS XTC stores coordinates in nanometers; convert to Angstroms
    for v in &mut output {
        *v *= 10.0;
    }

    Ok(output)
}

// ---------- Public API ----------

/// Parse an XTC binary trajectory and return all frames.
pub fn parse_xtc(data: &[u8]) -> Result<XtcData, String> {
    let mut xdr = XdrReader::new(data);
    let mut frame_positions: Vec<Vec<f32>> = Vec::new();
    let mut n_atoms: usize = 0;
    let mut first_time: f32 = 0.0;
    let mut second_time: f32 = 0.0;
    let mut last_box: Option<[f32; 9]> = None;

    while xdr.remaining() >= 16 {
        // Frame header
        let magic = match xdr.read_i32() {
            Ok(m) => m,
            Err(_) => break, // EOF
        };
        if magic != XTC_MAGIC {
            return Err(format!("bad XTC magic: {} (expected {})", magic, XTC_MAGIC));
        }

        let frame_natoms = xdr.read_i32()? as usize;
        if frame_natoms == 0 {
            return Err("zero atoms in XTC frame".into());
        }
        if n_atoms == 0 {
            n_atoms = frame_natoms;
        } else if frame_natoms != n_atoms {
            return Err(format!(
                "inconsistent atom count: {} vs {}",
                frame_natoms, n_atoms
            ));
        }

        let _step = xdr.read_i32()?;
        let time = xdr.read_f32()?;

        if frame_positions.is_empty() {
            first_time = time;
        } else if frame_positions.len() == 1 {
            second_time = time;
        }

        // Box vectors (3x3, in nm)
        let mut box_mat = [0f32; 9];
        for v in &mut box_mat {
            *v = xdr.read_f32()? * 10.0; // nm -> Angstrom
        }
        last_box = Some(box_mat);

        // Decompress coordinate data
        let positions = decompress_coords(&mut xdr, n_atoms)?;
        frame_positions.push(positions);
    }

    if frame_positions.is_empty() {
        return Err("no frames found in XTC file".into());
    }

    let timestep_ps = if frame_positions.len() > 1 {
        second_time - first_time
    } else {
        1.0
    };

    Ok(XtcData {
        n_atoms,
        n_frames: frame_positions.len(),
        timestep_ps,
        box_matrix: last_box,
        frame_positions,
    })
}
