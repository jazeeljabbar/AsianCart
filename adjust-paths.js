const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else {
      callback(dirPath);
    }
  });
}

const targetDir = process.argv[2];
const basePath = process.argv[3] || ''; // e.g. "/mockups/design-1/"

if (!targetDir) {
  console.error("Please specify target directory");
  process.exit(1);
}

// 1. Find all files in the target directory (this will be the list of public assets)
const publicAssets = [];
const publicRoot = path.resolve(targetDir);

if (!fs.existsSync(publicRoot)) {
  console.error(`Directory does not exist: ${publicRoot}`);
  process.exit(1);
}

walkDir(publicRoot, (filePath) => {
  const relativePath = path.relative(publicRoot, filePath);
  // Skip the assets folder which contains compiled JS/CSS bundles
  if (!relativePath.startsWith('assets' + path.sep)) {
    publicAssets.push(relativePath);
  }
});

console.log("Found public assets to adjust:");
publicAssets.forEach(a => console.log(`  - ${a}`));

// 2. Find all JS files in assets/ folder
const jsFiles = [];
const assetsDir = path.join(publicRoot, 'assets');
if (fs.existsSync(assetsDir)) {
  walkDir(assetsDir, (filePath) => {
    if (filePath.endsWith('.js') || filePath.endsWith('.css')) {
      jsFiles.push(filePath);
    }
  });
}

// Also process index.html at root of dist/public just in case
const indexHtml = path.join(publicRoot, 'index.html');
if (fs.existsSync(indexHtml)) {
  jsFiles.push(indexHtml);
}

console.log("Processing files for path replacement:");
jsFiles.forEach(f => console.log(`  - ${path.relative(publicRoot, f)}`));

// 3. For each file, replace absolute paths of public assets with relative paths
jsFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  publicAssets.forEach(asset => {
    // Normalise to forward slash for URL representation
    const urlPath = '/' + asset.replace(/\\/g, '/');
    const basePrefix = basePath ? (basePath.endsWith('/') ? basePath : basePath + '/') : '';
    const relPath = basePrefix + asset.replace(/\\/g, '/');
    
    // Replace quoted occurrences
    content = content.split(`"${urlPath}"`).join(`"${relPath}"`);
    content = content.split(`'${urlPath}'`).join(`'${relPath}'`);
    content = content.split(`\`${urlPath}\``).join(`\`${relPath}\``);
    
    // Replace attribute occurrences
    content = content.split(`src="${urlPath}"`).join(`src="${relPath}"`);
    content = content.split(`src='${urlPath}'`).join(`src='${relPath}'`);
    content = content.split(`href="${urlPath}"`).join(`href="${relPath}"`);
    content = content.split(`href='${urlPath}'`).join(`href='${relPath}'`);
  });
  
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated paths in ${path.relative(publicRoot, file)}`);
  }
  
  // Strip module type from script tags in index.html for file:// compatibility
  if (file.endsWith('index.html')) {
    let htmlContent = fs.readFileSync(file, 'utf8');
    let originalHtml = htmlContent;
    htmlContent = htmlContent.replace('type="module" crossorigin', '');
    
    // Move script tag to bottom of body so DOM elements are loaded before React initializes
    const scriptStart = htmlContent.indexOf('<script>');
    const scriptEnd = htmlContent.indexOf('</script>');
    if (scriptStart !== -1 && scriptEnd !== -1) {
      const scriptTagEndIndex = scriptEnd + 9;
      const scriptTag = htmlContent.substring(scriptStart, scriptTagEndIndex);
      // Remove it from head
      htmlContent = htmlContent.replace(scriptTag, '');
      // Place it at the end of body
      htmlContent = htmlContent.replace('</body>', scriptTag + '</body>');
      console.log(`Moved script tag to the bottom of body for DOM loading compatibility`);
    }
    
    if (htmlContent !== originalHtml) {
      fs.writeFileSync(file, htmlContent, 'utf8');
      console.log(`Removed type="module" from index.html for file:// compatibility`);
    }
  }
});

console.log("Done adjusting paths!");
