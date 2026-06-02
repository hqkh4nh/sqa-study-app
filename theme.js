/* Light/Dark theme toggle, shared across pages. Persists choice in localStorage. */
(function () {
  'use strict';
  var KEY = 'sqa-theme';
  var root = document.documentElement;

  function apply(t) { root.setAttribute('data-theme', t); }

  // initial theme: saved choice, else default to light (user's chosen direction)
  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}
  if (!saved) saved = 'light';
  apply(saved);

  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.getElementById('themeToggle');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      apply(next);
      try { localStorage.setItem(KEY, next); } catch (e) {}
    });
  });
})();
