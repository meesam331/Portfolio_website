lucide.createIcons();

document.getElementById('year').textContent = new Date().getFullYear();

const themeToggle = document.getElementById('theme-toggle');
const root = document.documentElement;
const icon = themeToggle.querySelector('svg');

const setTheme = (isDark) => {
  root.classList.toggle('dark', isDark);
  document.body.classList.toggle('bg-[#0A0A0A]', isDark);
  document.body.classList.toggle('bg-white', !isDark);
  document.body.classList.toggle('text-white', isDark);
  document.body.classList.toggle('text-black', !isDark);
  icon.setAttribute('data-lucide', isDark ? 'sun' : 'moon');
  lucide.createIcons();
};

themeToggle.addEventListener('click', () => {
  const isDark = !root.classList.contains('dark');
  setTheme(isDark);
});

setTheme(true);

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

const motionItems = document.querySelectorAll('.glass-card, .project-card, .floating, .skill-chip, .cta-button');

window.addEventListener('pointermove', (event) => {
  const x = (event.clientX / window.innerWidth - 0.5) * 18;
  const y = (event.clientY / window.innerHeight - 0.5) * 18;

  motionItems.forEach((item, index) => {
    const depth = (index + 1) * 0.9;
    item.style.setProperty('--rx', `${(y / depth) * -1}deg`);
    item.style.setProperty('--ry', `${(x / depth) * 1.2}deg`);
  });
});

const navLinks = document.querySelectorAll('a[href^="#"]');
navLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const targetId = link.getAttribute('href');
    const target = document.querySelector(targetId);
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
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
