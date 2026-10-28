/**
 * DureClaw i18n Engine (KO / EN)
 * Features:
 * 1. Dedicated bilingual routing: '/' for Korean, '/en/' for English.
 * 2. Automatic browser language detection with localStorage persistence.
 * 3. Seamless switching via nav switcher buttons.
 * 4. Fallback DOM translation for pages without dedicated /en/ templates.
 */
(function() {
  const STORAGE_KEY = 'dureclaw_lang';
  const pathname = window.location.pathname;
  const isEnPath = pathname.startsWith('/en/') || pathname === '/en';

  // 1. Check URL parameters for explicit language override (?lang=ko or ?lang=en)
  const urlParams = new URLSearchParams(window.location.search);
  const paramLang = urlParams.get('lang');
  if (paramLang === 'ko' || paramLang === 'en') {
    localStorage.setItem(STORAGE_KEY, paramLang);
  }

  // 2. Language determination
  function getPreferredLang() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'ko' || saved === 'en') return saved;
    const browserLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
    if (browserLang.startsWith('en')) return 'en';
    return 'ko';
  }

  const preferredLang = getPreferredLang();

  // 3. Smart routing for main page:
  // If on Korean root ('/' or '/index.html') and preferred language is 'en', redirect to '/en/'
  if (!isEnPath && (pathname === '/' || pathname === '/index.html')) {
    if (preferredLang === 'en' && !urlParams.has('stay')) {
      window.location.replace('/en/');
      return;
    }
  }

  // If on English root ('/en/' or '/en/index.html') and preferred language is 'ko', redirect to '/'
  if (isEnPath && (pathname === '/en/' || pathname === '/en/index.html' || pathname === '/en')) {
    if (preferredLang === 'ko' && !urlParams.has('stay')) {
      window.location.replace('/');
      return;
    }
  }

  // 4. Bind language switchers on both KO and EN pages
  function setupLangSwitchers() {
    const currentLang = isEnPath ? 'en' : 'ko';

    // Highlight active button
    document.querySelectorAll('.lang-btn').forEach(btn => {
      const btnLang = btn.dataset.lang;
      btn.classList.toggle('active', btnLang === currentLang);

      // Add click handler for redirection
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (btnLang === currentLang) return;
        localStorage.setItem(STORAGE_KEY, btnLang);
        if (btnLang === 'en') {
          window.location.href = '/en/';
        } else {
          window.location.href = '/';
        }
      });
    });

    // If no switcher in navbar exists, dynamically mount one
    const navInner = document.querySelector('.nav-inner');
    if (navInner && !document.querySelector('.lang-switch')) {
      const switcher = document.createElement('div');
      switcher.className = 'lang-switch';
      switcher.setAttribute('role', 'group');
      switcher.setAttribute('aria-label', 'Language selection');
      switcher.innerHTML = `
        <button type="button" class="lang-btn ${currentLang === 'ko' ? 'active' : ''}" data-lang="ko" title="한국어">KO</button>
        <span class="lang-sep">|</span>
        <button type="button" class="lang-btn ${currentLang === 'en' ? 'active' : ''}" data-lang="en" title="English">EN</button>
      `;

      const navGh = navInner.querySelector('.nav-gh');
      if (navGh) {
        navGh.insertAdjacentElement('afterend', switcher);
      } else {
        navInner.appendChild(switcher);
      }

      switcher.addEventListener('click', (e) => {
        const btn = e.target.closest('.lang-btn');
        if (!btn) return;
        const target = btn.dataset.lang;
        if (target && target !== currentLang) {
          localStorage.setItem(STORAGE_KEY, target);
          if (target === 'en') {
            window.location.href = '/en/';
          } else {
            window.location.href = '/';
          }
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupLangSwitchers);
  } else {
    setupLangSwitchers();
  }
})();
