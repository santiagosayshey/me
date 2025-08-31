<script lang="ts">
  import { onMount } from 'svelte';
  import { loadAndParseMarkdown, type ParsedMarkdown, type ParserOptions } from '../parser/parser';
  import Frontmatter from './blocks/frontmatter.svelte';
  import Heading from './blocks/heading.svelte';
  import HorizontalRule from './blocks/horizontal-rule.svelte';
  import Paragraph from './blocks/paragraph.svelte';
  import List from './blocks/list.svelte';
  import Table from './blocks/table.svelte';
  import CodeBlock from './blocks/code-block.svelte';
  import Quote from './blocks/quote.svelte';
  import Image from './blocks/image.svelte';
  import Toc from './blocks/toc.svelte';
  import Footnotes from './blocks/footnotes.svelte';
  import type { HeadingBlock } from '$parsers/heading';
  import type { ListBlock } from '$parsers/list';
  import type { TableBlock } from '$parsers/table';
  import type { CodeBlock as CodeBlockType } from '$parsers/code';
  import type { QuoteBlock } from '$parsers/quote';
  import type { ImageBlock } from '$parsers/image';
  import type { TocBlock } from '$parsers/toc';
  import type { FootnotesSection } from '$parsers/footnote';
  
  export let filePath: string;
  export let options: ParserOptions = {
    enableFrontmatter: true,
    enableTables: true,
    enableFootnotes: true,
    enableMath: true
  };
  
  let parsedContent: ParsedMarkdown | null = null;
  let loading = true;
  let error: string | null = null;
  
  onMount(async () => {
    try {
      loading = true;
      error = null;
      parsedContent = await loadAndParseMarkdown(filePath, options);
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to load markdown file';
      console.error('Error loading markdown:', err);
    } finally {
      loading = false;
    }
  });
</script>

<div class="max-w-4xl mx-auto p-8 font-sans leading-relaxed">
  {#if loading}
    <div class="text-gray-500 italic text-center py-8">Loading markdown...</div>
  {:else if error}
    <div class="text-red-700 bg-red-50 p-4 rounded border border-red-200">
      Error: {error}
    </div>
  {:else if parsedContent}
    {#each parsedContent.blocks as block}
      {#if block.type === 'frontmatter' && block.metadata}
        <Frontmatter data={block.metadata} />
      {:else if block.type === 'heading'}
        <Heading block={block as HeadingBlock} />
      {:else if block.type === 'code'}
        <CodeBlock block={block as CodeBlockType} />
      {:else if block.type === 'quote'}
        <Quote block={block as QuoteBlock} />
      {:else if block.type === 'image'}
        <Image block={block as ImageBlock} />
      {:else if block.type === 'toc'}
        <Toc block={block as TocBlock} />
      {:else if block.type === 'list'}
        <List block={block as ListBlock} />
      {:else if block.type === 'table'}
        <Table block={block as TableBlock} />
      {:else if block.type === 'horizontalRule'}
        <HorizontalRule />
      {:else if block.type === 'paragraph'}
        <Paragraph 
          content={block.content} 
          linkDefinitions={block.linkDefinitions} 
          footnoteDefinitions={block.footnoteDefinitions} 
        />
      {:else if block.type === 'footnotes'}
        <Footnotes 
          block={block as FootnotesSection} 
          linkDefinitions={block.linkDefinitions} 
        />
      {:else}
        <div class="bg-gray-50 border border-dashed border-gray-300 p-4 my-4 rounded">
          <em class="text-gray-600 text-sm">Unsupported block type: {block.type}</em>
          <pre class="mt-2 whitespace-pre-wrap break-words font-mono text-sm text-gray-700">{block.content}</pre>
        </div>
      {/if}
    {/each}
  {/if}
</div>