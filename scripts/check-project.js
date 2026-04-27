import { readFileSync, existsSync } from 'node:fs';

const requiredFiles = [
  'index.html',
  'configurator.html',
  'summary.html',
  'css/main.css',
  'src/js/main.js',
  'src/data/configurator.xml',
  'src/react/main.jsx',
  'src/react/summaryEntry.jsx',
  'src/react/App.jsx',
  'src/react/Summary.jsx',
  'README.md',
  'docs/project-explanation.md',
  'docs/prototype.md',
  'docs/testing.md',
  'eslint.config.js',
  '.github/workflows/pages.yml',
  '.github/workflows/super-linter.yml'
];

const draftPatterns = [
  /React mount point/i,
  /#configurator-root/,
  /Now Live/i,
  /Будущая сборка/i,
  /href="#"/
];

function fail(message) {
  console.error(`Project check failed: ${message}`);
  process.exitCode = 1;
}

for (const file of requiredFiles) {
  if (!existsSync(file)) {
    fail(`missing required file: ${file}`);
  }
}

const textFiles = [
  'index.html',
  'configurator.html',
  'summary.html',
  'src/js/main.js',
  'src/react/App.jsx',
  'src/react/Summary.jsx',
  'README.md',
  'docs/project-explanation.md',
  'docs/prototype.md',
  'docs/project-parts.md',
  'docs/testing.md'
];

for (const file of textFiles) {
  const content = readFileSync(file, 'utf8');
  for (const pattern of draftPatterns) {
    if (pattern.test(content)) {
      fail(`draft marker found in ${file}: ${pattern}`);
    }
  }
}

const indexHtml = readFileSync('index.html', 'utf8');
const configuratorHtml = readFileSync('configurator.html', 'utf8');
const summaryHtml = readFileSync('summary.html', 'utf8');
const xml = readFileSync('src/data/configurator.xml', 'utf8');

if (indexHtml.includes('/src/react/main.jsx')) {
  fail('index.html must stay independent from React');
}

if (!configuratorHtml.includes('/src/react/main.jsx')) {
  fail('configurator.html must mount the React configurator');
}

if (!summaryHtml.includes('/src/react/summaryEntry.jsx')) {
  fail('summary.html must mount the React summary page');
}

const viteConfig = readFileSync('vite.config.js', 'utf8');

if (!viteConfig.includes("base: './'")) {
  fail('vite.config.js must use relative asset paths for GitHub Pages');
}

const categoryCount = (xml.match(/<category\b/g) || []).length;
const productCount = (xml.match(/<product\b/g) || []).length;

if (categoryCount < 10) {
  fail(`expected at least 10 XML categories, found ${categoryCount}`);
}

if (productCount < 20) {
  fail(`expected at least 20 XML products, found ${productCount}`);
}

if (!process.exitCode) {
  console.log(`Project check passed: ${categoryCount} categories, ${productCount} products.`);
}
