// Compiles src/*.ts and writes it and src/arcade.css into mumtea-high.html between the ARCADE markers.
import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';

rmSync('build', { recursive: true, force: true });
execFileSync(process.execPath, ['node_modules/typescript/bin/tsc'], { stdio: 'inherit' });
// The files run as one script in name order, and booth-gallery.ts must come before booth.ts.
const names = readdirSync('build').filter(name => name.endsWith('.js')).sort();
const js = '"use strict";\n' + names.map(name => readFileSync('build/' + name, 'utf8').replace(/^"use strict";\r?\n/, '')).join('');
if (js.includes('</script')) throw new Error('compiled script must not contain a closing script tag');
const css = readFileSync('src/arcade.css', 'utf8');
const between = (text, a, b, body) => {
  const i = text.indexOf(a), j = text.indexOf(b);
  if (i < 0 || j < i) throw new Error('missing marker ' + a);
  return text.slice(0, i + a.length) + '\n' + body + '\n' + text.slice(j);
};
let html = readFileSync('mumtea-high.html', 'utf8');
html = between(html, '/*ARCADE-CSS-START*/', '/*ARCADE-CSS-END*/', css);
html = between(html, '/*ARCADE-JS-START*/', '/*ARCADE-JS-END*/', js);
const lib = readFileSync('node_modules/@supabase/supabase-js/dist/umd/supabase.js', 'utf8').replace(/<\/script/gi, '<\\/script');
html = between(html, '<!--SUPABASE-LIB-START-->', '<!--SUPABASE-LIB-END-->', '<script id="supabase-lib">' + lib + '</script>');
writeFileSync('mumtea-high.html', html);
writeFileSync('index.html', html);
console.log('Built mumtea-high.html', Math.round(html.length / 1024) + ' KB');
