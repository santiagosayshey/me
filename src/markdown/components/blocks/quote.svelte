<script lang="ts">
  import type { QuoteBlock } from '$parsers/quote';
  import type { HeadingBlock } from '$parsers/heading';
  import type { ListBlock } from '$parsers/list';
  import type { CodeBlock } from '$parsers/code';
  import { 
    Quote, Info, AlertCircle, AlertTriangle, CheckCircle, 
    Lightbulb, MessageSquare, Zap, Heart, Star, Flame, User,
    Music
  } from 'lucide-svelte';
  
  // Import block components
  import Heading from './heading.svelte';
  import Paragraph from './paragraph.svelte';
  import List from './list.svelte';
  import CodeBlockComponent from './code-block.svelte';
  import HorizontalRule from './horizontal-rule.svelte';
  
  export let block: QuoteBlock;
  
  // Audio playback state
  let audio: HTMLAudioElement | null = null;
  let isPlaying = false;
  
  // Map icon string to component
  let IconComponent = Quote;
  if (block.icon) {
    const iconMap: Record<string, typeof Quote> = {
      'quote': Quote,
      'info': Info,
      'warning': AlertTriangle,
      'error': AlertCircle,
      'success': CheckCircle,
      'tip': Lightbulb,
      'chat': MessageSquare,
      'idea': Zap,
      'love': Heart,
      'star': Star,
      'flame': Flame
    };
    IconComponent = iconMap[block.icon.toLowerCase()] || Quote;
  }
  
  // Handle audio playback
  function toggleAudio() {
    if (!audio && block.audio) {
      audio = new Audio(`/audio/${block.audio}`);
      audio.addEventListener('ended', () => {
        isPlaying = false;
      });
    }
    
    if (audio) {
      if (isPlaying) {
        audio.pause();
        isPlaying = false;
      } else {
        audio.play();
        isPlaying = true;
      }
    }
  }
</script>

<blockquote class="my-8 relative p-8 bg-neutral-50 dark:bg-neutral-800/30 rounded-2xl shadow-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden">
  <!-- Curved accent background - vertical with multiple waves -->
  <svg class="absolute inset-0 w-full h-full opacity-10 dark:opacity-5" preserveAspectRatio="none" viewBox="0 0 100 100">
    <path d="M60,0 Q62,15 60,30 T60,60 T60,100 L0,100 L0,0 Z" 
          fill="currentColor" 
          class="text-neutral-400 dark:text-neutral-500"/>
  </svg>
  
  <!-- Icon as a subtle watermark or clickable link -->
  {#if IconComponent}
    {#if block.link}
      <a 
        href={block.link}
        target="_blank"
        rel="noopener noreferrer"
        class="absolute top-4 right-4 w-14 h-14 flex items-center justify-center
               group cursor-pointer z-20"
        aria-label="Open link in new tab"
      >
        <IconComponent class="w-10 h-10 text-neutral-600 dark:text-neutral-400 
                             opacity-20 dark:opacity-10
                             group-hover:text-blue-600 dark:group-hover:text-blue-400 
                             group-hover:opacity-100
                             transition-all pointer-events-none" />
      </a>
    {:else}
      <div class="absolute top-4 right-4 w-14 h-14 flex items-center justify-center">
        <IconComponent class="w-10 h-10 text-neutral-600 dark:text-neutral-400 
                             opacity-20 dark:opacity-10" />
      </div>
    {/if}
  {/if}
  
  <!-- Quote content -->
  <div class="relative z-10 space-y-4 pr-12">
    {#each block.blocks as nestedBlock}
      {#if nestedBlock.type === 'heading'}
        <Heading block={nestedBlock as HeadingBlock} />
      {:else if nestedBlock.type === 'code'}
        <CodeBlockComponent block={nestedBlock as CodeBlock} />
      {:else if nestedBlock.type === 'list'}
        <List block={nestedBlock as ListBlock} />
      {:else if nestedBlock.type === 'quote'}
        <svelte:self block={nestedBlock as QuoteBlock} />
      {:else if nestedBlock.type === 'horizontalRule'}
        <HorizontalRule />
      {:else if nestedBlock.type === 'paragraph'}
        <p class="font-serif text-lg italic leading-relaxed text-neutral-700 dark:text-neutral-300">
          <Paragraph content={nestedBlock.content} />
        </p>
      {/if}
    {/each}
  </div>
  
  <!-- Author left aligned -->
  {#if block.author}
    <div class="mt-4">
      <span class="text-sm italic text-neutral-500 dark:text-neutral-400">
        {block.author}
      </span>
    </div>
  {/if}
  
  <!-- Audio play button or decorative dots in bottom right -->
  {#if block.audio}
    <button 
      on:click={toggleAudio}
      class="absolute bottom-6 right-6 cursor-pointer group"
      aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
    >
      <Music class="w-10 h-10 
                   {isPlaying 
                     ? 'text-blue-600 dark:text-blue-400 opacity-100 animate-sway' 
                     : 'text-neutral-600 dark:text-neutral-400 opacity-20 dark:opacity-10 group-hover:opacity-50 group-hover:text-neutral-800 dark:group-hover:text-white'} 
                   transition-all" />
    </button>
  {/if}
</blockquote>

<style>
  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.1);
      opacity: 0.8;
    }
  }
  
  :global(.animate-sway) {
    animation: pulse 2s ease-in-out infinite;
  }
</style>