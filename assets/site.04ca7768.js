/* Progressive enhancement only: the site works fully without this file. */
(function () {
  var d = document;
  function closeMenus(except) {
    [].forEach.call(d.querySelectorAll('details.dd[open], details.nav-mob[open]'), function (el) {
      if (el !== except) el.removeAttribute('open');
    });
  }
  d.addEventListener('click', function (e) {
    var open = e.target.closest ? e.target.closest('details.dd, details.nav-mob') : null;
    closeMenus(open);
  });
  d.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenus(null);
  });

  if (typeof HTMLDialogElement !== 'function') return;
  [].forEach.call(d.querySelectorAll('[data-gallery]'), function (gal) {
    var links = [].slice.call(gal.querySelectorAll('a[data-full]'));
    if (!links.length) return;
    var dlg = d.createElement('dialog'), idx = 0, opener = null, x0 = null;
    dlg.className = 'lb';
    dlg.setAttribute('aria-label', gal.getAttribute('data-label') || '');
    var img = d.createElement('img');
    var bar = d.createElement('div');
    bar.className = 'lb-bar';
    function btn(label, fn) {
      var b = d.createElement('button');
      b.type = 'button';
      b.className = 'btn';
      b.textContent = label;
      b.addEventListener('click', fn);
      bar.appendChild(b);
      return b;
    }
    function show(i) {
      idx = (i + links.length) % links.length;
      var thumb = links[idx].querySelector('img');
      img.src = links[idx].getAttribute('href');
      img.alt = thumb ? thumb.alt : '';
    }
    var multi = links.length > 1;
    if (multi) btn(gal.getAttribute('data-prev'), function () { show(idx - 1); });
    if (multi) btn(gal.getAttribute('data-next'), function () { show(idx + 1); });
    var closeBtn = btn(gal.getAttribute('data-close'), function () { dlg.close(); });
    dlg.appendChild(img);
    dlg.appendChild(bar);
    d.body.appendChild(dlg);
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener('keydown', function (e) {
      if (!multi) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); show(idx + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); show(idx - 1); }
    });
    /* Focus goes back to the photo that opened the viewer, wherever the arrows ended up. */
    dlg.addEventListener('close', function () { if (opener) opener.focus(); });
    /* Phones: swipe left or right to change photo. */
    dlg.addEventListener('touchstart', function (e) { x0 = e.touches.length === 1 ? e.touches[0].clientX : null; }, { passive: true });
    dlg.addEventListener('touchend', function (e) {
      if (!multi || x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      x0 = null;
      if (Math.abs(dx) > 40) show(idx + (dx < 0 ? 1 : -1));
    });
    links.forEach(function (a, i) {
      a.addEventListener('click', function (e) {
        if (e.metaKey || e.ctrlKey || e.shiftKey) return;
        e.preventDefault();
        opener = a;
        show(i);
        dlg.showModal();
        closeBtn.focus();
      });
    });
  });
})();

/* Floating WhatsApp button: keep it out of the way while the page's first WhatsApp button is on screen. */
(function () {
  var fab = document.querySelector('.fab'), first = document.querySelector('.actions .btn, .actions a');
  if (!fab || !first || !('IntersectionObserver' in window)) return;
  new IntersectionObserver(function (es) {
    fab.classList.toggle('is-off', es[0].isIntersecting);
  }).observe(first);
})();
