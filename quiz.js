/* =========================================================================
   Shared quiz engine for the SQA Study Journal.
   Each chapter page defines a global `STUDY = { quiz: [ ... ] }` and a
   container <div id="quiz"></div>. This script renders the questions,
   gives immediate correct/incorrect feedback, and tallies a live score.

   Quiz item shape:
   { q: "question (may contain <code>...</code>)",
     options: ["a", "b", ...],
     answer: 0,                       // index of correct option
     explain: "why the answer is correct (reinforcement)" }
   ========================================================================= */
(function () {
  'use strict';

  var data = (window.STUDY && window.STUDY.quiz) || [];
  var mount = document.getElementById('quiz');
  if (!mount || !data.length) return;

  var LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];
  var answered = 0;
  var correct = 0;
  var total = data.length;

  var chip = document.getElementById('scoreChip');
  var results = document.getElementById('results');

  function updateChip() {
    if (chip) chip.innerHTML = 'Quiz <b>' + correct + '</b>/' + total +
      ' &middot; ' + answered + ' answered';
  }

  function showResults() {
    if (!results) return;
    var pct = Math.round((correct / total) * 100);
    var ring = results.querySelector('.ring');
    var num = results.querySelector('.ring i');
    var h3 = results.querySelector('.msg h3');
    var p = results.querySelector('.msg p');
    ring.style.setProperty('--p', pct);
    num.textContent = pct + '%';
    var verdict;
    if (pct === 100) verdict = 'Flawless — every concept locked in.';
    else if (pct >= 80) verdict = 'Strong grasp of the fundamentals.';
    else if (pct >= 60) verdict = 'Solid start — review the missed items.';
    else verdict = 'Worth another pass through the theory above.';
    h3.textContent = 'You scored ' + correct + ' / ' + total;
    p.textContent = verdict;
    results.classList.add('show');
    results.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function render() {
    data.forEach(function (item, qi) {
      var card = document.createElement('div');
      card.className = 'q';

      var num = document.createElement('div');
      num.className = 'qnum';
      num.textContent = 'Question ' + (qi + 1) + ' of ' + total;
      card.appendChild(num);

      var qt = document.createElement('div');
      qt.className = 'qtext';
      qt.innerHTML = item.q;
      card.appendChild(qt);

      var btns = [];
      item.options.forEach(function (opt, oi) {
        var b = document.createElement('button');
        b.className = 'opt';
        b.type = 'button';
        b.innerHTML = '<span class="mark">' + LETTERS[oi] + '</span>' +
          '<span class="lbl">' + opt + '</span>';
        b.addEventListener('click', function () { choose(qi, oi, btns, ex, item); });
        card.appendChild(b);
        btns.push(b);
      });

      var ex = document.createElement('div');
      ex.className = 'explain';
      card.appendChild(ex);

      mount.appendChild(card);
    });
    updateChip();
  }

  function choose(qi, oi, btns, ex, item) {
    if (btns._done) return;        // lock after first answer
    btns._done = true;
    answered++;

    var isRight = oi === item.answer;
    if (isRight) correct++;

    btns.forEach(function (b, i) {
      b.disabled = true;
      if (i === item.answer) b.classList.add('correct');
      else if (i === oi) b.classList.add('wrong');
      else b.classList.add('muted');
    });

    ex.classList.add('show', isRight ? 'ok' : 'no');
    ex.innerHTML = '<span class="verdict">' +
      (isRight ? '✓ Correct. ' : '✗ Not quite. ') + '</span>' +
      (item.explain || '');

    updateChip();
    if (answered === total) showResults();
  }

  // reading progress bar
  var bar = document.getElementById('rprog');
  if (bar) {
    var onScroll = function () {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  render();
})();
