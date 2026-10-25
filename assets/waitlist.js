// 웨이팅리스트 — form2ai2email 로 admin@baryon.ai 에 전달
(() => {
  const form = document.getElementById('waitlist-form');
  if (!form) return;
  const API = 'https://api.form2ai2email.baryon.ai/api/submit';
  const FORM_ID = 'mvnos8ullkr08dwq';
  const status = document.getElementById('wl-status');
  const btn = form.querySelector('button[type=submit]');

  const say = (msg, kind) => { status.textContent = msg; status.dataset.kind = kind || ''; };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (form.website.value) return;                     // 봇 함정
    const email = form.email.value.trim();
    if (!form.email.checkValidity() || !email) { say('이메일 주소를 확인해 주세요.', 'error'); form.email.focus(); return; }
    if (!form.agree.checked) { say('개인정보 수집·이용에 동의해 주세요.', 'error'); form.agree.focus(); return; }

    const envs = [...form.querySelectorAll('input[name=env]:checked')].map((i) => i.value);
    btn.disabled = true; say('보내는 중…');
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 20000);  // 응답이 없으면 20초 뒤 실패 처리
    try {
      const res = await fetch(API, {
        method: 'POST',
        signal: ctrl.signal,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form_id: FORM_ID,
          data: {
            email,
            name: form.name.value.trim(),
            organization: form.org.value.trim(),
            environments: envs.join(', '),
            use_case: form.usecase.value.trim(),
            source: 'dureclaw.baryon.ai',
            page: location.pathname,
            submitted_at: new Date().toISOString(),
          },
        }),
      });
      const out = await res.json().catch(() => ({}));
      if (!res.ok || out.success === false) throw new Error(out.error || res.status);
      say('');
      form.reset();
      form.hidden = true;
      document.getElementById('wl-done').hidden = false;
      try { window.posthog && posthog.capture('waitlist_submitted', { environments: envs }); } catch (_) {}
    } catch (err) {
      say('전송하지 못했습니다. 잠시 후 다시 시도하거나 admin@baryon.ai 로 메일 주세요.', 'error');
      try { window.posthog && posthog.capture('waitlist_failed', { error: String(err) }); } catch (_) {}
    } finally {
      clearTimeout(timer);
      btn.disabled = false;
    }
  });
})();
