import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const yamlPath = path.join(scriptDir, 'tokens.yaml');
const cssPath = path.join(scriptDir, 'tokens.css');

function collectTokens(node, tokens) {
  if (!node || typeof node !== 'object' || Array.isArray(node)) {
    return;
  }

  for (const [key, value] of Object.entries(node)) {
    if (
      typeof key === 'string' &&
      key.startsWith('--') &&
      (typeof value === 'string' || typeof value === 'number')
    ) {
      tokens.set(key, value);
      continue;
    }

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      collectTokens(value, tokens);
    }
  }
}

try {
  const yamlText = await fs.readFile(yamlPath, 'utf8');
  let data;

  try {
    data = parse(yamlText);
  } catch (error) {
    console.error('Failed to parse tokens.yaml:', error);
    process.exit(1);
  }

  const tokens = new Map();
  collectTokens(data, tokens);

  const lines = [':root {'];
  for (const [name, value] of tokens) {
    lines.push(`  ${name}: ${value};`);
  }
  lines.push('}');

  const output = `${lines.join('\n')}\n`;
  await fs.writeFile(cssPath, output, 'utf8');
} catch (error) {
  console.error('Failed to build tokens.css:', error);
  process.exit(1);
}
