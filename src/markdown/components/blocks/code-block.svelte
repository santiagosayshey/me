<script lang="ts">
  import { onMount } from 'svelte';
  import type { CodeBlock } from '$parsers/code';
  import { highlightCode } from '$parsers/code';
  import { Copy, Check } from 'lucide-svelte';
  import * as simpleIcons from 'simple-icons';
  import { theme } from '$stores/theme';
  
  export let block: CodeBlock;
  
  let copied = false;
  let highlightedHtml = '';
  let loading = true;
  
  // Map language names to Simple Icons slugs
  const languageToIconSlug: Record<string, string> = {
    'javascript': 'javascript',
    'js': 'javascript',
    'jsx': 'javascript',
    'typescript': 'typescript',
    'ts': 'typescript', 
    'tsx': 'typescript',
    'python': 'python',
    'py': 'python',
    'bash': 'gnubash',
    'sh': 'gnubash',
    'terminal': 'windowsterminal',
    'json': 'json',
    'sql': 'postgresql',
    'html': 'html5',
    'css': 'css3',
    'svelte': 'svelte',
    'markdown': 'markdown',
    'md': 'markdown',
    'yaml': 'yaml',
    'yml': 'yaml',
    'diff': 'git',
    'text': 'readme',
    'txt': 'readme',
    'rust': 'rust',
    'go': 'go',
    'java': 'openjdk',
    'c': 'c',
    'cpp': 'cplusplus',
    'csharp': 'csharp',
    'cs': 'csharp',
    'php': 'php',
    'ruby': 'ruby',
    'rb': 'ruby',
    'swift': 'swift',
    'kotlin': 'kotlin',
    'dart': 'dart',
    'vue': 'vuedotjs',
    'react': 'react',
    'angular': 'angular',
    'docker': 'docker',
    'dockerfile': 'docker',
    'nginx': 'nginx',
    'apache': 'apache',
    'nodejs': 'nodedotjs',
    'node': 'nodedotjs',
    'npm': 'npm',
    'yarn': 'yarn',
    'pnpm': 'pnpm',
    'git': 'git',
    'github': 'github',
    'gitlab': 'gitlab'
  };
  
  function getIconSvg(iconName?: string): string | null {
    // Only show icon if explicitly specified with $icon directive
    if (!iconName) return null;
    
    let slug = languageToIconSlug[iconName.toLowerCase()] || iconName.toLowerCase();
    
    if (!slug) return null;
    
    // Try to find the icon in Simple Icons
    try {
      const iconKey = `si${slug.charAt(0).toUpperCase()}${slug.slice(1).replace(/[^a-zA-Z0-9]/g, '')}`;
      const icon = (simpleIcons as any)[iconKey];
      if (icon) {
        return icon.svg;
      }
    } catch (e) {
      // Icon not found
    }
    
    return null;
  }
  
  function copyCode() {
    navigator.clipboard.writeText(block.content);
    copied = true;
    setTimeout(() => copied = false, 2000);
  }
  
  async function updateHighlighting() {
    if (block.codeType === 'fenced' && block.language) {
      loading = true;
      highlightedHtml = await highlightCode(block.content, block.language);
      loading = false;
    } else {
      loading = false;
    }
  }
  
  onMount(() => {
    updateHighlighting();
  });
  
  // Re-highlight when theme changes
  $: $theme, updateHighlighting();
</script>

{#if block.codeType === 'fenced'}
  <div class="relative my-4 rounded-lg overflow-hidden bg-neutral-100 dark:bg-transparent border border-neutral-200 dark:border-neutral-800">
    {#if block.language || block.icon}
      <div class="flex justify-between items-center px-4 py-2 bg-neutral-100 dark:bg-transparent border-b border-neutral-200 dark:border-neutral-800">
        <div class="flex items-center gap-2">
          {#if block.icon && getIconSvg(block.icon)}
            <div class="w-4 h-4 text-neutral-600 dark:text-neutral-400 [&>svg]:w-full [&>svg]:h-full [&>svg]:fill-current">
              {@html getIconSvg(block.icon)}
            </div>
          {/if}
          {#if block.language}
            <span class="font-mono text-xs text-neutral-600 dark:text-neutral-400">
              {block.language.toLowerCase()}
            </span>
          {/if}
        </div>
        <button 
          class="group flex items-center gap-1.5 p-1.5 text-xs rounded transition-colors duration-200
                 bg-transparent hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700"
          on:click={copyCode}
        >
          {#if copied}
            <Check class="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
          {:else}
            <Copy class="w-3.5 h-3.5 text-neutral-700 dark:text-neutral-300 dark:group-hover:text-neutral-100" />
          {/if}
        </button>
      </div>
    {/if}
    <div class="p-4 overflow-x-auto bg-neutral-100 dark:bg-transparent">
      {#if loading}
        <pre class="font-mono text-sm leading-relaxed text-neutral-800 dark:text-neutral-200 whitespace-pre">{block.content}</pre>
      {:else if highlightedHtml}
        <div class="shiki-wrapper [&_pre]:!bg-transparent [&_pre]:!p-0 [&_code]:!bg-transparent">
          {@html highlightedHtml}
        </div>
      {:else}
        <pre class="font-mono text-sm leading-relaxed text-neutral-800 dark:text-neutral-200 whitespace-pre">{block.content}</pre>
      {/if}
    </div>
  </div>
{:else}
  <div class="my-4 p-4 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 overflow-x-auto">
    <pre class="font-mono text-sm leading-relaxed text-neutral-800 dark:text-neutral-200 whitespace-pre">{block.content}</pre>
  </div>
{/if}