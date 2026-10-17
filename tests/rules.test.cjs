const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'../echo.html'),'utf8');
const js=html.split('<script>')[1].split('</script>')[0];
new Function(js);
const context={localStorage:{getItem:()=>null},console};vm.createContext(context);
vm.runInContext(js.slice(0,js.indexOf("$('close').onclick"))+ '\nthis.api={Rules,mirror,reflected,dailyPlan,encode,decode};',context);
const browserTest=fs.readFileSync(path.join(__dirname,'echo.test.cjs'),'utf8');
const checks=browserTest.split('const result=await page.evaluate(()=>{')[1].split("return 'Rules, collisions")[0];
context.EchoTest=context.api;vm.runInContext('(()=>{'+checks+'})()',context);
const {Rules:R,dailyPlan,encode,decode}=context.api;
for(let n=0;n<1000;n++){
 const board=Array(25).fill(null),echo=dailyPlan('stress-'+n),moves=[];
 for(let t=0;t<8;t++){
  R.mature(board,t);R.place(board,echo[t],1,t);
  const empty=board.map((v,i)=>v?null:i).filter(v=>v!==null);
  assert(empty.length);const move={p:empty[(n*7+t*3)%empty.length],t:['blade','seed','mirror','wall'][(n+t)%4]};
  moves.push(move);assert.equal(R.place(board,move,0,t).blocked,false);
  assert(board.every(u=>!u||(u.owner===0||u.owner===1)));
 }
 assert.equal(moves.length,8);assert(R.score(board).reduce((a,b)=>a+b,0)<=16);
 assert.equal(JSON.stringify(decode(encode(moves))),JSON.stringify(moves));
}
console.log('PASS: syntax, captures, Walls, collisions, Seeds, Mirrors, daily seeding, share validation and 1,000 complete simulated rounds.');
