/**
 * Mel Asseraf Website — Main JavaScript
 * Navigation, scroll animations, accordion, intersection observer
 */

(function () {
  'use strict';

  // === Navigation ===
  const header = document.querySelector('.header');
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  const hero = document.querySelector('.hero');

  // Scroll-aware header (transparent → solid)
  function updateHeader() {
    if (!header) return;

    // If no hero on this page, always solid
    if (!hero) {
      header.classList.add('header--solid');
      header.classList.remove('header--transparent');
      return;
    }

    const scrollY = window.scrollY;
    const heroHeight = hero.offsetHeight - 100;

    if (scrollY > heroHeight) {
      header.classList.add('header--solid');
      header.classList.remove('header--transparent');
    } else {
      header.classList.add('header--transparent');
      header.classList.remove('header--solid');
    }
  }

  // Run on load and scroll
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  // Mobile hamburger toggle
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', function () {
      const isOpen = mobileNav.classList.contains('is-open');

      hamburger.classList.toggle('is-active');
      mobileNav.classList.toggle('is-open');

      // Lock body scroll
      document.body.style.overflow = isOpen ? '' : 'hidden';

      // Accessibility
      hamburger.setAttribute('aria-expanded', !isOpen);
    });

    // Close on nav link click
    mobileNav.querySelectorAll('.mobile-nav__link').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('is-active');
        mobileNav.classList.remove('is-open');
        document.body.style.overflow = '';
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileNav.classList.contains('is-open')) {
        hamburger.classList.remove('is-active');
        mobileNav.classList.remove('is-open');
        document.body.style.overflow = '';
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.focus();
      }
    });
  }

  // === Scroll Animations ===
  if ('IntersectionObserver' in window) {
    var animateObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            animateObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    document.querySelectorAll('.animate, .animate-stagger').forEach(function (el) {
      animateObserver.observe(el);
    });
  } else {
    // Fallback: show everything
    document.querySelectorAll('.animate, .animate-stagger').forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  // === Accordion ===
  document.querySelectorAll('.accordion__trigger').forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      var item = this.closest('.accordion__item');
      var isOpen = item.classList.contains('is-open');
      var content = item.querySelector('.accordion__content');

      // Close all other items in the same accordion
      var accordion = item.closest('.accordion');
      if (accordion) {
        accordion.querySelectorAll('.accordion__item.is-open').forEach(function (openItem) {
          if (openItem !== item) {
            openItem.classList.remove('is-open');
            openItem.querySelector('.accordion__trigger').setAttribute('aria-expanded', 'false');
            var openContent = openItem.querySelector('.accordion__content');
            if (openContent) openContent.style.maxHeight = null;
          }
        });
      }

      // Toggle current item
      item.classList.toggle('is-open');
      this.setAttribute('aria-expanded', !isOpen);

      if (!isOpen && content) {
        content.style.maxHeight = content.scrollHeight + 'px';
      } else if (content) {
        content.style.maxHeight = null;
      }
    });

    // Keyboard: Enter and Space
    trigger.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });

  // === Active Navigation Highlighting ===
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll('.nav__link, .mobile-nav__link').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('nav__link--active');
    }
  });

})();
