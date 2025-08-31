<script lang="ts">
  import { parseInlineText, processTokensWithDefinitions } from '$parsers/text';
  import Text from './text.svelte';
  
  export let content: string;
  export let linkDefinitions: Map<string, { url: string; title?: string }> | undefined = undefined;
  
  $: rawTokens = parseInlineText(content);
  $: tokens = processTokensWithDefinitions(rawTokens, linkDefinitions);
</script>

<p class="my-4 text-gray-800">
  <Text {tokens} />
</p>