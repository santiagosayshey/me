<script lang="ts">
  import type { HTMLBlock } from '$parsers/html';

  export let block: HTMLBlock;
</script>

<div class="my-4">
  {@html block.content}
</div>
