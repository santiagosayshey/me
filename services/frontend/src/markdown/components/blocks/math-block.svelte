<script lang="ts">
  import { onMount } from 'svelte';
  import katex from 'katex';
  import type { MathBlock } from '$parsers/math';
  
  export let block: MathBlock;
  
  let mathElement: HTMLElement;
  let error: string | null = null;
  
  onMount(() => {
    try {
      katex.render(block.latex, mathElement, {
        displayMode: block.display,
        throwOnError: false,
        errorColor: '#ef4444',
        trust: true,
        strict: false,
        macros: {
          "\\RR": "\\mathbb{R}",
          "\\NN": "\\mathbb{N}",
          "\\ZZ": "\\mathbb{Z}",
          "\\QQ": "\\mathbb{Q}",
          "\\CC": "\\mathbb{C}"
        }
      });
    } catch (e) {
      console.error('KaTeX error:', e);
      error = e instanceof Error ? e.message : 'Failed to render math';
    }
  });
</script>

<svelte:head>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css" crossorigin="anonymous">
</svelte:head>

{#if block.display}
  <div class="my-6">
    <div 
      bind:this={mathElement}
      class="text-center text-lg math-block"
    >
      {#if error}
        <span class="text-red-500 font-mono text-sm">{error}</span>
      {/if}
    </div>
  </div>
{:else}
  <span 
    bind:this={mathElement}
    class="inline-block mx-1 align-middle"
  >
    {#if error}
      <span class="text-red-500 font-mono text-xs">{error}</span>
    {/if}
  </span>
{/if}

<style>
  /* Prevent cramping & horizontal scroll */
  .math-block {
    overflow-wrap: break-word;
    white-space: normal;
    max-width: 100%;
    line-height: 1.6;
  }

  /* Let big display equations wrap gracefully */
  .math-block :global(.katex-display) {
    overflow-x: visible;
    overflow-y: visible;
    white-space: normal;
    text-align: center;
    margin: 1em 0;
  }

  /* Make inline math align nicely with text */
  :global(.katex) {
    font-size: 1em;
  }
</style>
