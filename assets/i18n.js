/**
 * DureClaw i18n Engine (KO / EN)
 * Auto-detects browser language and supports manual switching with localStorage persistence.
 */
(function() {
  const STORAGE_KEY = 'dureclaw_lang';

  // 1. Translation dictionary: Korean -> English
  const dict = {
    // Navigation
    "설치 가이드": "Install Guide",
    "활용 사례": "Use Cases",
    "구조와 원리": "Architecture",
    "데모": "Demo",
    "개발자": "Developers",
    "Changelog": "Changelog",
    "엔터프라이즈": "Enterprise",
    "문서": "Docs",
    "도입 문의 · 소식": "Inquiry & Updates",
    "대기 신청": "Inquiry & Updates",

    // Hero
    "Claude Code 네이티브 · 개인판 무료": "Claude Code Native · Free Personal Edition",
    "내 모든 컴퓨터가하나의 AI 팀으로": "Turn All Your Computers into a Single AI Crew",
    "내 모든 컴퓨터가": "Turn All Your Computers",
    "하나의 AI 팀으로": "into a Single AI Crew",
    "여러 대의 맥, 윈도우, 라즈베리 파이를 하나의 협력 버스로 묶습니다. Claude가 두뇌, 각 노드가 물리와 화면의 손이 되어 움직입니다. keyless 엣지 + 결정 동결(LLM as compiler)로 API 키 없이 빠르고 안전합니다.": "Unite Macs, Windows PCs, and Raspberry Pis into a single collaborative bus. Claude acts as the central brain, while each node serves as physical and desktop hands — running securely with zero API keys exposed via keyless edge and Decision Freezing.",
    "Mac용 다운로드": "Download for Mac",
    "Windows 가이드": "Windows Guide",
    "개인판 무료 (서버 포함 2대) · 온프레미스 사설망 탑재": "Free Personal Edition (up to 2 nodes) · On-Premise P2P Mesh Built-in",
    "서버 앱을 띄우고, 각 컴퓨터를 한 줄로 합류시킵니다.": "Launch the server app, and join any computer with a single command.",

    // Core Value Cards
    "1인 개발부터 연구실까지": "From Solo Developers to Research Labs",
    "왜 DureClaw인가요?": "Why DureClaw?",
    "Claude 하나로 모든 기기를 조율": "Orchestrate All Machines with One Claude",
    "SSH는 터미널을 열 뿐이지만, DureClaw는 에이전트 간 협력 프로토콜(P2P 버스)을 제공합니다.": "While SSH merely opens a terminal, DureClaw provides a real-time agentic collaboration protocol (P2P Bus).",
    "Keyless 엣지 & 안전 격리": "Keyless Edge & Sandboxed Hands",
    "엣지 컴퓨터에 값비싼 LLM API 키나 SSH 개인키를 심을 필요가 없습니다. 순수 실행 도구로만 안전하게 동작합니다.": "No need to place expensive LLM API keys or SSH private keys on edge machines. Nodes operate purely as sandboxed execution hands.",
    "결정 동결 (LLM as compiler)": "Decision Freezing (LLM as Compiler)",
    "한 번 승인된 판단과 절차는 코드로 컴파일되어, 2회차부터는 LLM 호출 0회 · 마이크로초(µs) 단위로 즉시 실행됩니다.": "Approved plans and decisions are compiled into deterministic rules — running with 0 LLM calls at microsecond (µs) speeds on subsequent runs.",

    // Claws: Browser and Desktop
    "브라우저와 데스크톱도 팀원이 됩니다": "Browsers and Desktops Join the Crew",
    "화면을 직접 보고 다루는 로컬 손 — webclaw와 deskclaw": "Local hands that see and control displays — webclaw & deskclaw",
    "브라우저 노드": "Browser Node",
    "크롬 창에서 검색·수집·양식 입력을 대행합니다. 헤드리스가 아니라 눈앞의 실제 브라우저에서 작업이 진행됩니다.": "Automates search, web scraping, and form filling inside real Chrome tabs with full visibility.",
    "데스크톱 노드": "Desktop Node",
    "화면 캡처와 키보드·마우스 자동화(RPA)로 레거시 프로그램이나 사내 ERP를 제어합니다.": "Controls desktop GUIs, legacy software, and on-premise ERPs via screen perception and deterministic replay.",

    // Open Edge Ecosystem
    "오픈 엣지 에코시스템": "Open Edge Ecosystem",
    "임베디드·엣지 장비를 위한 다양한 claw 연동": "Seamless Integration with Open-Source Embedded Agents",
    "공식 Go 정적 단일 바이너리. 리눅스·맥·윈도우·라즈베리파이 어디서나 즉시 실행.": "Official static Go single binary. Runs instantly across Linux, macOS, Windows, and Raspberry Pi.",
    "Rust 기반 극초경량·초고속 자율 에이전트. 메모리 안전성과 최소 자원 소비.": "Rust-powered ultra-fast autonomous agent with zero-cost memory safety.",
    "Zig 기반 마이크로 에이전트. C 런타임 의존성 없는 극소 풋프린트.": "Zig-native micro agent with zero libc dependency and negligible resource footprint.",
    "Go 기반 초소형 배포 가능 에이전트. RISC-V 보드 및 IoT 디바이스 최적화.": "Ultra-tiny Go agent deployable on RISC-V and minimal embedded boards.",
    "Python 기반 경량 워크플로우 에이전트. 풍부한 AI 라이브러리 연동.": "Python-based agent for rapid workflow automation and AI library orchestration.",

    // Form & Waitlist
    "도입 문의 · 출시 소식": "Enterprise Inquiry & Updates",
    "새 기능과 정식 출시 소식을 먼저 받아보세요": "Get New Features & Release Updates Early",
    "Windows 서버 앱, 알림·자동 업데이트, 팀 플랜까지 — 준비되는 대로 이메일로 알려드립니다. 어떤 일을 맡기고 싶은지 적어 주시면 우선 지원 대상을 정하는 데 참고합니다.": "Windows server apps, real-time alerts, enterprise plans — delivered straight to your inbox. Share your workflow to help us prioritize support.",
    "이메일": "Email",
    "이름": "Name",
    "전화번호": "Phone",
    "소속": "Organization",
    "직책·역할": "Role / Title",
    "쓰려는 환경": "Target Environments",
    "연결할 기기 수": "Number of Devices",
    "선택 안 함": "Not Selected",
    "1~2대": "1~2 Nodes",
    "3~5대": "3~5 Nodes",
    "6~20대": "6~20 Nodes",
    "21대 이상": "21+ Nodes",
    "맡기고 싶은 일": "Desired Use Case",
    "문의·질문": "Questions / Inquiries",
    "도입 문의 · 소식 신청": "Submit Inquiry & Updates",
    "웨이팅리스트 신청": "Submit Inquiry & Updates",
    "신청해 주셔서 감사합니다 🙌": "Thank you for subscribing 🙌",
    "준비되는 대로 이메일로 알려드리겠습니다. 지금 바로 써 보려면 설치 가이드를 보세요.": "We will update you as soon as features are ready. Check our Install Guide to get started today.",

    // Footer
    "DureClaw (두레클로)": "DureClaw",
    "놀고 있는 모든 컴퓨터를 AI 팀원으로 — Local-First Agentic Bus": "Turn idle computers into an AI crew — Local-First Agentic Bus",
    "시작하기": "Get Started",
    "방법론·아키텍처": "Architecture",
    "플랜 및 요금": "Pricing & Plans",
    "이용약관": "Terms of Service",
    "이슈·템플릿 ↗": "GitHub Issues ↗",
    "회사 소개 ↗": "About Baryon Labs ↗",
    "AX 컨설팅·도입 ↗": "AX Consulting & Solutions ↗",
    "바리온랩스 (Baryon Labs)": "Baryon Labs",
    "대표: 홍승우": "CEO: Seungwoo Hong",
    "문의: hello@baryon.ai": "Inquiry: hello@baryon.ai",
    "자세히 알아보기": "Learn More",
    "활용 사례 전체 보기 →": "View All Use Cases →",
    "지금 Mac 한 대로 시작하세요": "Get Started with a Single Mac",
    "서버 앱을 설치하고, 놀고 있는 컴퓨터를 하나씩 팀에 합류시키면 됩니다.": "Install the server app, then connect your idle computers one by one."
  };

  // Build reverse dictionary for switching back to KO
  const reverseDict = {};
  for (const [k, v] of Object.entries(dict)) {
    reverseDict[v] = k;
  }

  // 2. Language determination logic:
  // priority: 1. localStorage -> 2. browser language (en -> 'en', else -> 'ko')
  function getPreferredLang() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'ko' || saved === 'en') return saved;
    const browserLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
    if (browserLang.startsWith('en')) return 'en';
    return 'ko';
  }

  let currentLang = 'ko';

  function applyLanguage(targetLang) {
    if (targetLang === currentLang && document.documentElement.lang === targetLang) return;
    currentLang = targetLang;
    document.documentElement.lang = targetLang;
    localStorage.setItem(STORAGE_KEY, targetLang);

    // Update switcher button states
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === targetLang);
    });

    const activeDict = (targetLang === 'en') ? dict : reverseDict;

    // Translate DOM text nodes
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          if (!node.textContent || !node.textContent.trim()) return NodeFilter.FILTER_REJECT;
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          const tag = parent.tagName.toLowerCase();
          if (tag === 'script' || tag === 'style' || tag === 'code' || tag === 'pre') return NodeFilter.FILTER_REJECT;
          if (parent.closest('.lang-switch')) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);

    nodes.forEach(node => {
      const trimmed = node.textContent.trim();
      if (activeDict[trimmed]) {
        // preserve leading/trailing whitespace
        const leading = node.textContent.match(/^\s*/)[0];
        const trailing = node.textContent.match(/\s*$/)[0];
        node.textContent = leading + activeDict[trimmed] + trailing;
      }
    });

    // Translate input placeholders
    document.querySelectorAll('input[placeholder], textarea[placeholder]').forEach(el => {
      const ph = el.getAttribute('placeholder');
      if (ph && activeDict[ph.trim()]) {
        el.setAttribute('placeholder', activeDict[ph.trim()]);
      }
    });
  }

  // Inject language toggle switch into navbar
  function initLangSwitch() {
    const navInner = document.querySelector('.nav-inner');
    if (!navInner) return;

    if (!document.querySelector('.lang-switch')) {
      const switcher = document.createElement('div');
      switcher.className = 'lang-switch';
      switcher.setAttribute('role', 'group');
      switcher.setAttribute('aria-label', 'Language selection');
      switcher.innerHTML = `
        <button type="button" class="lang-btn ${currentLang === 'ko' ? 'active' : ''}" data-lang="ko" title="한국어">KO</button>
        <span class="lang-sep">|</span>
        <button type="button" class="lang-btn ${currentLang === 'en' ? 'active' : ''}" data-lang="en" title="English">EN</button>
      `;

      // place right next to GitHub link or at the end
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
          applyLanguage(target);
        }
      });
    }
  }

  // Initialize on DOMContentLoaded or immediately
  function start() {
    const initialLang = getPreferredLang();
    initLangSwitch();
    if (initialLang === 'en') {
      applyLanguage('en');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
