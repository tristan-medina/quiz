const {defineConfig}=require('@playwright/test');
module.exports=defineConfig({testDir:'./tests',testMatch:'**/*.spec.js',workers:2,use:{browserName:'chromium',launchOptions:{executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']},viewport:{width:390,height:844}},reporter:'list'});
