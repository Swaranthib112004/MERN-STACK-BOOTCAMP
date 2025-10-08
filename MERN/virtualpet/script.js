// --- Cat image paths ---
const catImages = {
  idle: "images/idle.png",
  feed: "images/feed.png",
  play: "images/play.jfif",
  sleep: "images/sleep.png"
};

const petImage = document.getElementById('petImage');
const feedBtn = document.getElementById('feedBtn');
const playBtn = document.getElementById('playBtn');
const sleepBtn = document.getElementById('sleepBtn');
const resetBtn = document.getElementById('resetBtn');
const statsGrid = document.getElementById('statsGrid');
const logList = document.getElementById('logList');

// --- Pet stats ---
const pet = { name: 'Buddy', hunger: 30, energy: 70, happiness: 70 };

// --- Activity log ---
const activityLog = [];

// --- Utility ---
const fmtTime = () => new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit',second:'2-digit'});
const clamp = (v,a=0,b=100) => Math.max(a,Math.min(b,v));

// --- Create stat blocks ---
const statSpecs = [
  {key:'hunger',label:'Hunger',invert:true},
  {key:'energy',label:'Energy'},
  {key:'happiness',label:'Happiness'}
];

function makeStatBlock(spec){
  const el = document.createElement('div');
  el.className = 'stat';
  el.dataset.key = spec.key;

  const label = document.createElement('div');
  label.className = 'label';
  label.innerText = spec.label;
  const val = document.createElement('div');
  val.className = 'value';
  val.id = spec.key + 'Val';
  val.innerText = '—';

  const progWrap = document.createElement('div');
  progWrap.className = 'progress';
  const prog = document.createElement('i');
  prog.id = spec.key + 'Bar';
  prog.style.width = '0%';
  progWrap.appendChild(prog);

  el.appendChild(label);
  el.appendChild(val);
  el.appendChild(progWrap);
  statsGrid.appendChild(el);
}
statSpecs.forEach(makeStatBlock);

// --- Update stats UI ---
function updateUI(){
  statSpecs.forEach(spec=>{
    const key = spec.key;
    const valEl = document.getElementById(key+'Val');
    const barEl = document.getElementById(key+'Bar');
    let display = spec.invert ? 100 - pet[key] : pet[key];
    valEl.innerText = Math.round(display)+'%';
    barEl.style.width = clamp(display)+'%';
  });
}

// --- Activity log ---
function pushLog(text){
  const ts = fmtTime();
  activityLog.push({text,ts});
  renderLog();
}

function renderLog(){
  logList.innerHTML = '';
  for(let i=activityLog.length-1;i>=0;i--){
    const li = document.createElement('div');
    li.className='log-item';
    li.innerHTML=`<div>${activityLog[i].text}</div><div class="time">${activityLog[i].ts}</div>`;
    logList.appendChild(li);
  }
}

// --- Cat image switch ---
function setCatImage(action){
  petImage.src = catImages[action] || catImages.idle;
  clearTimeout(window.imageResetTimeout);
  window.imageResetTimeout = setTimeout(()=>{
    petImage.src = catImages.idle;
  },4000);
}

// --- Actions ---
function feed(){
  pet.hunger = clamp(pet.hunger - 30);
  pet.happiness = clamp(pet.happiness + 5);
  pushLog(`Fed ${pet.name} (Hunger: ${Math.round(100-pet.hunger)}%)`);
  setCatImage('feed');
  updateUI();
}

function play(){
  pet.happiness = clamp(pet.happiness + 18);
  pet.energy = clamp(pet.energy - 20);
  pet.hunger = clamp(pet.hunger + 10);
  pushLog(`Played with ${pet.name} (Happiness: ${Math.round(pet.happiness)}%)`);
  setCatImage('play');
  updateUI();
}

function sleep(){
  pet.energy = clamp(pet.energy + 40);
  pet.hunger = clamp(pet.hunger + 10);
  pushLog(`${pet.name} took a nap (Energy: ${Math.round(pet.energy)}%)`);
  setCatImage('sleep');
  updateUI();
}

function resetPet(){
  pet.hunger=30; pet.energy=70; pet.happiness=70;
  activityLog.length=0;
  pushLog(`Reset ${pet.name}`);
  updateUI();
  renderLog();
}

// --- Event listeners ---
feedBtn.addEventListener('click', feed);
playBtn.addEventListener('click', play);
sleepBtn.addEventListener('click', sleep);
resetBtn.addEventListener('click', ()=>{
  if(confirm('Reset Buddy to defaults?')) resetPet();
});

// --- Timer to auto change stats ---
setInterval(()=>{
  pet.hunger = clamp(pet.hunger + 3);
  pet.energy = clamp(pet.energy - 2);
  if(pet.hunger>60) pet.happiness=clamp(pet.happiness-3);
  if(pet.energy<30) pet.happiness=clamp(pet.happiness-2);
  if(pet.hunger<30 && pet.energy>60) pet.happiness=clamp(pet.happiness+1);
  pushLog(`Status — Hunger: ${Math.round(100-pet.hunger)}%, Energy: ${Math.round(pet.energy)}%, Happiness: ${Math.round(pet.happiness)}%`);
  updateUI();
},5000);

// --- Initialize UI ---
updateUI();
pushLog(`Welcome! ${pet.name} is ready.`);
