<script lang="ts">
  import { parseInlineText } from '$parsers/text';
  import Text from './text.svelte';
  import type { TableBlock, TableCell } from '$parsers/table';
  
  export let block: TableBlock;
  
  function getAlignClass(align?: 'left' | 'center' | 'right'): string {
    switch (align) {
      case 'center': return 'text-center';
      case 'right': return 'text-right';
      default: return 'text-left';
    }
  }
</script>

<div class="overflow-x-auto my-6">
  <div class="inline-block min-w-full">
    <div class="overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800">
      <table class="min-w-full divide-y divide-neutral-200 dark:divide-neutral-800">
        <thead class="bg-neutral-50 dark:bg-neutral-800">
          <tr>
            {#each block.headers as header}
              <th class="px-6 py-3 text-xs font-semibold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider {getAlignClass(header.align)}">
                <Text tokens={parseInlineText(header.content)} />
              </th>
            {/each}
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-transparent divide-y divide-neutral-200 dark:divide-neutral-800">
          {#each block.rows as row, rowIndex}
            <tr class="hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors duration-150">
              {#each row.cells as cell}
                <td class="px-6 py-4 text-sm text-neutral-700 dark:text-neutral-300 {getAlignClass(cell.align)}">
                  <Text tokens={parseInlineText(cell.content)} />
                </td>
              {/each}
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</div>