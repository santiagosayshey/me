<script lang="ts">
  import { location } from 'svelte-spa-router';
  
  export let title: string;
  export let emoji: string = '';
  export let groupPath: string;
  export let isExpanded: boolean = true;
  
  $: isGroupActive = $location.startsWith(`/${groupPath}`);
  
  function toggleExpanded() {
    isExpanded = !isExpanded;
  }
</script>

<button
  on:click={toggleExpanded}
  class="group w-full px-3 py-2 flex items-center justify-between rounded-lg cursor-pointer transition-colors duration-200 {isGroupActive ? 'bg-neutral-100 dark:bg-neutral-800' : 'hover:bg-neutral-100 dark:hover:bg-neutral-900'}"
>
  <div class="flex items-center space-x-2">
    {#if emoji}
      <span class="text-sm">{emoji}</span>
    {/if}
    <span class="text-sm font-medium text-neutral-900 dark:text-neutral-100">
      {title}
    </span>
  </div>
  
  <svg
    class="w-4 h-4 text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-200 transition-all duration-200 {isExpanded ? 'rotate-180' : ''}"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M19 9l-7 7-7-7"
    />
  </svg>
</button>