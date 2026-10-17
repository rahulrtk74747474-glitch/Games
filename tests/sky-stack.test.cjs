// No-dependency rules checks. Run with: node tests/sky-stack.test.cjs
const fs=require('fs'),vm=require('vm'),assert=require('assert/strict'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');const js=html.split('<script>')[1].split('</script>')[0];new Function(js);
const c={};vm.createContext(c);vm.runInContext(js.slice(0,js.indexOf('// STATE & STORAGE'))+'\nthis.R=Rules;',c);const R=c.R;
assert.equal(R.land(100,100,100,100).perfect,true);
assert.equal(R.land(104,100,100,100).width,100);
assert.equal(R.land(125,100,100,100).width,75);
assert.equal(R.land(75,100,100,100).width,75);
assert.equal(R.land(201,100,100,100).width,0);
for(let width=2;width<=170;width++)for(let x=-200;x<400;x+=7){const r=R.land(x,width,125,width,4);assert(r.width>=0&&r.width<=width);assert(r.cut>=0);if(r.width&&!r.perfect){assert(r.x>=125);assert(r.x+r.width<=125+width);}}
console.log('PASS: perfect tolerance, left/right cuts, miss, overlap invariants and JS syntax.');
