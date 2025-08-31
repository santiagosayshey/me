<script lang="ts">
  import GroupHeader from './groupHeader.svelte';
  import GroupRow from './groupRow.svelte';
  
  export let groupName: string;
  export let groupPath: string;
  export let emoji: string = '';
  export let files: Array<{name: string, path: string}> = [];
  
  let isExpanded = true;
  
  function formatTitle(name: string): string {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }
  
  function formatFileName(filename: string): string {
    return filename
      .replace(/\.md$/, '')
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
</script>

<div class="mb-2">
  <GroupHeader 
    title={formatTitle(groupName)}
    {emoji}
    {groupPath}
    bind:isExpanded
  />
  
  {#if isExpanded && files.length > 0}
    <div class="ml-3 mt-2 border-l-2 border-neutral-200 dark:border-neutral-800">
      {#each files as file}
        <GroupRow
          title={formatFileName(file.name)}
          path={file.path}
          {groupPath}
        />
      {/each}
    </div>
  {/if}
</div>