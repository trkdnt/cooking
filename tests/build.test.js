import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,cp,rm,readFile,appendFile,access} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {buildSite} from '../scripts/build.mjs';
const source=fileURLToPath(new URL('../',import.meta.url));
test('A közzétett HTML és minden modul az összetartozó, verziózott fájlokat hivatkozza',async()=>{
 const root=await mkdtemp(join(tmpdir(),'cooking-build-'));
 try{
  for(const name of ['index.html','app.js','core.js','ingredients.js','style.css','assets'])await cp(join(source,name),join(root,name),{recursive:true});
  const first=await buildSite(root);
  const html=await readFile(join(root,'dist/index.html'),'utf8');
  assert(html.includes(`./${first['app.js']}`));assert(html.includes(`./${first['style.css']}`));
  assert(!html.includes('"./app.js"'));assert(!html.includes('"./style.css"'));
  for(const [original,name] of Object.entries(first)){
   await access(join(root,'dist',name));assert.match(name,/\.[a-f0-9]{12}\.(js|css)$/);
   const content=await readFile(join(root,'dist',name),'utf8');
   if(original==='app.js')assert(content.includes(`./${first['core.js']}`));
   if(original==='core.js')assert(content.includes(`./${first['ingredients.js']}`));
  }
  assert.deepEqual(await buildSite(root),first);
  await appendFile(join(root,'ingredients.js'),'\n// changed ingredient data\n');
  const changed=await buildSite(root);
  for(const name of ['ingredients.js','core.js','app.js'])assert.notEqual(changed[name],first[name]);
  assert.equal(changed['style.css'],first['style.css']);
 }finally{await rm(root,{recursive:true,force:true});}
});
