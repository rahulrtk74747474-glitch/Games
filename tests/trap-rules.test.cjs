const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8'),js=html.split('<script>')[1].split('</script>')[0];new Function(js);
const c={};vm.createContext(c);vm.runInContext(js.slice(0,js.indexOf('// STATE & PERSISTENCE'))+';this.api={Rules,LEVELS,DAILY_LEVELS}',c);const {Rules:R,LEVELS,DAILY_LEVELS}=c.api;
function replay(level){let s=R.initial(level);assert(level.thieves.every(t=>R.route(level,s,t).length>1));for(const a of level.solution){assert(R.legal(level,s,a),'certificate move illegal');const prev=JSON.stringify(s);const next=R.apply(level,s,a);assert.equal(JSON.stringify(s),prev,'rules mutated input');s=next;assert.notEqual(s.status,'lost');}assert.equal(s.status,'won');assert(s.thieves.every(t=>R.route(level,s,t).length===0));}
for(const l of LEVELS)replay(l);
for(const l of DAILY_LEVELS)replay(l);
const open={walls:[],exits:[3,27,45,21],thieves:[24],tunnel:[],gates:[],switch:-1};assert.deepEqual(Array.from(R.route(open,R.initial(open),24)),[24,17,10,3]);
assert.equal(R.apply(open,R.initial(open),24),null);assert.equal(R.apply(open,R.initial(open),3),null);assert.equal(R.apply(open,R.initial(open),-1),null);
const tunnel={...open,exits:[3],tunnel:[24,10]};assert.deepEqual(Array.from(R.route(tunnel,R.initial(tunnel),24)),[24,10,3]);
const gate={...open,gates:[17],switch:8};let s=R.apply(gate,R.initial(gate),8);assert(s.closed);assert.notEqual(s.thieves[0],17);s={...R.initial(gate),thieves:[17]};assert.equal(R.legal(gate,s,8),false);
assert(R.solve(LEVELS[0],R.initial(LEVELS[0])));
console.log('PASS: 24 campaign certificates; 132 certified daily variants; route tie order; tunnels; gate toggles; illegal moves; immutable state.');
