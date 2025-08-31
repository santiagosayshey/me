<script lang="ts">
  import { parseInlineText } from '$parsers/text';
  import Text from './text.svelte';
  
  export let content: string;
  
  $: tokens = parseInlineText(content);
</script>

<p class="my-4 text-gray-800">
  <Text {tokens} />
</p>