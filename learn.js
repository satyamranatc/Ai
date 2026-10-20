/**
 * Aether AI — Learn Page Interactions
 * learn.js
 */

document.addEventListener('DOMContentLoaded', () => {

  // ─── Reading Progress Bar ─────────────────────────────────────────────
  const progressBar = document.getElementById('readingProgress');
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressBar) progressBar.style.width = pct + '%';
  }, { passive: true });


  // ─── Active Nav Highlight on Scroll ──────────────────────────────────
  const chapters = document.querySelectorAll('.chapter');
  const cnavLinks = document.querySelectorAll('.cnav-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        cnavLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { rootMargin: '-30% 0px -60% 0px' });

  chapters.forEach(ch => observer.observe(ch));


  // ─── Mobile Hamburger ─────────────────────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const chapterNav = document.getElementById('chapterNav');

  if (hamburger && chapterNav) {
    hamburger.addEventListener('click', () => {
      const isOpen = chapterNav.style.display === 'flex';
      chapterNav.style.cssText = isOpen
        ? ''
        : 'display:flex;flex-direction:column;position:absolute;top:100%;left:0;right:0;background:rgba(8,9,14,0.97);padding:20px 28px;border-bottom:1px solid rgba(255,255,255,0.07);gap:8px;z-index:99;backdrop-filter:blur(16px);';
    });
    chapterNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => { chapterNav.style.cssText = ''; });
    });
  }


  // ─── ML Cycle Diagram — hover pulse ───────────────────────────────────
  document.querySelectorAll('.cycle-node').forEach((node, i) => {
    node.addEventListener('mouseenter', () => {
      node.style.boxShadow = '0 0 20px rgba(99,102,241,0.35)';
    });
    node.addEventListener('mouseleave', () => {
      node.style.boxShadow = '';
    });
  });


  // ─── Neural Network Canvas Lines ──────────────────────────────────────
  function drawNNLines() {
    const diagram = document.getElementById('nnDiagram');
    const canvas = document.getElementById('nnCanvas');
    if (!diagram || !canvas) return;

    canvas.width = diagram.offsetWidth;
    canvas.height = diagram.offsetHeight;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const layers = diagram.querySelectorAll('.nn-layer');
    if (layers.length < 2) return;

    const dRect = diagram.getBoundingClientRect();

    function getNodeCenters(layer) {
      const nodes = layer.querySelectorAll('.nn-node');
      return Array.from(nodes).map(n => {
        const r = n.getBoundingClientRect();
        return {
          x: r.left - dRect.left + r.width / 2,
          y: r.top - dRect.top + r.height / 2,
        };
      });
    }

    for (let i = 0; i < layers.length - 1; i++) {
      const from = getNodeCenters(layers[i]);
      const to   = getNodeCenters(layers[i + 1]);
      from.forEach(f => {
        to.forEach(t => {
          ctx.beginPath();
          ctx.moveTo(f.x, f.y);
          ctx.lineTo(t.x, t.y);
          ctx.strokeStyle = 'rgba(99,102,241,0.12)';
          ctx.lineWidth = 1;
          ctx.stroke();
        });
      });
    }
  }

  drawNNLines();
  window.addEventListener('resize', drawNNLines);


  // ─── Animate NN nodes on load ─────────────────────────────────────────
  const nnNodes = document.querySelectorAll('.nn-node');
  nnNodes.forEach((node, i) => {
    node.style.opacity = '0';
    node.style.transform = 'scale(0.5)';
    setTimeout(() => {
      node.style.transition = 'all 0.4s cubic-bezier(0.16,1,0.3,1)';
      node.style.opacity = '1';
      node.style.transform = 'scale(1)';
    }, 100 + i * 60);
  });


  // ─── Token Stream Visualizer (LLM chapter) ───────────────────────────
  const tvPlayBtn = document.getElementById('tvPlayBtn');
  const tvTokens  = document.getElementById('tvTokens');
  const tvCount   = document.getElementById('tv-token-count');

  const sampleTokens = [
    'enabling', ' parallel', ' self-', 'attention', ' across', ' entire',
    ' sequences', ',', ' eliminating', ' the', ' need', ' for', ' recurrent',
    ' or', ' convolutional', ' structures', '.', ' This', ' allowed',
    ' unprecedented', ' scale', ' —', ' from', ' BERT', ' to', ' GPT',
    '-', '4', ' and', ' beyond', '.', ' Attention', ' is', ' truly',
    ' all', ' you', ' need', '.'
  ];

  let streaming = false;
  let streamTimer = null;

  if (tvPlayBtn && tvTokens) {
    tvPlayBtn.addEventListener('click', () => {
      if (streaming) return;
      tvTokens.innerHTML = '';
      tvCount.textContent = '0 tokens';
      streaming = true;
      tvPlayBtn.textContent = '⏳ Generating…';
      tvPlayBtn.disabled = true;

      let idx = 0;
      streamTimer = setInterval(() => {
        if (idx >= sampleTokens.length) {
          clearInterval(streamTimer);
          streaming = false;
          tvPlayBtn.textContent = '▶ Generate';
          tvPlayBtn.disabled = false;
          return;
        }
        const tok = document.createElement('span');
        tok.className = 'tv-token';
        tok.textContent = sampleTokens[idx];
        tvTokens.appendChild(tok);
        tvCount.textContent = (idx + 1) + ' tokens';
        idx++;
      }, 90);
    });
  }


  // ─── Agentic Loop — orbit node pulse animation ───────────────────────
  const aldNodes = document.querySelectorAll('.ald-node');
  let aldCurrent = 0;
  const aldColors = ['rgba(6,182,212,0.35)', 'rgba(245,158,11,0.35)', 'rgba(16,185,129,0.35)', 'rgba(99,102,241,0.35)'];

  setInterval(() => {
    aldNodes.forEach((n, i) => {
      n.style.borderColor = i === aldCurrent ? aldColors[i] : 'rgba(255,255,255,0.12)';
      n.style.boxShadow = i === aldCurrent ? `0 0 16px ${aldColors[i]}` : '';
    });
    aldCurrent = (aldCurrent + 1) % aldNodes.length;
  }, 800);


  // ─── Scroll-reveal fade-in for cards ─────────────────────────────────
  const revealTargets = document.querySelectorAll(
    '.paradigm-card, .arch-card, .model-card, .mas-card, .anatomy-item, .tech-card, .mod-card, .math-item, .hcc'
  );

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        revealObserver.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -60px 0px' });

  revealTargets.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity 0.5s ease ${(i % 6) * 60}ms, transform 0.5s cubic-bezier(0.16,1,0.3,1) ${(i % 6) * 60}ms`;
    revealObserver.observe(el);
  });

  // Re-draw NN after fonts/images settle
  setTimeout(drawNNLines, 500);

});
