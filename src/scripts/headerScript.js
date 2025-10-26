export function initNavAnimation(nav) {
  if (!nav) return () => {};
  const links = Array.from(nav.querySelectorAll('a'));
  if (!links.length) return () => {};

  let indicator = nav.querySelector('.nav-indicator');
  if (!indicator) {
    indicator = document.createElement('span');
    indicator.className = 'nav-indicator';
    indicator.setAttribute('aria-hidden', 'true');
    nav.appendChild(indicator);
  }
  indicator.classList.add('initializing');

  let active = nav.querySelector('a.active') || links[0];

  function moveTo(el) {
    if (!el) return;
    const navRect = nav.getBoundingClientRect();
    const rect = el.getBoundingClientRect();
    indicator.style.left = (rect.left - navRect.left) + 'px';
    indicator.style.width = rect.width + 'px';
  }

  moveTo(active);
  void indicator.offsetWidth;
  requestAnimationFrame(() => indicator.classList.remove('initializing'));

  const handlers = new Map();

  links.forEach(link => {
    const onEnter = () => moveTo(link);
    const onClick = (e) => {
      links.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      active = link;
      moveTo(active);
    };
    link.addEventListener('mouseenter', onEnter);
    link.addEventListener('focus', onEnter);
    link.addEventListener('click', onClick);
    handlers.set(link, {onEnter, onClick});
  });

  const onLeave = () => moveTo(active);
  const onResize = () => moveTo(active);
  const onLoad = () => moveTo(active);

  nav.addEventListener('mouseleave', onLeave);
  window.addEventListener('resize', onResize);
  window.addEventListener('load', onLoad);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => moveTo(active));
  }

  return function cleanup() {
    handlers.forEach((h, link) => {
      link.removeEventListener('mouseenter', h.onEnter);
      link.removeEventListener('focus', h.onEnter);
      link.removeEventListener('click', h.onClick);
    });
    nav.removeEventListener('mouseleave', onLeave);
    window.removeEventListener('resize', onResize);
    window.removeEventListener('load', onLoad);
    // можно оставить индикатор или удалить:
    if (indicator && indicator.parentNode === nav) nav.removeChild(indicator);
  };
}

export function initLanguageSwitch(root) {
  if (!root) return () => {};
  const langBtn = root.querySelector('.btn-language');
  const langList = root.querySelector('.language-list');
  if (!langBtn || !langList) return () => {};

  const switchRoot = root;
  const saved = localStorage.getItem('siteLang') || 'EN';

  function setLanguage(code, { save = true } = {}) {
    langBtn.textContent = code;
    langBtn.setAttribute('aria-label', 'Language: ' + code);

    langList.querySelectorAll('li').forEach(li => {
      const is = li.dataset.lang === code;
      li.classList.toggle('active', is);
      li.setAttribute('aria-checked', String(is));
    });

    langList.classList.remove('open');
    langBtn.setAttribute('aria-expanded', 'false');

    if (save) localStorage.setItem('siteLang', code);
  }

  const onBtnClick = (e) => {
    const open = !langList.classList.contains('open');
    langList.classList.toggle('open', open);
    langBtn.setAttribute('aria-expanded', String(open));
  };

  const onListClick = (e) => {
    const li = e.target.closest('li');
    if (!li) return;
    setLanguage(li.dataset.lang);
  };

  const onDocClick = (e) => {
    if (!switchRoot.contains(e.target)) {
      langList.classList.remove('open');
      langBtn.setAttribute('aria-expanded', 'false');
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Escape') {
      langList.classList.remove('open');
      langBtn.setAttribute('aria-expanded', 'false');
      langBtn.focus();
      return;
    }
    if (langList.classList.contains('open')) {
      const items = Array.from(langList.querySelectorAll('li'));
      const idx = items.findIndex(i => i === document.activeElement);
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const next = (idx + 1) < items.length ? items[idx + 1] : items[0];
        next.focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = (idx - 1) >= 0 ? items[idx - 1] : items[items.length - 1];
        prev.focus();
      } else if (e.key === 'Enter' && document.activeElement.tagName === 'LI') {
        document.activeElement.click();
      }
    }
  };

  langBtn.addEventListener('click', onBtnClick);
  langList.addEventListener('click', onListClick);
  document.addEventListener('click', onDocClick);
  document.addEventListener('keydown', onKeyDown);
  langList.querySelectorAll('li').forEach(li => li.setAttribute('tabindex', '0'));
  setLanguage(saved, { save: false });

  return function cleanup() {
    langBtn.removeEventListener('click', onBtnClick);
        langList.removeEventListener('click', onListClick);
        document.removeEventListener('click', onDocClick);
        document.removeEventListener('keydown', onKeyDown);
    };
}
