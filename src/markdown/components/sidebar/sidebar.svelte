<script lang="ts">
  import Frontmatter from './frontmatter.svelte';
  import HeaderNav from './headerNav.svelte';
  import type { HeadingBlock } from '$parsers/heading';
  
  export let frontmatterData: Record<string, any> = {};
  export let headings: HeadingBlock[] = [];
</script>

<aside class="w-80 h-full bg-white dark:bg-transparent border-l border-neutral-200 dark:border-neutral-800 overflow-y-auto sticky top-0">
  <Frontmatter data={frontmatterData} />
  
  {#if (frontmatterData && Object.keys(frontmatterData).length > 0) || headings.length > 0}
    <div class="mx-4 my-2">
      <div class="h-px bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent"></div>
    </div>
  {/if}
  
  <HeaderNav {headings} />
</aside>