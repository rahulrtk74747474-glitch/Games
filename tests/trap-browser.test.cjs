// npm install --no-save playwright; npx playwright install chromium
// Optional: CHROMIUM_EXECUTABLE=/path/to/chromium node tests/trap-browser.test.cjs
const {chromium}=require('playwright'),assert=require('node:assert/strict'),path=require('node:path'),os=require('node:os');
(async()=>{
const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_EXECUTABLE?{executablePath:process.env.CHROMIUM_EXECUTABLE,args:['--no-sandbox','--disable-dev-shm-usage','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']}:{} )});
const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});const errors=[],requests=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(/^https?:/.test(r.url()))requests.push(r.url())});
await page.goto('file://'+path.resolve(__dirname,'../index.html'));await page.evaluate(()=>localStorage.clear());await page.reload();assert.equal(await page.locator('.cell').count(),49);
const shot=process.env.SCREENSHOT_DIR||os.tmpdir();await page.screenshot({path:path.join(shot,'trap-mobile.png'),fullPage:true});
for(let index=0;index<24;index++){
 const cert=await page.evaluate(i=>TrapTest.LEVELS[i].solution,index);
 for(const a of cert){if(index===0)await page.locator('.cell').nth(a).tap();else await page.locator('.cell').nth(a).click();}
 assert.equal(await page.evaluate(()=>TrapTest.state().s.status),'won');assert(await page.locator('#modal').evaluate(e=>e.open));
 if(index<23)await page.locator('#resultMain').click();
}
assert.equal(await page.evaluate(()=>TrapTest.profile().stars.reduce((a,b)=>a+b,0)),72);
await page.locator('#review').click();await page.locator('#levels').click();await page.locator('[data-case="13"]').click();
await page.screenshot({path:path.join(shot,'trap-gates.png'),fullPage:true});
const move=await page.evaluate(()=>TrapTest.LEVELS[13].solution[0]);await page.locator('.cell').nth(move).click();const before=await page.evaluate(()=>TrapTest.state());await page.reload();assert.deepEqual(await page.evaluate(()=>TrapTest.state()),before);await page.locator('#undo').click();assert.equal(await page.evaluate(()=>TrapTest.state().s.moves),0);
await page.locator('#hint').click();await page.waitForFunction(()=>document.querySelector('.hinted'));assert.equal(await page.evaluate(()=>TrapTest.state().hints),1);
await page.locator('#daily').click();const day=await page.evaluate(()=>TrapTest.state().day);const cert=await page.evaluate(d=>TrapTest.dailyLevel(d).solution,day);for(const a of cert)await page.locator('.cell').nth(a).click();assert.equal(await page.evaluate(()=>TrapTest.state().s.status),'won');await page.locator('#review').click();
await page.locator('#levels').click();await page.locator('[data-case="1"]').click();
for(let n=0;n<12;n++){const action=await page.evaluate(()=>{const {Rules:R,LEVELS}=TrapTest,s=TrapTest.state().s,l=LEVELS[1];return R.actions(l,s).map(a=>({a,s:R.apply(l,s,a)})).filter(v=>v.s.status!=='won').sort((a,b)=>(a.s.status==='lost'?-100:R.route(l,a.s,a.s.thieves[0]).length)-(b.s.status==='lost'?-100:R.route(l,b.s,b.s.thieves[0]).length))[0]?.a;});assert.notEqual(action,undefined);await page.locator('.cell').nth(action).click();if(await page.evaluate(()=>TrapTest.state().s.status==='lost'))break;}
assert.equal(await page.evaluate(()=>TrapTest.state().s.status),'lost');await page.locator('#resultMain').click();assert.equal(await page.evaluate(()=>TrapTest.state().s.status),'playing');
for(const viewport of [{width:360,height:800},{width:768,height:1024},{width:844,height:390}]){await page.setViewportSize(viewport);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'horizontal overflow');}
await page.setViewportSize({width:1000,height:820});await page.screenshot({path:path.join(shot,'trap-desktop.png'),fullPage:true});
assert.deepEqual(errors,[]);assert.deepEqual(requests,[]);console.log('PASS: all 24 cases via UI, 72 stars, gates, saved round/reload, undo, hint, daily win, loss/recovery, responsive overflow, no external requests or JS errors.');await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
