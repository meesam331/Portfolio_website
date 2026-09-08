lucide.createIcons();

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

const root = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');
const setTheme = (isDark) => {
  root.classList.toggle('dark', isDark);
  root.dataset.theme = isDark ? 'dark' : 'light';
  const icon = themeToggle?.querySelector('svg');
  if (icon) icon.setAttribute('data-lucide', isDark ? 'sun' : 'moon');
  lucide.createIcons();
};

themeToggle?.addEventListener('click', () => setTheme(!root.classList.contains('dark')));

const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
menuToggle?.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  menuToggle.querySelector('svg')?.setAttribute('data-lucide', isOpen ? 'x' : 'menu');
  lucide.createIcons();
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    mobileMenu?.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  });
});

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    observer.unobserve(entry.target);
  });
}, { threshold: 0.14 });
document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const progressBar = document.getElementById('scroll-progress');
const updateProgress = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  if (progressBar) progressBar.style.width = `${scrollable ? (window.scrollY / scrollable) * 100 : 0}%`;
};
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

const sections = document.querySelectorAll('main section[id]');
const navigationLinks = document.querySelectorAll('.nav-links .nav-link');
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navigationLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
  });
}, { rootMargin: '-35% 0px -55% 0px' });
sections.forEach((section) => sectionObserver.observe(section));

document.querySelectorAll('[data-count]').forEach((counter) => {
  const target = Number(counter.dataset.count);
  const counterObserver = new IntersectionObserver((entries, observer) => {
    if (!entries[0].isIntersecting) return;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / 900, 1);
      counter.textContent = Math.floor((1 - Math.pow(1 - progress, 3)) * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    observer.disconnect();
  }, { threshold: 0.8 });
  counterObserver.observe(counter);
});

const soundControl = document.getElementById('floating-sound-control');
let audioContext;
let soundEnabled = true;
const playUiTone = (frequency = 540) => {
  if (!soundEnabled) return;
  audioContext ??= new AudioContext();
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
  gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.025, audioContext.currentTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.08);
  oscillator.connect(gain).connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.09);
};
soundControl?.addEventListener('click', () => {
  soundEnabled = !soundEnabled;
  soundControl.classList.toggle('is-muted', !soundEnabled);
  soundControl.setAttribute('aria-pressed', String(soundEnabled));
  soundControl.setAttribute('aria-label', soundEnabled ? 'Turn sound off' : 'Turn sound on');
  soundControl.title = soundEnabled ? 'Sound on, click to mute' : 'Sound off, click to enable';
  soundControl.querySelector('svg')?.setAttribute('data-lucide', soundEnabled ? 'volume-2' : 'volume-x');
  lucide.createIcons();
  if (soundEnabled) playUiTone(430);
});
document.querySelectorAll('a, button').forEach((element) => {
  if (element.dataset.noClickSound === 'true') return;
  element.addEventListener('click', () => playUiTone(560));
});

const contactForm = document.getElementById('contact-form');
const toast = document.getElementById('toast');
contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  toast?.classList.remove('hidden');
  contactForm.reset();
  window.setTimeout(() => toast?.classList.add('hidden'), 4000);
});

setTheme(true);
