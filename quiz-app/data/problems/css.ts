import type { Problem } from '@/types'

export const cssProblems: Problem[] = [
  // ─── Flexbox 기초 ───
  {
    id: 'css-001',
    category: 'css',
    subcategory: 'Flexbox',
    type: 'css-visual',
    difficulty: 'easy',
    title: 'Flexbox 가로 정렬',
    description: '3개의 박스를 가로로 나란히 배치하고, 사이에 균등한 간격을 넣어보세요.',
    code: `<div class="container">
  <div class="box">A</div>
  <div class="box">B</div>
  <div class="box">C</div>
</div>`,
    correctAnswer: `.container {
  display: flex;
  justify-content: space-between;
}
.box {
  width: 80px;
  height: 80px;
  background: #89b4fa;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}`,
    explanation: `display: flex로 플렉스 컨테이너를 만들고, justify-content: space-between으로 요소 사이에 균등한 간격을 배치합니다.
space-between은 첫 요소를 시작점, 마지막 요소를 끝점에 놓고 나머지 공간을 균등 분배합니다.`,
    hints: ['display: flex를 먼저 설정하세요', 'justify-content 속성을 사용하세요', '각 박스에 width/height를 지정하세요'],
  },
  {
    id: 'css-002',
    category: 'css',
    subcategory: 'Flexbox',
    type: 'css-visual',
    difficulty: 'easy',
    title: 'Flexbox 세로 가운데 정렬',
    description: '박스를 컨테이너의 정중앙에 배치하세요. 컨테이너 높이는 300px입니다.',
    code: `<div class="container">
  <div class="box">Center</div>
</div>`,
    correctAnswer: `.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  border: 1px dashed #585b70;
}
.box {
  width: 100px;
  height: 100px;
  background: #a6e3a1;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #1e1e2e;
}`,
    explanation: `가로 중앙: justify-content: center, 세로 중앙: align-items: center.
이 두 속성을 함께 사용하면 완벽한 중앙 정렬이 됩니다. 컨테이너에 명시적 높이가 필요합니다.`,
    hints: ['컨테이너에 display: flex와 height를 설정하세요', 'justify-content와 align-items 모두 center로'],
  },
  {
    id: 'css-003',
    category: 'css',
    subcategory: 'Flexbox',
    type: 'css-visual',
    difficulty: 'medium',
    title: 'Navbar 레이아웃',
    description: '왼쪽에 로고, 오른쪽에 메뉴 버튼들이 있는 네비게이션 바를 만드세요.',
    code: `<nav class="navbar">
  <div class="logo">MyApp</div>
  <div class="menu">
    <a class="link">Home</a>
    <a class="link">About</a>
    <a class="link">Contact</a>
  </div>
</nav>`,
    correctAnswer: `.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: #313244;
  border-radius: 12px;
}
.logo {
  font-size: 20px;
  font-weight: bold;
  color: #cba6f7;
}
.menu {
  display: flex;
  gap: 16px;
}
.link {
  color: #bac2de;
  text-decoration: none;
  font-size: 14px;
  cursor: pointer;
}`,
    explanation: `Navbar 패턴: 외부 flex로 로고/메뉴를 양쪽 끝에 배치(space-between), 내부 flex(menu)로 링크들을 가로 정렬.
gap 속성으로 링크 간 간격을 깔끔하게 처리합니다.`,
    hints: ['navbar에 display: flex + space-between', 'menu도 별도의 flex 컨테이너로', 'gap으로 링크 간격 조정'],
  },

  // ─── Grid ───
  {
    id: 'css-004',
    category: 'css',
    subcategory: 'Grid',
    type: 'css-visual',
    difficulty: 'easy',
    title: '2x2 그리드 카드',
    description: '4개의 카드를 2열 2행 그리드로 배치하세요. 카드 사이 간격은 12px.',
    code: `<div class="grid">
  <div class="card">1</div>
  <div class="card">2</div>
  <div class="card">3</div>
  <div class="card">4</div>
</div>`,
    correctAnswer: `.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.card {
  background: #45475a;
  padding: 24px;
  border-radius: 8px;
  text-align: center;
  font-weight: bold;
  color: #f5e0dc;
}`,
    explanation: `display: grid + grid-template-columns: 1fr 1fr로 동일 너비의 2열 그리드를 만듭니다.
1fr은 사용 가능한 공간을 1:1로 나누는 단위입니다. gap으로 카드 간 간격을 설정합니다.`,
    hints: ['display: grid를 사용하세요', 'grid-template-columns로 열 수를 정의', 'gap으로 간격 설정'],
  },
  {
    id: 'css-005',
    category: 'css',
    subcategory: 'Grid',
    type: 'css-visual',
    difficulty: 'medium',
    title: '대시보드 레이아웃',
    description: '상단에 전체 너비 헤더, 그 아래 사이드바(1/3) + 메인(2/3) 레이아웃을 만드세요.',
    code: `<div class="dashboard">
  <header class="header">Dashboard</header>
  <aside class="sidebar">Menu</aside>
  <main class="main">Content</main>
</div>`,
    correctAnswer: `.dashboard {
  display: grid;
  grid-template-columns: 1fr 2fr;
  grid-template-rows: auto 1fr;
  gap: 12px;
  height: 300px;
}
.header {
  grid-column: 1 / -1;
  background: #585b70;
  padding: 16px;
  border-radius: 8px;
  font-weight: bold;
}
.sidebar {
  background: #45475a;
  padding: 16px;
  border-radius: 8px;
}
.main {
  background: #313244;
  padding: 16px;
  border-radius: 8px;
}`,
    explanation: `grid-column: 1 / -1은 첫 열부터 마지막 열까지 차지하라는 의미입니다.
grid-template-columns: 1fr 2fr로 1:2 비율의 사이드바/메인 레이아웃을 만듭니다.`,
    hints: ['grid-template-columns: 1fr 2fr', '헤더는 grid-column: 1 / -1로 전체 너비', 'grid-template-rows로 행 높이 설정'],
  },

  // ─── 포지셔닝 ───
  {
    id: 'css-006',
    category: 'css',
    subcategory: 'Position',
    type: 'css-visual',
    difficulty: 'medium',
    title: '배지가 있는 아이콘',
    description: '아이콘 오른쪽 상단에 빨간 알림 배지를 position으로 배치하세요.',
    code: `<div class="icon-wrap">
  <div class="icon">B</div>
  <span class="badge">3</span>
</div>`,
    correctAnswer: `.icon-wrap {
  position: relative;
  display: inline-block;
}
.icon {
  width: 48px;
  height: 48px;
  background: #585b70;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 20px;
}
.badge {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 20px;
  height: 20px;
  background: #f38ba8;
  color: white;
  border-radius: 50%;
  font-size: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}`,
    explanation: `부모를 position: relative로, 배지를 position: absolute로 설정하면 부모 기준으로 배치할 수 있습니다.
top/right에 음수값을 주면 부모 바깥으로 약간 튀어나오는 배지 효과를 만들 수 있습니다.`,
    hints: ['부모에 position: relative', '배지에 position: absolute + top/right', 'border-radius: 50%로 원형 배지'],
  },

  // ─── 반응형 ───
  {
    id: 'css-007',
    category: 'css',
    subcategory: 'Responsive',
    type: 'css-visual',
    difficulty: 'medium',
    title: '반응형 카드 그리드',
    description: 'auto-fill과 minmax를 사용해서 카드가 자동으로 줄바꿈되는 반응형 그리드를 만드세요.',
    code: `<div class="cards">
  <div class="card">Card 1</div>
  <div class="card">Card 2</div>
  <div class="card">Card 3</div>
  <div class="card">Card 4</div>
  <div class="card">Card 5</div>
</div>`,
    correctAnswer: `.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
}
.card {
  background: #45475a;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  font-size: 14px;
  color: #cdd6f4;
}`,
    explanation: `repeat(auto-fill, minmax(120px, 1fr))는 CSS Grid의 핵심 반응형 패턴입니다.
auto-fill: 가능한 많은 열을 채우고, minmax(120px, 1fr): 최소 120px ~ 최대 1fr로 유연하게 조절됩니다.
미디어 쿼리 없이도 반응형 레이아웃이 만들어집니다.`,
    hints: ['display: grid 사용', 'grid-template-columns에 repeat() 함수 사용', 'auto-fill과 minmax()를 조합하세요'],
  },

  // ─── 트랜지션/효과 ───
  {
    id: 'css-008',
    category: 'css',
    subcategory: 'Effects',
    type: 'css-visual',
    difficulty: 'easy',
    title: '호버 카드 효과',
    description: '카드에 호버 시 살짝 위로 올라가고 그림자가 생기는 효과를 추가하세요. (목표 화면은 호버 상태입니다)',
    code: `<div class="card">
  <h3 class="title">Feature</h3>
  <p class="desc">Hover me!</p>
</div>`,
    correctAnswer: `.card {
  background: #313244;
  padding: 24px;
  border-radius: 12px;
  border: 1px solid #45475a;
  transition: transform 0.2s, box-shadow 0.2s;
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.3);
}
.title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
}
.desc {
  color: #a6adc8;
  font-size: 14px;
}`,
    explanation: `transform: translateY(-4px)로 위로 이동, box-shadow로 그림자를 추가합니다.
transition 속성으로 부드러운 애니메이션 효과를 줄 수 있습니다.
실제 프로젝트에서는 .card:hover에 이 스타일을 적용합니다.`,
    hints: ['transform: translateY()로 위로 이동', 'box-shadow로 그림자 추가', 'transition으로 부드러운 전환'],
  },

  // ─── 실전 컴포넌트 ───
  {
    id: 'css-009',
    category: 'css',
    subcategory: 'Components',
    type: 'css-visual',
    difficulty: 'hard',
    title: '프로필 카드',
    description: '아바타, 이름, 역할, 액션 버튼이 있는 프로필 카드를 만드세요.',
    code: `<div class="profile-card">
  <div class="avatar">JK</div>
  <h3 class="name">John Kim</h3>
  <p class="role">Frontend Developer</p>
  <button class="btn">Follow</button>
</div>`,
    correctAnswer: `.profile-card {
  background: #313244;
  border-radius: 16px;
  padding: 32px;
  text-align: center;
  border: 1px solid #45475a;
  max-width: 250px;
}
.avatar {
  width: 64px;
  height: 64px;
  background: #cba6f7;
  color: #1e1e2e;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 20px;
  margin: 0 auto 16px;
}
.name {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 4px;
}
.role {
  color: #a6adc8;
  font-size: 14px;
  margin-bottom: 20px;
}
.btn {
  background: #89b4fa;
  color: #1e1e2e;
  border: none;
  padding: 8px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  font-size: 14px;
}`,
    explanation: `프로필 카드 패턴: text-align: center로 전체 중앙 정렬, 아바타는 border-radius: 50% + margin: 0 auto로 원형 중앙 배치.
실제 피그마에서 이런 카드를 자주 볼 수 있으며, spacing(margin/padding)과 typography 설정이 핵심입니다.`,
    hints: ['text-align: center로 전체 중앙 정렬', '아바타: border-radius: 50% + margin: 0 auto', '버튼에 padding, border-radius, background 설정'],
  },
  {
    id: 'css-010',
    category: 'css',
    subcategory: 'Components',
    type: 'css-visual',
    difficulty: 'hard',
    title: '가격표 카드',
    description: '플랜 이름, 가격, 기능 목록, CTA 버튼이 있는 가격표 카드를 만드세요.',
    code: `<div class="pricing">
  <h3 class="plan">Pro</h3>
  <div class="price">$29<span class="period">/mo</span></div>
  <ul class="features">
    <li>Unlimited projects</li>
    <li>Priority support</li>
    <li>Custom domain</li>
  </ul>
  <button class="cta">Get Started</button>
</div>`,
    correctAnswer: `.pricing {
  background: #313244;
  border-radius: 16px;
  padding: 32px;
  border: 1px solid #45475a;
  max-width: 280px;
}
.plan {
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: #a6adc8;
  margin-bottom: 8px;
}
.price {
  font-size: 40px;
  font-weight: bold;
  margin-bottom: 24px;
}
.period {
  font-size: 16px;
  color: #6c7086;
  font-weight: normal;
}
.features {
  list-style: none;
  margin-bottom: 24px;
}
.features li {
  padding: 8px 0;
  border-bottom: 1px solid #45475a;
  font-size: 14px;
  color: #bac2de;
}
.cta {
  width: 100%;
  padding: 12px;
  background: #a6e3a1;
  color: #1e1e2e;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  font-size: 15px;
  cursor: pointer;
}`,
    explanation: `가격표 패턴의 핵심:
1. Typography 계층: plan(작은 대문자) → price(큰 볼드) → period(작은 회색)
2. features: list-style: none + border-bottom으로 깔끔한 구분선
3. CTA 버튼: width: 100%로 전체 너비 + 눈에 띄는 색상
피그마에서 이런 패턴을 보면 font-size, spacing, color 계층을 먼저 파악하세요.`,
    hints: [
      'plan: text-transform: uppercase + letter-spacing',
      'features: list-style: none + border-bottom',
      'CTA: width: 100% + 눈에 띄는 background color',
    ],
  },
]
