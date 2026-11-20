const films = [
  { title: 'Mama & Adek', id: '1F_gAcmvujlaFHpXQS7iu4ngfTN9wf-CD', src: 'videos/family-1.mp4', poster: 'videos/poster-1.jpg' },
  { title: 'Bapak', id: '1Tok-3xMnyZt59leL8Cfk2k23sn-yjAF1', src: 'videos/family-2.mp4', poster: 'videos/poster-2.jpg' },
  { title: 'Adek Kedua', id: '1tVoewy35fo1FxdoAWRm1ESdKLlorg6lR', src: 'videos/family-3.mp4', poster: 'videos/poster-3.jpg' }
];
const mobileLayout = matchMedia('(max-width: 760px)');
const desktopPages = ['intro', 'films', 'note'];
const mobilePages = ['intro', 'films', 'record', 'note'];
let pages = mobileLayout.matches ? mobilePages : desktopPages;
const pageLabels = { intro: 'Buka buku', films: 'Film keluarga', record: 'Vinyl', note: 'Untuk kamu' };
const player = document.querySelector('#family-video');
let currentFilm = 0;
let currentPage = 0;
let currentPageName = 'intro';

function setPage(name, updateHash = true) {
  const index = pages.indexOf(name);
  if (index === -1) return;
  const pageChanged = index !== currentPage;
  const content = document.querySelector('#left-content');
  const canTurn = index !== currentPage && !document.querySelector('.book-wrap').hidden && !document.documentElement.classList.contains('book-morphing') && !mobileLayout.matches && !matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (canTurn) turnPaper(content, index > currentPage);
  currentPage = index;
  currentPageName = name;
  document.querySelector('#book').dataset.mobilePage = name;
  document.querySelectorAll('[data-content]').forEach(content => { content.hidden = content.dataset.content !== name; });
  document.querySelectorAll('[data-page]').forEach(button => {
    const active = button.dataset.page === name;
    button.classList.toggle('active', active);
    if (active) button.setAttribute('aria-current', 'page');
    else button.removeAttribute('aria-current');
  });
  const heading = document.querySelector(`[data-content="${name}"] h1`);
  document.querySelectorAll('.page-content h1').forEach(title => title.removeAttribute('id'));
  if (heading) heading.id = 'page-title';
  document.querySelector('#page-counter').textContent = `${pageLabels[name]} · ${index + 1} / ${pages.length}`;
  document.querySelector('#left-page-number').textContent = String(mobileLayout.matches ? index + 1 : index * 2 + 1).padStart(2, '0');
  document.querySelector('#right-page-number').textContent = String(mobileLayout.matches ? index + 1 : index * 2 + 2).padStart(2, '0');
  document.querySelector('#previous-page').disabled = index === 0;
  document.querySelector('#next-page').disabled = index === pages.length - 1;
  content.classList.remove('is-turning');
  void content.offsetWidth;
  content.classList.add('is-turning');
  if (updateHash) history.replaceState(null, '', `#${name}`);
  if (pageChanged && mobileLayout.matches && !document.documentElement.classList.contains('book-morphing')) {
    window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }
}

const filmDialog = document.querySelector('#film-dialog');
function selectFilm(index, play = true) {
  if (index < 0 || index >= films.length) return;
  currentFilm = index;
  const film = films[index];
  document.querySelectorAll('[data-video]').forEach(button => {
    const selected = Number(button.dataset.video) === index;
    button.classList.toggle(button.classList.contains('channel') ? 'active' : 'selected', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
  document.querySelector('#film-label').textContent = `A${index + 1} — ${film.title}`;
  document.querySelector('#playback-error').hidden = true;
  document.querySelector('#dialog-title').textContent = film.title;
  document.querySelector('#dialog-track').textContent = `TRACK 0${index + 1} / 03`;
  document.querySelector('#previous-film').disabled = index === 0;
  document.querySelector('#next-film').disabled = index === films.length - 1;
  player.pause();
  player.src = film.src;
  player.poster = film.poster;
  player.setAttribute('aria-label', `Video keluarga ${index + 1}: ${film.title}`);
  if (!filmDialog.open) {
    filmDialog.showModal();
    document.body.classList.add('modal-open');
    document.querySelector('#close-film').focus();
  }
  if (play) player.play().catch(() => { /* Native controls remain available. */ });
}

document.querySelectorAll('[data-page]').forEach(button => button.addEventListener('click', () => navigateBook(button.dataset.page)));
const homeLink = document.querySelector('.logo');
homeLink.addEventListener('click', event => { event.preventDefault(); navigateBook('intro'); });
document.querySelector('#previous-page').addEventListener('click', () => { if (currentPage > 0) setPage(pages[currentPage - 1]); });
document.querySelector('#next-page').addEventListener('click', () => { if (currentPage < pages.length - 1) setPage(pages[currentPage + 1]); });
document.querySelectorAll('[data-video]').forEach(button => button.addEventListener('click', () => {
  setPage('films');
  selectFilm(Number(button.dataset.video));
}));
function syncRecord() {
  document.querySelector('#album-assembly').classList.toggle('is-playing', !player.paused && !player.ended && player.readyState >= 3);
}
['playing', 'pause', 'ended', 'waiting', 'emptied', 'error'].forEach(event => player.addEventListener(event, syncRecord));
document.querySelector('#start-film').addEventListener('click', () => selectFilm(currentFilm));
document.querySelector('#close-film').addEventListener('click', () => filmDialog.close());
filmDialog.addEventListener('close', () => { player.pause(); document.body.classList.remove('modal-open'); });
filmDialog.addEventListener('click', event => {
  const rect = filmDialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) filmDialog.close();
});
document.querySelector('#previous-film').addEventListener('click', () => selectFilm(currentFilm - 1));
document.querySelector('#next-film').addEventListener('click', () => selectFilm(currentFilm + 1));
player.addEventListener('error', () => { document.querySelector('#playback-error').hidden = false; });
player.addEventListener('ended', () => { document.querySelector('#film-label').textContent = `TRACK 0${currentFilm + 1} · Putar lagi kapan pun kamu kangen ♡`; });
window.addEventListener('hashchange', () => setPage(location.hash.slice(1), false));
setPage('intro', false);
history.replaceState(null, '', location.pathname + location.search);

const bookWrap = document.querySelector('.book-wrap');
const closedScene = document.querySelector('#closed-scene');
let bookBusy = false;
function turnPaper(content, forward) {
  document.querySelectorAll('.turning-paper').forEach(sheet => sheet.remove());
  const sheet = content.cloneNode(true);
  sheet.removeAttribute('id');
  sheet.querySelectorAll('[id]').forEach(node => node.removeAttribute('id'));
  sheet.className = 'turning-paper';
  sheet.setAttribute('aria-hidden', 'true');
  sheet.inert = true;
  Object.assign(sheet.style, {
    left: `${content.offsetLeft}px`, top: `${content.offsetTop}px`,
    width: `${content.offsetWidth}px`, height: `${content.offsetHeight}px`,
    transformOrigin: forward ? 'right center' : 'left center'
  });
  content.parentElement.append(sheet);
  sheet.animate([
    { transform: 'perspective(1200px) rotateY(0deg)', opacity: 1, filter: 'brightness(1)' },
    { transform: `perspective(1200px) rotateY(${forward ? 58 : -58}deg)`, opacity: .75, filter: 'brightness(.89)', offset: .65 },
    { transform: `perspective(1200px) rotateY(${forward ? 88 : -88}deg)`, opacity: 0, filter: 'brightness(.85)' }
  ], { duration: 630, easing: 'cubic-bezier(.22,.7,.2,1)', fill: 'forwards' }).finished.finally(() => sheet.remove());
}
async function morphBook(update, direction, animate = true) {
  if (bookBusy) return;
  bookBusy = true;
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  root.dataset.bookMotion = direction;
  root.classList.add('book-morphing');
  try {
    if (animate && !reduced && document.startViewTransition) {
      const transition = document.startViewTransition(update);
      await transition.finished.catch(() => {});
    } else if (animate && !reduced) {
      await animateBookFallback(update, direction);
    } else {
      update();
    }
  } finally {
    root.classList.remove('book-morphing');
    delete root.dataset.bookMotion;
    bookBusy = false;
  }
}
async function closeBook() {
  if (bookBusy || bookWrap.hidden) return;
  player.pause();
  if (filmDialog.open) filmDialog.close();
  await morphBook(() => {
    document.querySelectorAll('.turning-paper').forEach(sheet => sheet.remove());
    bookWrap.hidden = true;
    document.querySelector('.below-book').hidden = true;
    document.querySelector('.desk-note').hidden = true;
    closedScene.classList.add('is-ending');
    document.querySelector('#reopen-book').textContent = 'buka lagi';
    closedScene.hidden = false;
    history.replaceState(null, '', location.pathname + location.search);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, 'closing');
  document.querySelector('#reopen-book').focus({ preventScroll: true });
}
async function reopenBook(page = 'intro', animate = true) {
  if (bookBusy) return;
  stopCoverInvitation();
  await morphBook(() => {
    closedScene.hidden = true;
    bookWrap.hidden = false;
    document.querySelector('.below-book').hidden = false;
    document.querySelector('.desk-note').hidden = false;
    setPage(page);
    if (animate) window.scrollTo({ top: 0, behavior: 'instant' });
  }, 'opening', animate);
  document.querySelector('#interactive-cover').style.removeProperty('transform');
}
function navigateBook(page) {
  if (bookBusy) return;
  if (!closedScene.hidden) reopenBook(page);
  else setPage(page);
}
document.querySelector('#close-book').addEventListener('click', closeBook);
document.querySelector('#reopen-book').addEventListener('click', async () => {
  await reopenBook();
  document.querySelector('[data-page="intro"]').focus({ preventScroll: true });
});



const authorDialog = document.querySelector('#author-dialog');
document.querySelectorAll('[data-show-rian]').forEach(button => button.addEventListener('click', () => {
  authorDialog.showModal();
  document.body.classList.add('modal-open');
  document.querySelector('#close-author').focus();
}));
document.querySelector('#close-author').addEventListener('click', () => authorDialog.close());
authorDialog.addEventListener('close', () => { if (!filmDialog.open) document.body.classList.remove('modal-open'); });
authorDialog.addEventListener('click', event => {
  const rect = authorDialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) authorDialog.close();
});

async function animateBookFallback(update, direction) {
  const source = direction === 'opening' ? closedScene.querySelector('.closed-cover') : bookWrap;
  const rect = source.getBoundingClientRect();
  const ghost = source.cloneNode(true);
  ghost.removeAttribute('id');
  ghost.querySelectorAll('[id]').forEach(node => node.removeAttribute('id'));
  ghost.setAttribute('aria-hidden', 'true');
  ghost.inert = true;
  ghost.classList.add('book-motion-ghost');
  if (direction === 'opening' && closedScene.classList.contains('is-ending')) ghost.classList.add('ending-ghost');
  Object.assign(ghost.style, {
    position: 'fixed', left: `${rect.left}px`, top: `${rect.top}px`,
    width: `${rect.width}px`, height: `${rect.height}px`, margin: '0',
    transform: 'none', transformOrigin: 'left center', zIndex: '50',
    pointerEvents: 'none', animation: 'none', transition: 'none'
  });
  document.body.append(ghost);
  update();
  const target = direction === 'opening' ? bookWrap : closedScene.querySelector('.closed-cover');
  const targetRect = target.getBoundingClientRect();
  const restingTransform = getComputedStyle(target).transform;
  const shiftX = targetRect.left - rect.left;
  const shiftY = targetRect.top - rect.top;
  const mobile = mobileLayout.matches;
  const scale = Math.min(1.5, Math.max(.45, targetRect.height / rect.height));
  const duration = mobile ? 650 : 850;
  try {
    await Promise.all([
      ghost.animate([
        { opacity: 1, transform: 'perspective(1600px) translate(0,0) rotateY(0) scale(1)' },
        { opacity: .8, transform: `perspective(1600px) translate(${shiftX * .5}px,${shiftY * .5}px) rotateY(${direction === 'opening' ? -46 : 36}deg) scale(${(1 + scale) / 2})`, offset: .48 },
        { opacity: 0, transform: `perspective(1600px) translate(${shiftX}px,${shiftY}px) rotateY(${direction === 'opening' ? -100 : 78}deg) scale(${scale})` }
      ], { duration, easing: 'cubic-bezier(.22,.7,.2,1)', fill: 'forwards' }).finished,
      target.animate([
        { opacity: 0, transform: `perspective(1600px) rotateY(${direction === 'opening' ? 18 : -30}deg) scale(.96)` },
        { opacity: 0, transform: `perspective(1600px) rotateY(${direction === 'opening' ? 12 : -22}deg) scale(.97)`, offset: .2 },
        { opacity: 1, transform: restingTransform === 'none' ? 'none' : restingTransform }
      ], { duration, easing: 'cubic-bezier(.22,.7,.2,1)' }).finished
    ]);
  } finally { ghost.remove(); }
}

mobileLayout.addEventListener('change', () => {
  pages = mobileLayout.matches ? mobilePages : desktopPages;
  setPage(pages.includes(currentPageName) ? currentPageName : 'films', false);
});
let swipeStart = null;
const bookPages = document.querySelector('#book-pages');
bookPages.addEventListener('touchstart', event => {
  if (!mobileLayout.matches || bookBusy || event.touches.length !== 1) return;
  swipeStart = { x: event.touches[0].clientX, y: event.touches[0].clientY };
}, { passive: true });
bookPages.addEventListener('touchend', event => {
  if (!swipeStart || !mobileLayout.matches) return;
  const dx = event.changedTouches[0].clientX - swipeStart.x;
  const dy = event.changedTouches[0].clientY - swipeStart.y;
  swipeStart = null;
  if (Math.abs(dx) < 65 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
  const target = currentPage + (dx < 0 ? 1 : -1);
  if (target >= 0 && target < pages.length) {
    event.preventDefault();
    setPage(pages[target]);
  }
}, { passive: false });
bookPages.addEventListener('touchcancel', () => { swipeStart = null; });

let coverEntranceTimer;
let coverInvitationTimer;
function stopCoverInvitation() {
  clearTimeout(coverEntranceTimer);
  clearTimeout(coverInvitationTimer);
  if (closedScene.classList.contains('is-arriving') || closedScene.classList.contains('is-inviting')) {
    const cover = document.querySelector('#interactive-cover');
    cover.style.transform = getComputedStyle(cover).transform;
  }
  closedScene.classList.remove('is-arriving', 'is-inviting');
}
function inviteToOpen() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || closedScene.hidden || closedScene.classList.contains('is-ending')) return;
  closedScene.classList.add('is-arriving');
  coverEntranceTimer = setTimeout(() => {
    closedScene.classList.remove('is-arriving');
    coverInvitationTimer = setTimeout(() => {
      if (!closedScene.hidden && !closedScene.classList.contains('is-ending')) closedScene.classList.add('is-inviting');
    }, 1200);
  }, 1150);
}
const interactiveCover = document.querySelector('#interactive-cover');
interactiveCover.addEventListener('click', () => reopenBook());
interactiveCover.addEventListener('keydown', event => {
  if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); reopenBook(); }
});
document.addEventListener('visibilitychange', () => {
  closedScene.classList.toggle('motion-paused', document.hidden);
});
matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', event => {
  if (event.matches) stopCoverInvitation();
});
inviteToOpen();
