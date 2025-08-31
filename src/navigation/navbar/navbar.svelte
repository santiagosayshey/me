<script lang="ts">
  import { theme, isDark } from '$stores/theme';
  import { Sun, Moon } from 'lucide-svelte';
</script>

<nav class="w-full border-b border-neutral-200 dark:border-neutral-800 sticky top-0 z-10 bg-white dark:bg-neutral-900">
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-16">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <span class="text-2xl">🎨</span>
        </div>
        <div class="ml-4">
          <span class="text-lg font-bold text-neutral-900 dark:text-neutral-100" style="font-family: var(--font-mono);">santiago.me</span>
        </div>
      </div>
      <div class="flex items-center">
        <button 
          on:click={() => theme.toggle()} 
          class="p-2 rounded-md text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none focus:bg-neutral-100 dark:focus:bg-neutral-800"
        >
          {#if $isDark}
            <Sun size={20} />
          {:else}
            <Moon size={20} />
          {/if}
        </button>
      </div>
    </div>
  </div>
</nav>