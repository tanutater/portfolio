/* Portfolio interactions: vanilla JavaScript, no dependencies. */
(function () {
  'use strict';

  var header = document.getElementById('header');
  var menuBtn = document.getElementById('menu-btn');
  var navLinks = document.getElementById('nav-links');
  var links = Array.prototype.slice.call(navLinks.querySelectorAll('a'));

  /* 1. Dynamic copyright year */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* 2. Mobile menu: open/close, swap icon, close on link / Escape / outside click */
  function setMenu(open) {
    navLinks.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menuBtn.querySelector('use').setAttribute('href', open ? '#i-x' : '#i-mn');
  }
  menuBtn.addEventListener('click', function () {
    setMenu(!navLinks.classList.contains('open'));
  });
  links.forEach(function (a) {
    a.addEventListener('click', function () { setMenu(false); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setMenu(false);
  });
  document.addEventListener('click', function (e) {
    if (!header.contains(e.target)) setMenu(false);
  });
  window.addEventListener('resize', function () {
    if (window.innerWidth > 860) setMenu(false);
  });

  /* 3. Header shadow once the page is scrolled */
  function onScroll() { header.classList.toggle('scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* 4. Highlight the nav link of the section currently in view */
  var sections = links.map(function (a) {
    return document.querySelector(a.getAttribute('href'));
  }).filter(Boolean);

  /* 5. Scroll-reveal animation */
  var reveals = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) {
          var on = a.getAttribute('href') === '#' + entry.target.id;
          a.classList.toggle('active', on);
          if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s); });

    var reveal = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('in'); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.08 });
    reveals.forEach(function (el) { reveal.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }
})();
