import type { Problem } from '@/types'

export const testingProblems: Problem[] = [
  // ─── fundamentals ────────────────────────────────────────────────────────────

  {
    id: 'test-q-001',
    category: 'testing',
    subcategory: 'fundamentals',
    type: 'multiple-choice',
    difficulty: 'easy',
    title: '테스트 피라미드 — 올바른 비율',
    description: '실무에서 권장하는 테스트 피라미드의 비율과 이유로 가장 올바른 것은?',
    options: [
      'E2E 테스트를 가장 많이 작성해야 신뢰성이 높아진다',
      '단위 테스트(Unit) > 통합 테스트(Integration) > E2E 순으로 작성하고, 위로 갈수록 수가 적어진다',
      '통합 테스트만으로 충분하다 — 단위 테스트는 과도한 세부사항을 테스트한다',
      '세 레이어를 동일한 비율로 유지해야 균형 잡힌 테스트가 된다',
    ],
    correctAnswer: 1,
    explanation:
      '테스트 피라미드(Unit > Integration > E2E)는 빠르고 값싼 테스트를 많이, 느리고 비싼 테스트를 적게 두는 전략입니다. E2E는 브라우저 실행이 필요해 느리고 불안정(flaky)합니다. 단위 테스트는 격리된 환경에서 밀리초 단위로 실행되며, 문제 원인도 즉시 파악됩니다. Kent C. Dodds의 "Testing Trophy"는 통합 테스트를 조금 더 강조하지만 기본 방향은 동일합니다.',
    hints: ['속도와 비용을 함께 생각하면 답이 나옵니다'],
    deepDive:
      '테스트 피라미드 실무 적용:\n```\n         /\\\n        /  \\  E2E (적게: Playwright, Cypress)\n       /----\\\n      /      \\  Integration (보통: RTL + MSW, Supertest)\n     /--------\\\n    /          \\  Unit (많이: Vitest, Jest)\n   /____________\\\n```\n\n각 레이어 특성:\n\n**Unit (단위)**\n- 함수 하나, 컴포넌트 하나를 격리해서 테스트\n- 외부 의존성은 mock 처리\n- 실행 속도: < 1ms\n- 예: 유틸 함수, 커스텀 훅(renderHook), 순수 컴포넌트\n\n**Integration (통합)**\n- 여러 컴포넌트/모듈이 함께 작동하는지 테스트\n- MSW로 API를 모킹하여 실제 네트워크 요청처럼 처리\n- 실행 속도: 수십ms~수백ms\n- 예: 로그인 폼 제출 → API 호출 → 성공 메시지 확인\n\n**E2E (종단간)**\n- 실제 브라우저에서 사용자 흐름 전체를 테스트\n- 실행 속도: 수초\n- 예: 회원가입 → 로그인 → 상품 구매 → 결제 완료\n\n```typescript\n// 좋은 Integration 테스트 예시 (RTL + MSW)\ntest("로그인 성공 시 대시보드로 이동", async () => {\n  // MSW가 POST /auth/login을 가로채서 200 응답\n  render(<LoginPage />)\n  await userEvent.type(screen.getByLabelText("이메일"), "user@test.com")\n  await userEvent.type(screen.getByLabelText("비밀번호"), "password123")\n  await userEvent.click(screen.getByRole("button", { name: "로그인" }))\n  expect(await screen.findByText("대시보드")).toBeInTheDocument()\n})\n```',
    relatedProblems: ['test-q-002', 'test-q-003'],
  },
  {
    id: 'test-q-002',
    category: 'testing',
    subcategory: 'fundamentals',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'Mock vs Stub vs Spy — 차이점',
    description: '다음 중 Mock, Stub, Spy의 차이를 올바르게 설명한 것은?',
    options: [
      'Mock은 반환값을 지정하고, Stub은 호출 여부를 검증하고, Spy는 전체를 교체한다',
      'Stub은 사전 정의된 반환값만 제공하고, Spy는 실제 구현을 유지하며 호출 추적, Mock은 호출 기대값까지 검증한다',
      'Mock, Stub, Spy는 Vitest에서 모두 vi.fn()으로 동일하게 만들어지므로 차이가 없다',
      'Spy는 오직 클래스의 메서드에만 사용하고, Stub은 함수에만, Mock은 모듈에만 사용한다',
    ],
    correctAnswer: 1,
    explanation:
      'Martin Fowler의 구분에 따르면: Stub은 테스트 대상에게 고정된 응답을 주는 대역(ex: API가 항상 { name: "test" }를 반환). Spy는 실제 구현을 실행하면서 호출 여부·인자를 기록. Mock은 "어떻게 호출되어야 하는가"에 대한 사전 기대값을 포함하며 검증까지 담당. Vitest에서는 vi.fn(), vi.spyOn() 등으로 이 개념들을 구현합니다.',
    hints: ['실제 코드 실행 여부가 Spy와 Stub을 가르는 핵심 차이입니다'],
    deepDive:
      '```typescript\nimport { vi, expect, test } from "vitest"\nimport * as emailService from "./emailService"\n\n// ─── Stub: 반환값만 지정, 실제 구현 없음\nconst getUser = vi.fn().mockResolvedValue({ id: 1, name: "Alice" })\n// → 항상 { id: 1, name: "Alice" }를 반환하는 가짜 함수\n\n// ─── Spy: 실제 구현 유지 + 호출 추적\nconst sendEmailSpy = vi.spyOn(emailService, "sendEmail")\n// → emailService.sendEmail 실제 로직이 실행되고, 호출 여부도 추적\ntest("이메일이 발송된다", async () => {\n  await registerUser("alice@test.com")\n  expect(sendEmailSpy).toHaveBeenCalledWith(\n    "alice@test.com",\n    expect.stringContaining("환영합니다")\n  )\n})\n\n// ─── Mock: 모듈 전체를 대체\nvi.mock("./emailService", () => ({\n  sendEmail: vi.fn().mockResolvedValue({ success: true }),\n}))\n// → emailService 모듈 전체가 대체됨, 실제 이메일 발송 없음\n\n// 실무 선택 기준:\n// - 외부 API/DB → Mock (실제 호출 차단)\n// - 함수 호출 여부 검증 → Spy (실제 동작 유지)\n// - 의존성에 고정값 주입 → Stub (반환값만 필요)\n```',
    relatedProblems: ['test-q-001', 'test-q-007'],
  },
  {
    id: 'test-q-003',
    category: 'testing',
    subcategory: 'fundamentals',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: '커버리지의 함정 — 100% 커버리지의 의미',
    description: '코드 커버리지 100%를 달성한 테스트에 대한 설명으로 가장 올바른 것은?',
    options: [
      '100% 커버리지는 버그가 없음을 보장한다',
      '커버리지 100%는 모든 코드가 실행되었음을 의미하지만, 올바르게 동작함을 보장하지는 않는다',
      '커버리지 80% 이상이면 프로덕션 배포에 충분하다',
      '라인 커버리지보다 스테이트먼트 커버리지가 항상 더 정확하다',
    ],
    correctAnswer: 1,
    explanation:
      '커버리지는 "어떤 코드가 실행되었는가"를 측정하지, "올바르게 작동하는가"를 측정하지 않습니다. assertion 없이 코드를 실행만 해도 커버리지는 올라갑니다. 높은 커버리지보다 "의미 있는 assertion"이 중요합니다. 실무에서는 80~90%를 목표로 하되, 핵심 비즈니스 로직(결제, 인증)은 100% 가까이 유지합니다.',
    hints: ['expect()가 없어도 커버리지는 올라갑니다'],
    deepDive:
      '```typescript\n// 커버리지 함정 예시\nfunction divide(a: number, b: number) {\n  if (b === 0) throw new Error("0으로 나눌 수 없습니다")\n  return a / b\n}\n\n// 나쁜 테스트 (커버리지는 100%지만 버그를 잡지 못함)\ntest("divide", () => {\n  divide(10, 2)  // 실행은 됨, assertion 없음\n  divide(10, 0)  // 에러 던지는 분기도 실행됨\n})\n// 커버리지: 100% ← 하지만 의미 없음!\n\n// 좋은 테스트\ntest("divide: 정상 나눗셈", () => {\n  expect(divide(10, 2)).toBe(5)\n})\ntest("divide: 0으로 나누면 에러", () => {\n  expect(() => divide(10, 0)).toThrow("0으로 나눌 수 없습니다")\n})\n\n// vitest.config.ts — 커버리지 임계값 설정\nexport default defineConfig({\n  test: {\n    coverage: {\n      provider: "v8",\n      thresholds: {\n        lines: 80,\n        functions: 80,\n        branches: 70,  // 분기 커버리지는 조금 낮게\n        statements: 80,\n      },\n      // 핵심 비즈니스 로직 파일은 별도 임계값\n      perFile: true,\n    },\n  },\n})\n\n// 커버리지 종류:\n// - Line: 실행된 줄 수\n// - Statement: 실행된 구문 수 (한 줄에 여러 구문 가능)\n// - Branch: if/else, 삼항 연산자 각 분기\n// - Function: 호출된 함수 수\n// → Branch 커버리지가 실제로 가장 의미 있음\n```',
    relatedProblems: ['test-q-001', 'test-q-002'],
  },

  // ─── rtl ─────────────────────────────────────────────────────────────────────

  {
    id: 'test-q-004',
    category: 'testing',
    subcategory: 'rtl',
    type: 'multiple-choice',
    difficulty: 'easy',
    title: 'RTL 쿼리 우선순위 — getByRole이 왜 최우선인가',
    description: 'React Testing Library에서 요소를 찾는 쿼리의 권장 우선순위로 올바른 것은?',
    options: [
      'getByTestId > getByRole > getByText > getByPlaceholderText',
      'getByRole > getByLabelText > getByPlaceholderText > getByText > getByTestId',
      'getByClassName > getByRole > getByText > getByTestId',
      '모든 쿼리는 동일하며, 가장 편한 것을 사용하면 된다',
    ],
    correctAnswer: 1,
    explanation:
      'RTL은 "사용자가 요소를 찾는 방식"에 가장 가까운 쿼리를 권장합니다. getByRole은 ARIA 역할로 요소를 찾아 접근성(a11y)도 자동으로 검증됩니다. getByTestId는 구현 세부사항(data-testid 속성)에 의존하므로 최후 수단입니다. 버튼은 getByRole("button", { name: "제출" }), 입력창은 getByRole("textbox")처럼 사용합니다.',
    hints: ['접근성과 테스트 원칙은 같은 방향을 가리킵니다'],
    deepDive:
      '```typescript\n// RTL 공식 쿼리 우선순위 (높음 → 낮음)\n// 1. getByRole (ARIA role + accessible name)\n// 2. getByLabelText (form 요소)\n// 3. getByPlaceholderText\n// 4. getByText\n// 5. getByDisplayValue\n// 6. getByAltText (이미지)\n// 7. getByTitle\n// 8. getByTestId (최후 수단)\n\n// 나쁜 예 — 구현 세부사항에 의존\nconst btn = screen.getByTestId("submit-btn")\nconst input = container.querySelector(".email-input")\n\n// 좋은 예 — 사용자 관점\nconst btn = screen.getByRole("button", { name: /제출/i })\nconst emailInput = screen.getByRole("textbox", { name: /이메일/i })\nconst passwordInput = screen.getByLabelText("비밀번호")\nconst checkbox = screen.getByRole("checkbox", { name: /자동 로그인/i })\n\n// Next.js 컴포넌트 예시\ntest("제출 버튼 클릭 시 API 호출", async () => {\n  render(<ContactForm />)\n  await userEvent.type(screen.getByRole("textbox", { name: /이름/i }), "홍길동")\n  await userEvent.click(screen.getByRole("button", { name: /문의 보내기/i }))\n  expect(await screen.findByText(/전송 완료/i)).toBeInTheDocument()\n})\n\n// getByRole로 찾을 수 있는 ARIA roles:\n// button, link, heading (level 지정 가능), img, checkbox,\n// radio, combobox, textbox, listbox, dialog, alert, ...\n```',
    relatedProblems: ['test-q-005', 'test-q-006'],
  },
  {
    id: 'test-q-005',
    category: 'testing',
    subcategory: 'rtl',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'userEvent vs fireEvent — 차이와 선택 기준',
    description: 'React Testing Library에서 userEvent와 fireEvent의 차이로 올바른 것은?',
    options: [
      'userEvent는 구식이고 fireEvent가 최신 권장 API다',
      'fireEvent는 실제 브라우저 이벤트 시퀀스를 시뮬레이션하고, userEvent는 단순한 이벤트 디스패치다',
      'userEvent는 실제 사용자 상호작용(focus, hover, keydown/up 등 전체 이벤트 시퀀스)을 시뮬레이션하고, fireEvent는 단일 이벤트만 발생시킨다',
      'userEvent와 fireEvent는 내부 구현만 다를 뿐 결과는 항상 동일하다',
    ],
    correctAnswer: 2,
    explanation:
      'userEvent는 실제 브라우저에서 발생하는 전체 이벤트 시퀀스를 재현합니다. 타이핑 시 pointerover → focus → keydown → keypress → input → keyup 순서로 발생합니다. fireEvent.click()은 click 이벤트 하나만 발생시킵니다. 실무에서는 userEvent를 기본으로 사용하고, 복잡한 이벤트 제어가 필요할 때만 fireEvent를 사용합니다.',
    hints: ['실제 사람이 버튼을 클릭할 때 몇 개의 이벤트가 발생하는지 생각해보세요'],
    deepDive:
      '```typescript\nimport userEvent from "@testing-library/user-event"\nimport { fireEvent, render, screen } from "@testing-library/react"\n\n// userEvent 기본 설정 (v14+)\nconst user = userEvent.setup()\n\ntest("userEvent — 실제 사용자처럼 동작", async () => {\n  render(<SearchInput />)\n  const input = screen.getByRole("textbox")\n\n  // 실제로 발생하는 이벤트 시퀀스:\n  // pointerover, pointerenter, mouseover, mouseenter,\n  // pointermove, mousemove, pointerdown, mousedown,\n  // focus, focusin, pointerup, mouseup, click\n  await user.click(input)\n\n  // 각 글자마다 keydown, keypress, input, keyup 발생\n  await user.type(input, "React")\n  expect(input).toHaveValue("React")\n\n  // Tab 키도 자연스럽게 처리\n  await user.tab()\n})\n\ntest("fireEvent — 단일 이벤트 발생", () => {\n  render(<SearchInput />)\n  const input = screen.getByRole("textbox")\n\n  // click 이벤트 하나만 발생 (focus, mousedown 등 없음)\n  fireEvent.click(input)\n\n  // input 이벤트 직접 발생\n  fireEvent.change(input, { target: { value: "React" } })\n})\n\n// 언제 fireEvent를 쓰나?\n// - 특정 이벤트 객체 속성이 필요할 때\nfireEvent.keyDown(input, { key: "Enter", code: "Enter", keyCode: 13 })\n// - drag & drop 이벤트 시뮬레이션\nfireEvent.dragStart(element, { dataTransfer: mockDataTransfer })\n```',
    relatedProblems: ['test-q-004', 'test-q-006'],
  },
  {
    id: 'test-q-006',
    category: 'testing',
    subcategory: 'rtl',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'waitFor vs findBy — 비동기 처리 선택',
    description: 'RTL에서 비동기 요소를 기다릴 때 waitFor와 findBy의 올바른 사용 방법은?',
    options: [
      'waitFor와 findBy는 동일하므로 아무거나 사용해도 된다',
      'findByText는 내부적으로 waitFor(() => getByText())이므로, 단순히 요소가 나타나길 기다릴 때는 findBy가 더 간결하다',
      'waitFor는 항상 더 강력하므로 findBy 대신 waitFor를 항상 사용해야 한다',
      'findBy는 SSR 환경에서만 작동하고, waitFor는 CSR에서만 작동한다',
    ],
    correctAnswer: 1,
    explanation:
      'findByXxx는 내부적으로 waitFor + getByXxx를 합친 것입니다. 요소가 DOM에 나타나길 기다릴 때는 findBy를 쓰는 게 더 간결합니다. waitFor는 여러 assertion을 묶어서 기다릴 때, 또는 요소가 사라지길 기다릴 때(waitFor(() => expect(el).not.toBeInTheDocument())) 사용합니다.',
    hints: ['findByText는 await screen.findByText()처럼 async/await와 함께 씁니다'],
    deepDive:
      '```typescript\n// findBy: 요소가 나타날 때까지 기다림 (권장)\ntest("로딩 후 데이터 표시", async () => {\n  render(<UserList />)\n  // 로딩 스피너가 먼저 보임\n  expect(screen.getByText("로딩 중...")).toBeInTheDocument()\n  // 데이터가 나타날 때까지 기다림 (기본 타임아웃: 1000ms)\n  const user = await screen.findByText("홍길동")\n  expect(user).toBeInTheDocument()\n})\n\n// waitFor: 복잡한 조건 기다림\ntest("폼 제출 후 에러 메시지 사라짐", async () => {\n  render(<LoginForm />)\n  await userEvent.click(screen.getByRole("button", { name: /로그인/ }))\n\n  // 여러 assertion을 하나의 waitFor로 묶기\n  await waitFor(() => {\n    expect(screen.queryByText("에러")).not.toBeInTheDocument()\n    expect(screen.getByText("로그인 성공")).toBeInTheDocument()\n  })\n})\n\n// 흔한 실수 1: waitFor 내부에서 side-effect 발생\n// 나쁜 예 — waitFor 내부에서 userEvent 호출\nawait waitFor(async () => {\n  await userEvent.click(btn) // ← 반복 실행될 수 있음!\n  expect(screen.getByText("완료")).toBeInTheDocument()\n})\n// 좋은 예\nawait userEvent.click(btn)\nawait waitFor(() => {\n  expect(screen.getByText("완료")).toBeInTheDocument()\n})\n\n// 흔한 실수 2: getBy를 await하기\n// 나쁜 예\nconst el = await screen.getByText("제목") // getBy는 동기!\n// 좋은 예\nconst el = await screen.findByText("제목") // async API 사용\n```',
    relatedProblems: ['test-q-004', 'test-q-005', 'test-q-007'],
  },
  {
    id: 'test-q-007',
    category: 'testing',
    subcategory: 'rtl',
    type: 'multiple-choice',
    difficulty: 'hard',
    title: 'renderHook — 커스텀 훅 테스트',
    description: 'React Testing Library의 renderHook을 사용해 커스텀 훅을 테스트하는 방법으로 올바른 것은?',
    options: [
      'renderHook은 클래스 컴포넌트에서만 사용 가능하다',
      'renderHook으로 훅을 렌더링하고, result.current로 반환값에 접근하며, act()로 상태 변경을 감싼다',
      '커스텀 훅은 컴포넌트 없이 직접 호출해서 테스트해야 한다',
      'renderHook은 deprecated되었으므로 더 이상 사용하지 않는다',
    ],
    correctAnswer: 1,
    explanation:
      'renderHook은 훅을 렌더링할 더미 컴포넌트를 자동으로 생성합니다. result.current로 훅의 반환값에 접근하고, 상태 변경이 발생하는 액션은 act()로 감싸야 경고 없이 동작합니다. Context가 필요한 훅은 wrapper 옵션으로 Provider를 주입합니다.',
    hints: ['훅은 리액트 컴포넌트 안에서만 실행 가능하므로 렌더링 컨텍스트가 필요합니다'],
    deepDive:
      '```typescript\nimport { renderHook, act } from "@testing-library/react"\nimport { useCounter } from "./useCounter"\nimport { QueryClient, QueryClientProvider } from "@tanstack/react-query"\n\n// 기본 커스텀 훅 테스트\ntest("useCounter: 증가/감소 동작", () => {\n  const { result } = renderHook(() => useCounter(0))\n\n  expect(result.current.count).toBe(0)\n\n  act(() => {\n    result.current.increment()\n  })\n  expect(result.current.count).toBe(1)\n\n  act(() => {\n    result.current.decrement()\n  })\n  expect(result.current.count).toBe(0)\n})\n\n// Context가 필요한 훅 테스트\nconst createWrapper = () => {\n  const queryClient = new QueryClient({\n    defaultOptions: { queries: { retry: false } },\n  })\n  return ({ children }: { children: React.ReactNode }) => (\n    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>\n  )\n}\n\ntest("useUserQuery: 유저 데이터 페칭", async () => {\n  const { result } = renderHook(() => useUserQuery("user-1"), {\n    wrapper: createWrapper(),\n  })\n\n  // 초기 로딩 상태\n  expect(result.current.isLoading).toBe(true)\n\n  // 데이터가 로드될 때까지 기다림\n  await waitFor(() => {\n    expect(result.current.isSuccess).toBe(true)\n  })\n  expect(result.current.data?.name).toBe("홍길동")\n})\n\n// 비동기 훅 테스트 (실제 NestJS API 연동)\ntest("useSubmitForm: 폼 제출 성공", async () => {\n  const { result } = renderHook(() => useSubmitForm())\n\n  await act(async () => {\n    await result.current.submit({ title: "테스트", content: "내용" })\n  })\n\n  expect(result.current.isSuccess).toBe(true)\n})\n```',
    relatedProblems: ['test-q-002', 'test-q-006'],
  },
  {
    id: 'test-q-008',
    category: 'testing',
    subcategory: 'rtl',
    type: 'multiple-choice',
    difficulty: 'hard',
    title: '구현 세부사항 테스트 금지 원칙',
    description: '다음 중 "구현 세부사항을 테스트하지 말라(Test Implementation Details)"는 RTL 원칙에 어긋나는 테스트는?',
    options: [
      'screen.getByRole("button", { name: /제출/ })로 버튼을 찾는 테스트',
      'component.state.isLoading === true를 직접 확인하는 테스트',
      'screen.findByText("저장 완료")로 성공 메시지를 확인하는 테스트',
      'userEvent.click으로 버튼을 클릭하고 URL이 /dashboard로 변경됨을 확인하는 테스트',
    ],
    correctAnswer: 1,
    explanation:
      'component.state.isLoading은 컴포넌트 내부 상태(구현 세부사항)에 직접 접근하는 것입니다. 리팩토링으로 isLoading 변수명이 isPending으로 바뀌면 테스트가 깨집니다. 사용자는 isLoading 변수를 볼 수 없고, 로딩 스피너나 "로딩 중..." 텍스트를 봅니다. 사용자가 실제로 보는 것을 테스트해야 합니다.',
    hints: ['사용자가 직접 볼 수 없는 것을 테스트하고 있다면 구현 세부사항입니다'],
    deepDive:
      '```typescript\n// 나쁜 예 — 구현 세부사항 테스트\ntest("로딩 중 상태 테스트", () => {\n  const { container } = render(<UserProfile />)\n  // ❌ 내부 state에 직접 접근 (구현 세부사항)\n  expect(component.state.isLoading).toBe(true)\n  // ❌ CSS 클래스명에 의존 (스타일 변경 시 깨짐)\n  expect(container.querySelector(".loading-spinner")).toBeInTheDocument()\n  // ❌ prop 내부값 확인\n  expect(wrapper.props().userId).toBe("123")\n})\n\n// 좋은 예 — 사용자 관점 테스트\ntest("유저 프로필: 로딩 중 스피너 표시", async () => {\n  render(<UserProfile userId="123" />)\n\n  // ✅ 사용자가 실제로 보는 것\n  expect(screen.getByRole("progressbar")).toBeInTheDocument()\n  // 또는\n  expect(screen.getByText("프로필 불러오는 중...")).toBeInTheDocument()\n\n  // ✅ 로딩 완료 후 데이터 표시\n  expect(await screen.findByText("홍길동")).toBeInTheDocument()\n  expect(screen.queryByRole("progressbar")).not.toBeInTheDocument()\n})\n\n// 구현 세부사항 체크리스트:\n// ❌ 컴포넌트 state/ref 직접 접근\n// ❌ 특정 CSS 클래스명\n// ❌ 컴포넌트 메서드 직접 호출\n// ❌ 리덕스 스토어 내부 상태\n// ✅ DOM에 표시되는 텍스트\n// ✅ ARIA role, label\n// ✅ URL 변경\n// ✅ LocalStorage 변화 (observable side effect)\n```',
    relatedProblems: ['test-q-004', 'test-q-007'],
  },

  // ─── msw ─────────────────────────────────────────────────────────────────────

  {
    id: 'test-q-009',
    category: 'testing',
    subcategory: 'msw',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'MSW Handler 구조 — http.get, http.post',
    description: 'MSW(Mock Service Worker) v2의 handler를 작성하는 올바른 방법은?',
    options: [
      'msw.mock("/api/users", { method: "GET", response: usersData })로 작성한다',
      'http.get("/api/users", resolver) 형태로 작성하며, resolver는 HttpResponse를 반환한다',
      'MSW handler는 jest.mock과 함께 사용해야만 동작한다',
      'MSW는 브라우저에서만 동작하므로 Node.js 테스트 환경에서는 사용할 수 없다',
    ],
    correctAnswer: 1,
    explanation:
      'MSW v2에서는 http.get/post/put/delete 등으로 handler를 작성하고, HttpResponse 객체를 반환합니다. 브라우저(Service Worker)와 Node.js(setupServer) 모두에서 동작합니다. 테스트에서는 setupServer로 서버를 설정하고 beforeAll/afterEach/afterAll에서 lifecycle을 관리합니다.',
    hints: ['MSW v2는 v1과 API가 크게 바뀌었습니다 (rest.get → http.get)'],
    deepDive:
      '```typescript\n// src/mocks/handlers.ts\nimport { http, HttpResponse } from "msw"\n\nexport const handlers = [\n  // GET handler\n  http.get("/api/users", () => {\n    return HttpResponse.json([\n      { id: 1, name: "홍길동", email: "hong@test.com" },\n      { id: 2, name: "김철수", email: "kim@test.com" },\n    ])\n  }),\n\n  // POST handler — request body 파싱\n  http.post("/api/users", async ({ request }) => {\n    const body = await request.json() as { name: string; email: string }\n    return HttpResponse.json(\n      { id: 3, ...body },\n      { status: 201 }\n    )\n  }),\n\n  // Path parameter\n  http.get("/api/users/:id", ({ params }) => {\n    const { id } = params\n    if (id === "999") {\n      return HttpResponse.json(\n        { message: "유저를 찾을 수 없습니다" },\n        { status: 404 }\n      )\n    }\n    return HttpResponse.json({ id, name: "테스트 유저" })\n  }),\n]\n\n// src/mocks/server.ts (Node.js 환경)\nimport { setupServer } from "msw/node"\nexport const server = setupServer(...handlers)\n\n// vitest.setup.ts\nimport { server } from "./src/mocks/server"\nbeforeAll(() => server.listen())\nafterEach(() => server.resetHandlers()) // 테스트별 핸들러 초기화\nafterAll(() => server.close())\n```',
    relatedProblems: ['test-q-010', 'test-q-011'],
  },
  {
    id: 'test-q-010',
    category: 'testing',
    subcategory: 'msw',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'MSW onUnhandledRequest 설정',
    description: 'MSW에서 handler가 없는 요청이 들어올 때의 동작을 설정하는 옵션으로, 실무에서 권장하는 설정은?',
    options: [
      'onUnhandledRequest: "bypass" — 핸들러 없는 요청을 실제 서버로 전달 (기본값, 테스트에서 권장)',
      'onUnhandledRequest: "error" — 핸들러 없는 요청 시 에러를 던져 누락된 mock을 즉시 발견',
      'onUnhandledRequest: "warn" — 경고만 출력하고 계속 진행 (테스트 환경 기본값)',
      '설정할 필요 없다 — MSW는 모든 요청을 자동으로 처리한다',
    ],
    correctAnswer: 1,
    explanation:
      '"error" 설정이 테스트 환경에서 권장됩니다. 핸들러가 누락된 API 요청이 있을 때 즉시 에러를 던져 "어떤 API를 mock하지 않았는지"를 바로 알 수 있습니다. "warn"은 경고만 출력하고 넘어가므로 누락을 놓칠 수 있고, "bypass"는 실제 서버로 요청이 가서 테스트가 외부 의존성을 갖게 됩니다.',
    hints: ['테스트는 외부 의존성이 없어야 하므로 실제 서버 요청을 막아야 합니다'],
    deepDive:
      '```typescript\n// vitest.setup.ts\nimport { server } from "./src/mocks/server"\n\nbeforeAll(() =>\n  server.listen({\n    onUnhandledRequest: "error",\n    // ← 핸들러 없는 요청 → 즉시 에러\n    // 누락된 mock을 바로 발견 가능\n  })\n)\naftereEach(() => server.resetHandlers())\nafterAll(() => server.close())\n\n// 특정 요청만 bypass 허용 (정적 파일 등)\nserver.listen({\n  onUnhandledRequest(request, print) {\n    // 정적 리소스는 무시\n    if (request.url.includes("/_next/")) return\n    // 나머지는 에러\n    print.error()\n  },\n})\n\n// 테스트별로 일시적인 핸들러 추가\ntest("API 에러 시 에러 메시지 표시", async () => {\n  // 이 테스트에서만 에러 응답으로 오버라이드\n  server.use(\n    http.get("/api/users", () => {\n      return HttpResponse.json(\n        { message: "서버 에러" },\n        { status: 500 }\n      )\n    })\n  )\n\n  render(<UserList />)\n  expect(await screen.findByText("데이터를 불러올 수 없습니다")).toBeInTheDocument()\n  // afterEach의 resetHandlers()가 이 핸들러를 자동 제거\n})\n```',
    relatedProblems: ['test-q-009', 'test-q-011'],
  },
  {
    id: 'test-q-011',
    category: 'testing',
    subcategory: 'msw',
    type: 'multiple-choice',
    difficulty: 'hard',
    title: 'MSW로 네트워크 에러 시뮬레이션',
    description: 'MSW를 사용해 실제 네트워크 에러(연결 실패, 타임아웃)를 시뮬레이션하는 올바른 방법은?',
    options: [
      'HttpResponse.json({ error: true }, { status: 500 })으로 네트워크 에러를 시뮬레이션한다',
      'http.NetworkError를 throw하거나 delay(Infinity)로 타임아웃을 시뮬레이션한다',
      'MSW로는 네트워크 에러를 시뮬레이션할 수 없으므로 fetch를 직접 mock해야 한다',
      'status: 0을 반환하면 네트워크 에러처럼 동작한다',
    ],
    correctAnswer: 1,
    explanation:
      'MSW는 HttpResponse.error()로 네트워크 수준 에러를 시뮬레이션합니다. 이는 서버가 응답을 반환한 HTTP 에러(4xx, 5xx)와 다릅니다. 네트워크 에러 시 fetch는 reject되고, React Query의 onError 콜백이 실행됩니다. delay()를 사용해 지연이나 타임아웃도 테스트할 수 있습니다.',
    hints: ['HTTP 500 에러와 네트워크 연결 실패는 다릅니다'],
    deepDive:
      '```typescript\nimport { http, HttpResponse, delay } from "msw"\n\n// 1. 네트워크 에러 (연결 실패)\nhttp.get("/api/users", () => {\n  return HttpResponse.error()\n  // → fetch()가 TypeError: Failed to fetch 로 reject됨\n})\n\n// 2. 타임아웃 시뮬레이션\nhttp.get("/api/slow-endpoint", async () => {\n  await delay(5000) // 5초 지연\n  return HttpResponse.json({ data: "느린 응답" })\n})\n\n// 3. 무한 지연 (로딩 상태 테스트)\nhttp.get("/api/users", async () => {\n  await delay("infinite") // 응답하지 않음\n  return HttpResponse.json([])\n})\n\n// 실제 테스트 예시\ntest("네트워크 에러 시 재시도 버튼 표시", async () => {\n  server.use(\n    http.get("/api/users", () => HttpResponse.error())\n  )\n\n  render(\n    <QueryClientProvider client={queryClient}>\n      <UserList />\n    </QueryClientProvider>\n  )\n\n  // React Query는 기본 3회 재시도, retry: false로 설정 필요\n  expect(await screen.findByText("네트워크 오류가 발생했습니다")).toBeInTheDocument()\n  expect(screen.getByRole("button", { name: /다시 시도/ })).toBeInTheDocument()\n})\n\ntest("로딩 스피너가 지속 표시됨", async () => {\n  server.use(\n    http.get("/api/users", async () => {\n      await delay("infinite")\n      return HttpResponse.json([])\n    })\n  )\n  render(<UserList />)\n  expect(screen.getByRole("progressbar")).toBeInTheDocument()\n})\n```',
    relatedProblems: ['test-q-009', 'test-q-010'],
  },

  // ─── playwright ──────────────────────────────────────────────────────────────

  {
    id: 'test-q-012',
    category: 'testing',
    subcategory: 'playwright',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'Playwright Locator 우선순위',
    description: 'Playwright에서 요소를 찾는 Locator의 권장 우선순위로 올바른 것은?',
    options: [
      'page.locator(".css-class") > page.getByRole() > page.getByTestId()',
      'page.getByRole() > page.getByLabel() > page.getByText() > page.getByTestId()',
      'page.locator("#id") > page.getByRole() > page.getByText()',
      'page.getByTestId()가 가장 안정적이므로 항상 우선 사용한다',
    ],
    correctAnswer: 1,
    explanation:
      'Playwright도 RTL과 동일한 철학을 따릅니다. getByRole()이 ARIA 접근성을 기반으로 하기 때문에 가장 권장됩니다. CSS 선택자나 ID는 구현 변경에 취약합니다. getByTestId()는 data-testid 속성이 필요하므로 코드 침투적입니다. Playwright는 자동으로 요소가 visible하고 enabled 상태가 될 때까지 기다리는 auto-waiting을 제공합니다.',
    hints: ['Playwright와 RTL은 같은 접근성 기반 철학을 공유합니다'],
    deepDive:
      '```typescript\n// playwright.config.ts\nimport { defineConfig } from "@playwright/test"\nexport default defineConfig({\n  use: {\n    baseURL: "http://localhost:3000",\n    // 모든 Locator에 자동 대기 적용\n    actionTimeout: 5000,\n  },\n})\n\n// tests/login.spec.ts\nimport { test, expect } from "@playwright/test"\n\ntest("로그인 성공 → 대시보드 이동", async ({ page }) => {\n  await page.goto("/login")\n\n  // ✅ 권장: getByRole, getByLabel\n  await page.getByLabel("이메일").fill("user@test.com")\n  await page.getByLabel("비밀번호").fill("password123")\n  await page.getByRole("button", { name: "로그인" }).click()\n\n  // 자동 대기: URL이 변경될 때까지 기다림\n  await expect(page).toHaveURL("/dashboard")\n  await expect(page.getByRole("heading", { name: "대시보드" })).toBeVisible()\n})\n\ntest("API 응답 인터셉트", async ({ page }) => {\n  // Playwright도 API 모킹 가능\n  await page.route("/api/users", (route) => {\n    route.fulfill({\n      json: [{ id: 1, name: "테스트 유저" }],\n    })\n  })\n\n  await page.goto("/users")\n  await expect(page.getByText("테스트 유저")).toBeVisible()\n})\n\n// ❌ 피해야 할 Locator\npage.locator(".btn-primary") // CSS 클래스 변경 시 깨짐\npage.locator("#submit")      // ID 변경 시 깨짐\npage.locator("div > span:nth-child(2)") // DOM 구조 변경 시 깨짐\n```',
    relatedProblems: ['test-q-013'],
  },
  {
    id: 'test-q-013',
    category: 'testing',
    subcategory: 'playwright',
    type: 'multiple-choice',
    difficulty: 'hard',
    title: 'page.waitForResponse — API 응답 대기 패턴',
    description: 'Playwright에서 특정 API 응답을 기다려야 할 때 올바른 패턴은?',
    options: [
      'page.waitForTimeout(2000)으로 2초를 기다린다',
      'Promise.all로 action과 waitForResponse를 동시에 시작하여 race condition을 방지한다',
      'await를 두 번 연속 사용하여 action 후 response를 순차적으로 기다린다',
      'page.waitForNavigation()이 모든 API 응답을 자동으로 처리한다',
    ],
    correctAnswer: 1,
    explanation:
      'waitForResponse를 action 이후에 호출하면 응답이 이미 도착한 후에 기다리기 시작해 race condition이 발생합니다. Promise.all로 action 시작과 waitForResponse를 동시에 선언하면 순서에 관계없이 안전하게 기다릴 수 있습니다. page.waitForTimeout은 명시적 sleep이므로 피해야 합니다.',
    hints: ['race condition: 응답이 기다리기 전에 이미 도착하면 영원히 기다립니다'],
    deepDive:
      '```typescript\nimport { test, expect } from "@playwright/test"\n\n// ❌ 나쁜 패턴 — race condition 위험\ntest("나쁜 예: 순차적 대기", async ({ page }) => {\n  await page.goto("/products")\n  await page.getByRole("button", { name: "검색" }).click()\n  // 클릭 후 응답이 이미 도착했을 수 있음!\n  await page.waitForResponse("/api/products") // ← 이미 놓쳤을 수도 있음\n})\n\n// ✅ 좋은 패턴 — Promise.all로 동시 시작\ntest("좋은 예: 동시 시작으로 race condition 방지", async ({ page }) => {\n  await page.goto("/products")\n\n  const [response] = await Promise.all([\n    page.waitForResponse(\n      (res) => res.url().includes("/api/products") && res.status() === 200\n    ),\n    page.getByRole("button", { name: "검색" }).click(),\n    // click과 waitForResponse가 동시에 시작됨\n  ])\n\n  const data = await response.json()\n  expect(data.products).toHaveLength(10)\n})\n\n// 실전 패턴: Next.js App Router 페이지 테스트\ntest("상품 삭제 후 목록 갱신", async ({ page }) => {\n  await page.goto("/admin/products")\n\n  const [deleteResponse] = await Promise.all([\n    page.waitForResponse(\n      (res) => res.url().includes("/api/products/1") && res.request().method() === "DELETE"\n    ),\n    page.getByRole("button", { name: "삭제" }).first().click(),\n    page.getByRole("button", { name: "확인" }).click(),\n  ])\n\n  expect(deleteResponse.status()).toBe(200)\n  await expect(page.getByText("상품 A")).not.toBeVisible()\n})\n\n// waitForURL: 페이지 이동 대기\nawait Promise.all([\n  page.waitForURL("/dashboard"),\n  page.getByRole("button", { name: "로그인" }).click(),\n])\n```',
    relatedProblems: ['test-q-012'],
  },

  // ─── vitest ──────────────────────────────────────────────────────────────────

  {
    id: 'test-q-014',
    category: 'testing',
    subcategory: 'vitest',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'Vitest vs Jest — 핵심 차이점',
    description: 'Vitest와 Jest의 차이점으로 올바른 것은?',
    options: [
      'Vitest는 브라우저 테스트 전용이고 Jest는 Node.js 전용이다',
      'Vitest는 ESM 네이티브 지원과 Vite 설정 공유가 장점이며, vi.mock()은 jest.mock()과 동일한 역할을 한다',
      'Vitest는 TypeScript를 지원하지 않으므로 TypeScript 프로젝트에서는 Jest를 사용해야 한다',
      'Jest는 더 빠른 실행 속도를 제공하므로 대규모 프로젝트에 적합하다',
    ],
    correctAnswer: 1,
    explanation:
      'Vitest는 Vite 기반 프로젝트(Vite, SvelteKit 등)에서 설정 없이 바로 사용할 수 있고, ESM을 네이티브로 지원합니다. Next.js 프로젝트에서도 Vitest를 사용할 수 있습니다. vi.mock()은 jest.mock()과 동일한 역할을 하며, 대부분의 Jest API가 vi 네임스페이스로 호환됩니다. 일반적으로 Vitest가 Jest보다 빠릅니다.',
    hints: ['Vitest는 Vite의 변환 파이프라인을 그대로 활용합니다'],
    deepDive:
      '```typescript\n// vitest.config.ts (Next.js 프로젝트)\nimport { defineConfig } from "vitest/config"\nimport react from "@vitejs/plugin-react"\nimport path from "path"\n\nexport default defineConfig({\n  plugins: [react()],\n  test: {\n    environment: "jsdom",\n    setupFiles: ["./vitest.setup.ts"],\n    globals: true, // describe, test, expect를 import 없이 사용\n    alias: {\n      "@": path.resolve(__dirname, "./src"),\n    },\n  },\n})\n\n// vitest.setup.ts\nimport "@testing-library/jest-dom"\nimport { server } from "./src/mocks/server"\nbeforeAll(() => server.listen({ onUnhandledRequest: "error" }))\nafterEach(() => server.resetHandlers())\nafterAll(() => server.close())\n\n// Jest vs Vitest API 대응표:\n// jest.fn()           → vi.fn()\n// jest.mock()         → vi.mock()\n// jest.spyOn()        → vi.spyOn()\n// jest.useFakeTimers() → vi.useFakeTimers()\n// jest.clearAllMocks() → vi.clearAllMocks()\n\n// ESM 모듈 모킹 (Vitest 장점)\nvi.mock("next/navigation", () => ({\n  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),\n  useSearchParams: () => new URLSearchParams(),\n  usePathname: () => "/",\n}))\n\n// 가짜 타이머 사용\ntest("디바운스 테스트", async () => {\n  vi.useFakeTimers()\n  const debouncedFn = useDebounce(mockFn, 300)\n  debouncedFn("첫 번째 호출")\n  debouncedFn("두 번째 호출") // 이전 호출 취소\n  vi.advanceTimersByTime(300)\n  expect(mockFn).toHaveBeenCalledTimes(1)\n  expect(mockFn).toHaveBeenCalledWith("두 번째 호출")\n  vi.useRealTimers()\n})\n```',
    relatedProblems: ['test-q-015'],
  },
  {
    id: 'test-q-015',
    category: 'testing',
    subcategory: 'vitest',
    type: 'multiple-choice',
    difficulty: 'hard',
    title: 'Vitest setupFiles 활용',
    description: 'Vitest의 setupFiles에서 전역 설정을 할 때 올바른 활용 방법은?',
    options: [
      'setupFiles는 각 테스트 파일 실행 후에 실행되어 정리(cleanup) 작업에 사용한다',
      'setupFiles는 각 테스트 파일 실행 전에 한 번 실행되며, 전역 mock 등록, 환경 설정, 라이브러리 초기화에 사용한다',
      'setupFiles는 beforeEach와 동일하므로 beforeEach 대신 사용하면 된다',
      'setupFiles는 오직 jest-dom 같은 matcher 확장에만 사용할 수 있다',
    ],
    correctAnswer: 1,
    explanation:
      'setupFiles는 각 테스트 파일이 실행되기 전에 한 번 실행됩니다. 전역 mock 등록(MSW 서버 시작, next/navigation 모킹), jest-dom matcher 확장, 환경변수 설정 등에 사용합니다. globalSetup은 모든 테스트 전에 딱 한 번만 실행되는 것으로, setupFiles와 다릅니다.',
    hints: ['setupFiles = 파일 단위 전처리, globalSetup = 전체 테스트 스위트 전처리'],
    deepDive:
      '```typescript\n// vitest.config.ts\nexport default defineConfig({\n  test: {\n    // 각 테스트 파일 실행 전에 실행\n    setupFiles: ["./vitest.setup.ts"],\n    // 전체 테스트 스위트 전에 딱 한 번만\n    globalSetup: "./vitest.global-setup.ts",\n  },\n})\n\n// vitest.setup.ts — 모든 테스트에 적용되는 전역 설정\nimport "@testing-library/jest-dom" // toBeInTheDocument 등 matcher 추가\nimport { server } from "./src/mocks/server"\n\n// MSW 서버 lifecycle\nbeforeAll(() => server.listen({ onUnhandledRequest: "error" }))\nafterEach(() => {\n  server.resetHandlers() // 테스트별 핸들러 초기화\n  vi.clearAllMocks()     // mock 호출 기록 초기화\n})\nafterAll(() => server.close())\n\n// 전역 환경 설정\nObject.defineProperty(window, "matchMedia", {\n  value: vi.fn().mockImplementation((query) => ({\n    matches: false,\n    media: query,\n    addListener: vi.fn(),\n    removeListener: vi.fn(),\n  })),\n})\n\n// Next.js 라우터 전역 모킹\nvi.mock("next/navigation", () => ({\n  useRouter: () => ({\n    push: vi.fn(),\n    replace: vi.fn(),\n    back: vi.fn(),\n    prefetch: vi.fn(),\n  }),\n  usePathname: () => "/",\n  useSearchParams: () => new URLSearchParams(),\n})\n\n// vitest.global-setup.ts — 전체 테스트 전 DB 연결 등\nexport default async function setup() {\n  // 테스트 DB 초기화 (한 번만)\n  process.env.DATABASE_URL = "mongodb://localhost:27017/test"\n}\n\nexport async function teardown() {\n  // 전체 테스트 후 정리\n}\n```',
    relatedProblems: ['test-q-014', 'test-q-009'],
  },
]
