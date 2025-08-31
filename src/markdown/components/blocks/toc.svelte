<script lang="ts">
  import type { TocBlock } from '$parsers/toc';
  import { ChevronRight } from 'lucide-svelte';
  
  export let block: TocBlock;
  
  function scrollToHeading(id: string) {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80; // Adjust this value for more or less padding
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }
</script>

<nav class="my-8 p-6 bg-neutral-50 dark:bg-neutral-900/50 rounded-xl border border-neutral-200 dark:border-neutral-800">
  <h2 class="text-lg font-semibold mb-4 text-neutral-900 dark:text-neutral-100">
    Table of Contents
  </h2>
  
  <ul class="space-y-2">
    {#each block.headings as heading}
      <li 
        class="flex items-start"
        style="padding-left: {(heading.level - 1) * 1.5}rem"
      >
        <ChevronRight class="w-3 h-3 mt-1 mr-1 text-neutral-400 dark:text-neutral-600 flex-shrink-0" />
        <button
          on:click={() => scrollToHeading(heading.id)}
          class="text-left text-sm hover:text-blue-600 dark:hover:text-blue-400 
                 text-neutral-700 dark:text-neutral-300 
                 transition-colors cursor-pointer
                 {heading.level === 1 ? 'font-semibold' : heading.level === 2 ? 'font-medium' : ''}"
        >
          {heading.text}
        </button>
      </li>
    {/each}
  </ul>
</nav>