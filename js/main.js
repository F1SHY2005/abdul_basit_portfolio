// =====================================================================
// BASIT — Engineering Portfolio — shared behaviour
// =====================================================================

document.addEventListener('DOMContentLoaded', () => {

  /* Mobile nav toggle -------------------------------------------------- */
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.textContent = open ? 'CLOSE' : 'MENU';
    });
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.textContent = 'MENU';
    }));
  }

  /* Mark active nav link ------------------------------------------------ */
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  /* Live clock in status strip ------------------------------------------ */
  const clockEl = document.querySelector('[data-clock]');
  if (clockEl) {
    const tz = clockEl.getAttribute('data-clock') || undefined;
    const update = () => {
      const now = new Date();
      const opts = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: tz };
      clockEl.textContent = now.toLocaleTimeString('en-GB', opts) + (tz ? ' PKT' : '');
    };
    update();
    setInterval(update, 1000);
  }

  /* Oscilloscope hero animation ------------------------------------------ */
  const canvas = document.querySelector('#scope');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let w, h, dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    let t = 0;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function drawGrid() {
      ctx.strokeStyle = 'rgba(255,255,255,0.05)';
      ctx.lineWidth = 1;
      const step = 20;
      for (let x = 0; x < w; x += step) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      }
      for (let y = 0; y < h; y += step) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }
      ctx.strokeStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2); ctx.stroke();
    }

    function drawWave(phase, amp, freq, color, width, noise) {
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.shadowColor = color;
      ctx.shadowBlur = 6;
      for (let x = 0; x <= w; x += 2) {
        const n = noise ? (Math.random() - 0.5) * noise : 0;
        const y = h / 2 + Math.sin((x * freq) + phase) * amp + n;
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    function frame() {
      ctx.clearRect(0, 0, w, h);
      drawGrid();
      // AC voltage trace (blue)
      drawWave(t, h * 0.28, 0.045, 'rgba(76,151,232,0.9)', 2, 0);
      // Load / harmonic trace (copper), slightly out of phase
      drawWave(t * 1.6 + 1.4, h * 0.14, 0.09, 'rgba(205,138,87,0.55)', 1.4, 1.2);
      t += reduceMotion ? 0 : 0.045;
      requestAnimationFrame(frame);
    }
    frame();
  }

  /* Contact form (static — no backend wired up) --------------------------- */
  const form = document.querySelector('#contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const status = form.querySelector('.form-note');
      const name = form.querySelector('#name')?.value || '';
      btn.textContent = 'MESSAGE SENT';
      btn.disabled = true;
      if (status) status.textContent = `Thanks${name ? ', ' + name.split(' ')[0] : ''} — this form is a static demo, so wire it to Formspree, a mail API, or a serverless function to receive submissions for real.`;
      form.reset();
    });
  }

  /* Project filter (client-side) ------------------------------------------ */
  const filterBar = document.querySelector('[data-filter-bar]');
  if (filterBar) {
    const buttons = filterBar.querySelectorAll('button');
    const items = document.querySelectorAll('[data-domain]');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');
        items.forEach(item => {
          const show = filter === 'all' || item.getAttribute('data-domain') === filter;
          item.style.display = show ? '' : 'none';
        });
      });
    });
  }

  /* Resume "download" -> print-friendly view ------------------------------ */
  const printBtn = document.querySelector('[data-print]');
  if (printBtn) {
    printBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.print();
    });
  }

});
