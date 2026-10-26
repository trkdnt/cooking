import {cp,mkdir,rm} from 'node:fs/promises';
await rm('dist',{recursive:true,force:true});
await mkdir('dist',{recursive:true});
for(const path of ['index.html','style.css','app.js','core.js','data','assets'])await cp(path,`dist/${path}`,{recursive:true});
console.log('A statikus oldal elkészült: dist/');
