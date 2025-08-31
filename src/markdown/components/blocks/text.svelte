<script lang="ts">
  import type { TextToken } from '$parsers/text';
  
  export let tokens: TextToken[];
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
    <code class="bg-blue-50 dark:bg-blue-950/30 px-2 py-1 rounded-md text-sm font-mono text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50">{token.content}</code>
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
  {/if}
{/each}