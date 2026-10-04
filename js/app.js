import {createProgress} from './state.js';
import {parseRoute} from './routes.js';
import {renderPage,searchResults} from './render.js';
import {lessons} from './course.js';
let storage;try{storage=window.localStorage;}catch{}
const progress=createProgress(storage),main=document.querySelector('#main'),dialog=document.querySelector('#reset-dialog');
let route,toastTimer;
function toast(text){const el=document.querySelector('#toast');el.textContent=text;el.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('visible'),5500);}
function render(focus=true){route=parseRoute(location.hash);if(route.page==='lesson')progress.visitDay(route.day);main.innerHTML=renderPage(route,progress.get());document.title=(route.page==='lesson'?`День ${route.day}: ${lessons[route.day-1].title}`:route.page==='materials'?'Матеріали':route.page==='tools'?'Інструменти':'ШІ за 21 день')+' — Творча практика';document.querySelectorAll('[data-nav]').forEach(a=>{const active=a.dataset.nav===(route.page==='lesson'?'home':route.page);if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});if(focus){window.scrollTo(0,0);main.querySelector('h1')?.focus({preventScroll:true});}}
window.addEventListener('hashchange',()=>render());
document.addEventListener('click',async event=>{
 if(event.target.closest('.skip')){event.preventDefault();main.focus();main.scrollIntoView({block:'start'});return;}
 const material=event.target.closest('[data-material]');if(material){const el=document.getElementById(material.dataset.material);if(el){el.open=true;el.scrollIntoView({behavior:'smooth',block:'start'});el.querySelector('summary').focus();}return;}
 const button=event.target.closest('[data-action]');if(!button)return;
 switch(button.dataset.action){
 case 'roadmap':document.querySelector('#roadmap')?.scrollIntoView({behavior:'smooth'});break;
 case 'complete':{const y=window.scrollY,day=+button.dataset.day;progress.toggleDay(day);render(false);window.scrollTo(0,y);document.querySelector('[data-action="complete"]')?.focus({preventScroll:true});toast(progress.get().completed.includes(day)?'День завершено. Чудовий крок уперед!':'Позначку завершення прибрано.');break;}
 case 'reset':dialog.showModal();break;
 case 'cancel-reset':dialog.close();break;
 case 'confirm-reset':dialog.close();progress.reset();render(false);toast('Прогрес скинуто. Можна починати знову.');break;
 case 'copy':{const text=button.closest('.prompt').querySelector('.prompt-text');try{await navigator.clipboard.writeText(text.textContent);button.textContent='Скопійовано ✓';toast('Запит скопійовано. Вставте його в обраний сервіс.');setTimeout(()=>{if(button.isConnected)button.textContent='Копіювати ⧉';},2500);}catch{const selection=window.getSelection(),range=document.createRange();range.selectNodeContents(text);selection.removeAllRanges();selection.addRange(range);text.focus();toast('Текст виділено. Натисніть «Копіювати» або Ctrl+C / ⌘C.');}break;}
 }
});
document.addEventListener('input',event=>{if(event.target.id==='course-search')document.querySelector('#search-results').innerHTML=searchResults(event.target.value);});
render(false);
