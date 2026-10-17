// Development-only tests. The game itself has no dependencies.
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const path=require('node:path');
(async()=>{
 const browser=await chromium.launch({headless:true});
 const page=await browser.newPage({viewport:{width:390,height:844}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('file://'+path.resolve(__dirname,'../echo.html'));
 const result=await page.evaluate(()=>{
  const {Rules:R,mirror,reflected,dailyPlan,encode,decode}=EchoTest;
  const check=(ok,msg)=>{if(!ok)throw Error(msg)};
  check(mirror(mirror(6))===6&&mirror(6)===8,'reflection');
  let b=Array(25).fill(null);b[7]={type:'wall',owner:1,born:0};b[11]={type:'seed',owner:1,born:0};b[6]={type:'blade',owner:1,born:0};
  R.place(b,{p:12,t:'blade'},0,0);check(b[11].owner===0&&b[7].owner===1&&b[6].owner===1,'orthogonal capture and wall immunity');
  check(R.place(b,{p:7,t:'mirror'},0,1).blocked,'occupied placement');
  b=Array(25).fill(null);R.place(b,{p:11,t:'seed'},0,0);R.place(b,{p:12,t:'wall'},1,0);b[6]={type:'mirror',owner:1,born:0};
  R.mature(b,1);check(b[11].type==='seed','seed early');R.mature(b,2);check(b[11].type==='blade'&&b[6].owner===0&&b[12].owner===1,'seed bloom');
  b=Array(25).fill(null);b[1]={type:'blade',owner:1,born:0};R.place(b,{p:6,t:'mirror'},0,0);check(!b[1]&&b[3].owner===1,'mirror flip');
  const p=dailyPlan('2026-10-17');check(JSON.stringify(p)===JSON.stringify(dailyPlan('2026-10-17')),'daily deterministic');check(new Set(p.map(m=>m.p)).size===8,'daily unique');
  check(JSON.stringify(decode(encode(p)))===JSON.stringify(p),'share roundtrip');let rejected=false;try{decode('E1-zzzzzzzzzzzzzzzz-00')}catch(e){rejected=true}check(rejected,'share rejects invalid');
  return 'Rules, collisions, maturation, mirror, daily and share code passed';
 });console.log(result);
 for(let i=0;i<8;i++)await page.locator('.cell:not([disabled])').first().click();
 assert(await page.locator('#modal').evaluate(e=>e.open));
 const state=await page.evaluate(()=>EchoTest.getState());assert.equal(state.moves.length,8);assert(state.over);
 const xp=await page.locator('#xpText').textContent();await page.reload();assert.equal(await page.locator('#xpText').textContent(),xp);
 await page.locator('#again').click();
 assert.deepEqual(await page.evaluate(()=>EchoTest.getState().echo),state.moves.map(m=>({p:Math.floor(m.p/5)*5+4-m.p%5,t:m.t})));
 await page.locator('.cell:not([disabled])').first().click();const resumed=await page.evaluate(()=>EchoTest.getState());await page.reload();assert.deepEqual(await page.evaluate(()=>EchoTest.getState()),resumed);
 for(const [width,height] of [[360,800],[768,1024],[844,390]]){await page.setViewportSize({width,height});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'horizontal overflow');}
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:path.join(require('node:os').tmpdir(),'echo-mobile.png'),fullPage:true});
 await page.locator('#import').click();await page.locator('#codeInput').fill('bad');await page.locator('#loadCode').click();assert((await page.locator('#codeError').textContent()).length>0);
 assert.deepEqual(errors,[]);await browser.close();console.log('8-turn round, rewards, persistence, next Echo, mobile/tablet/landscape, invalid import and browser errors passed');
})().catch(e=>{console.error(e);process.exit(1)});
