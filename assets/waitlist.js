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

    const v = (n) => (form.elements[n]?.value || '').trim() || '-';
    const utm = [...new URLSearchParams(location.search)].filter(([k]) => k.startsWith('utm_')).map(([k, x]) => `${k}=${x}`).join('&');
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
          // 키를 한글로 보내야 알림 메일에 한글 항목명으로 보인다. 빈 칸도 '-' 로 남겨 항목이 빠지지 않게 한다.
          data: {
            email,                    // 'email'·'name' 키는 서비스가 '이메일'·'이름'으로 표시하고 회신 주소로 쓴다
            name: v('name'),
            '전화번호': v('phone'),
            '소속': v('org'),
            '직책·역할': v('role'),
            '쓰려는 환경': envs.join(', ') || '-',
            '연결할 기기 수': v('devices'),
            '맡기고 싶은 일': v('usecase'),
            '문의·질문': v('question'),
            '뉴스레터 구독': form.newsletter.checked ? '예 (수신 동의)' : '아니오',
            '개인정보 수집·이용 동의': '예',
            '유입 경로': [document.referrer || '직접', utm].filter(Boolean).join(' · '),
            '페이지': location.href,
            '제출 시각': new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }) + ' (KST)',
          },
        }),
      });
      const out = await res.json().catch(() => ({}));
      if (!res.ok || out.success === false) throw new Error(out.error || res.status);
      say('');
      form.reset();
      form.hidden = true;
      document.getElementById('wl-done').hidden = false;
      try { window.posthog && posthog.capture('waitlist_submitted', { environments: envs, newsletter: form.newsletter.checked }); } catch (_) {}
    } catch (err) {
      say('전송하지 못했습니다. 잠시 후 다시 시도하거나 admin@baryon.ai 로 메일 주세요.', 'error');
      try { window.posthog && posthog.capture('waitlist_failed', { error: String(err) }); } catch (_) {}
    } finally {
      clearTimeout(timer);
      btn.disabled = false;
    }
  });
})();
