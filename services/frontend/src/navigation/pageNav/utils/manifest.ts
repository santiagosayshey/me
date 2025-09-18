import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface FileInfo {
  name: string;
  path: string;
}

interface GroupData {
  name: string;
  path: string;
  emoji: string;
  files: FileInfo[];
}

function generateManifest() {
  const projectRoot = path.resolve(__dirname, '../../../../');
  const markdownDir = path.join(projectRoot, 'public', 'markdown');
  const outputPath = path.join(projectRoot, 'public', 'markdown-manifest.json');
  
  if (!fs.existsSync(markdownDir)) {
    console.log('No markdown directory found, creating empty manifest');
    fs.writeFileSync(outputPath, JSON.stringify([], null, 2));
    return;
  }
  
  const folders = fs.readdirSync(markdownDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory());
  
  const groups: GroupData[] = [];
  
  for (const folder of folders) {
    const folderPath = path.join(markdownDir, folder.name);
    const metadataPath = path.join(folderPath, 'metadata.json');
    
    let emoji = '';
    if (fs.existsSync(metadataPath)) {
      try {
        const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
        emoji = metadata.emoji || '';
      } catch (e) {
        console.error(`Error reading metadata for ${folder.name}:`, e);
      }
    }
    
    const files = fs.readdirSync(folderPath, { withFileTypes: true })
      .filter(file => file.isFile() && file.name.endsWith('.md'))
      .map(file => ({
        name: file.name,
        path: file.name.replace('.md', '')
      }));
    
    groups.push({
      name: folder.name,
      path: folder.name,
      emoji,
      files
    });
  }
  
  fs.writeFileSync(outputPath, JSON.stringify(groups, null, 2));
  console.log(`Manifest generated with ${groups.length} groups at ${outputPath}`);
}

// Run the generation
generateManifest();

// Watch mode if --watch flag is passed
if (process.argv.includes('--watch')) {
  const projectRoot = path.resolve(__dirname, '../../../../');
  const markdownDir = path.join(projectRoot, 'public', 'markdown');
  
  console.log('Watching for changes in', markdownDir);
  
  let timeout: NodeJS.Timeout;
  const debounce = (fn: () => void, delay: number) => {
    return () => {
      clearTimeout(timeout);
      timeout = setTimeout(fn, delay);
    };
  };
  
  const regenerate = debounce(() => {
    console.log('Changes detected, regenerating manifest...');
    generateManifest();
  }, 500);
  
  fs.watch(markdownDir, { recursive: true }, regenerate);
}