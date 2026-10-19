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
 const sandbox={document:{querySelector:()=>sequence,querySelectorAll:()=>panels},desktopMotion:'desktop',aboutContent:null,aboutRegion:null,progressBetween,Math,requestScrollState:()=>updates++,window:{ScrollTrigger:{},gsap:{registerPlugin(){},matchMedia(){return{add(q,cb){cb()}}},set:real.set,timeline(options){scrub=options.scrollTrigger.scrub;const timeline=real.timeline({...options,scrollTrigger:undefined,paused:true});timeline.scrollTrigger={progress:0,getTween:()=>({progress(){}})};return timeline}}}};
 vm.createContext(sandbox);
 const sceneHelpers=source.slice(source.indexOf('function sceneTransitionProgress('),source.indexOf('// Explicit from/to values'));
 const holdSource=source.slice(source.indexOf('function updateAboutHold()'),source.indexOf('function updateScrollState()'));
 vm.runInContext('let sceneTimeline=null,landscapeTimeline=null,aboutBoundary=null,aboutHoldShift=null;'+source.match(/const scenePacing = [^;]+;/)[0]+sceneHelpers+holdSource+source.slice(source.indexOf('function initScenes()'),source.indexOf('// One scroll controller'))+source.slice(source.indexOf('function settleScene()'),source.indexOf('["wheel", "touchstart"'))+'\ninitScenes();globalThis.testTimeline=sceneTimeline;',sandbox);
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
 // About stays in place until its lower edge meets Work; then it travels with
 // that boundary. Use different measured content heights, not text fixtures.
 let contentTop=0,contentHeight=0,viewportHeight=900,holdWrites=0;
 const heldContent={get offsetTop(){return contentTop},get offsetHeight(){return contentHeight},style:{setProperty(name,value){this[name]=value;holdWrites++}}};
 const hold={aboutContent:heldContent,aboutRegion:{get clientHeight(){return viewportHeight}},sceneTimeline:timeline,progressBetween,Math};
 vm.createContext(hold);
 vm.runInContext('let aboutBoundary=null,aboutHoldShift=null;'+source.match(/const scenePacing = [^;]+;/)[0]+sceneHelpers+holdSource,hold);
 for(const height of [760,900,1080]) for(const contentSize of [330,460]) {
  viewportHeight=height;contentHeight=contentSize;contentTop=(height-contentSize)/2;
  hold.measureAboutBoundary();
  const states=[];
  for(let i=0;i<=100;i++) {
   const time=2.1+i/100*1.3;timeline.time(time);hold.updateAboutHold();
   const shift=parseFloat(heldContent.style['--about-hold-y']);
   const netShift=panels[1].yPercent/100*height+shift;
   const edge=panels[2].yPercent/100*height;
   const gap=Math.min(40,Math.max(24,height*.03));
   const expected=Math.min(0,edge-contentTop-contentSize-gap);
   assert.ok(Math.abs(netShift-expected)<.01,'text and CTA must remain centered, then leave at the actual next-scene edge');
   assert.ok(contentTop+contentSize+netShift<=edge-gap+.01,'the next scene must not cover the CTA');
   states.push({time,shift});
  }
  for(const state of states.slice().reverse()) {
   timeline.time(state.time);hold.updateAboutHold();assert.equal(parseFloat(heldContent.style['--about-hold-y']),state.shift);
  }
 }
 const holdCount=holdWrites;hold.updateAboutHold();assert.equal(holdWrites,holdCount,'stationary scroll must not keep writing the hold transform');
 hold.sceneTimeline=null;assert.doesNotThrow(()=>hold.updateAboutHold(),'normal flow must not receive a desktop counter-transform');
 // Landscape motion exercises the production timeline with the same GSAP.
 const art={scale:1},word={y:0},caption={y:0};
 let landscapeOptions,landscapeCleanup;
 const landscape={progressBetween,window:{ScrollTrigger:{},gsap:{registerPlugin(){},matchMedia(){return{add(query,callback){assert.equal(query,'(prefers-reduced-motion: no-preference)');landscapeCleanup=callback()}}},timeline(options){landscapeOptions=options.scrollTrigger;return real.timeline({...options,scrollTrigger:undefined,paused:true})}}},document:{querySelector:()=>({querySelector(selector){return {'.landscape-art':art,'.landscape-word':word,'.landscape-caption':caption}[selector]}})}};
 vm.createContext(landscape);
 vm.runInContext('let landscapeTimeline=null;'+source.slice(source.indexOf('function initLandscape()'),source.indexOf('function updateSceneAccess()'))+'initLandscape();globalThis.testLandscape=landscapeTimeline;',landscape);
 assert.equal(landscapeOptions.start,'top bottom');assert.equal(landscapeOptions.end,'bottom bottom');assert.equal(landscapeOptions.scrub,.8);
 const landscapeFrames=[];
 for(const progress of [0,.1,.25,.5,.75,1]) {
  landscape.testLandscape.progress(progress);landscapeFrames.push({progress,scale:art.scale,y:word.y,captionY:caption.y});
 }
 assert.equal(landscapeFrames[0].y,260);assert.equal(landscapeFrames.at(-1).y,0);assert.equal(landscapeFrames.at(-1).scale,1);
 assert.ok(landscapeFrames[2].y>landscapeFrames[3].y&&landscapeFrames[3].y>landscapeFrames[4].y,'the name must rise continuously, not play once at a threshold');
 for(const state of landscapeFrames.slice().reverse()) {
  landscape.testLandscape.progress(state.progress);assert.equal(word.y,state.y);assert.equal(art.scale,state.scale);assert.equal(caption.y,state.captionY);
 }
 sandbox.testTimeline.scrollTrigger.progress=.6;
 vm.runInContext('landscapeTimeline=globalThis.footerTimeline;',Object.assign(sandbox,{footerTimeline:landscape.testLandscape}));
 landscape.testLandscape.scrollTrigger={progress:.4,getTween:()=>({progress(){}}),kill(){}};
 sandbox.settleScene();assert.ok(Math.abs(landscape.testLandscape.progress()-.4)<1e-8,'language/layout restoration must settle the footer scrub too');
 landscapeCleanup();
 let sectionTop=0,sectionHeight=900,textWrites=0;
 const aboutText={style:{setProperty(name,value){this[name]=value;textWrites++}}};
 const aboutRegion={style:{setProperty(name,value){this[name]=value}},getBoundingClientRect:()=>({top:sectionTop,height:sectionHeight})};
 const entrySource=source.slice(source.indexOf('function getSectionEntryProgress('),source.indexOf('function updateAboutText()'));
 const textEffect={aboutText,aboutRegion,reducedMotion:{matches:false},progressBetween,innerHeight:900,Math,sceneTimeline:timeline,sceneTransitionProgress:sandbox.sceneTransitionProgress};
 vm.createContext(textEffect);
 vm.runInContext('let aboutTextProgress=-1,aboutShadeProgress=-1;'+source.match(/const scenePacing = [^;]+;/)[0]+source.match(/const aboutRevealPacing = [^;]+;/)[0]+entrySource+source.slice(source.indexOf('function updateAboutText()'),source.indexOf('function updateScrollState()')),textEffect);
 for(const time of [.12,.35,.9,1.2,1.4]) {
  timeline.time(time);
  assert.ok(Math.abs(textEffect.getSectionEntryProgress(aboutRegion,'about')-(1-panels[1].yPercent/100))<1e-5,'About plant/text clock must match the eased panel, not linear timeline time');
 }
 for(const time of [2.1,2.3,2.7,3.15,3.4]) {
  timeline.time(time);
  assert.ok(Math.abs(textEffect.getSectionEntryProgress(aboutRegion,'work')-(1-panels[2].yPercent/100))<1e-5,'Work plant clock must match the eased panel');
 }
 const textProgress=()=>parseFloat(aboutText.style['--about-text-progress']);
 const textFrames=[];
 for(const time of [0,.5,.95,1,1.2,1.4,1.8,1.85,2.1,3.4]){
  timeline.time(time);textEffect.updateAboutText();textFrames.push({time,progress:textProgress(),shade:aboutRegion.style['--about-shade'],label:aboutRegion.style['--about-label-progress']});
 }
 assert.equal(textFrames[0].progress,0,'text must start before its color sweep');
 const enteringText=textFrames.find(frame=>frame.time===1.2).progress;
 assert.ok(enteringText>100&&enteringText<200,'the second of four lines should be revealing during late entry');
 assert.ok(textFrames.find(frame=>frame.time===1.4).progress>100&&textFrames.find(frame=>frame.time===1.4).progress<300,'text continues revealing while centered');
 assert.equal(textFrames.find(frame=>frame.time===1.4).shade,'100%','the scene must be dark before its centered reading phase');
 assert.ok(textFrames.find(frame=>frame.time===1.8).progress>300&&textFrames.find(frame=>frame.time===1.8).progress<400,'the fourth line should still be completing');
 assert.equal(textFrames.find(frame=>frame.time===1.85).progress,400,'all four lines finish before the next scene moves');
 assert.equal(textFrames.find(frame=>frame.time===2.1).progress,400,'complete text remains during the reading pause');
 assert.ok(textFrames.filter(frame=>frame.progress>0).every(frame=>parseFloat(frame.shade)>=80),'white text must wait for a sufficiently dark surface');
 for(const frame of textFrames.slice().reverse()){
  timeline.time(frame.time);textEffect.updateAboutText();assert.equal(textProgress(),frame.progress,'reverse scene scroll must restore text progress');assert.equal(aboutRegion.style['--about-shade'],frame.shade);assert.equal(aboutRegion.style['--about-label-progress'],frame.label);
 }
 const writes=textWrites;textEffect.updateAboutText();assert.equal(textWrites,writes,'an unchanged frame should not write the same style again');
 textEffect.sceneTimeline=null;
 for(const height of [680,719,900]){
  textEffect.innerHeight=height;
  for(const regionHeight of [height*.8,height,height*1.4]){
   sectionHeight=regionHeight;
   const distance=Math.min(height,regionHeight);
   const frames=[];
   for(const top of [height*1.1,height,height-distance*.75,height-distance,-100]){
    sectionTop=top;textEffect.updateAboutText();frames.push({top,progress:textProgress()});
   }
   assert.equal(frames[0].progress,0);
   assert.equal(frames[1].progress,0,'the text starts before its scene enters');
   assert.ok(frames[2].progress>0&&frames[2].progress<400,'normal-flow text must reveal across four line ranges');
   assert.equal(frames[3].progress,400,'normal-flow text must complete when the scene fits, or at its first full viewport');
   for(const frame of frames.slice().reverse()){
    sectionTop=frame.top;textEffect.updateAboutText();assert.equal(textProgress(),frame.progress,'normal-flow reverse scroll must restore text progress');
   }
  }
 }
 textEffect.reducedMotion.matches=true;textEffect.updateAboutText();assert.equal(textProgress(),400,'reduced motion should show all four complete lines');assert.equal(aboutRegion.style['--about-shade'],'100%');
 textEffect.aboutText=null;assert.doesNotThrow(()=>textEffect.updateAboutText(),'other routes have no homepage About text');
 const regions=['hero','about','about','work',null].map((scene,index)=>({scene,delay:index===2?.16:index===3?.2:0,progress:-1,region:{getBoundingClientRect:()=>({top:700,height:700})},vine:{style:{setProperty(name,value){this[name]=value}}}}));
 const growth={botanicalVines:regions,reducedMotion:{matches:false},progressBetween,innerHeight:900,Math,sceneTimeline:timeline,sceneTransitionProgress:sandbox.sceneTransitionProgress};
 vm.createContext(growth);
 vm.runInContext(source.match(/const scenePacing = [^;]+;/)[0]+entrySource+source.slice(source.indexOf('function updateBotanicalGrowth()'),source.indexOf('function requestScrollState()')),growth);
 const vineFrames=[];
 for(const time of [0,.12,.35,.9,1.2,1.4,1.8,2.1,2.7,3.15,3.4]){
  timeline.time(time);growth.updateBotanicalGrowth();
  vineFrames.push({time,values:regions.map(r=>r.progress)});
 }
 for(const frame of vineFrames.slice().reverse()){
  timeline.time(frame.time);growth.updateBotanicalGrowth();assert.deepEqual(regions.map(r=>r.progress),frame.values);
 }
 assert.ok(vineFrames.every(frame=>frame.values[0]===1000),'hero vines must be complete from the first frame');
 const aboutEntering=vineFrames.find(frame=>frame.time===1.2).values;
 assert.ok(aboutEntering[1]>0&&aboutEntering[1]<1000&&aboutEntering[2]>0&&aboutEntering[2]<1000,'both About plants should grow while the scene enters');
 assert.deepEqual(vineFrames.find(frame=>frame.time===1.4).values.slice(1,3),[1000,1000],'both About plants must finish at its arrival, including the delayed right plant');
 assert.equal(vineFrames.find(frame=>frame.time===2.1).values[3],0,'Work plants must follow the beginning of their own entry');
 assert.ok(vineFrames.find(frame=>frame.time===2.7).values[3]>0,'Work plants must grow as the scene enters');
 assert.ok(vineFrames.find(frame=>frame.time===3.15).values[3]<1000,'Work plants must not finish ahead of their scene');
 assert.equal(vineFrames.find(frame=>frame.time===3.4).values[3],1000,'Work plants must finish exactly at its arrival');
 growth.reducedMotion.matches=true;growth.updateBotanicalGrowth();assert.ok(regions.every(r=>r.progress===1000));
 growth.reducedMotion.matches=false;
 let pageTop=0;
 const initialPage={fromTop:true,delay:0,progress:-1,region:{getBoundingClientRect:()=>({top:pageTop,height:900})},vine:{style:{setProperty(name,value){this[name]=value}}}};
 const laterPage={...initialPage,fromTop:false,delay:.2,progress:-1,vine:{style:{setProperty(name,value){this[name]=value}}}};
 growth.botanicalVines=[initialPage,laterPage];
 growth.sceneTimeline=null;
 const pageFrames=[];
 for(const top of [1050,900,700,450,200,0,-100]){
  pageTop=top;growth.updateBotanicalGrowth();pageFrames.push([top,initialPage.progress,laterPage.progress]);
 }
 assert.ok(pageFrames.every(frame=>frame[1]===1000),'child-page opening vines must be complete');
 assert.equal(pageFrames[0][2],0);
 assert.equal(pageFrames[1][2],0,'lower-page vines should start with the section entry');
 assert.ok(pageFrames[2][2]>0&&pageFrames[4][2]<1000,'plants should keep growing during the entry instead of finishing around the viewport midpoint');
 assert.equal(pageFrames[5][2],1000,'a viewport-height section should complete its plants when fully in place');
 for(const [top,first,second] of pageFrames.slice().reverse()){
  pageTop=top;growth.updateBotanicalGrowth();assert.equal(initialPage.progress,first);assert.equal(laterPage.progress,second);
 }
 let fittingTop=900;
 const fittingPage={...laterPage,delay:0,progress:-1,region:{getBoundingClientRect:()=>({top:fittingTop,height:700})},vine:{style:{setProperty(name,value){this[name]=value}}}};
 growth.botanicalVines=[fittingPage];
 fittingTop=550;growth.updateBotanicalGrowth();assert.equal(fittingPage.progress,500);
 fittingTop=200;growth.updateBotanicalGrowth();assert.equal(fittingPage.progress,1000,'a shorter section should complete once its entire height is visible');
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
 console.log('Motion checks passed: reversible eased scenes, bounded centered About/CTA, progressive landscape reveal, text/vines (pinned/normal flow), layout restoration, five phone states, letter dissolve, reduced motion and local SVG references.');
} catch(error) {
 console.error(error.name+': '+error.message);
 process.exitCode=1;
} finally {real.ticker.sleep();}
