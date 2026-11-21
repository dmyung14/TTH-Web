(function () {
  // Google Apps Script web app that appends sign-ups to the mailing-list sheet.
  var ENDPOINT = 'https://script.google.com/macros/s/AKfycbzZHhZZYucf7qi7hXMndaVO0oGoHPnINgRoJGcLyFA-HiOtQUc5b6aWwDYj95RblR99/exec';

  var form = document.getElementById('join-form');
  var input = document.getElementById('tth-email');
  var error = document.getElementById('join-error');
  var submitBtn = document.getElementById('join-submit');
  var pills = Array.prototype.slice.call(document.querySelectorAll('.pill'));
  if (!form) return;

  pills.forEach(function (p) {
    p.addEventListener('click', function () {
      p.setAttribute('aria-pressed', p.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
    });
  });

  input.addEventListener('input', function () { error.hidden = true; });

  function showError(msg) {
    error.textContent = msg;
    error.hidden = false;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var v = (input.value || '').trim();
    if (!/^[^\s@]+@(jhu|jh|jhmi)\.edu$/i.test(v)) {
      showError('Please use a Hopkins email (jhu.edu, jh.edu or jhmi.edu).');
      input.focus();
      return;
    }
    var chosen = pills.filter(function (p) { return p.getAttribute('aria-pressed') === 'true'; })
      .map(function (p) { return p.dataset.label; });
    var hp = form.querySelector('input[name="website"]');
    var body = new URLSearchParams({
      email: v,
      interests: chosen.join(', '),
      source: location.hostname,
      website: hp ? hp.value : ''
    });

    submitBtn.disabled = true;
    submitBtn.textContent = 'Subscribing…';

    function done() { window.location.assign('/thanks'); }
    function fail() {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Subscribe';
      showError('Something went wrong. Please try again in a moment.');
    }

    fetch(ENDPOINT, { method: 'POST', body: body })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        if (res && res.ok) done();
        else if (res && res.error === 'invalid_email') {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Subscribe';
          showError('Please use a Hopkins email (jhu.edu, jh.edu or jhmi.edu).');
        } else fail();
      })
      .catch(function () {
        // Fall back to an opaque request if the response can't be read (e.g. CORS).
        fetch(ENDPOINT, { method: 'POST', mode: 'no-cors', body: body }).then(done, fail);
      });
  });
})();
