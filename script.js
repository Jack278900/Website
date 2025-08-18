// Mobile nav
const navToggle = document.getElementById('navToggle');
const siteNav = document.getElementById('siteNav');
if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const open = siteNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
}

// Year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Slider
document.querySelectorAll('.slider').forEach(initSlider);

function initSlider(slider){
  const track = slider.querySelector('.track');
  const slides = [...slider.querySelectorAll('.slide')];
  const prev = slider.querySelector('.prev');
  const next = slider.querySelector('.next');
  const dotsWrap = slider.querySelector('.dots');

  let idx = 0;
  const last = slides.length - 1;

  // dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'dot' + (i===0 ? ' active' : '');
    dot.setAttribute('aria-label', `Go to slide ${i+1}`);
    dot.addEventListener('click', () => go(i));
    dotsWrap.appendChild(dot);
  });

  const dots = [...dotsWrap.children];

  function update(){
    dots.forEach(d => d.classList.remove('active'));
    dots[idx].classList.add('active');
    track.scrollTo({ left: idx * track.clientWidth, behavior: 'smooth' });
  }

  function go(i){
    idx = Math.max(0, Math.min(last, i));
    update();
  }
  function nextSlide(){ go(idx + 1 > last ? 0 : idx + 1); }
  function prevSlide(){ go(idx - 1 < 0 ? last : idx - 1); }

  next.addEventListener('click', nextSlide);
  prev.addEventListener('click', prevSlide);
  window.addEventListener('resize', update);

  // autoplay
  const ms = Number(slider.dataset.autoplay || 0);
  let t;
  if (ms > 0) {
    const start = () => t = setInterval(nextSlide, ms);
    const stop = () => clearInterval(t);
    slider.addEventListener('mouseenter', stop);
    slider.addEventListener('mouseleave', start);
    start();
  }

  // swipe
  let x0 = null;
  track.addEventListener('pointerdown', e => (x0 = e.clientX));
  track.addEventListener('pointerup', e => {
    if (x0 === null) return;
    const dx = e.clientX - x0;
    if (Math.abs(dx) > 40) (dx > 0 ? prevSlide() : nextSlide());
    x0 = null;
  });

  update();
}

// News (localStorage; add posts from admin.html)
(function renderNews(){
  const el = document.getElementById('newsList');
  if (!el) return;
  let posts = [];
  try { posts = JSON.parse(localStorage.getItem('acf_news') || '[]'); }
  catch(_){ posts = []; }
  if (!posts.length) {
    el.innerHTML = `
      <article class="news">
        <time datetime="${new Date().toISOString().slice(0,10)}">${new Date().toLocaleDateString()}</time>
        <h3>Website is live 🎉</h3>
        <p>DNS connected, GitHub Pages deployed, and the trail is open. Hit “Join the Server” up top.</p>
      </article>
    `;
    return;
  }
  el.innerHTML = posts.map(p => `
    <article class="news">
      <time datetime="${p.date}">${new Date(p.date).toLocaleDateString()}</time>
      <h3>${p.title}</h3>
      <p>${p.body}</p>
    </article>
  `).join('');
})();
