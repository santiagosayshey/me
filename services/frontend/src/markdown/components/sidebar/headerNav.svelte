<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { ListTree } from 'lucide-svelte';
  import type { HeadingBlock } from '$parsers/heading';
  
  export let headings: HeadingBlock[] = [];
  
  let activeHeadingId: string = '';
  let scrollContainer: HTMLElement | null = null;
  
  function scrollToHeading(id: string) {
    const element = document.getElementById(id);
    if (element) {
      // Get the scroll container (markdown content area)
      const container = element.closest('.overflow-y-auto');
      if (container) {
        const containerTop = container.getBoundingClientRect().top;
        const elementTop = element.getBoundingClientRect().top;
        const scrollTop = container.scrollTop;
        // Add 20px offset for better spacing at top
        container.scrollTo({
          top: scrollTop + (elementTop - containerTop) - 20,
          behavior: 'smooth'
        });
      }
      // Update URL hash
      const currentPath = window.location.pathname;
      window.history.replaceState(null, '', `${currentPath}#${id}`);
    }
    // Set this as the active heading
    activeHeadingId = id;
  }
  
  function handleScroll() {
    if (!scrollContainer || headings.length === 0) return;
    
    const containerRect = scrollContainer.getBoundingClientRect();
    let currentActiveId = '';
    
    // Find the heading that's currently in view
    for (let i = headings.length - 1; i >= 0; i--) {
      const heading = headings[i];
      const element = document.getElementById(heading.id);
      if (element) {
        const rect = element.getBoundingClientRect();
        // Check if heading is above the midpoint of the viewport
        if (rect.top <= containerRect.top + 100) {
          currentActiveId = heading.id;
          break;
        }
      }
    }
    
    // If no heading is above viewport, use the first one if it's visible
    if (!currentActiveId && headings.length > 0) {
      const firstElement = document.getElementById(headings[0].id);
      if (firstElement) {
        const rect = firstElement.getBoundingClientRect();
        if (rect.top < containerRect.bottom) {
          currentActiveId = headings[0].id;
        }
      }
    }
    
    if (currentActiveId !== activeHeadingId) {
      activeHeadingId = currentActiveId;
      // Update URL hash without adding to history
      const currentPath = window.location.pathname;
      if (currentActiveId) {
        window.history.replaceState(null, '', `${currentPath}#${currentActiveId}`);
      } else {
        // Remove hash if no heading is active
        window.history.replaceState(null, '', currentPath);
      }
    }
  }
  
  onMount(() => {
    // Find the markdown scroll container
    scrollContainer = document.querySelector('.markdown-content');
    
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      // Initial check for active heading
      setTimeout(handleScroll, 100);
    }
  });
  
  onDestroy(() => {
    if (scrollContainer) {
      scrollContainer.removeEventListener('scroll', handleScroll);
    }
  });
</script>

<div class="p-4">
  <div class="flex items-center gap-2 mb-3">
    <ListTree class="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
    <h3 class="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
      On this page
    </h3>
  </div>
  {#if headings.length > 0}
    <nav class="space-y-1">
      {#each headings as heading}
        <button
          on:click={() => scrollToHeading(heading.id)}
          class="block w-full text-left text-sm py-1 px-2 rounded-md transition-colors duration-200 {activeHeadingId === heading.id ? 'bg-neutral-100 dark:bg-neutral-800 text-blue-600 dark:text-blue-400' : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100'}"
          style="padding-left: {(heading.level - 1) * 12 + 8}px"
        >
          {heading.text}
        </button>
      {/each}
    </nav>
  {:else}
    <p class="text-sm text-neutral-500 dark:text-neutral-500">No headings</p>
  {/if}
</div>