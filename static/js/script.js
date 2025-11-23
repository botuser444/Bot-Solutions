// Enhanced JS for interactions: theme toggle, mobile menu, smooth scrolling,
// reveal-on-scroll and a lightweight testimonials carousel.

// Ensure page always starts at the top on reload/refresh/back navigation.
// Some browsers restore scroll position by default; set manual restoration
// and force-scroll to top on load and pageshow (bfcache) events.
try {
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
} catch (e) { /* ignore */ }
window.addEventListener('pageshow', function (e) {
  // If the page was restored from bfcache (persisted), scroll to top
  if (e.persisted) window.scrollTo(0, 0);
});

document.addEventListener('DOMContentLoaded', function () {
  // safety: ensure we're at top after DOM is ready
  try { window.scrollTo(0, 0); } catch (e) { /* ignore */ }
  const themeToggle = document.getElementById('themeToggle');
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');
  const root = document.documentElement;

  // --- Theme (persisted) ---
  const saved = localStorage.getItem('bs-theme');
  if (saved) {
    root.setAttribute('data-theme', saved);
  } else {
    // set default to dark for better contrast
    root.setAttribute('data-theme', 'dark');
  }
  // Only update the toggle UI if the control exists
  if (themeToggle) {
    const currentIcon = root.getAttribute('data-theme') === 'light' ? '🌙' : '☀️';
    themeToggle.textContent = currentIcon;
    themeToggle.addEventListener('click', function () {
      const current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      const next = current === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', next);
      localStorage.setItem('bs-theme', next);
      themeToggle.textContent = next === 'light' ? '🌙' : '☀️';
    });
  }

  // --- Mobile menu toggle ---
  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', function () {
      const visible = mainNav.style.display === 'flex' || getComputedStyle(mainNav).display === 'flex';
      if (visible) {
        mainNav.style.display = 'none';
      } else {
        mainNav.style.display = 'flex';
        mainNav.style.flexDirection = 'column';
      }
    });

    // Close mobile menu when a link is clicked
    mainNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      if (window.innerWidth < 900) mainNav.style.display = 'none';
    }));
  }

  // --- Smooth reveal on scroll ---
  const revealEls = document.querySelectorAll('.container > *');
  function reveal() {
    const windowBottom = window.innerHeight + window.scrollY;
    revealEls.forEach(el => {
      const elTop = el.getBoundingClientRect().top + window.scrollY;
      if (windowBottom > elTop + 60) el.classList.add('reveal');
    });
  }
  reveal();
  window.addEventListener('scroll', reveal);

  // --- Smooth scrolling for header links (offset for sticky header) ---
  document.querySelectorAll('.main-nav a, .footer-links a, .logo, .btn').forEach(el => {
    el.addEventListener('click', (e) => {
      const href = el.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (!target) return;
      const headerOffset = 70; // adjust for sticky header
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    });
  });

  // --- Testimonials (client-side demo + review form) ---
  (function testimonialsDemo(){
    const testList = document.getElementById('testList');
    if (!testList) return;

    // Helper to create a review card element
    function makeTestEl({name='Anonymous', rating=5, review='', time=''}){
      const wrap = document.createElement('div');
      wrap.className = 'test';

      // avatar with initials
      const avatar = document.createElement('div');
      avatar.className = 'avatar';
      const parts = (name || 'Anonymous').split(/\s+/).filter(Boolean);
      const initials = (parts.slice(0,2).map(p => p[0]).join('') || parts[0] || 'A').toUpperCase();
      avatar.textContent = initials;

      const body = document.createElement('div');
      body.className = 'comment-body';

      const meta = document.createElement('div');
      meta.className = 'meta';
      const clientSpan = document.createElement('span'); clientSpan.className = 'client-name'; clientSpan.textContent = name;
      const timeSpan = document.createElement('span'); timeSpan.className = 'time'; timeSpan.textContent = time || 'Just now';
      const ratingSpan = document.createElement('span'); ratingSpan.className = 'rating'; ratingSpan.textContent = '★'.repeat(rating) + '☆'.repeat(Math.max(0,5-rating));
      meta.appendChild(clientSpan);
      meta.appendChild(timeSpan);
      meta.appendChild(ratingSpan);

      const commentText = document.createElement('div'); commentText.className = 'comment-text'; commentText.textContent = review;

      body.appendChild(meta);
      body.appendChild(commentText);

      wrap.appendChild(avatar);
      wrap.appendChild(body);
      return wrap;
    }

    // Render any stored reviews (persisted in localStorage)
    try {
      const stored = JSON.parse(localStorage.getItem('bs-reviews') || '[]');
      stored.forEach(r => testList.appendChild(makeTestEl(r)));
    } catch (e) { console.warn('Failed to load stored reviews', e); }

    // Setup collapse/expand behavior: show first 4 reviews when collapsed,
    // expand to show all when the user clicks the toggle button.
    const VISIBLE_COUNT = 4; // how many to show when collapsed

    const toggle = document.getElementById('toggleReviews');

    function applyCollapse(){
      const items = Array.from(testList.querySelectorAll('.test'));
      const collapsed = testList.classList.contains('collapsed');
      items.forEach((it, idx) => {
        if (collapsed && idx >= VISIBLE_COUNT) it.style.display = 'none';
        else it.style.display = '';
      });
    }

    function updateToggleText(){
      const total = testList.querySelectorAll('.test').length;
      const expanded = !testList.classList.contains('collapsed');
      if (!toggle) return;
      toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      if (expanded) toggle.textContent = 'Show fewer reviews';
      else toggle.textContent = `See all reviews (${total})`;
    }

    if (toggle){
      // ensure collapsed class exists initially
      if (!testList.classList.contains('collapsed')) testList.classList.add('collapsed');
      applyCollapse();
      updateToggleText();
      toggle.addEventListener('click', function(){
        testList.classList.toggle('collapsed');
        applyCollapse();
        updateToggleText();
        toggle.focus();
      });
    }

    // Review submission handling
    const reviewForm = document.getElementById('reviewForm');
    if (!reviewForm) return;
    reviewForm.addEventListener('submit', function(e){
      e.preventDefault();
      const name = (document.getElementById('reviewerName')||{}).value || 'Anonymous';
      const reviewText = (document.getElementById('reviewText')||{}).value || '';
      const ratingEl = reviewForm.querySelector('input[name="rating"]:checked');
      const rating = ratingEl ? parseInt(ratingEl.value,10) : 5;
      if (!reviewText.trim()) { alert('Please enter a short review.'); return; }

      const timestamp = new Date().toLocaleString();
      const obj = { name, rating, review: reviewText, time: timestamp };
      // append to DOM and ensure collapsed state hides extras
      const el = makeTestEl(obj);
      testList.insertBefore(el, testList.firstChild);
      try { if (typeof applyCollapse === 'function') applyCollapse(); } catch (e) { console.warn('applyCollapse failed after inserting review', e); }
      if (typeof updateToggleText === 'function') updateToggleText();

      // persist
      try {
        let stored = JSON.parse(localStorage.getItem('bs-reviews') || '[]');
        stored.unshift(obj);
        localStorage.setItem('bs-reviews', JSON.stringify(stored.slice(0,200)));
      } catch (err) { console.warn('Failed to save review', err); }

      // reset form and give lightweight feedback
      reviewForm.reset();
      const btn = reviewForm.querySelector('button[type="submit"]');
      if (btn) {
        const old = btn.textContent;
        btn.textContent = 'Thanks!';
        setTimeout(()=> btn.textContent = old, 1500);
      }
    });
  })();

  // --- Typing effect for hero taglines ---
  (function heroTyping(){
    const el = document.getElementById('heroTyped');
    if (!el) return;
    const phrases = [
      'We build modern web, mobile and AI-powered solutions.',
      'Custom AI integrations that drive real results.',
      'Cloud-native systems for reliability and scale.'
    ];
    let pi = 0, ci = 0, deleting = false;
    function tick(){
      const full = phrases[pi];
      if (!deleting) {
        el.textContent = full.slice(0, ci+1);
        ci++;
        if (ci === full.length) { deleting = true; setTimeout(tick, 1400); return; }
      } else {
        el.textContent = full.slice(0, ci-1);
        ci--;
        if (ci === 0) { deleting = false; pi = (pi+1) % phrases.length; setTimeout(tick, 400); return; }
      }
      setTimeout(tick, deleting ? 60 : (ci < 4 ? 160 : 80));
    }
    tick();
  })();

  // --- Parallax background effect for hero (subtle) ---
  (function heroParallax(){
    const hero = document.querySelector('.hero');
    const bg = document.querySelector('.hero-bg');
    if (!hero || !bg) return;
    function onScroll(){
      const rect = hero.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, 1 - (rect.top / window.innerHeight)));
      // translate the bg slightly and adjust opacity
      const y = pct * 20; // px
      bg.style.transform = `translateY(${y}px) scale(${1 + pct*0.02})`;
      bg.style.opacity = `${0.08 + pct*0.12}`;
    }
    onScroll();
    window.addEventListener('scroll', onScroll, {passive:true});
    window.addEventListener('resize', onScroll);
  })();

  // --- Staggered entrance animations for key elements ---
  (function staggerAppear(){
    const heroInner = document.querySelector('.hero-inner');
    const cards = document.querySelectorAll('.service-grid .card');
    const tests = document.querySelectorAll('.test');
    const cta = document.querySelector('.cta');
    const toAnimate = [];
    if (heroInner) toAnimate.push(heroInner);
    cards.forEach(c => toAnimate.push(c));
    tests.forEach(t => toAnimate.push(t));
    let delay = 120;
    toAnimate.forEach((el, i) => {
      el.classList.add('animate-hidden');
      setTimeout(() => el.classList.add('animate-show'), delay * (i+1));
    });
    if (cta) setInterval(() => { cta.animate([{transform:'translateY(0)'},{transform:'translateY(-6px)'}],{duration:800,iterations:1,direction:'alternate'}); }, 4000);
  })();
});
