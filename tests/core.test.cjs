const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
function core(){ assert.ok(fs.existsSync('The Top Quiz.html'),'standalone quiz exists'); const html=fs.readFileSync('The Top Quiz.html','utf8');const scope={};vm.runInNewContext(html.match(/<script id="quiz-core">([\s\S]*?)<\/script>/)[1],scope);return scope.QuizCore; }
test('15 concise balanced scenarios, with three valid choices each',()=>{
 const {questions}=core();assert.equal(questions.length,15);assert.equal(questions.filter(q=>q.kind==='everyday').length,8);
 assert.equal(new Set(questions.map(q=>q.id)).size,15);let total=0;
 for(const q of questions){assert.ok(q.prompt.split(/\s+/).length<=35);assert.equal(q.options.length,3);assert.equal(new Set(q.options.map(o=>o.id)).size,3);const scores=q.options.map(o=>{assert.ok(o.text.split(/\s+/).length<=16);assert.equal(o.traits.length,4);assert.ok(o.traits.every(n=>Number.isInteger(n)&&Math.abs(n)<=2));assert.ok(o.traits.filter(Boolean).length>=2);const s=o.traits.reduce((s,n,i)=>s+n*[2,1,-2,-1][i],0);assert.notEqual(s,0);return s});assert.ok(scores.some(s=>s>0)&&scores.some(s=>s<0));total+=scores.reduce((a,b)=>a+b,0);}
 assert.equal(total,0);
});
test('results require ten answers, ignore timeouts, and resolve ties deterministically',()=>{
 const {questions,scoreAnswers,classifyContributions}=core();
 const answers=sign=>questions.map(q=>({questionId:q.id,optionId:q.options.find(o=>Math.sign(o.traits.reduce((s,n,i)=>s+n*[2,1,-2,-1][i],0))===sign).id}));
 assert.equal(scoreAnswers(answers(1)).character,'Maverick');assert.equal(scoreAnswers(answers(-1)).character,'Goose');assert.equal(scoreAnswers(answers(1).slice(0,9)).character,null);assert.equal(scoreAnswers(answers(1).slice(0,10)).character,'Maverick');assert.equal(scoreAnswers([...answers(-1).slice(0,10),{questionId:questions[10].id,optionId:null}]).character,'Goose');
 assert.equal(classifyContributions([1,-1,1,-1,1,-1,1,-1,1,-1]),'Maverick');assert.equal(classifyContributions([-1,1,1,-1,1,-1,1,-1,1,-1]),'Goose');
});
