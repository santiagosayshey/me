<script lang="ts">
  import { onMount } from 'svelte';
  import katex from 'katex';
  import type { TextToken } from '$parsers/text';
  
  export let tokens: TextToken[];
  
  function renderMath(element: HTMLElement, latex: string) {
    try {
      katex.render(latex, element, {
        displayMode: false,
        throwOnError: false,
        errorColor: '#ef4444',
        trust: true,
        strict: false
      });
    } catch (e) {
      console.error('KaTeX inline error:', e);
      element.textContent = latex;
      element.classList.add('text-red-500');
    }
  }
</script>

{#each tokens as token}
  {#if token.type === 'text'}
    <span class="text-neutral-900 dark:text-neutral-100">{token.content}</span>
  {:else if token.type === 'bold'}
    <strong class="font-bold text-neutral-900 dark:text-neutral-100">{token.content}</strong>
  {:else if token.type === 'italic'}
    <em class="italic text-neutral-900 dark:text-neutral-100">{token.content}</em>
  {:else if token.type === 'boldItalic'}
    <strong class="font-bold italic text-neutral-900 dark:text-neutral-100">{token.content}</strong>
  {:else if token.type === 'code'}
                    <code class="bg-neutral-100 dark:bg-neutral-800 shadow-inner px-1.5 py-0.5 rounded-md text-sm font-mono text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700">{token.content}</code>
  {:else if token.type === 'strikethrough'}
    <del class="line-through text-neutral-500 dark:text-neutral-400">{token.content}</del>
  {:else if token.type === 'subscript'}
    <sub class="text-xs text-neutral-900 dark:text-neutral-100">{token.content}</sub>
  {:else if token.type === 'superscript'}
    <sup class="text-xs text-neutral-900 dark:text-neutral-100">{token.content}</sup>
  {:else if token.type === 'highlight'}
    <mark class="bg-blue-100 dark:bg-blue-500/20 text-neutral-900 dark:text-neutral-100 px-1 py-0.5 rounded">{token.content}</mark>
  {:else if token.type === 'underline'}
    <u class="underline text-neutral-900 dark:text-neutral-100">{token.content}</u>
  {:else if token.type === 'mark'}
    <mark class="bg-blue-100 dark:bg-blue-500/20 text-neutral-900 dark:text-neutral-100 px-1 py-0.5 rounded">{token.content}</mark>
  {:else if token.type === 'linebreak'}
    <br />
  {:else if token.type === 'link'}
    <a 
      href={token.href} 
      title={token.title || ''} 
      class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline decoration-blue-600/30 dark:decoration-blue-400/30 hover:decoration-blue-600 dark:hover:decoration-blue-400 transition-colors"
    >
      {token.content}
    </a>
  {:else if token.type === 'footnote'}
    <sup>
      <a 
        href="#fn-{token.footnoteId}" 
        id="fnref-{token.footnoteId}" 
        class="footnote-ref text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
      >
        [{token.footnoteNumber || token.content}]
      </a>
    </sup>
  {:else if token.type === 'math'}
    <span
      class="inline-block mx-0.5 text-neutral-900 dark:text-white"
      use:renderMath={token.content}
    ></span>
  {/if}
{/each}