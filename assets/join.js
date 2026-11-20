(function () {
  var TO = 'dmyung2@jh.edu';
  var form = document.getElementById('join-form');
  var input = document.getElementById('tth-email');
  var error = document.getElementById('join-error');
  var done = document.getElementById('join-done');
  var echo = document.getElementById('join-email-echo');
  var mailto = document.getElementById('join-mailto');
  var reset = document.getElementById('join-reset');
  var pills = Array.prototype.slice.call(document.querySelectorAll('.pill'));
  if (!form) return;

  pills.forEach(function (p) {
    p.addEventListener('click', function () {
      p.setAttribute('aria-pressed', p.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
    });
  });

  input.addEventListener('input', function () { error.hidden = true; });

  function buildMailto(email) {
    var chosen = pills.filter(function (p) { return p.getAttribute('aria-pressed') === 'true'; })
      .map(function (p) { return p.dataset.label; });
    var body = 'Please add ' + email + ' to The Triple Helix at JHU mailing list.' +
      (chosen.length ? '\nInterested in: ' + chosen.join(', ') : '');
    return 'mailto:' + TO + '?subject=' + encodeURIComponent('TTH at JHU mailing list sign-up') +
      '&body=' + encodeURIComponent(body);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var v = (input.value || '').trim();
    if (!/^[^\s@]+@(jhu|jh|jhmi)\.edu$/i.test(v)) {
      error.textContent = 'Please use a Hopkins email (jhu.edu, jh.edu or jhmi.edu).';
      error.hidden = false;
      input.focus();
      return;
    }
    var href = buildMailto(v);
    echo.textContent = v;
    mailto.href = href;
    form.hidden = true;
    done.hidden = false;
    window.location.href = href;
  });

  reset.addEventListener('click', function () {
    input.value = '';
    pills.forEach(function (p) { p.setAttribute('aria-pressed', 'false'); });
    done.hidden = true;
    form.hidden = false;
    input.focus();
  });
})();
