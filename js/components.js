/* ════════════════════════════════════════════════
   FACTOR LABORAL HUMANO — components.js
   ════════════════════════════════════════════════ */

const LOGO_HTML = `<img src="../assets/logo.png" alt="Factor Laboral Humano">`;
const LOGO_HOME = `<img src="assets/logo.png" alt="Factor Laboral Humano">`;

function renderNav(activePage) {
  const pages = [
    { id:'inicio',     href:'../index.html',          label:'Inicio' },
    { id:'servicios',  href:'servicios.html',          label:'Reclutamiento' },
    { id:'tecnologia', href:'tecnologia.html',         label:'Tecnología' },
    { id:'vacantes',   href:'vacantes.html',           label:'Vacantes' },
    { id:'sectores',   href:'sectores.html',           label:'Sectores' },
    { id:'nosotros',   href:'nosotros.html',           label:'Nosotros' },
    { id:'contacto',   href:'contacto.html',           label:'Contacto' },
  ];
  const links = pages.map(p=>`<a href="${p.href}" class="${p.id===activePage?'active':''}">${p.label}</a>`).join('');
  const mobileLinks = pages.map(p=>`<a href="${p.href}" onclick="closeMobileMenu()">${p.label}</a>`).join('');
  return `
    <nav class="nav" id="mainNav">
      <a href="../index.html" class="nav-logo">
        ${LOGO_HTML}
        <div class="nav-logo-text">Factor Laboral <span>Humano</span><small>Reclutamiento · Guatemala</small></div>
      </a>
      <div class="nav-links">
        ${links}
        <a href="candidatos.html" class="nav-btn-candidato">👤 Busco trabajo</a>
        <a href="#" class="nav-cta" onclick="openModal('empresa');return false;">Publicar vacante</a>
      </div>
      <button class="nav-hamburger" onclick="openMobileMenu()" aria-label="Menú"><span></span><span></span><span></span></button>
    </nav>
    <div class="nav-mobile" id="mobileMenu">
      <button class="nav-mobile-close" onclick="closeMobileMenu()">✕</button>
      ${mobileLinks}
      <a href="candidatos.html" class="btn btn-outline" style="border-color:rgba(255,255,255,.3)" onclick="closeMobileMenu()">👤 Busco trabajo</a>
      <a href="#" class="btn btn-primary" onclick="openModal('empresa');closeMobileMenu();return false;">Publicar vacante</a>
    </div>`;
}

function renderNavHome(activePage) {
  const pages = [
    { id:'inicio',     href:'#home',                   label:'Inicio' },
    { id:'servicios',  href:'pages/servicios.html',     label:'Reclutamiento' },
    { id:'tecnologia', href:'pages/tecnologia.html',    label:'Tecnología' },
    { id:'vacantes',   href:'pages/vacantes.html',      label:'Vacantes' },
    { id:'sectores',   href:'pages/sectores.html',      label:'Sectores' },
    { id:'nosotros',   href:'pages/nosotros.html',      label:'Nosotros' },
    { id:'contacto',   href:'pages/contacto.html',      label:'Contacto' },
  ];
  const links = pages.map(p=>`<a href="${p.href}" class="${p.id===activePage?'active':''}">${p.label}</a>`).join('');
  const mobileLinks = pages.map(p=>`<a href="${p.href}" onclick="closeMobileMenu()">${p.label}</a>`).join('');
  return `
    <nav class="nav" id="mainNav">
      <a href="#home" class="nav-logo">
        ${LOGO_HOME}
        <div class="nav-logo-text">Factor Laboral <span>Humano</span><small>Reclutamiento · Guatemala</small></div>
      </a>
      <div class="nav-links">
        ${links}
        <a href="pages/candidatos.html" class="nav-btn-candidato">👤 Busco trabajo</a>
        <a href="#" class="nav-cta" onclick="openModal('empresa');return false;">Publicar vacante</a>
      </div>
      <button class="nav-hamburger" onclick="openMobileMenu()" aria-label="Menú"><span></span><span></span><span></span></button>
    </nav>
    <div class="nav-mobile" id="mobileMenu">
      <button class="nav-mobile-close" onclick="closeMobileMenu()">✕</button>
      ${mobileLinks}
      <a href="pages/candidatos.html" class="btn btn-outline" style="border-color:rgba(255,255,255,.3)" onclick="closeMobileMenu()">👤 Busco trabajo</a>
      <a href="#" class="btn btn-primary" onclick="openModal('empresa');closeMobileMenu();return false;">Publicar vacante</a>
    </div>`;
}

function renderFooter(isIndex) {
  const base = isIndex ? 'pages/' : '';
  const logoSrc = isIndex ? 'assets/logo.png' : '../assets/logo.png';
  return `
    <footer>
      <div class="footer-grid">
        <div>
          <div class="footer-logo">
            <img src="${logoSrc}" alt="Factor Laboral Humano">
            <div class="footer-logo-text">Factor Laboral <span>Humano</span><small>Reclutamiento · Guatemala</small></div>
          </div>
          <p class="footer-tagline">Conectando el talento guatemalteco con las empresas que impulsan el país. Presencia en toda la república.</p>
          <div class="footer-social">
            <a href="https://www.linkedin.com/in/factor-laboral-humano-296441406" target="_blank" class="social-btn" title="LinkedIn">in</a>
            <a href="https://www.facebook.com/share/g/14avjVS6KRY/" target="_blank" class="social-btn" title="Facebook">f</a>
            <a href="https://www.tiktok.com/@reclutamiento.tal53" target="_blank" class="social-btn" title="TikTok">♪</a>
            <a href="mailto:factorlaboralhumano@gmail.com" class="social-btn" title="Email">✉</a>
            <a href="https://wa.me/50237190890" target="_blank" class="social-btn" title="WhatsApp">📱</a>
          </div>
        </div>
        <div class="footer-col">
          <h5>Servicios</h5>
          <ul>
            <li><a href="${base}servicios.html">Búsqueda ejecutiva</a></li>
            <li><a href="${base}servicios.html">Reclutamiento masivo</a></li>
            <li><a href="${base}servicios.html">Capacitación laboral</a></li>
            <li><a href="${base}tecnologia.html">🌐 Soluciones tecnológicas</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h5>Candidatos</h5>
          <ul>
            <li><a href="${base}candidatos.html">🚀 Portal de empleo</a></li>
            <li><a href="${base}vacantes.html">Ver vacantes</a></li>
            <li><a href="${base}candidatos.html">Subir mi CV</a></li>
            <li><a href="${base}candidatos.html">Crear cuenta</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h5>Contacto</h5>
          <ul>
            <li><a href="mailto:factorlaboralhumano@gmail.com">factorlaboralhumano@gmail.com</a></li>
            <li><a href="https://wa.me/50237190890" target="_blank">WhatsApp: 3719-0890</a></li>
            <li><a href="${base}contacto.html">Formulario</a></li>
            <li><a href="${base}nosotros.html">Nosotros</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© 2025 Factor Laboral Humano · Guatemala</span>
        <span><a href="#">Privacidad</a> · <a href="#">Términos</a></span>
      </div>
    </footer>`;
}

function renderModal() {
  return `
    <div class="modal-overlay" id="modal" onclick="closeModalOut(event)">
      <div class="modal-box">
        <button class="modal-close" onclick="closeModal()">✕</button>
        <h3>Empecemos 🚀</h3>
        <p>Completa el formulario y te contactamos por WhatsApp o correo a la brevedad.</p>
        <div class="tipo-selector">
          <button class="tipo-btn active" id="btn-empresa" onclick="setTipo('empresa')">🏢 Soy empresa</button>
          <button class="tipo-btn" id="btn-candidato" onclick="setTipo('candidato')">👤 Busco trabajo</button>
        </div>
        <div class="form-row">
          <div class="form-group"><label>Nombre completo</label><input type="text" id="m-nombre" placeholder="Ej. Ana García"></div>
          <div class="form-group"><label>Teléfono / WhatsApp</label><input type="tel" id="m-telefono" placeholder="3719-0890"></div>
        </div>
        <div class="form-group"><label>Correo electrónico</label><input type="email" id="m-correo" placeholder="tu@correo.com"></div>
        <div class="form-group" id="field-empresa" style="display:none"><label>Nombre de la empresa</label><input type="text" id="m-empresa" placeholder="Ej. Mi Empresa S.A."></div>
        <div class="form-group" id="field-puesto"><label>Puesto que deseas cubrir</label><input type="text" id="m-puesto" placeholder="Ej. Gerente de Ventas..."></div>
        <div class="form-group"><label>Mensaje (opcional)</label><textarea id="m-mensaje" placeholder="Cuéntanos más sobre lo que necesitas..."></textarea></div>
        <button class="btn btn-primary btn-lg" style="width:100%;justify-content:center" onclick="submitForm()">Enviar por WhatsApp →</button>
        <p style="font-size:.73rem;color:#999;margin-top:10px;text-align:center;">Se abrirá WhatsApp con tu mensaje listo para enviar.</p>
      </div>
    </div>`;
}

function renderCursor() {
  return `<div id="cursor"></div><div id="cursor-ring"></div>`;
}

/* ════════════════════════════════
   CHATBOT / WHATSAPP FLOTANTE
   ════════════════════════════════ */
function renderChatWidget() {
  return `
  <!-- Botón flotante WhatsApp + Chat IA -->
  <div id="chatWidgetWrap">
    <!-- Burbuja WA (siempre visible) -->
    <a href="https://wa.me/50237190890?text=Hola%2C%20quiero%20información%20sobre%20sus%20servicios%20de%20reclutamiento"
       target="_blank" class="cw-wa-btn" title="Escríbenos por WhatsApp" aria-label="WhatsApp">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
    </a>
    <!-- Botón abrir chat IA -->
    <button class="cw-chat-btn" onclick="toggleChat()" id="cwChatBtn" title="Chat con IA" aria-label="Abrir chat">
      <span class="cw-chat-open">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
      </span>
      <span class="cw-chat-close" style="display:none">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </span>
      <span class="cw-badge">IA</span>
    </button>
    <!-- Panel chat -->
    <div class="cw-panel" id="cwPanel">
      <div class="cw-header">
        <div class="cw-dot"></div>
        <div>
          <div class="cw-title">Asistente FLH</div>
          <div class="cw-sub">Respondo en segundos ✨</div>
        </div>
        <button class="cw-close" onclick="toggleChat()">✕</button>
      </div>
      <div class="cw-messages" id="cwMessages">
        <div class="cw-msg cw-msg-bot">
          <div class="cw-bubble">¡Hola! 👋 Soy el asistente de <strong>Factor Laboral Humano</strong>. Puedo ayudarte con:<br><br>• Información sobre nuestros servicios<br>• Cómo postularte a vacantes<br>• Publicar una vacante para tu empresa<br>• Tiempos y costos del proceso<br><br>¿En qué puedo ayudarte?</div>
        </div>
      </div>
      <div class="cw-quick-btns" id="cwQuickBtns">
        <button onclick="sendQuick('¿Cuánto cuesta el servicio de reclutamiento?')">💰 Costos</button>
        <button onclick="sendQuick('¿Cómo aplico a una vacante?')">📋 Vacantes</button>
        <button onclick="sendQuick('¿En cuánto tiempo encuentran candidatos?')">⏱ Tiempos</button>
      </div>
      <div class="cw-input-wrap">
        <input type="text" class="cw-input" id="cwInput" placeholder="Escribe tu pregunta..." onkeydown="if(event.key==='Enter')sendChat()">
        <button class="cw-send" onclick="sendChat()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </div>
    </div>
  </div>`;
}
