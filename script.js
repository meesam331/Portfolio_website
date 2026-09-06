lucide.createIcons();

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

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
  oscillator.frequency.exponentialRampToValueAtTime(frequency * 1.35, audioContext.currentTime + 0.08);
  gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.035, audioContext.currentTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.11);
  oscillator.connect(gain).connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.12);
};

soundControl?.addEventListener('click', () => {
  soundEnabled = !soundEnabled;
  soundControl.classList.toggle('is-muted', !soundEnabled);
  soundControl.setAttribute('aria-pressed', String(soundEnabled));
  soundControl.setAttribute('aria-label', soundEnabled ? 'Turn sound off' : 'Turn sound on');
  soundControl.title = soundEnabled ? 'Sound on, click to mute' : 'Sound off, click to enable';
  if (soundEnabled) playUiTone(430);
});

document.querySelectorAll('a, button').forEach((element) => {
  if (element.dataset.noClickSound === 'true') return;
  element.addEventListener('click', () => playUiTone(560));
});

const themeToggle = document.getElementById('theme-toggle');
const root = document.documentElement;
const icon = themeToggle?.querySelector('svg');

const setTheme = (isDark) => {
  root.classList.toggle('dark', isDark);
  document.body.classList.toggle('bg-[#0A0A0A]', isDark);
  document.body.classList.toggle('bg-white', !isDark);
  document.body.classList.toggle('text-white', isDark);
  document.body.classList.toggle('text-black', !isDark);
  if (icon) icon.setAttribute('data-lucide', isDark ? 'sun' : 'moon');
  lucide.createIcons();
};

themeToggle?.addEventListener('click', () => {
  const isDark = !root.classList.contains('dark');
  setTheme(isDark);
});

setTheme(true);

const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
menuToggle?.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  menuToggle.querySelector('svg')?.setAttribute('data-lucide', isOpen ? 'x' : 'menu');
  lucide.createIcons();
});

particlesJS('particles-js', {
  particles: {
    number: { value: 48, density: { enable: true, value_area: 800 } },
    color: { value: '#00F5FF' },
    shape: { type: 'circle' },
    opacity: { value: 0.3, random: true },
    size: { value: 2.2, random: true },
    line_linked: {
      enable: true,
      distance: 150,
      color: '#00F5FF',
      opacity: 0.18,
      width: 1,
    },
    move: {
      enable: true,
      speed: 1.3,
      direction: 'none',
      random: false,
      straight: false,
      out_mode: 'out',
      bounce: false,
    },
  },
  interactivity: {
    detect_on: 'canvas',
    events: {
      onhover: { enable: true, mode: 'grab' },
      onclick: { enable: true, mode: 'push' },
      resize: true,
    },
    modes: {
      grab: { distance: 170, line_linked: { opacity: 0.45 } },
      push: { particles_nb: 4 },
    },
  },
  retina_detect: true,
});

const fadeElements = document.querySelectorAll('.fade-up');
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.12 }
);

fadeElements.forEach((element) => observer.observe(element));

const motionItems = document.querySelectorAll('.project-card, .floating, .skill-chip, .cta-button');

window.addEventListener('pointermove', (event) => {
  const x = (event.clientX / window.innerWidth - 0.5) * 18;
  const y = (event.clientY / window.innerHeight - 0.5) * 18;

  document.documentElement.style.setProperty('--pointer-x', `${event.clientX}px`);
  document.documentElement.style.setProperty('--pointer-y', `${event.clientY}px`);
  motionItems.forEach((item) => {
    const bounds = item.getBoundingClientRect();
    const localX = (event.clientX - bounds.left) / bounds.width - 0.5;
    const localY = (event.clientY - bounds.top) / bounds.height - 0.5;
    item.style.setProperty('--rx', `${localY * -4}deg`);
    item.style.setProperty('--ry', `${localX * 5}deg`);
  });
});

const progress = document.getElementById('scroll-progress');
const updateProgress = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  if (progress) progress.style.width = `${scrollable ? (window.scrollY / scrollable) * 100 : 0}%`;
};
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

const navLinks = document.querySelectorAll('a[href^="#"]');
navLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const targetId = link.getAttribute('href');
    const target = document.querySelector(targetId);
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    mobileMenu?.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  });
});

document.querySelectorAll('[data-count]').forEach((counter) => {
  const target = Number(counter.dataset.count);
  const animateCount = () => {
    const start = performance.now();
    const duration = 1200;
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      counter.textContent = Math.floor((1 - Math.pow(1 - progress, 3)) * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const countObserver = new IntersectionObserver((entries, observer) => {
    if (entries[0].isIntersecting) {
      animateCount();
      observer.disconnect();
    }
  }, { threshold: 0.8 });
  countObserver.observe(counter);
});

const contactForm = document.getElementById('contact-form');
const toast = document.getElementById('toast');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  toast.classList.remove('hidden');
  toast.classList.add('animate-[fadeIn_0.3s_ease-out]');
  contactForm.reset();

  setTimeout(() => {
    toast.classList.add('hidden');
    toast.classList.remove('animate-[fadeIn_0.3s_ease-out]');
  }, 4000);
});
