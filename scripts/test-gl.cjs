const gl = require('gl');
const ctx = gl(640, 480);
if (ctx) {
  console.log('GL OK');
  console.log('GL version:', ctx.getParameter(ctx.VERSION));
  console.log('GL renderer:', ctx.getParameter(ctx.RENDERER));
} else {
  console.log('GL context is null');
}
