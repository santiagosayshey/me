<script lang="ts">
  import type { FrontmatterData } from '$parsers/frontmatter';
  
  export let data: FrontmatterData;
  
  function formatValue(value: any): string {
    if (value === null || value === undefined) return 'null';
    if (Array.isArray(value)) return value.join(', ');
    if (typeof value === 'object') return JSON.stringify(value, null, 2);
    return String(value);
  }
  
  function formatKey(key: string): string {
    return key
      .split(/[-_]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
</script>

<div class="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 mb-8">
  <h2 class="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Document Metadata</h2>
  <dl class="space-y-3">
    {#each Object.entries(data) as [key, value]}
      <div class="grid grid-cols-1 sm:grid-cols-[150px_1fr] gap-2 sm:gap-4">
        <dt class="font-semibold text-neutral-600 dark:text-neutral-400 text-sm">
          {formatKey(key)}
        </dt>
        <dd class="text-neutral-700 dark:text-neutral-300 text-sm">
          {#if typeof value === 'object' && !Array.isArray(value)}
            <pre class="bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded p-2 text-xs font-mono overflow-x-auto text-neutral-800 dark:text-neutral-200">{formatValue(value)}</pre>
          {:else}
            {formatValue(value)}
          {/if}
        </dd>
      </div>
    {/each}
  </dl>
</div>