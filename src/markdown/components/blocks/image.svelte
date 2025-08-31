<script lang="ts">
  import type { ImageBlock } from '$parsers/image';
  import { ExternalLink } from 'lucide-svelte';
  
  export let block: ImageBlock;
  
  let imageError = false;
  let loading = true;
  
  function handleImageError() {
    imageError = true;
    loading = false;
  }
  
  function handleImageLoad() {
    loading = false;
  }
</script>

<figure class="my-8 relative flex flex-col {block.position === 'left' ? 'items-start' : block.position === 'right' ? 'items-end' : 'items-center'}">
  {#if block.isClickable && block.linkUrl}
    <a 
      href={block.linkUrl}
      target="_blank"
      rel="noopener noreferrer"
      class="relative inline-block group"
    >
      <div class="relative overflow-hidden rounded-lg">
        {#if loading}
          <div class="absolute inset-0 bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
        {/if}
        
        {#if imageError}
          <div class="flex items-center justify-center w-full h-64 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
            <div class="text-center text-neutral-500 dark:text-neutral-400">
              <p class="text-sm">Failed to load image</p>
              <p class="text-xs mt-1">{block.src}</p>
            </div>
          </div>
        {:else}
          <img 
            src={block.src}
            alt={block.alt}
            title={block.title}
            on:error={handleImageError}
            on:load={handleImageLoad}
            class="max-w-full h-auto rounded-lg shadow-lg 
                   transition-transform group-hover:scale-105"
          />
        {/if}
        
        <!-- Link indicator overlay -->
        <div class="absolute top-2 right-2 p-1.5 bg-white/80 dark:bg-neutral-900/80 
                    rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
          <ExternalLink class="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
        </div>
      </div>
    </a>
  {:else}
    <div class="relative overflow-hidden rounded-lg inline-block">
      {#if loading}
        <div class="absolute inset-0 bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
      {/if}
      
      {#if imageError}
        <div class="flex items-center justify-center w-full h-64 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
          <div class="text-center text-neutral-500 dark:text-neutral-400">
            <p class="text-sm">Failed to load image</p>
            <p class="text-xs mt-1">{block.src}</p>
          </div>
        </div>
      {:else}
        <img 
          src={block.src}
          alt={block.alt}
          title={block.title}
          on:error={handleImageError}
          on:load={handleImageLoad}
          class="max-w-full h-auto rounded-lg shadow-lg"
        />
      {/if}
    </div>
  {/if}
  
  {#if block.alt || block.title}
    <figcaption class="mt-3 text-center text-sm text-neutral-600 dark:text-neutral-400 italic">
      {block.title || block.alt}
    </figcaption>
  {/if}
</figure>