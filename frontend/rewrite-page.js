/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');

const file = 'src/app/admin/page.tsx';
let code = fs.readFileSync(file, 'utf8');

const actions = [
  'saveTeam', 'deleteTeam',
  'savePlayer', 'deletePlayer',
  'saveFixture', 'deleteFixture',
  'updateMatchStatus', 'addMatchEvent',
  'saveNews', 'deleteNews',
  'sendNotification',
  'saveSponsor', 'deleteSponsor',
  'saveGalleryImage', 'deleteGalleryImage',
  'saveUser', 'deleteUser',
  'triggerRecalculate'
];

for (const action of actions) {
  // We need to replace: await ACTION(ARGS) with:
  // const res = await ACTION(ARGS); if (res && !res.success) throw new Error(res.error || 'Failed to ' + 'ACTION');
  // Since we don't have a full parser, we can use a regex that matches `await ACTION(...)` 
  // It's a bit tricky because ARGS can span multiple lines.
  // Instead, we can just find `await ACTION(` and replace it with `const res = await ACTION(`.
  // But wait, where do we insert `if (!res.success) throw new Error(res.error);`?
  // We can't easily do it with regex if the function spans multiple lines!
}

// Since there are only ~20 calls, let's just do a manual replace or a smarter bracket matcher.
function replaceAwaits(source) {
  let result = source;
  for (const action of actions) {
    const searchStr = `await ${action}(`;
    let startIndex = 0;
    while ((startIndex = result.indexOf(searchStr, startIndex)) !== -1) {
      // Find the closing parenthesis
      let pCount = 1;
      let endIndex = startIndex + searchStr.length;
      while (pCount > 0 && endIndex < result.length) {
        if (result[endIndex] === '(') pCount++;
        if (result[endIndex] === ')') pCount--;
        endIndex++;
      }
      
      const statement = result.substring(startIndex, endIndex);
      // Let's check if we're assigning it. If it's already assigned, we shouldn't prepend `const res =`.
      // The code currently has no assignments of `await saveX()`. It just does `await saveX()`.
      
      // Let's create a unique var name
      const varName = `res_${Math.random().toString(36).substring(2, 7)}`;
      
      const replacement = `const ${varName} = ${statement};\n      if (${varName} && !${varName}.success) throw new Error(${varName}.error || 'Failed');`;
      
      result = result.substring(0, startIndex) + replacement + result.substring(endIndex);
      startIndex += replacement.length;
    }
  }
  return result;
}

const newCode = replaceAwaits(code);
fs.writeFileSync(file, newCode);
console.log('Replaced await calls in page.tsx');
