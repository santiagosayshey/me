<script lang="ts">
  import { onMount } from 'svelte';
  import Group from './group.svelte';
  
  interface GroupData {
    name: string;
    path: string;
    emoji: string;
    files: Array<{name: string; path: string}>;
  }
  
  let groups: GroupData[] = [];
  
  // Check if we're in dev mode
  const isDev = import.meta.env.DEV;
  
  async function loadGroups() {
    try {
      const response = await fetch('/markdown-manifest.json');
      if (!response.ok) {
        console.error('Failed to fetch markdown manifest');
        return;
      }
      const allGroups = await response.json();
      
      // In production, hide the 'dev' group
      if (!isDev) {
        groups = allGroups.filter((group: GroupData) => group.name !== 'dev');
      } else {
        groups = allGroups;
      }
    } catch (error) {
      console.error('Error loading groups:', error);
      groups = [];
    }
  }
  
  onMount(() => {
    loadGroups();
  });
</script>

<nav class="w-64 h-full bg-white dark:bg-transparent border-r border-neutral-200 dark:border-neutral-800 overflow-y-auto">
  <div class="p-4">
    {#if groups.length > 0}
      {#each groups as group}
        <Group
          groupName={group.name}
          groupPath={group.path}
          emoji={group.emoji}
          files={group.files}
        />
      {/each}
    {:else}
      <p class="text-sm text-neutral-500 dark:text-neutral-400">
        No content available
      </p>
    {/if}
  </div>
</nav>