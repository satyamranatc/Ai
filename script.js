/**
 * Aether AI Blog — script.js
 * Handles: filter, search modal, newsletter, reading progress, scroll-reveal
 */

document.addEventListener('DOMContentLoaded', () => {

  // ─── Reading Progress ────────────────────────────────────────────────
  const progress = document.getElementById('readProgress');
  window.addEventListener('scroll', () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = h > 0 ? (window.scrollY / h * 100) + '%' : '0%';
  }, { passive: true });


  // ─── Sticky Header Shadow on Scroll ──────────────────────────────────
  const header = document.getElementById('siteHeader');
  window.addEventListener('scroll', () => {
    header.style.borderBottomColor = window.scrollY > 20
      ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.07)';
  }, { passive: true });


  // ─── Article Filter ──────────────────────────────────────────────────
  const filterBtns = document.querySelectorAll('.filter-btn');
  const articles   = document.querySelectorAll('.post-card');
  const cloudTags  = document.querySelectorAll('.cloud-tag');

  function applyFilter(filter) {
    filterBtns.forEach(b => b.classList.toggle('active', b.dataset.filter === filter));

    let delay = 0;
    articles.forEach(card => {
      const cat = card.dataset.category;
      const show = filter === 'all' || cat === filter;
      card.classList.toggle('hidden', !show);
      if (show) {
        card.style.transitionDelay = delay + 'ms';
        delay += 50;
        requestAnimationFrame(() => card.classList.add('visible'));
      } else {
        card.style.transitionDelay = '0ms';
        card.classList.remove('visible');
      }
    });
  }

  filterBtns.forEach(btn => btn.addEventListener('click', () => applyFilter(btn.dataset.filter)));
  cloudTags.forEach(tag => tag.addEventListener('click', () => {
    applyFilter(tag.dataset.filter);
    document.getElementById('topics').scrollIntoView({ behavior: 'smooth', block: 'center' });
  }));


  // ─── Scroll-reveal for cards ──────────────────────────────────────────
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -40px 0px' });

  articles.forEach((card, i) => {
    card.style.transitionDelay = (i % 4 * 60) + 'ms';
    revealObserver.observe(card);
  });

  document.querySelectorAll('.ts-card, .side-post').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(18px)';
    el.style.transition = `opacity 0.45s ease ${i * 55}ms, transform 0.45s cubic-bezier(0.16,1,0.3,1) ${i * 55}ms`;
    new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    }, { rootMargin: '0px 0px -30px 0px' }).observe(el);
  });


  // ─── Search Modal ────────────────────────────────────────────────────
  const searchModal  = document.getElementById('searchModal');
  const searchBar    = document.getElementById('searchBar');
  const modalSearch  = document.getElementById('modalSearch');
  const smBackdrop   = document.getElementById('smBackdrop');
  const smClose      = document.getElementById('smClose');
  const smResults    = document.getElementById('smResults');

  const articleData = Array.from(articles).map(card => ({
    el:      card,
    title:   card.querySelector('.post-card-title')?.textContent || '',
    excerpt: card.querySelector('.post-card-excerpt')?.textContent || '',
    tag:     card.querySelector('.topic-tag')?.textContent || '',
    link:    card.querySelector('.post-link')?.href || '#',
  }));

  function openSearch() {
    searchModal.removeAttribute('hidden');
    modalSearch.focus();
    modalSearch.value = '';
    smResults.innerHTML = '<div class="sm-hint">Start typing to search all articles…</div>';
  }

  function closeSearch() {
    searchModal.setAttribute('hidden', '');
  }

  searchBar.addEventListener('click', openSearch);
  smBackdrop.addEventListener('click', closeSearch);
  smClose.addEventListener('click', closeSearch);

  document.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); openSearch(); }
    if (e.key === 'Escape') closeSearch();
  });

  modalSearch.addEventListener('input', () => {
    const q = modalSearch.value.trim().toLowerCase();
    if (!q) { smResults.innerHTML = '<div class="sm-hint">Start typing to search all articles…</div>'; return; }

    const matches = articleData.filter(d =>
      d.title.toLowerCase().includes(q) || d.excerpt.toLowerCase().includes(q) || d.tag.toLowerCase().includes(q)
    );

    if (!matches.length) {
      smResults.innerHTML = '<div class="sm-hint">No articles found for "' + q + '"</div>';
      return;
    }

    smResults.innerHTML = matches.slice(0, 6).map(d => `
      <a class="sm-result-item" href="${d.link}">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:#64748B;flex-shrink:0">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
        </svg>
        <div>
          <strong>${d.title}</strong>
          <span>${d.tag}</span>
        </div>
      </a>
    `).join('');
  });


  // ─── Mobile Navigation ────────────────────────────────────────────────
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mainNav = document.getElementById('mainNav');

  if (hamburgerBtn && mainNav) {
    hamburgerBtn.addEventListener('click', () => {
      const open = mainNav.style.display === 'flex';
      mainNav.style.cssText = open ? '' :
        'display:flex;flex-direction:column;position:absolute;top:60px;left:0;right:0;background:rgba(9,9,14,0.97);padding:20px 28px;border-bottom:1px solid rgba(255,255,255,0.07);gap:6px;z-index:98;backdrop-filter:blur(16px);';
    });
  }


  // ─── Newsletter Forms ─────────────────────────────────────────────────
  function handleNewsletterForm(formId, emailId, messageId) {
    const form = document.getElementById(formId);
    const emailInput = document.getElementById(emailId);
    const message = document.getElementById(messageId);
    if (!form) return;

    form.addEventListener('submit', e => {
      e.preventDefault();
      const val = emailInput.value.trim();
      if (!val || !val.includes('@')) {
        message.textContent = '⚠️ Please enter a valid email address.';
        message.style.color = '#F87171';
        return;
      }
      message.textContent = '🎉 You're in! Check your inbox for a confirmation email.';
      message.style.color = '#34D399';
      emailInput.value = '';
    });
  }

  handleNewsletterForm('nlForm', 'nlEmail', 'nlMessage');
  handleNewsletterForm('sidebarNlForm', 'sidebarEmail', 'sidebarNlMsg');


  // ─── Side post hover → slight slide ──────────────────────────────────
  document.querySelectorAll('.side-post').forEach(post => {
    post.addEventListener('keydown', e => {
      if (e.key === 'Enter') post.click();
    });
  });

});
