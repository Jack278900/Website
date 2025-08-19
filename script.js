// mobile nav
const navToggle = document.getElementById('navToggle');
const siteNav = document.getElementById('siteNav');
if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const open = siteNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
}

// year
const y = document.getElementById('year');
if (y) y.textContent = new Date().getFullYear();

// slider
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
    idx = (i + slides.length) % slides.length;
    update();
  }
  function nextSlide(){ go(idx + 1); }
  function prevSlide(){ go(idx - 1); }

  next.addEventListener('click', nextSlide);
  prev.addEventListener('click', prevSlide);
  window.addEventListener('resize', update);

  // autoplay (pause on hover)
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
