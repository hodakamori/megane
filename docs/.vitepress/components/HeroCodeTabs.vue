<script setup lang="ts">
import { ref } from "vue";

const activeTab = ref(0);

const tabs = [
  { label: "Python" },
  { label: "CLI" },
  { label: "React" },
];
</script>

<template>
  <div class="hero-code-tabs">
    <div class="tab-buttons">
      <button
        v-for="(tab, i) in tabs"
        :key="tab.label"
        :class="['tab-button', { active: activeTab === i }]"
        @click="activeTab = i"
      >
        {{ tab.label }}
      </button>
    </div>
    <div class="tab-content">
      <!-- Python -->
      <pre v-show="activeTab === 0"><code><span class="kn">import</span> <span class="nn">megane</span>

<span class="n">viewer</span> <span class="o">=</span> <span class="n">megane</span><span class="o">.</span><span class="n">MolecularViewer</span><span class="p">()</span>
<span class="n">viewer</span><span class="o">.</span><span class="n">load</span><span class="p">(</span><span class="s">"protein.pdb"</span><span class="p">)</span>
<span class="n">viewer</span></code></pre>
      <!-- CLI -->
      <pre v-show="activeTab === 1"><code><span class="c">$ </span><span class="n">megane serve protein.pdb</span>

<span class="c">Serving on </span><span class="s">http://localhost:8765</span></code></pre>
      <!-- React -->
      <pre v-show="activeTab === 2"><code><span class="kn">import</span> <span class="p">{</span> <span class="n">useMeganeLocal</span><span class="p">,</span> <span class="nc">MeganeViewer</span> <span class="p">}</span> <span class="kn">from</span> <span class="s">"megane"</span>

<span class="kn">const</span> <span class="n">mol</span> <span class="o">=</span> <span class="n">useMeganeLocal</span><span class="p">()</span>
<span class="n">mol</span><span class="o">.</span><span class="n">loadFile</span><span class="p">(</span><span class="s">"protein.pdb"</span><span class="p">)</span>

<span class="o">&lt;</span><span class="nc">MeganeViewer</span> <span class="na">snapshot</span><span class="o">=</span><span class="p">{</span><span class="n">mol</span><span class="o">.</span><span class="n">snapshot</span><span class="p">}</span> <span class="o">/&gt;</span></code></pre>
    </div>
  </div>
</template>

<style scoped>
.hero-code-tabs {
  margin-top: 24px;
  width: 100%;
  max-width: 420px;
  text-align: left;
}

.tab-buttons {
  display: flex;
  border-bottom: 1px solid var(--vp-c-divider);
}

.tab-button {
  padding: 6px 16px;
  font-size: 13px;
  font-weight: 500;
  font-family: var(--vp-font-family-base);
  color: var(--vp-c-text-2);
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: color 0.2s, border-color 0.2s;
}

.tab-button:hover {
  color: var(--vp-c-text-1);
}

.tab-button.active {
  color: var(--vp-c-brand-1);
  border-bottom-color: var(--vp-c-brand-1);
}

.tab-content {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-top: none;
  border-radius: 0 0 8px 8px;
  overflow: hidden;
}

.tab-content pre {
  margin: 0;
  padding: 16px 20px;
  font-family: var(--vp-font-family-mono);
  font-size: 13px;
  line-height: 1.7;
  overflow-x: auto;
  text-align: left;
}

.tab-content code {
  font-family: inherit;
  font-size: inherit;
}

/* Syntax highlighting - light */
.tab-content .kn { color: #008000; font-weight: bold; }
.tab-content .nn { color: #0000ff; font-weight: bold; }
.tab-content .nc { color: #0000ff; font-weight: bold; }
.tab-content .na { color: #687822; }
.tab-content .n { color: var(--vp-c-text-1); }
.tab-content .o { color: #666666; }
.tab-content .p { color: var(--vp-c-text-1); }
.tab-content .s { color: #ba2121; }
.tab-content .m { color: #666666; }
.tab-content .c { color: #3d7b7b; }

/* Syntax highlighting - dark */
.dark .tab-content .kn { color: #c586c0; font-weight: normal; }
.dark .tab-content .nn { color: #4ec9b0; font-weight: normal; }
.dark .tab-content .nc { color: #4ec9b0; font-weight: normal; }
.dark .tab-content .na { color: #9cdcfe; }
.dark .tab-content .n { color: #d4d4d4; }
.dark .tab-content .o { color: #d4d4d4; }
.dark .tab-content .p { color: #d4d4d4; }
.dark .tab-content .s { color: #ce9178; }
.dark .tab-content .m { color: #b5cea8; }
.dark .tab-content .c { color: #6a9955; }
</style>
