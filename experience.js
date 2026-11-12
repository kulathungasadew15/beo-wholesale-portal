(function () {
  'use strict';
  const root = document.documentElement;
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const motionButton = document.querySelector('#motion-toggle');
  const header = document.querySelector('.site-header');
  const progress = document.querySelector('#reading-progress');
  let manuallyReduced = false;
  let revealObserver;
  const motionReduced = () => manuallyReduced || motionPreference.matches;

  function revealAll() {
    if (revealObserver) revealObserver.disconnect();
    document.querySelectorAll('.reveal-pending').forEach(element => {
      element.classList.remove('reveal-pending', 'reveal-visible');
    });
  }

  function syncMotion() {
    root.classList.toggle('motion-reduced', motionReduced());
    motionButton.setAttribute('aria-pressed', String(motionReduced()));
    motionButton.textContent = motionPreference.matches ? 'Reduced motion enabled' : manuallyReduced ? 'Enable animations' : 'Reduce motion';
    motionButton.disabled = motionPreference.matches;
    if (motionReduced()) revealAll();
  }

  motionButton.hidden = false;
  document.querySelector('.motion-divider').hidden = false;
  motionButton.addEventListener('click', () => {
    manuallyReduced = !manuallyReduced;
    syncMotion();
  });
  motionPreference.addEventListener('change', syncMotion);
  syncMotion();

  if ('IntersectionObserver' in window && !motionReduced()) {
    try {
      const targets = document.querySelectorAll('.section-heading, .product-card, .story-art, .story-copy, .business-heading, .business-options>div, .how-intro, .steps>li, .enquiry-intro, .faq-grid>div:first-child, .faq-list details, .contact-section>div');
      revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('reveal-visible');
          revealObserver.unobserve(entry.target);
          // Release transition styles so later hover states retain their own timing.
          window.setTimeout(() => entry.target.classList.remove('reveal-pending', 'reveal-visible'), 1150);
        });
      }, { threshold: .08, rootMargin: '0px 0px -20px 0px' });
      targets.forEach((element, index) => {
        // Never hide content already on screen, including a directly linked section.
        if (element.getBoundingClientRect().top < window.innerHeight) return;
        element.style.setProperty('--reveal-delay', (index % 3) * 65 + 'ms');
        element.classList.add('reveal-pending');
        revealObserver.observe(element);
      });
    } catch {
      revealAll();
    }
  }

  const navLinks = [...document.querySelectorAll('.nav-link')];
  const sections = navLinks.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  let pendingFrame = false;

  function updateScrollState() {
    pendingFrame = false;
    const top = window.scrollY || 0;
    header.classList.toggle('is-scrolled', top > 16);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, Math.max(0, top / max)) : 0) + ')';
    let active = '';
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= 180) active = '#' + section.id;
    }
    navLinks.forEach(link => {
      if (link.getAttribute('href') === active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }

  function scheduleScrollUpdate() {
    if (pendingFrame) return;
    pendingFrame = true;
    window.requestAnimationFrame(updateScrollState);
  }
  window.addEventListener('scroll', scheduleScrollUpdate, { passive: true });
  window.addEventListener('resize', scheduleScrollUpdate, { passive: true });
  window.addEventListener('load', scheduleScrollUpdate, { once: true });
  window.addEventListener('pageshow', scheduleScrollUpdate);
  updateScrollState();
})();
