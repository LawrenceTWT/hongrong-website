import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { botanicalPlacements, createVine, progressBetween } from '../js/botanical.js';
// Exercise the production scene functions with the bundled GSAP engine.
// DOM/ScrollTrigger are stubs: this checks progress/state, not browser layout.
const root=new URL('../',import.meta.url);
const source=fs.readFileSync(new URL('js/main.js',root),'utf8');
const context={exports:{},setTimeout,clearTimeout,Date,console};
context.module={exports:context.exports};
vm.runInNewContext(fs.readFileSync(new URL('assets/vendor/gsap.min.js',root),'utf8'),context);
const real=context.exports.gsap;
try {
 const makePanel=name=>({dataset:{scenePanel:name},yPercent:0,attrs:{},getAttribute(k){return this.attrs[k]},setAttribute(k,v){this.attrs[k]=v},removeAttribute(k){delete this.attrs[k]},querySelector(){return this.copy}});
 const panels=['hero','about','work'].map(makePanel);
 for(const panel of panels)panel.copy={yPercent:0,'--about-text-progress':'0%'};
 const sequence={classList:{add(){},remove(){}},querySelector(s){return panels.find(p=>s.includes('"'+p.dataset.scenePanel+'"'))}};
 let updates=0,scrub;
 const sandbox={document:{querySelector:()=>sequence,querySelectorAll:()=>panels},desktopMotion:'desktop',requestScrollState:()=>updates++,window:{ScrollTrigger:{},gsap:{registerPlugin(){},matchMedia(){return{add(q,cb){cb()}}},set:real.set,timeline(options){scrub=options.scrollTrigger.scrub;const timeline=real.timeline({...options,scrollTrigger:undefined,paused:true});timeline.scrollTrigger={progress:0,getTween:()=>({progress(){}})};return timeline}}}};
 vm.createContext(sandbox);
 vm.runInContext('let sceneTimeline=null;'+source.match(/const scenePacing = [^;]+;/)[0]+source.slice(source.indexOf('function initScenes()'),source.indexOf('// One scroll controller'))+source.slice(source.indexOf('function settleScene()'),source.indexOf('["wheel", "touchstart"'))+'\ninitScenes();globalThis.testTimeline=sceneTimeline;',sandbox);
 const timeline=sandbox.testTimeline;
 assert.equal(scrub,0.8);
 assert.equal(timeline.duration(),3.6);
 const frames=[];
 for(const time of [0,.35,.9,1.4,1.8,2.1,2.7,3.4,3.6]){
  timeline.time(time,false);const [hero,about,work]=panels;
  assert.ok(hero.yPercent<=0 && hero.yPercent>=-30);
  assert.ok(about.yPercent<=100 && about.yPercent>=-20);
  assert.ok(work.yPercent<=100 && work.yPercent>=0);
  if(time>=1.4&&time<=2.1)assert.equal(about.yPercent,0);
  if(time>0.12&&time<1.4)assert.ok(about.yPercent<100,'next scene must enter while hero remains');
  frames.push({time,positions:panels.map(p=>p.yPercent)});
 }
 for(const frame of frames.slice().reverse()){
  timeline.time(frame.time,false);assert.deepEqual(panels.map(p=>p.yPercent),frame.positions,'reverse must restore the same composition');
 }
 timeline.time(2.7);timeline.scrollTrigger.progress=0;sandbox.settleScene();
 assert.deepEqual(panels.map(p=>p.yPercent),[0,100,100]);
 assert.equal(panels[0].inert,false);
 assert.equal(panels[1].inert,true);
 for(const progress of [0,.2,.7,1,.4,0]){
  timeline.time(2.9);timeline.scrollTrigger.progress=progress;sandbox.settleScene();
  assert.ok(Math.abs(timeline.progress()-progress)<1e-8,'restoring a language/layout position must settle scrub');
 }
 assert.deepEqual([-3,0,.25,.5,.75,1,4].map(p=>progressBetween(p,0,1)),[0,0,.25,.5,.75,1,1]);
 assert.equal(progressBetween(0,0,0),1);
 assert.equal(progressBetween(-1,0,0),0);
 assert.ok(updates>0,'access/navigation updates must follow the animation ticker');
 const regions=['hero','about','work',null].map(scene=>({scene,progress:-1,region:{getBoundingClientRect:()=>({top:700,height:700})},vine:{style:{setProperty(name,value){this[name]=value}}}}));
 const growth={botanicalVines:regions,reducedMotion:{matches:false},progressBetween,innerHeight:900,Math,sceneTimeline:timeline};
 vm.createContext(growth);
 vm.runInContext(source.match(/const scenePacing = [^;]+;/)[0]+source.slice(source.indexOf('function updateBotanicalGrowth()'),source.indexOf('function requestScrollState()')),growth);
 const vineFrames=[];
 for(const time of [0,.35,.9,1.4,1.8,2.7,3.4]){
  timeline.time(time);growth.updateBotanicalGrowth();
  vineFrames.push({time,values:regions.map(r=>r.progress)});
 }
 for(const frame of vineFrames.slice().reverse()){
  timeline.time(frame.time);growth.updateBotanicalGrowth();assert.deepEqual(regions.map(r=>r.progress),frame.values);
 }
 assert.ok(vineFrames.every(frame=>frame.values[0]===1000),'hero vines must be complete from the first frame');
 assert.equal(vineFrames.find(frame=>frame.time===1.4).values[1],1000,'About vines should finish before its reading pause');
 assert.ok(vineFrames.find(frame=>frame.time===1.8).values[2]>0,'Work vines should start before the scene enters');
 growth.reducedMotion.matches=true;growth.updateBotanicalGrowth();assert.ok(regions.every(r=>r.progress===1000));
 growth.reducedMotion.matches=false;
 let pageTop=0;
 const initialPage={fromTop:true,delay:0,progress:-1,region:{getBoundingClientRect:()=>({top:pageTop,height:900})},vine:{style:{setProperty(name,value){this[name]=value}}}};
 const laterPage={...initialPage,fromTop:false,delay:.2,progress:-1,vine:{style:{setProperty(name,value){this[name]=value}}}};
 growth.botanicalVines=[initialPage,laterPage];
 growth.sceneTimeline=null;
 const pageFrames=[];
 for(const top of [1050,900,700,450,200]){
  pageTop=top;growth.updateBotanicalGrowth();pageFrames.push([top,initialPage.progress,laterPage.progress]);
 }
 assert.ok(pageFrames.every(frame=>frame[1]===1000),'child-page opening vines must be complete');
 assert.equal(pageFrames[0][2],0);
 assert.ok(pageFrames[1][2]>0,'lower-page vines should already grow at the viewport edge');
 assert.equal(pageFrames[3][2],1000,'lower-page vines should complete around the viewport midpoint');
 for(const [top,first,second] of pageFrames.slice().reverse()){
  pageTop=top;growth.updateBotanicalGrowth();assert.equal(initialPage.progress,first);assert.equal(laterPage.progress,second);
 }
 growth.botanicalVines=[regions[0]];growth.updateBotanicalGrowth();
 assert.equal(regions[0].progress,1000,'hero vines must also be complete without pinned scenes');
 let offset=0;
 const ai={innerHeight:900,reducedMotion:{matches:false},progressBetween,Math,aiSteps:Array.from({length:5},(_,i)=>({getBoundingClientRect:()=>({top:150+i*600-offset,height:600})})),aiVine:{style:{}},aiVineLength:2000,aiLeaves:Array.from({length:5},()=>({style:{setProperty(n,v){this[n]=v}}}))};
 vm.createContext(ai);
 vm.runInContext('let activeAiState=0,aiGrowthProgress=-1; function setAiState(i){activeAiState=i;}'+source.slice(source.indexOf('function updateAiStory()'),source.indexOf('function updateNavigation()'))+'globalThis.getAiState=()=>activeAiState;',ai);
 const aiFrames=[];
 for(const y of [0,60,300,600,1200,1800,2400]){
  offset=y;ai.updateAiStory();aiFrames.push({y,state:ai.getAiState(),offset:ai.aiVine.style.strokeDashoffset});
 }
 assert.equal(aiFrames[0].state,0);assert.equal(aiFrames.at(-1).state,4);
 assert.ok(aiFrames[0].offset<ai.aiVineLength*.9,'phone vine should already extend during the opening login step');
 assert.equal(aiFrames[0].state,aiFrames[1].state);assert.notEqual(aiFrames[0].offset,aiFrames[1].offset,'vine must grow between phone state changes');
 for(const frame of aiFrames.slice().reverse()){
  offset=frame.y;ai.updateAiStory();assert.equal(ai.aiVine.style.strokeDashoffset,frame.offset);assert.equal(ai.getAiState(),frame.state);
 }
 ai.reducedMotion.matches=true;ai.updateAiStory();assert.equal(ai.aiVine.style.strokeDashoffset,'0');
 const openingSandbox={window:{gsap:{timeline(options){return real.timeline({...options,paused:true})}}}};
 vm.createContext(openingSandbox);
 vm.runInContext(source.slice(source.indexOf('function createOpeningTimeline('),source.indexOf('async function startOpening(')),openingSandbox);
 const letters=Array.from({length:9},()=>({opacity:0,x:0,y:0,filter:'blur(10px)'}));
 const curtain={yPercent:0};let completed=0;
 const opening=openingSandbox.createOpeningTimeline(curtain,{querySelectorAll:()=>letters},()=>completed++);
 opening.time(.8,false);assert.ok(letters.every(letter=>letter.opacity===1),'whole name needs a clear reading pause');
 opening.time(1.1,false);assert.ok(letters[0].opacity>letters.at(-1).opacity,'right-hand letters must dissolve before the left');
 assert.equal(letters[0].filter,'blur(0px)');
 assert.equal(curtain.yPercent,0,'curtain should wait for the word to dissolve');
 assert.equal(opening.duration(),2.5,'opening must complete in the requested 2.5 seconds');
 opening.time(opening.duration(),false);assert.equal(curtain.yPercent,-100);assert.equal(completed,1);assert.ok(letters.every(letter=>letter.opacity===0));
 const margins=botanicalPlacements.filter(p=>p.side);
 assert.ok(margins.some(p=>p.side==='left') && margins.some(p=>p.side==='right'));
 assert.ok(new Set(margins.map(p=>p.bottom)).size>3,'plants should not share one repeated baseline');
 assert.ok(new Set(margins.map(p=>p.angle)).size>3,'plants should not share one repeated angle');
 globalThis.document={createElementNS(){return{attributes:{},setAttribute(name,value){this.attributes[name]=value}}}};
 const allIds=new Set();
 for(let i=0;i<7;i++){
  const vine=createVine(i===0?'portrait':'margin',i);
  assert.equal(vine.attributes['aria-hidden'],'true');
  assert.equal(vine.attributes.focusable,'false');
  const ids=new Set([...vine.innerHTML.matchAll(/id="([^"]+)"/g)].map(m=>m[1]));
  for(const id of ids){assert.ok(!allIds.has(id),'paint/mask IDs must not collide between vines');allIds.add(id)}
  for(const ref of vine.innerHTML.matchAll(/(?:url\(#|href="#)([^)" ]+)/g))assert.ok(ids.has(ref[1]),'all SVG paints, masks and leaf references must resolve locally');
 }
 delete globalThis.document;
 console.log('Motion checks passed: reversible scenes, layout restoration, asymmetric continuous vines, five phone states, letter dissolve, reduced motion and local SVG references.');
} catch(error) {
 console.error(error.name+': '+error.message);
 process.exitCode=1;
} finally {real.ticker.sleep();}
