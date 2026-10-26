import {cp,mkdir,rm,readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve,join} from 'node:path';
import {fileURLToPath} from 'node:url';

// A modulokat a függőségeik után nevezzük el: egy alapanyaglista-változás
// a core és az app URL-jét is frissíti, így régi és új modul nem keveredik.
export async function buildSite(root=process.cwd()){
 const output=join(root,'dist');
 await rm(output,{recursive:true,force:true});
 await mkdir(output,{recursive:true});
 const files=new Map();
 for(const original of ['ingredients.js','core.js','app.js','style.css']){
  let content=await readFile(join(root,original),'utf8');
  for(const [source,target] of files)content=content.replaceAll(`./${source}`,`./${target}`);
  const hash=createHash('sha256').update(content).digest('hex').slice(0,12);
  const name=original.replace(/\.(js|css)$/u,`.${hash}.$1`);
  await writeFile(join(output,name),content);
  files.set(original,name);
 }
 let html=await readFile(join(root,'index.html'),'utf8');
 for(const [source,target] of files)html=html.replaceAll(`./${source}`,`./${target}`);
 await writeFile(join(output,'index.html'),html);
 await cp(join(root,'assets'),join(output,'assets'),{recursive:true});
 return Object.fromEntries(files);
}
if(resolve(process.argv[1]||'')===fileURLToPath(import.meta.url)){
 await buildSite();
 console.log('A statikus készletlista elkészült verziózott fájlokkal: dist/');
}
