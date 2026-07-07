/* ════════════════════════════════════════════════
   FACTOR LABORAL HUMANO — main.js
   Comportamientos globales compartidos
   ════════════════════════════════════════════════ */

/* ── CURSOR ──────────────────────────────────── */
(function initCursor() {
  const cur  = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');
  if (!cur || !ring) return;

  // Only activate on non-touch devices
  if (window.matchMedia('(pointer: coarse)').matches) {
    cur.style.display = 'none';
    ring.style.display = 'none';
    return;
  }

  let mouseX = -100, mouseY = -100;
  let ringX = -100, ringY = -100;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cur.style.left  = (mouseX - 6) + 'px';
    cur.style.top   = (mouseY - 6) + 'px';
  }, { passive: true });

  // Smooth ring follow
  function animateRing() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    ring.style.left = (ringX - 19) + 'px';
    ring.style.top  = (ringY - 19) + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  function attachCursorEvents() {
    document.querySelectorAll('a, button, .sector-card, .service-card, .vacante-card, .tab-btn, .filter-btn').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cur.style.transform  = 'scale(2.8)';
        ring.style.transform = 'scale(1.6)';
        ring.style.borderColor = 'rgba(0,200,151,0.9)';
      });
      el.addEventListener('mouseleave', () => {
        cur.style.transform  = 'scale(1)';
        ring.style.transform = 'scale(1)';
        ring.style.borderColor = 'rgba(0,200,151,0.6)';
      });
    });
  }
  attachCursorEvents();
  window.addEventListener('load', attachCursorEvents);
})();

// ── NAV SCROLL ──────────────────────────────── 
(function initNavScroll() {
  window.addEventListener('scroll', () => {
    const nav = document.getElementById('mainNav');
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
  // Mostrar link admin si URL tiene ?admin en la barra (diferido: el nav se inyecta después)
  window.addEventListener('load', () => {
    if(window.location.search.includes('admin')||localStorage.getItem('flh_admin_access')){
      localStorage.setItem('flh_admin_access','1');
      const navLinks=document.querySelector('#mainNav .nav-links');
      if(navLinks && !navLinks.querySelector('.admin-link')){
        const adminLink=document.createElement('a');
        adminLink.href='pages/admin.html';
        adminLink.className='admin-link';
        adminLink.style.cssText='font-size:.78rem;color:#E04E12;border:1px solid rgba(255,107,53,.35);padding:5px 12px;border-radius:999px;transition:all .2s';
        adminLink.textContent='⚙ Admin';
        navLinks.insertBefore(adminLink,navLinks.querySelector('.nav-cta'));
      }
    }
  });
})();

/* ── MOBILE MENU ─────────────────────────────── */
function openMobileMenu() {
  const m = document.getElementById('mobileMenu');
  if (m) m.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeMobileMenu() {
  const m = document.getElementById('mobileMenu');
  if (m) m.classList.remove('open');
  document.body.style.overflow = '';
}

/* ── SCROLL REVEAL ───────────────────────────── */
(function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 100);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();

/* ── STEP REVEAL ─────────────────────────────── */
(function initSteps() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 150);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.step').forEach(s => obs.observe(s));
})();

/* ── TABS ────────────────────────────────────── */
function switchTab(tab, btn) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  const target = document.getElementById('tab-' + tab);
  if (target) target.classList.add('active');
}

/* ── ANIMATED COUNTERS ───────────────────────── */
(function initCounters() {
  function animate(el, target, duration) {
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start = Math.min(start + step, target);
      const span = el.querySelector('.count');
      if (span) span.textContent = start >= 1000 ? (start/1000).toFixed(1).replace('.0','') + 'K' : start;
      if (start >= target) clearInterval(timer);
    }, 16);
  }
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && !e.target.dataset.animated) {
        e.target.dataset.animated = '1';
        animate(e.target, +e.target.dataset.target, 1600);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-target]').forEach(el => obs.observe(el));
})();

/* ── MODAL ───────────────────────────────────── */
function openModal(tipo) {
  const m = document.getElementById('modal');
  if (m) m.classList.add('open');
  document.body.style.overflow = 'hidden';
  if (tipo) setTipo(tipo);
}
function closeModal() {
  const m = document.getElementById('modal');
  if (m) m.classList.remove('open');
  document.body.style.overflow = '';
}
function closeModalOut(e) {
  if (e.target.id === 'modal') closeModal();
}
function setTipo(tipo) {
  ['empresa','candidato'].forEach(t => {
    const btn = document.getElementById('btn-' + t);
    if (btn) btn.classList.toggle('active', t === tipo);
  });
  const fe = document.getElementById('field-empresa');
  if (fe) fe.style.display = tipo === 'empresa' ? 'block' : 'none';
  const lbl = document.querySelector('#field-puesto label');
  const inp = document.querySelector('#field-puesto input');
  if (lbl && inp) {
    lbl.textContent = tipo === 'empresa' ? 'Puesto que deseas cubrir' : 'Puesto que buscas';
    inp.placeholder = tipo === 'empresa' ? 'Ej. Gerente de Ventas...' : 'Ej. Desarrollador, Contador...';
  }
}
function submitForm() {
  const nombre   = (document.getElementById('m-nombre')   || {}).value || '';
  const telefono = (document.getElementById('m-telefono') || {}).value || '';
  const correo   = (document.getElementById('m-correo')   || {}).value || '';
  const empresa  = (document.getElementById('m-empresa')  || {}).value || '';
  const puesto   = (document.getElementById('m-puesto')   || {}).value || '';
  const mensaje  = (document.getElementById('m-mensaje')  || {}).value || '';

  const tipoBtn  = document.querySelector('.tipo-btn.active');
  const tipo     = tipoBtn && tipoBtn.textContent.includes('empresa') ? 'Empresa' : 'Candidato';

  let textoWA = `*Nuevo contacto - Factor Laboral Humano*\n\n`;
  textoWA += `Tipo: ${tipo}\n`;
  if (nombre)   textoWA += `Nombre: ${nombre.trim()}\n`;
  if (telefono) textoWA += `Teléfono: ${telefono.trim()}\n`;
  if (correo)   textoWA += `Correo: ${correo.trim()}\n`;
  if (empresa)  textoWA += `Empresa: ${empresa.trim()}\n`;
  if (puesto)   textoWA += `Puesto: ${puesto.trim()}\n`;
  if (mensaje)  textoWA += `Mensaje: ${mensaje.trim()}\n`;

  const emailSubject = encodeURIComponent(`Contacto web - ${tipo}: ${nombre.trim()}`);
  const emailBody    = encodeURIComponent(textoWA.replace(/\*/g,''));

  closeModal();

  // 1. Abrir WhatsApp en nueva pestaña
  window.open(`https://wa.me/50237190890?text=${encodeURIComponent(textoWA)}`, '_blank');

  // 2. Abrir correo con pequeño delay para no bloquear el popup
  setTimeout(() => {
    window.location.href = `mailto:factorlaboralhumano@gmail.com?subject=${emailSubject}&body=${emailBody}`;
  }, 600);
}

document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeModal(); closeMobileMenu(); } });


/* ── CHAT WIDGET ─────────────────────────────── */
const CW_SYSTEM = `Eres el asistente virtual de Factor Laboral Humano, empresa líder de reclutamiento y selección de personal en Guatemala.
Responde SIEMPRE en español, de forma amable, profesional y concisa (máximo 3-4 oraciones).

INFORMACIÓN CLAVE:
- Servicios: reclutamiento ejecutivo, masivo, capacitación, evaluaciones psicométricas
- Promedio de colocación: 12 días hábiles
- Cobertura: toda la república guatemalteca  
- Contacto: WhatsApp 3719-0890 | factorlaboralhumano@gmail.com
- Garantía de reposición sin costo adicional
- Más de 500 empresas clientes, 98% satisfacción
- Para publicar una vacante, pueden llenar el formulario en el sitio o llamar directamente
- Para candidatos: registrarse en /pages/candidatos.html y subir CV
- También ofrecen páginas web y plataformas digitales desde Q200/mes

Si te preguntan por precios de reclutamiento, menciona que varía según el perfil y que contacten para una cotización personalizada sin compromiso.`;

let cwHistory = [];
let cwOpen = false;

function toggleChat() {
  cwOpen = !cwOpen;
  const panel = document.getElementById('cwPanel');
  const btn   = document.getElementById('cwChatBtn');
  if (!panel || !btn) return;
  panel.classList.toggle('open', cwOpen);
  btn.querySelector('.cw-chat-open').style.display = cwOpen ? 'none' : '';
  btn.querySelector('.cw-chat-close').style.display = cwOpen ? '' : 'none';
  if (cwOpen) setTimeout(() => document.getElementById('cwInput')?.focus(), 200);
}

function sendQuick(text) {
  document.getElementById('cwInput').value = text;
  document.getElementById('cwQuickBtns').style.display = 'none';
  sendChat();
}

async function sendChat() {
  const input = document.getElementById('cwInput');
  const msgs  = document.getElementById('cwMessages');
  if (!input || !msgs) return;
  const text = input.value.trim();
  if (!text) return;
  input.value = '';

  // User bubble
  msgs.innerHTML += `<div class="cw-msg cw-msg-user"><div class="cw-bubble">${text}</div></div>`;
  // Typing indicator
  const typingId = 'cwTyping_' + Date.now();
  msgs.innerHTML += `<div class="cw-msg cw-msg-bot cw-typing" id="${typingId}"><div class="cw-bubble"><span></span><span></span><span></span></div></div>`;
  msgs.scrollTop = msgs.scrollHeight;

  cwHistory.push({ role: 'user', content: text });

  try {
    const resp = await fetch('/api/claude', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ system: CW_SYSTEM, messages: cwHistory, max_tokens: 300 }),
    });
    const data = await resp.json();
    const reply = data.content?.[0]?.text || 'Lo siento, no pude procesar tu mensaje. Contáctanos por WhatsApp al 3719-0890.';
    cwHistory.push({ role: 'assistant', content: reply });
    document.getElementById(typingId)?.remove();
    msgs.innerHTML += `<div class="cw-msg cw-msg-bot"><div class="cw-bubble">${reply.replace(/\n/g,'<br>')}</div></div>`;
  } catch {
    document.getElementById(typingId)?.remove();
    msgs.innerHTML += `<div class="cw-msg cw-msg-bot"><div class="cw-bubble">Hubo un error. Escríbenos directamente al <a href="https://wa.me/50237190890" target="_blank" style="color:var(--verde)">WhatsApp 3719-0890</a> 📱</div></div>`;
  }
  msgs.scrollTop = msgs.scrollHeight;
}
