<script lang="ts">
  import type { FootnotesSection } from '$parsers/footnote';
  import { parseInlineText, processTokensWithDefinitions } from '$parsers/text';
  import Text from './text.svelte';
  
  export let block: FootnotesSection;
  export let linkDefinitions: Map<string, { url: string; title?: string }> | undefined = undefined;
</script>

{#if block.definitions && block.definitions.length > 0}
  <div class="mt-12 pt-6 border-t-2 border-neutral-200 dark:border-neutral-700">
    <h2 class="text-lg font-semibold mb-4 text-neutral-900 dark:text-neutral-100">
      Footnotes
    </h2>
    
    <ol class="space-y-3 text-sm">
      {#each block.definitions as footnote}
        {@const rawTokens = parseInlineText(footnote.content)}
        {@const tokens = processTokensWithDefinitions(rawTokens, linkDefinitions)}
        <li id="fn-{footnote.id}" class="flex">
          <span class="mr-3 text-neutral-500 dark:text-neutral-400 font-medium">
            {footnote.number}.
          </span>
          <div class="flex-1">
            <span class="text-neutral-700 dark:text-neutral-300">
              <Text {tokens} />
            </span>
            <a 
              href="#fnref-{footnote.id}" 
              class="ml-2 text-xs text-blue-600 dark:text-blue-400 hover:underline"
              title="Return to reference"
            >
              ↩
            </a>
          </div>
        </li>
      {/each}
    </ol>
  </div>
{/if}