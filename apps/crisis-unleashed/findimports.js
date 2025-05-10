const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const readFile = promisify(fs.readFile);

// Extensions to check
const extensions = ['.js', '.jsx', '.ts', '.tsx'];

// Patterns to search for
const patterns = [
  /import.*LogoSystem.*from/i,
  /import.*logo-system.*from/i,
  /import.*from ['"].*logo-system/i,
  /import.*from ['"].*LogoSystem/i,
  /import.*\{.*LogoSystem.*\}.*from/i
];

// Directories to skip
const skipDirs = ['node_modules', '.git', '.next', 'dist', 'build'];

// Function to recursively search directories
async function searchDirectory(dir) {
  const results = [];
  let filesScanned = 0;
  
  try {
    const entries = await readdir(dir);
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry);
      
      try {
        const stats = await stat(fullPath);
        
        // Skip directories we don't want to search
        if (stats.isDirectory()) {
          if (!skipDirs.includes(entry)) {
            const subResults = await searchDirectory(fullPath);
            results.push(...subResults.matches);
            filesScanned += subResults.filesScanned;
          }
        } else if (stats.isFile() && extensions.includes(path.extname(entry))) {
          // Check if the file has a relevant extension
          filesScanned++;
          
          try {
            const content = await readFile(fullPath, 'utf8');
            const lines = content.split('\n');
            
            // Check each line for the patterns
            for (let i = 0; i < lines.length; i++) {
              const line = lines[i];
              for (const pattern of patterns) {
                if (pattern.test(line)) {
                  results.push({
                    file: path.relative(process.cwd(), fullPath),
                    line: i + 1,
                    content: line.trim()
                  });
                  break; // Only report the line once even if multiple patterns match
                }
              }
            }
          } catch (error) {
            console.error(`Error reading file ${fullPath}:`, error.message);
          }
        }
      } catch (error) {
        console.error(`Error accessing ${fullPath}:`, error.message);
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error.message);
  }
  
  return { matches: results, filesScanned };
}

// Main function
async function main() {
  console.log('Searching for LogoSystem imports...');
  
  const startDir = process.cwd();
  console.log(`Starting search in: ${startDir}`);
  
  const { matches: results, filesScanned } = await searchDirectory(startDir);
  
  console.log(`\nScanned ${filesScanned} files`);
  console.log(`Found ${results.length} imports containing LogoSystem:`);
  
  if (results.length > 0) {
    console.log('==============================================\n');
    
    results.forEach(result => {
      console.log(`File: ${result.file}`);
      console.log(`Line: ${result.line}`);
      console.log(`Import: ${result.content}`);
      console.log('----------------------------------------------');
    });
    
    // Group by file for a summary
    const fileGroups = {};
    results.forEach(result => {
      if (!fileGroups[result.file]) {
        fileGroups[result.file] = [];
      }
      fileGroups[result.file].push(result);
    });
    
    console.log('\nSummary by file:');
    console.log('==============================================\n');
    
    Object.keys(fileGroups).forEach(file => {
      console.log(`${file}: ${fileGroups[file].length} imports`);
    });
  } else {
    console.log('No matching imports found.');
  }
}

main().catch(error => {
  console.error('Error:', error);
});
