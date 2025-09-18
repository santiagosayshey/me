<script lang="ts">
  import type { HeadingBlock } from '$parsers/heading';
  
  export let block: HeadingBlock;
</script>

{#if block.level === 1}
  <h1 id={block.id} class="text-4xl font-bold mt-8 mb-4 text-neutral-900 dark:text-neutral-100">{block.text}</h1>
{:else if block.level === 2}
  <h2 id={block.id} class="text-3xl font-semibold mt-6 mb-3 text-neutral-900 dark:text-neutral-100">{block.text}</h2>
{:else if block.level === 3}
  <h3 id={block.id} class="text-2xl font-semibold mt-5 mb-3 text-neutral-900 dark:text-neutral-100">{block.text}</h3>
{:else if block.level === 4}
  <h4 id={block.id} class="text-xl font-medium mt-4 mb-2 text-neutral-800 dark:text-neutral-200">{block.text}</h4>
{:else if block.level === 5}
  <h5 id={block.id} class="text-lg font-medium mt-3 mb-2 text-neutral-800 dark:text-neutral-200">{block.text}</h5>
{:else if block.level === 6}
  <h6 id={block.id} class="text-base font-medium mt-3 mb-2 text-neutral-700 dark:text-neutral-300">{block.text}</h6>
{/if}