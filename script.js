// ===== База мест =====
// m: 'sad' (грустное), 'happy' (весёлое), 'both' (подходит под любое)
const PLACES = [
  { id: 1,  e: '🧖', n: 'Спа и хаммам',                    m: 'sad',   d: 'Тепло, тишина и массаж — чтобы выдохнуть и перезагрузиться.' },
  { id: 2,  e: '🍵', n: 'Чайная комната',                  m: 'sad',   d: 'Уютный полумрак, ароматный чай и неспешные разговоры.' },
  { id: 3,  e: '🎬', n: 'Кинотеатр с креслами-кроватями',  m: 'sad',   d: 'Комфортное кино, где можно забыть обо всём.' },
  { id: 4,  e: '📚', n: 'Книжное кафе',                    m: 'sad',   d: 'Тихий уголок с книгой, кофе и десертом.' },
  { id: 5,  e: '🌊', n: 'Прогулка по набережной на закате', m: 'both',  d: 'Свежий воздух и красивый закат подходят под любое настроение.' },
  { id: 6,  e: '🏺', n: 'Гончарная мастерская',            m: 'sad',   d: 'Творчество руками отлично успокаивает мысли.' },
  { id: 7,  e: '🎤', n: 'Караоке-бар',                     m: 'happy', d: 'Пой любимые хиты с друзьями до утра!' },
  { id: 8,  e: '🎳', n: 'Боулинг',                         m: 'happy', d: 'Азарт, смех и небольшое соревнование.' },
  { id: 9,  e: '🏎️', n: 'Картинг',                         m: 'happy', d: 'Скорость и адреналин для заряда энергии.' },
  { id: 10, e: '🎲', n: 'Бар настольных игр',              m: 'happy', d: 'Компания, игры и коктейли — вечер пролетит незаметно.' },
  { id: 11, e: '🤸', n: 'Батутный парк',                   m: 'happy', d: 'Прыгай и чувствуй себя ребёнком.' },
  { id: 12, e: '🧺', n: 'Пикник в парке',                  m: 'both',  d: 'Плед, вкусности и хорошая компания — или просто ты и природа.' }
];

const KEY = 'moodmix_liked';
let mood = null;
let current = null;

const $ = s => document.querySelector(s);

// ===== localStorage =====
function getLiked() {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; }
  catch (e) { return []; }
}
function setLiked(arr) {
  try { localStorage.setItem(KEY, JSON.stringify(arr)); }
  catch (e) {}
}

// ===== Экраны =====
function show(id) {
  ['home', 'results', 'history'].forEach(s => $('#' + s).hidden = (s !== id));
}

function card(p) {
  const liked = getLiked().includes(p.id);
  return `<div class="card" data-id="${p.id}">
    <span class="h">${liked ? '❤️' : ''}</span>
    <span class="e">${p.e}</span>
    <h3>${p.n}</h3>
    <p>${p.d}</p>
  </div>`;
}

// ===== Выбор настроения =====
document.querySelectorAll('.mood').forEach(btn => {
  btn.onclick = () => {
    mood = btn.dataset.mood;
    document.querySelectorAll('.mood').forEach(x => x.classList.toggle('active', x === btn));
    $('#hint').textContent = '';
  };
});

// ===== Кнопка "Найти места" =====
$('#findBtn').onclick = () => {
  if (!mood) {
    $('#hint').textContent = 'Сначала выбери настроение 🙂';
    return;
  }
  const list = PLACES.filter(p => p.m === mood || p.m === 'both');
  $('#resTitle').textContent = mood === 'sad'
    ? 'Чтобы расслабиться и отдохнуть'
    : 'Чтобы зарядиться и повеселиться';
  $('#resGrid').innerHTML = list.map(card).join('');
  show('results');
};

// ===== История посещений =====
function renderHistory() {
  const liked = getLiked();
  const list = PLACES.filter(p => liked.includes(p.id));
  $('#histGrid').innerHTML = list.length
    ? list.map(card).join('')
    : '<p class="empty">Пока пусто. Поставь ❤️ месту, куда пойдёшь!</p>';
}
$('#histBtn').onclick = () => { renderHistory(); show('history'); };

// ===== Кнопки "Вернуться" =====
document.querySelectorAll('[data-back]').forEach(b => b.onclick = () => show('home'));

// ===== Окно места + сердечко =====
function openModal(id) {
  current = PLACES.find(p => p.id == id);
  const on = getLiked().includes(current.id);
  $('#box').innerHTML = `
    <div class="e">${current.e}</div>
    <h3>${current.n}</h3>
    <p>${current.d}</p>
    <button class="heart ${on ? 'on' : ''}" id="heart" title="Пойду">❤️</button>
    <div class="row"><small id="ht">${on ? 'Ты пойдёшь сюда!' : 'Нажми на сердечко, если пойдёшь'}</small></div>
    <div class="row"><button class="btn ghost" id="close">Закрыть</button></div>`;
  $('#modal').classList.add('open');

  $('#heart').onclick = () => {
    let arr = getLiked();
    arr = arr.includes(current.id) ? arr.filter(x => x !== current.id) : [...arr, current.id];
    setLiked(arr);
    const now = arr.includes(current.id);
    $('#heart').classList.toggle('on', now);
    $('#ht').textContent = now ? 'Ты пойдёшь сюда!' : 'Нажми на сердечко, если пойдёшь';
  };
  $('#close').onclick = closeModal;
}

function closeModal() {
  $('#modal').classList.remove('open');
  if (!$('#history').hidden) renderHistory();
  document.querySelectorAll('.card').forEach(c => {
    c.querySelector('.h').textContent = getLiked().includes(+c.dataset.id) ? '❤️' : '';
  });
}

$('#modal').onclick = e => { if (e.target.id === 'modal') closeModal(); };
document.addEventListener('click', e => {
  const c = e.target.closest('.card');
  if (c) openModal(c.dataset.id);
});