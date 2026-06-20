/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');

let code = fs.readFileSync('src/app/admin/actions.ts', 'utf8');

const wrapper = `
// Helper for unified error handling
async function withErrorHandling<T>(action: () => Promise<T>) {
  try {
    const data = await action();
    return { success: true, data, error: null };
  } catch (err: any) {
    console.error('Server Action Error:', err);
    return { success: false, data: null, error: err.message || 'An unexpected error occurred' };
  }
}
`;

if (!code.includes('withErrorHandling')) {
  code = code.replace("import bcrypt from 'bcryptjs';", "import bcrypt from 'bcryptjs';\n" + wrapper);
}

// A simple regex to replace the body of export async function NAME(ARGS) { BODY }
// We can find the opening brace, find the matching closing brace, and wrap the inner content.
function wrapFunctions(source) {
  let result = source;
  const regex = /export\s+async\s+function\s+(\w+)\s*\(([^)]*)\)\s*\{/g;
  let match;
  let modifications = [];
  
  while ((match = regex.exec(source)) !== null) {
    const startIdx = match.index;
    const braceIdx = startIdx + match[0].length - 1;
    
    // Find matching closing brace
    let count = 1;
    let endIdx = braceIdx + 1;
    while (count > 0 && endIdx < source.length) {
      if (source[endIdx] === '{') count++;
      if (source[endIdx] === '}') count--;
      endIdx++;
    }
    
    const body = source.substring(braceIdx + 1, endIdx - 1);
    
    // Check if already wrapped
    if (body.includes('return withErrorHandling(async () => {')) continue;
    
    const newBody = `\n  return withErrorHandling(async () => {\n${body}\n  });\n`;
    
    modifications.push({
      start: braceIdx + 1,
      end: endIdx - 1,
      newBody: newBody
    });
  }
  
  // Apply from bottom to top to preserve indices
  modifications.sort((a, b) => b.start - a.start);
  for (const mod of modifications) {
    result = result.substring(0, mod.start) + mod.newBody + result.substring(mod.end);
  }
  
  return result;
}

const newCode = wrapFunctions(code);
fs.writeFileSync('src/app/admin/actions.ts', newCode);
console.log('Rewrote actions.ts');
