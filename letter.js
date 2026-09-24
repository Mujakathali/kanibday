/* Sealed envelope → parchment letter, over the finished tree. */

const $ = (id) => document.getElementById(id);

let io = null;
let opening = false;

export function initLetter(){
  const btn = $('letterBtn');
  const stage = $('letterStage');
  const env = $('env');
  const close = $('letterClose');
  if (!btn || !stage || !env) return;

  seedPetals();

  btn.addEventListener('click', openStage);
  env.addEventListener('click', openEnvelope);
  close.addEventListener('click', () => closeLetter());
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && stage.classList.contains('is-open')) closeLetter();
  });
}

export function armLetter(){
  const btn = $('letterBtn');
  if (!btn) return;
  btn.hidden = false;
  requestAnimationFrame(() => btn.classList.add('is-shown'));
}

export function disarmLetter(){
  closeLetter(true);
  const btn = $('letterBtn');
  if (!btn) return;
  btn.classList.remove('is-shown');
  btn.hidden = true;
}

function openStage(){
  const btn = $('letterBtn');
  const stage = $('letterStage');
  const envScene = $('envScene');
  const sheet = $('letterSheet');
  const env = $('env');
  const hint = $('envHint');
  if (!stage || !env || !envScene || !sheet) return;

  opening = false;
  env.classList.remove('is-broken', 'is-open', 'is-opening');
  envScene.classList.remove('is-gone');
  sheet.classList.remove('is-shown');
  sheet.scrollTop = 0;
  resetReveals();

  if (btn) btn.classList.remove('is-shown');
  stage.hidden = false;
  stage.removeAttribute('hidden');
  if (hint) hint.textContent = 'click the seal to open';

  requestAnimationFrame(() => {
    stage.classList.add('is-open');
    env.focus();
    openEnvelope();
  });
}

function openEnvelope(){
  if (opening) return;
  const env = $('env');
  const hint = $('envHint');
  const envScene = $('envScene');
  const sheet = $('letterSheet');
  if (!env || !envScene || !sheet) return;

  opening = true;
  env.classList.add('is-opening', 'is-broken');
  if (hint) hint.textContent = 'for you';

  window.setTimeout(() => env.classList.add('is-open'), 220);
  window.setTimeout(() => {
    envScene.classList.add('is-gone');
    sheet.classList.add('is-shown');
    sheet.focus({ preventScroll: true });
    watchReveals();
  }, 900);
}

export function closeLetter(immediate){
  const stage = $('letterStage');
  const sheet = $('letterSheet');
  const envScene = $('envScene');
  const env = $('env');
  if (!stage) return;

  opening = false;
  if (io){ io.disconnect(); io = null; }

  const hide = () => {
    stage.classList.remove('is-open');
    stage.hidden = true;
    sheet.classList.remove('is-shown');
    envScene.classList.remove('is-gone');
    env.classList.remove('is-broken', 'is-open', 'is-opening');
  };

  if (immediate){ hide(); return; }
  stage.classList.remove('is-open');
  window.setTimeout(hide, 420);

  const btn = $('letterBtn');
  if (btn && !btn.hidden){
    btn.classList.add('is-shown');
    btn.focus();
  }
}

function resetReveals(){
  document.querySelectorAll('.letter__hero, .letter__miss li, .letter__body p').forEach((el) => {
    el.classList.remove('is-in');
  });
}

function watchReveals(){
  if (io) io.disconnect();
  const nodes = document.querySelectorAll('.letter__hero, .letter__miss li, .letter__body p');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce){
    nodes.forEach((el) => el.classList.add('is-in'));
    return;
  }
  io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting){
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    });
  }, { root: $('letterSheet'), threshold: 0.18 });
  nodes.forEach((el) => io.observe(el));
}

function seedPetals(){
  const host = $('letterPetals');
  if (!host || host.childElementCount) return;
  for (let i = 0; i < 28; i++){
    const p = document.createElement('span');
    p.className = 'letterStage__petal';
    p.style.left = `${Math.random() * 100}%`;
    p.style.setProperty('--drift', `${(Math.random() * 80 - 40).toFixed(0)}px`);
    p.style.animationDuration = `${9 + Math.random() * 10}s`;
    p.style.animationDelay = `${-Math.random() * 12}s`;
    p.style.opacity = String(0.28 + Math.random() * 0.4);
    p.style.width = p.style.height = `${8 + Math.random() * 10}px`;
    host.appendChild(p);
  }
}
