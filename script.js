/**
 * Google Style Start Homepage - Main Script
 * Features:
 *  - Real-time Seoul & Jeju Weather via Open-Meteo API
 *  - Google Search & 'I'm Feeling Lucky' integration
 *  - Inspirational Wise Quotes with copy & refresh
 *  - Custom shortcuts with LocalStorage persistence
 *  - Real-time clock and Korean date
 *  - Dark / Light mode toggle
 *  - Google apps dropdown menu & voice/lens search effects
 */

// ==========================================================================
// 1. Data & Quotes Collection (명언 모음)
// ==========================================================================
const QUOTES = [
  {
    text: "오늘 걷지 않으면 내일은 뛰어야 한다.",
    translation: "If you don't walk today, you'll have to run tomorrow.",
    author: "카를레스 푸욜",
    category: "성장"
  },
  {
    text: "인생에서 가장 큰 영광은 결코 넘어지지 않는 것이 아니라, 넘어질 때마다 일어서는 데 있다.",
    translation: "The greatest glory in living lies not in never falling, but in rising every time we fall.",
    author: "넬슨 만델라",
    category: "도전"
  },
  {
    text: "당신이 할 수 있다고 믿든, 할 수 없다고 믿든, 믿는 대로 될 것이다.",
    translation: "Whether you think you can, or you think you can't – you're right.",
    author: "헨리 포드",
    category: "믿음"
  },
  {
    text: "시작이 반이다. 일단 첫 발을 내딛어라.",
    translation: "Well begun is half done.",
    author: "아리스토텔레스",
    category: "실천"
  },
  {
    text: "어제와 똑같이 살면서 다른 미래를 기대하는 것은 정신병 초기 증세이다.",
    translation: "Insanity is doing the same thing over and over again and expecting different results.",
    author: "알베르트 아인슈타인",
    category: "변화"
  },
  {
    text: "미래를 예측하는 가장 좋은 방법은 미래를 직접 창조하는 것이다.",
    translation: "The best way to predict the future is to create it.",
    author: "피터 드러커",
    category: "창조"
  },
  {
    text: "늘 갈망하고 우직하게 나아가라 (Stay hungry, stay foolish).",
    translation: "Stay hungry, stay foolish.",
    author: "스티브 잡스",
    category: "열정"
  },
  {
    text: "단순함이 궁극의 정교함이다.",
    translation: "Simplicity is the ultimate sophistication.",
    author: "레오나르도 다빈치",
    category: "지혜"
  },
  {
    text: "바람이 불지 않으면 스스로 노를 저어라.",
    translation: "When there is no wind, grab the oars.",
    author: "윈스턴 처칠",
    category: "의지"
  },
  {
    text: "천 리 길도 한 걸음부터 시작된다.",
    translation: "A journey of a thousand miles begins with a single step.",
    author: "노자",
    category: "시작"
  },
  {
    text: "성공의 비결은 결코 포기하지 않고 목적을 향해 나아가는 끈기에 있다.",
    translation: "The secret of success is constancy to purpose.",
    author: "벤저민 디스레일리",
    category: "끈기"
  },
  {
    text: "우리가 두려워해야 할 유일한 것은 두려움 그 자체다.",
    translation: "The only thing we have to fear is fear itself.",
    author: "프랭클린 D. 루스벨트",
    category: "용기"
  },
  {
    text: "행복은 이미 만들어진 완성품이 아니다. 그것은 자신의 행동에서 비롯된다.",
    translation: "Happiness is not something ready made. It comes from your own actions.",
    author: "달라이 라마",
    category: "행복"
  },
  {
    text: "가장 어두운 밤도 언젠가는 끝나고 아침 해는 반드시 떠오른다.",
    translation: "Even the darkest night will end and the sun will rise.",
    author: "빅토르 위고",
    category: "희망"
  },
  {
    text: "작은 기회로부터 종종 위대한 업적이 탄생한다.",
    translation: "Small opportunities are often the beginning of great enterprises.",
    author: "데모스테네스",
    category: "기회"
  },
  {
    text: "배움에는 끝이 없다. 호기심을 잃지 않는 자가 세상을 바꾼다.",
    translation: "Live as if you were to die tomorrow. Learn as if you were to live forever.",
    author: "마하트마 간디",
    category: "배움"
  }
];

// 기본 북마크 바로가기 리스트
const DEFAULT_SHORTCUTS = [
  { id: 'sc-sdu', name: '서울디지털대', url: 'https://www.sdu.ac.kr', iconText: 'SDU', bg: '#003876', isCustom: false },
  { id: 'sc-1', name: '네이버', url: 'https://www.naver.com', iconText: 'N', bg: '#03C75A', isCustom: false },
  { id: 'sc-2', name: 'YouTube', url: 'https://www.youtube.com', iconText: '▶', bg: '#FF0000', isCustom: false },
  { id: 'sc-3', name: '지도', url: 'https://map.naver.com', iconText: '🗺️', bg: '#4285F4', isCustom: false },
  { id: 'sc-4', name: 'GitHub', url: 'https://github.com', iconText: '🐙', bg: '#24292e', isCustom: false },
  { id: 'sc-5', name: 'ChatGPT', url: 'https://chatgpt.com', iconText: '🤖', bg: '#10A37F', isCustom: false },
  { id: 'sc-6', name: '넷플릭스', url: 'https://www.netflix.com/kr', iconText: 'N', bg: '#E50914', isCustom: false }
];

// WMO 날씨 코드 매핑 테이블
const WMO_WEATHER_MAP = {
  0: { label: '맑음', iconDay: '☀️', iconNight: '🌕' },
  1: { label: '대체로 맑음', iconDay: '🌤️', iconNight: '☁️' },
  2: { label: '구름 조금', iconDay: '⛅', iconNight: '☁️' },
  3: { label: '흐림', iconDay: '☁️', iconNight: '☁️' },
  45: { label: '안개', iconDay: '🌫️', iconNight: '🌫️' },
  48: { label: '짙은 안개', iconDay: '🌫️', iconNight: '🌫️' },
  51: { label: '약한 이슬비', iconDay: '🌦️', iconNight: '🌧️' },
  53: { label: '이슬비', iconDay: '🌧️', iconNight: '🌧️' },
  55: { label: '강한 이슬비', iconDay: '🌧️', iconNight: '🌧️' },
  56: { label: '어는 이슬비', iconDay: '🌨️', iconNight: '🌨️' },
  57: { label: '강한 어는 이슬비', iconDay: '🌨️', iconNight: '🌨️' },
  61: { label: '약한 비', iconDay: '🌦️', iconNight: '🌧️' },
  63: { label: '보통 비', iconDay: '🌧️', iconNight: '🌧️' },
  65: { label: '강한 비', iconDay: '🌧️', iconNight: '🌧️' },
  66: { label: '어는 비', iconDay: '🌨️', iconNight: '🌨️' },
  67: { label: '강한 어는 비', iconDay: '🌨️', iconNight: '🌨️' },
  71: { label: '약한 눈', iconDay: '🌨️', iconNight: '🌨️' },
  73: { label: '보통 눈', iconDay: '❄️', iconNight: '❄️' },
  75: { label: '강한 눈', iconDay: '❄️', iconNight: '❄️' },
  77: { label: '싸락눈', iconDay: '🌨️', iconNight: '🌨️' },
  80: { label: '약한 소나기', iconDay: '🌦️', iconNight: '🌧️' },
  81: { label: '소나기', iconDay: '🌧️', iconNight: '🌧️' },
  82: { label: '강한 소나기', iconDay: '⛈️', iconNight: '⛈️' },
  85: { label: '약한 눈 소나기', iconDay: '🌨️', iconNight: '🌨️' },
  86: { label: '강한 눈 소나기', iconDay: '🌨️', iconNight: '🌨️' },
  95: { label: '뇌우', iconDay: '⚡', iconNight: '⚡' },
  96: { label: '우박 동반 뇌우', iconDay: '⛈️', iconNight: '⛈️' },
  99: { label: '강한 우박 뇌우', iconDay: '⛈️', iconNight: '⛈️' }
};

// ==========================================================================
// 2. Main Controller & State
// ==========================================================================
const App = {
  currentQuoteIndex: 0,
  shortcuts: [],
  weatherTimer: null,
  clockTimer: null,

  init() {
    this.initTheme();
    this.initClock();
    this.initWeather();
    this.initSearch();
    this.initQuotes();
    this.initShortcuts();
    this.initAppsMenu();
    this.initKeyboardShortcuts();
  },

  // ------------------------------------------------------------------------
  // Theme Management (Light / Dark)
  // ------------------------------------------------------------------------
  initTheme() {
    const themeBtn = document.getElementById('themeToggleBtn');
    const savedTheme = localStorage.getItem('google_start_theme');
    const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    this.setTheme(initialTheme);

    themeBtn.addEventListener('click', () => {
      const current = document.body.getAttribute('data-theme');
      const nextTheme = current === 'dark' ? 'light' : 'dark';
      this.setTheme(nextTheme);
      this.showToast(nextTheme === 'dark' ? '🌙 다크 모드로 전환되었습니다.' : '☀️ 라이트 모드로 전환되었습니다.');
    });
  },

  setTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('google_start_theme', theme);
  },

  // ------------------------------------------------------------------------
  // Real-time Clock & Date (실시간 시계)
  // ------------------------------------------------------------------------
  initClock() {
    const updateTime = () => {
      const now = new Date();
      const dateEl = document.getElementById('currentDate');
      const timeEl = document.getElementById('currentTime');

      const days = ['일', '월', '화', '수', '목', '금', '토'];
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const date = String(now.getDate()).padStart(2, '0');
      const dayName = days[now.getDay()];

      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');

      if (dateEl) dateEl.textContent = `${month}월 ${date}일 (${dayName})`;
      if (timeEl) timeEl.textContent = `${hours}:${minutes}:${seconds}`;
    };

    updateTime();
    this.clockTimer = setInterval(updateTime, 1000);
  },

  // ------------------------------------------------------------------------
  // Weather Service (서울 & 제주 날씨)
  // ------------------------------------------------------------------------
  async initWeather() {
    const refreshBtn = document.getElementById('refreshWeatherBtn');
    
    refreshBtn.addEventListener('click', () => {
      refreshBtn.classList.add('spinning');
      this.fetchWeatherData(true).finally(() => {
        setTimeout(() => refreshBtn.classList.remove('spinning'), 600);
      });
    });

    await this.fetchWeatherData(false);

    // 20분마다 자동 갱신
    this.weatherTimer = setInterval(() => {
      this.fetchWeatherData(false);
    }, 20 * 60 * 1000);
  },

  async fetchWeatherData(isManual = false) {
    const statusEl = document.getElementById('weatherLastUpdated');
    if (statusEl) statusEl.textContent = '날씨 정보 수신 중...';

    // 서울 (37.5665, 126.9780), 제주 (33.4996, 126.5312)
    const seoulCoords = { lat: 37.5665, lon: 126.9780 };
    const jejuCoords = { lat: 33.4996, lon: 126.5312 };

    try {
      const [seoulRes, jejuRes] = await Promise.all([
        this.fetchCityWeather(seoulCoords.lat, seoulCoords.lon),
        this.fetchCityWeather(jejuCoords.lat, jejuCoords.lon)
      ]);

      this.updateWeatherUI('seoul', seoulRes);
      this.updateWeatherUI('jeju', jejuRes);

      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      if (statusEl) statusEl.textContent = `${timeStr} 기준 실시간 날씨`;

      if (isManual) {
        this.showToast('🌤️ 서울 및 제주 실시간 날씨가 갱신되었습니다.');
      }
    } catch (err) {
      console.warn('Weather fetch error:', err);
      if (statusEl) statusEl.textContent = '날씨 정보 (기본 데이터)';
      this.useWeatherFallback();
    }
  },

  async fetchCityWeather(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min&timezone=Asia%2FTokyo`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Weather API Error: ${res.status}`);
    return await res.json();
  },

  updateWeatherUI(cityPrefix, data) {
    if (!data || !data.current) return;

    const current = data.current;
    const daily = data.daily || {};

    const temp = Math.round(current.temperature_2m);
    const feelsLike = Math.round(current.apparent_temperature);
    const humidity = current.relative_humidity_2m;
    const windSpeed = (current.wind_speed_10m * (1000 / 3600)).toFixed(1); // km/h to m/s
    const isDay = current.is_day === 1;
    const weatherCode = current.weather_code;

    const weatherInfo = WMO_WEATHER_MAP[weatherCode] || { label: '구름 조금', iconDay: '⛅', iconNight: '☁️' };
    const icon = isDay ? weatherInfo.iconDay : weatherInfo.iconNight;

    const maxTemp = (daily.temperature_2m_max && daily.temperature_2m_max[0] !== undefined)
      ? Math.round(daily.temperature_2m_max[0]) : temp + 3;
    const minTemp = (daily.temperature_2m_min && daily.temperature_2m_min[0] !== undefined)
      ? Math.round(daily.temperature_2m_min[0]) : temp - 4;

    // DOM 업데이트
    const tempEl = document.getElementById(`${cityPrefix}Temp`);
    const iconEl = document.getElementById(`${cityPrefix}Icon`);
    const condEl = document.getElementById(`${cityPrefix}Condition`);
    const feelsEl = document.getElementById(`${cityPrefix}FeelsLike`);
    const minMaxEl = document.getElementById(`${cityPrefix}MinMax`);
    const humEl = document.getElementById(`${cityPrefix}Humidity`);
    const windEl = document.getElementById(`${cityPrefix}Wind`);

    if (tempEl) tempEl.textContent = temp;
    if (iconEl) iconEl.textContent = icon;
    if (condEl) condEl.textContent = weatherInfo.label;
    if (feelsEl) feelsEl.textContent = `체감 ${feelsLike}°C`;
    if (minMaxEl) minMaxEl.textContent = `${maxTemp}° / ${minTemp}°`;
    if (humEl) humEl.textContent = `${humidity}%`;
    if (windEl) windEl.textContent = `${windSpeed} m/s`;
  },

  useWeatherFallback() {
    // 네트워크 실패 시 안정적인 기본값 렌더링
    const fallbackSeoul = {
      current: { temperature_2m: 14, apparent_temperature: 13, relative_humidity_2m: 55, wind_speed_10m: 7.2, is_day: 1, weather_code: 1 },
      daily: { temperature_2m_max: [18], temperature_2m_min: [9] }
    };
    const fallbackJeju = {
      current: { temperature_2m: 19, apparent_temperature: 19, relative_humidity_2m: 65, wind_speed_10m: 10.8, is_day: 1, weather_code: 0 },
      daily: { temperature_2m_max: [22], temperature_2m_min: [15] }
    };
    this.updateWeatherUI('seoul', fallbackSeoul);
    this.updateWeatherUI('jeju', fallbackJeju);
  },

  // ------------------------------------------------------------------------
  // Google Search Engine Module (검색창)
  // ------------------------------------------------------------------------
  initSearch() {
    const form = document.getElementById('searchForm');
    const input = document.getElementById('searchInput');
    const clearBtn = document.getElementById('searchClearBtn');
    const luckyBtn = document.getElementById('btnFeelingLucky');
    const voiceBtn = document.getElementById('voiceSearchBtn');
    const lensBtn = document.getElementById('lensSearchBtn');

    // 입력값 변경 시 X 버튼 표시/숨김
    input.addEventListener('input', () => {
      if (input.value.trim().length > 0) {
        clearBtn.classList.add('visible');
      } else {
        clearBtn.classList.remove('visible');
      }
    });

    // 검색어 지우기 버튼
    clearBtn.addEventListener('click', () => {
      input.value = '';
      clearBtn.classList.remove('visible');
      input.focus();
    });

    // 폼 제출 처리 (URL 형식인지 또는 일반 검색어인지 판단)
    form.addEventListener('submit', (e) => {
      const query = input.value.trim();
      if (!query) {
        e.preventDefault();
        input.focus();
        return;
      }

      // 간단한 URL 패턴 (http://, https:// 또는 도메인 형태)
      const urlPattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/i;
      if (urlPattern.test(query) && !query.includes(' ')) {
        e.preventDefault();
        const destination = query.startsWith('http://') || query.startsWith('https://')
          ? query
          : `https://${query}`;
        window.location.href = destination;
      }
      // 일반 검색어는 form의 기본 action(Google Search)으로 진행
    });

    // I'm Feeling Lucky 버튼
    luckyBtn.addEventListener('click', () => {
      const query = input.value.trim();
      if (query) {
        window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}&btnI=1`;
      } else {
        window.location.href = 'https://www.google.com/doodles';
      }
    });

    // 음성 검색 버튼 (시뮬레이션 및 Web Speech 지원)
    voiceBtn.addEventListener('click', () => {
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = 'ko-KR';
        recognition.interimResults = false;

        voiceBtn.classList.add('listening');
        this.showToast('🎙️ 말씀하세요... 음성을 듣고 있습니다.');

        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          input.value = transcript;
          clearBtn.classList.add('visible');
          voiceBtn.classList.remove('listening');
          this.showToast(`🗣️ 인식됨: "${transcript}"`);
          form.submit();
        };

        recognition.onerror = () => {
          voiceBtn.classList.remove('listening');
          this.showToast('음성 인식 오류가 발생했습니다.');
        };

        recognition.onend = () => {
          voiceBtn.classList.remove('listening');
        };

        recognition.start();
      } else {
        this.showToast('🎤 음성 검색: "Google 오늘 날씨"와 같이 검색어를 말씀해 보세요.');
        input.focus();
      }
    });

    // 렌즈 검색 버튼
    lensBtn.addEventListener('click', () => {
      this.showToast('📷 Google 렌즈: 구글 이미지 검색 페이지로 이동합니다.');
      setTimeout(() => {
        window.open('https://images.google.com', '_blank');
      }, 500);
    });
  },

  // ------------------------------------------------------------------------
  // Wise Quote Module (오늘의 명언)
  // ------------------------------------------------------------------------
  initQuotes() {
    const nextBtn = document.getElementById('nextQuoteBtn');
    const copyBtn = document.getElementById('copyQuoteBtn');

    // 첫 명언 랜덤 선택
    this.currentQuoteIndex = Math.floor(Math.random() * QUOTES.length);
    this.renderQuote(this.currentQuoteIndex, false);

    // 다음 명언 버튼
    nextBtn.addEventListener('click', () => {
      nextBtn.classList.add('active');
      this.currentQuoteIndex = (this.currentQuoteIndex + 1) % QUOTES.length;
      this.renderQuote(this.currentQuoteIndex, true);
      setTimeout(() => nextBtn.classList.remove('active'), 600);
    });

    // 명언 복사 버튼
    copyBtn.addEventListener('click', () => {
      const current = QUOTES[this.currentQuoteIndex];
      const textToCopy = `"${current.text}" - ${current.author}`;
      
      navigator.clipboard.writeText(textToCopy).then(() => {
        this.showToast('📋 명언이 클립보드에 복사되었습니다!');
      }).catch(() => {
        // Fallback copy
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        this.showToast('📋 명언이 복사되었습니다!');
      });
    });
  },

  renderQuote(index, animated = true) {
    const quote = QUOTES[index];
    const bodyEl = document.getElementById('quoteBody');
    const textEl = document.getElementById('quoteText');
    const transEl = document.getElementById('quoteTranslation');
    const authorEl = document.getElementById('quoteAuthor');
    const catEl = document.getElementById('quoteCategory');

    if (!animated) {
      textEl.textContent = `"${quote.text}"`;
      transEl.textContent = quote.translation || '';
      authorEl.textContent = quote.author;
      catEl.textContent = quote.category;
      return;
    }

    bodyEl.classList.add('fade-out');
    setTimeout(() => {
      textEl.textContent = `"${quote.text}"`;
      transEl.textContent = quote.translation || '';
      authorEl.textContent = quote.author;
      catEl.textContent = quote.category;
      bodyEl.classList.remove('fade-out');
    }, 200);
  },

  // ------------------------------------------------------------------------
  // Shortcuts & Bookmarks Module (바로가기 즐겨찾기)
  // ------------------------------------------------------------------------
  initShortcuts() {
    const saved = localStorage.getItem('google_start_shortcuts');
    if (saved) {
      try {
        this.shortcuts = JSON.parse(saved);
        if (!this.shortcuts.some(s => s.url && s.url.includes('sdu.ac.kr'))) {
          this.shortcuts.unshift({ id: 'sc-sdu', name: '서울디지털대', url: 'https://www.sdu.ac.kr', iconText: 'SDU', bg: '#003876', isCustom: false });
        }
      } catch (e) {
        this.shortcuts = [...DEFAULT_SHORTCUTS];
      }
    } else {
      this.shortcuts = [...DEFAULT_SHORTCUTS];
    }

    this.renderShortcuts();
    this.initShortcutModal();
  },

  renderShortcuts() {
    const container = document.getElementById('shortcutsContainer');
    if (!container) return;

    container.innerHTML = '';

    this.shortcuts.forEach((item) => {
      const link = document.createElement('a');
      link.href = item.url;
      link.className = 'shortcut-item';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.title = `${item.name} (${item.url})`;

      // 원형 아이콘
      const circle = document.createElement('div');
      circle.className = 'shortcut-icon-circle';
      if (item.bg) circle.style.borderColor = `${item.bg}40`;

      // 파비콘 시도 or 아이콘 텍스트
      const domain = this.extractDomain(item.url);
      circle.innerHTML = domain 
        ? `<img class="shortcut-favicon" src="https://www.google.com/s2/favicons?domain=${domain}&sz=64" alt="${item.name}" onerror="this.outerHTML='<span>${item.iconText || item.name[0]}</span>'"/>`
        : `<span>${item.iconText || item.name[0]}</span>`;

      // 라벨
      const label = document.createElement('span');
      label.className = 'shortcut-label';
      label.textContent = item.name;

      link.appendChild(circle);
      link.appendChild(label);

      // 커스텀 추가 항목인 경우 삭제 버튼 제공
      if (item.isCustom) {
        const delBtn = document.createElement('button');
        delBtn.type = 'button';
        delBtn.className = 'shortcut-delete-btn';
        delBtn.innerHTML = '&times;';
        delBtn.title = '삭제';
        delBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.deleteShortcut(item.id);
        });
        link.appendChild(delBtn);
      }

      container.appendChild(link);
    });
  },

  extractDomain(url) {
    try {
      const parsed = new URL(url);
      return parsed.hostname;
    } catch {
      return '';
    }
  },

  saveShortcuts() {
    localStorage.setItem('google_start_shortcuts', JSON.stringify(this.shortcuts));
    this.renderShortcuts();
  },

  deleteShortcut(id) {
    this.shortcuts = this.shortcuts.filter(sc => sc.id !== id);
    this.saveShortcuts();
    this.showToast('🗑️ 바로가기가 삭제되었습니다.');
  },

  initShortcutModal() {
    const manageBtn = document.getElementById('shortcutManageBtn');
    const modal = document.getElementById('shortcutModal');
    const closeBtn = document.getElementById('closeModalBtn');
    const cancelBtn = document.getElementById('cancelModalBtn');
    const form = document.getElementById('addShortcutForm');
    const nameInput = document.getElementById('shortcutNameInput');
    const urlInput = document.getElementById('shortcutUrlInput');

    const openModal = () => {
      modal.classList.add('show');
      modal.setAttribute('aria-hidden', 'false');
      nameInput.focus();
    };

    const closeModal = () => {
      modal.classList.remove('show');
      modal.setAttribute('aria-hidden', 'true');
      form.reset();
    };

    if (manageBtn) manageBtn.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = nameInput.value.trim();
      let url = urlInput.value.trim();

      if (!name || !url) return;

      if (!/^https?:\/\//i.test(url)) {
        url = 'https://' + url;
      }

      const newShortcut = {
        id: 'sc-custom-' + Date.now(),
        name,
        url,
        iconText: name.charAt(0),
        isCustom: true
      };

      this.shortcuts.push(newShortcut);
      this.saveShortcuts();
      closeModal();
      this.showToast(`✨ "${name}" 바로가기가 추가되었습니다.`);
    });
  },

  // ------------------------------------------------------------------------
  // Google Apps Popover Menu
  // ------------------------------------------------------------------------
  initAppsMenu() {
    const appsBtn = document.getElementById('googleAppsBtn');
    const dropdown = document.getElementById('appsDropdown');

    appsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = dropdown.classList.contains('show');
      if (isOpen) {
        dropdown.classList.remove('show');
        dropdown.setAttribute('aria-hidden', 'true');
      } else {
        dropdown.classList.add('show');
        dropdown.setAttribute('aria-hidden', 'false');
      }
    });

    document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target) && e.target !== appsBtn) {
        dropdown.classList.remove('show');
        dropdown.setAttribute('aria-hidden', 'true');
      }
    });
  },

  // ------------------------------------------------------------------------
  // Keyboard Shortcuts ('/' 검색창 포커스)
  // ------------------------------------------------------------------------
  initKeyboardShortcuts() {
    const searchInput = document.getElementById('searchInput');

    window.addEventListener('keydown', (e) => {
      // 키가 '/' 이고 다른 텍스트 입력창에 포커스되어 있지 않을 때
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        searchInput.focus();
        searchInput.select();
      }
      // Esc 키로 검색창 포커스 해제 또는 모달 닫기
      if (e.key === 'Escape') {
        const modal = document.getElementById('shortcutModal');
        if (modal.classList.contains('show')) {
          modal.classList.remove('show');
        } else if (document.activeElement === searchInput) {
          searchInput.blur();
        }
      }
    });
  },

  // ------------------------------------------------------------------------
  // Toast Notification
  // ------------------------------------------------------------------------
  showToast(message, duration = 2800) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('fade-out');
      toast.addEventListener('animationend', () => {
        toast.remove();
      });
    }, duration);
  }
};

// DOM 로드 완료 시 애플리케이션 시작
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
