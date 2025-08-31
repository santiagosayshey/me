<script lang="ts">
  import { link } from 'svelte-spa-router';
  import { location } from 'svelte-spa-router';
  
  export let title: string;
  export let path: string;
  export let groupPath: string;
  
  $: href = `#/${groupPath}/${path}`;
  $: isActive = $location === `/${groupPath}/${path}`;
</script>

<a
  {href}
  use:link
  class="block ml-2 mr-2 px-3 py-1.5 text-sm rounded-md transition-colors duration-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 {isActive ? 'text-blue-600 dark:text-blue-400' : 'text-neutral-700 dark:text-neutral-300'}"
>
  {title}
</a>