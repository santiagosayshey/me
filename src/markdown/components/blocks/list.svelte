<script lang="ts">
  import { parseInlineText } from '$parsers/text';
  import Text from './text.svelte';
  import type { ListBlock, ListItem } from '$parsers/list';
  
  export let block: ListBlock;
  
  function renderItem(item: ListItem): any {
    return {
      ...item,
      tokens: parseInlineText(item.content)
    };
  }
</script>

{#if block.listType === 'ordered'}
  <ol class="list-decimal list-inside my-4 space-y-1 pl-4">
    {#each block.items as item}
      <li class="text-neutral-800 dark:text-neutral-200">
        <span class="inline"><Text tokens={renderItem(item).tokens} /></span>
        {#if item.children && item.children.length > 0}
          <div class="mt-1">
            <svelte:self block={{ ...block, items: item.children }} />
          </div>
        {/if}
      </li>
    {/each}
  </ol>
{:else if block.listType === 'task'}
  <ul class="list-none my-4 space-y-1 pl-4">
    {#each block.items as item}
      <li class="text-neutral-800 dark:text-neutral-200">
        <div class="flex items-start">
          <input 
            type="checkbox" 
            checked={item.checked} 
            disabled
            class="mr-2 mt-1 accent-blue-600 dark:accent-blue-400"
          />
          <div class="flex-1">
            <span class={item.checked ? 'line-through text-neutral-500 dark:text-neutral-400' : ''}>
              <Text tokens={renderItem(item).tokens} />
            </span>
            {#if item.children && item.children.length > 0}
              <div class="mt-1">
                <svelte:self block={{ ...block, items: item.children }} />
              </div>
            {/if}
          </div>
        </div>
      </li>
    {/each}
  </ul>
{:else}
  <ul class="list-disc list-inside my-4 space-y-1 pl-4">
    {#each block.items as item}
      <li class="text-neutral-800 dark:text-neutral-200 marker:text-neutral-600 dark:marker:text-neutral-400">
        <span class="inline"><Text tokens={renderItem(item).tokens} /></span>
        {#if item.children && item.children.length > 0}
          <div class="mt-1">
            <svelte:self block={{ ...block, items: item.children }} />
          </div>
        {/if}
      </li>
    {/each}
  </ul>
{/if}