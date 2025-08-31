<script lang="ts">
  import { FileText, User, Calendar } from 'lucide-svelte';
  
  export let data: Record<string, any> = {};
  
  // Extract specific fields
  $: title = data.title || '';
  $: author = data.author || '';
  $: date = data.date || '';
  $: description = data.description || '';
  $: tags = Array.isArray(data.tags) ? data.tags : (data.tags ? [data.tags] : []);
  
  // Format date if it exists
  function formatDate(dateStr: string): string {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch {
      return dateStr;
    }
  }
</script>

<div>
  {#if title}
    <div class="p-4 pb-3 flex items-center gap-2">
      <FileText class="w-4 h-4 text-neutral-500 dark:text-neutral-400 flex-shrink-0" />
      <h2 class="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
        {title}
      </h2>
    </div>
  {/if}
  
  {#if author || date}
    <div class="px-4 pb-3 flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-400">
      {#if author}
        <div class="flex items-center gap-1.5">
          <User class="w-3.5 h-3.5" />
          <span>{author}</span>
        </div>
      {/if}
      {#if author && date}
        <span class="text-neutral-400 dark:text-neutral-600">•</span>
      {/if}
      {#if date}
        <div class="flex items-center gap-1.5">
          <Calendar class="w-3.5 h-3.5" />
          <span>{formatDate(date)}</span>
        </div>
      {/if}
    </div>
  {/if}
  
  {#if description}
    <div class="px-4 pb-3">
      <p class="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
        {description}
      </p>
    </div>
  {/if}
  
  {#if tags.length > 0}
    <div class="px-4 pb-4">
      <div class="flex flex-wrap gap-2">
        {#each tags as tag}
          <span class="inline-block px-2.5 py-1 text-xs font-medium rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
            {tag}
          </span>
        {/each}
      </div>
    </div>
  {/if}
  
  {#if !title && !author && !date && !description && tags.length === 0}
    <div class="p-4">
      <p class="text-sm text-neutral-500 dark:text-neutral-500">No metadata</p>
    </div>
  {/if}
</div>