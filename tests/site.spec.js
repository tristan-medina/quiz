const {test,expect}=require('@playwright/test');
const {spawn}=require('node:child_process');
test.use({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
let server;
test.beforeAll(async()=>{
 server=spawn('python3',['-m','http.server','8765','--bind','127.0.0.1'],{cwd:require('node:path').resolve('..'),stdio:'ignore'});
 for(let i=0;i<50;i++){try{await fetch('http://127.0.0.1:8765/quiz/');return}catch{await new Promise(r=>setTimeout(r,100))}}
 throw Error('Local test server did not start');
});
test.afterAll(()=>server?.kill());
test('link opens in mobile emulation under /quiz/, caches, reloads offline, and completes',async({page,context})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8765/quiz/');
 await expect(page.getByRole('button',{name:'Start flight'})).toBeVisible();
 await expect(page.locator('#offline-status')).toHaveText('Ready for offline use.',{timeout:15000});
 await context.setOffline(true);await page.reload();
 await expect(page.getByRole('button',{name:'Start flight'})).toBeVisible();
 await page.getByRole('button',{name:'Start flight'}).click();
 for(let i=0;i<15;i++){await page.waitForTimeout(280);await page.locator('[data-option]').first().click()}
 await expect(page.locator('.result-name')).toHaveText(/Maverick|Goose/);
 expect(errors).toEqual([]);
});
test('cache failure does not block taking the quiz',async({page})=>{
 await page.addInitScript(()=>{Object.defineProperty(navigator,'serviceWorker',{value:{register:()=>Promise.reject(Error('Cache unavailable'))}})});
 await page.goto('http://127.0.0.1:8765/quiz/');
 await expect(page.locator('#offline-status')).toHaveText('Quiz ready. Offline saving is unavailable in this browser.');
 await page.getByRole('button',{name:'Start flight'}).click();
 await expect(page.locator('[data-question]')).toHaveAttribute('data-question','0');
});
