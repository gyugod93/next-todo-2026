import type { Problem } from '@/types'

export const csBasicsProblems: Problem[] = [
  {
    id: 'cs-q-001',
    category: 'cs-basics',
    subcategory: 'event-loop',
    type: 'code-output',
    difficulty: 'medium',
    title: '이벤트 루프 실행 순서',
    description: '다음 코드의 출력 순서는?',
    code: `console.log('A')

setTimeout(() => console.log('B'), 0)

Promise.resolve()
  .then(() => console.log('C'))
  .then(() => console.log('D'))

console.log('E')`,
    options: ['A, E, B, C, D', 'A, E, C, D, B', 'A, B, C, D, E', 'A, C, D, E, B'],
    correctAnswer: 1,
    explanation:
      '출력 순서: A → E → C → D → B. 동기 코드(A, E)가 먼저 실행되고, 콜 스택이 비워지면 마이크로태스크 큐(Promise.then: C, D)를 모두 소진한 뒤, 마지막으로 매크로태스크(setTimeout: B)가 실행됩니다.',
    hints: [
      '동기 코드 → 마이크로태스크(Promise.then) → 매크로태스크(setTimeout) 순서를 떠올리세요',
    ],
    deepDive:
      '이벤트 루프 규칙: ① 콜 스택이 비워지면 ② 마이크로태스크 큐를 전부 소진 (재귀적으로) ③ 매크로태스크 하나 꺼내 실행 ④ 반복. 마이크로태스크: Promise.then/catch/finally, async/await 이후 코드, queueMicrotask(), MutationObserver. 매크로태스크: setTimeout, setInterval, I/O.',
    relatedProblems: ['cs-q-002'],
  },
  {
    id: 'cs-q-002',
    category: 'cs-basics',
    subcategory: 'event-loop',
    type: 'code-output',
    difficulty: 'hard',
    title: 'async/await와 이벤트 루프',
    description: '다음 코드의 출력 순서는?',
    code: `async function foo() {
  console.log('B')
  await Promise.resolve()
  console.log('D')
}

console.log('A')
foo()
console.log('C')`,
    options: ['A, B, C, D', 'A, B, D, C', 'A, C, B, D', 'B, A, C, D'],
    correctAnswer: 0,
    explanation:
      '출력 순서: A → B → C → D. foo()를 호출하면 B가 동기적으로 출력되고, await에서 일시 중단됩니다. 제어권이 돌아와 C가 출력되고, 콜 스택이 비워지면 마이크로태스크로 스케줄된 D가 실행됩니다.',
    hints: ['await는 해당 지점에서 일시 중단되고 제어권을 호출자에게 돌려줍니다'],
    deepDive:
      'async/await는 Promise의 문법적 설탕입니다. await 이후 코드는 .then() 콜백과 동일하게 마이크로태스크 큐에 스케줄됩니다. 즉, await Promise.resolve()는 Promise.resolve().then(() => { /* 이후 코드 */ })와 동일합니다.',
    relatedProblems: ['cs-q-001'],
  },
  {
    id: 'cs-q-003',
    category: 'cs-basics',
    subcategory: 'browser-rendering',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'Reflow vs Repaint',
    description: '다음 CSS 속성 변경 중 Reflow(Layout)가 발생하는 것은?',
    options: [
      'opacity: 0.5 → opacity: 1',
      'transform: translateX(10px)',
      'width: 100px → width: 200px',
      'background-color: red → background-color: blue',
    ],
    correctAnswer: 2,
    explanation:
      'width 변경은 요소의 크기를 변경하므로 Reflow(Layout 재계산)가 발생합니다. opacity와 transform은 Composite only(GPU 처리)로 가장 저렴합니다. background-color 변경은 Repaint만 발생합니다. 성능 순서: Composite(transform, opacity) > Repaint(색상, 배경) > Reflow(크기, 위치).',
    hints: ['크기나 위치가 바뀌면 주변 요소도 다시 계산해야 합니다'],
    deepDive:
      'Layout Thrashing 방지: DOM 읽기(offsetWidth, getBoundingClientRect)와 쓰기(style 변경)를 번갈아 하면 브라우저가 강제로 Layout을 재계산합니다. 읽기를 한 번에 모아서 하고, 쓰기를 한 번에 모아서 하는 패턴으로 방지하거나 requestAnimationFrame을 사용하세요.',
    relatedProblems: ['cs-q-004'],
  },
  {
    id: 'cs-q-004',
    category: 'cs-basics',
    subcategory: 'browser-rendering',
    type: 'multiple-choice',
    difficulty: 'hard',
    title: 'Critical Rendering Path 순서',
    description: '브라우저의 Critical Rendering Path 순서로 올바른 것은?',
    options: [
      'HTML 파싱 → CSS 파싱 → Render Tree → Layout → Paint → Composite',
      'CSS 파싱 → HTML 파싱 → Render Tree → Paint → Layout → Composite',
      'HTML 파싱 → Render Tree → CSS 파싱 → Layout → Paint → Composite',
      'HTML 파싱 → Layout → CSS 파싱 → Render Tree → Paint → Composite',
    ],
    correctAnswer: 0,
    explanation:
      'CRP 순서: HTML 파싱(DOM) → CSS 파싱(CSSOM) → Render Tree 생성(DOM+CSSOM 결합) → Layout(위치/크기 계산) → Paint(픽셀 채우기) → Composite(레이어 합성). CSS는 렌더 블로킹 리소스로, CSSOM이 완성되기 전까지 Render Tree를 만들 수 없습니다.',
    hints: ['DOM과 CSSOM이 모두 준비되어야 Render Tree를 만들 수 있습니다'],
    deepDive:
      '렌더 블로킹 최적화: ① CSS는 <head>에 배치, Critical CSS는 인라인 ② JS는 async/defer 사용 ③ font-display: swap으로 폰트 블로킹 방지 ④ preload로 중요 리소스 조기 로드. display: none 요소는 Render Tree에서 제외되지만 visibility: hidden 요소는 포함됩니다.',
    relatedProblems: ['cs-q-003'],
  },
  {
    id: 'cs-q-005',
    category: 'cs-basics',
    subcategory: 'memory',
    type: 'bug-find',
    difficulty: 'medium',
    title: '메모리 누수 찾기',
    description: '다음 React 컴포넌트에서 메모리 누수가 발생하는 이유는?',
    code: `function DataPoller({ userId }: { userId: string }) {
  const [data, setData] = useState(null)

  useEffect(() => {
    const interval = setInterval(() => {
      fetch(\`/api/user/\${userId}\`)
        .then(r => r.json())
        .then(setData)
    }, 3000)
  }, [userId])

  return <div>{JSON.stringify(data)}</div>
}`,
    options: [
      'useState가 너무 자주 호출되어 메모리가 누수된다',
      'useEffect 클린업 함수가 없어서 컴포넌트 언마운트 후에도 interval이 계속 실행되고 setState를 호출한다',
      'fetch가 Promise를 반환하기 때문에 메모리 누수가 발생한다',
      'userId가 변경될 때마다 이전 interval이 계속 쌓인다는 것은 맞지만 React가 자동으로 정리한다',
    ],
    correctAnswer: 1,
    explanation:
      'useEffect에서 setInterval을 생성했지만 클린업 함수(return () => clearInterval(interval))가 없습니다. 컴포넌트가 언마운트되어도 interval이 계속 실행되고, 이미 사라진 컴포넌트의 setState를 호출해 "Can\'t perform a React state update on an unmounted component" 경고와 함께 메모리 누수가 발생합니다.',
    hints: ['useEffect에서 생성한 것은 useEffect에서 정리해야 합니다'],
    deepDive:
      '수정 코드: useEffect(() => { const interval = setInterval(..., 3000); return () => clearInterval(interval) }, [userId]). 추가로, userId가 변경될 때 이전 fetch가 완료되기 전에 새 fetch가 시작될 수 있으므로 AbortController도 함께 사용하는 것이 좋습니다: const controller = new AbortController(); fetch(url, { signal: controller.signal }); return () => { clearInterval(interval); controller.abort() }',
    relatedProblems: ['cs-q-001'],
  },
  {
    id: 'cs-q-006',
    category: 'cs-basics',
    subcategory: 'algorithms',
    type: 'code-output',
    difficulty: 'medium',
    title: 'Debounce vs Throttle 선택',
    description: '다음 시나리오에서 debounce와 throttle 중 적합한 것은?\n\n시나리오: 사용자가 검색창에 타이핑할 때마다 API를 호출하는 자동완성 기능',
    options: [
      'throttle — 일정 간격마다 API를 호출해야 하므로',
      'debounce — 타이핑이 멈춘 후 N ms 뒤에 API를 한 번만 호출하므로 불필요한 요청을 줄임',
      'throttle — 더 빠른 응답성이 필요하므로',
      'debounce와 throttle 모두 부적합하며 매 입력마다 호출해야 한다',
    ],
    correctAnswer: 1,
    explanation:
      '자동완성 API 호출에는 debounce가 적합합니다. 사용자가 "react"를 입력할 때 r → re → rea → reac → react 각각 API를 호출하면 낭비입니다. debounce를 사용하면 타이핑이 300ms 멈춘 뒤 "react"로 한 번만 호출합니다. throttle은 "스크롤 위치 추적"처럼 연속 이벤트를 일정 간격으로 처리할 때 적합합니다.',
    hints: ['마지막 동작 이후 N ms 기다렸다가 실행 vs N ms마다 최대 1회 실행'],
    deepDive:
      'debounce 사용 사례: 검색 자동완성, 폼 유효성 검사, 윈도우 리사이즈 후 처리. throttle 사용 사례: 스크롤 이벤트, 게임 입력, 마우스 이동 추적, 무한 스크롤 트리거. useDebounce 커스텀 훅: const debouncedValue = useDebounce(searchTerm, 300) — 이 값이 변경될 때만 API 호출.',
    relatedProblems: ['cs-q-005'],
  },

  // ─── Map / Set ──────────────────────────────────────────────────────────────

  {
    id: 'cs-q-007',
    category: 'cs-basics',
    subcategory: 'map-set',
    type: 'multiple-choice',
    difficulty: 'easy',
    title: 'Map vs Object — 언제 Map을 써야 하나',
    description: '다음 중 일반 Object 대신 Map을 사용해야 하는 경우로 가장 적절한 것은?',
    options: [
      'JSON으로 직렬화해서 API로 전송할 데이터를 저장할 때',
      '키의 개수를 자주 확인하고, 키가 문자열이 아닐 수 있으며, 삽입 순서를 보장해야 할 때',
      'React state로 관리하며 컴포넌트에 props로 전달할 때',
      'TypeScript interface로 타입을 정의해야 할 때',
    ],
    correctAnswer: 1,
    explanation:
      'Map이 Object보다 유리한 경우: ① 키 타입이 다양할 때 (객체, 함수, 숫자도 키 가능) ② 크기 확인이 빈번할 때 (map.size vs Object.keys(obj).length) ③ 삽입 순서 보장 필요 시 ④ 잦은 추가/삭제 시 성능 유리. 반면 JSON.stringify는 Map을 지원하지 않아 {} 빈 객체로 직렬화되므로, API 통신 데이터는 Object가 적합합니다.',
    hints: [
      'JSON.stringify(new Map([["a", 1]])) 결과가 "{}"임을 확인해보세요',
      'map.size는 O(1), Object.keys(obj).length는 O(n)입니다',
    ],
    deepDive:
      'Map vs Object 핵심 비교:\n```javascript\n// Object의 키 타입 제한\nconst obj = {}\nconst keyObj = { id: 1 }\nobj[keyObj] = "value"\nconsole.log(Object.keys(obj)) // ["[object Object]"] ← 자동 문자열 변환!\n\n// Map은 모든 타입이 키 가능\nconst map = new Map()\nmap.set(keyObj, "value")\nmap.get(keyObj) // "value" ✅\n\n// 크기 확인\nmap.size                       // O(1) 즉시\nObject.keys(obj).length        // O(n) 키 목록 생성 후\n\n// 순회\nfor (const [k, v] of map) {}   // Map: for...of 직접 지원\nfor (const [k, v] of Object.entries(obj)) {} // Object: 변환 필요\n\n// JSON 직렬화 비교\nJSON.stringify(new Map([["a",1]])) // "{}"  ❌\nJSON.stringify({ a: 1 })           // \'{"a":1}\' ✅\n```\n\n실무 선택:\n• API 데이터, React state → Object\n• 캐시, 빈도 계산, 방문 기록 → Map\n• 중복 제거, 집합 연산 → Set',
    relatedProblems: ['cs-q-008', 'cs-q-009'],
  },
  {
    id: 'cs-q-008',
    category: 'cs-basics',
    subcategory: 'map-set',
    type: 'code-output',
    difficulty: 'medium',
    title: 'Set 출력 결과 — 중복 제거와 집합 연산',
    description: '다음 코드의 출력 결과로 올바른 것은?',
    code: `const a = new Set([1, 2, 3, 4])
const b = new Set([3, 4, 5, 6])

const inter = new Set([...a].filter(x => b.has(x)))
const union = new Set([...a, ...b])
const diff  = new Set([...a].filter(x => !b.has(x)))

console.log([...inter]) // A
console.log([...union]) // B
console.log([...diff])  // C`,
    options: [
      'A: [3, 4]  B: [1, 2, 3, 4, 5, 6]  C: [1, 2]',
      'A: [3, 4]  B: [1, 2, 3, 4, 3, 4, 5, 6]  C: [1, 2]',
      'A: [3, 4, 5]  B: [1, 2, 3, 4, 5, 6]  C: [1, 2, 3]',
      'A: [4]  B: [1, 2, 3, 4, 5, 6]  C: [1, 2, 3]',
    ],
    correctAnswer: 0,
    explanation:
      '교집합(inter): a와 b 모두에 있는 값 → [3, 4]. 합집합(union): Set은 자동 중복 제거이므로 [...a, ...b]에 3,4가 두 번 나와도 Set은 하나만 저장 → [1,2,3,4,5,6]. 차집합(diff): a에만 있고 b에 없는 값 → [1, 2]. [...set]으로 변환 시 삽입 순서가 유지됩니다.',
    hints: [
      'Set([...a, ...b])에서 3, 4가 두 번 들어가지만 Set은 자동 중복 제거합니다',
      'b.has(x)는 O(1) 검색 — 배열 includes보다 빠릅니다',
    ],
    deepDive:
      'Set 핵심 메서드:\n```javascript\nconst s = new Set([1, 2, 2, 3])\ns.size          // 3 (중복 제거)\ns.has(2)        // true — O(1)\ns.add(4)        // Set {1,2,3,4}\ns.delete(2)     // Set {1,3,4}\n\n// 배열 중복 제거 원라이너\nconst unique = [...new Set([1,2,2,3,3])] // [1,2,3]\n\n// has() vs includes() 성능\n// 100만 개 데이터에서:\n// array.includes(x)  → O(n): 최대 100만 번 비교\n// set.has(x)         → O(1): 해시 테이블 즉시 조회\n```\n\nES2024 Set 집합 연산 메서드 (최신):\n```javascript\nconst a = new Set([1,2,3,4])\nconst b = new Set([3,4,5,6])\n\na.intersection(b)  // Set {3,4}   교집합\na.union(b)         // Set {1,2,3,4,5,6} 합집합\na.difference(b)    // Set {1,2}   차집합\na.isSubsetOf(b)    // false\n```',
    relatedProblems: ['cs-q-007', 'cs-q-009'],
  },
  {
    id: 'cs-q-009',
    category: 'cs-basics',
    subcategory: 'map-set',
    type: 'code-output',
    difficulty: 'medium',
    title: 'Map 빈도 계산 패턴 — 출력 결과',
    description: '다음 코드의 출력 결과로 올바른 것은?',
    code: `const words = ['apple', 'banana', 'apple', 'cherry', 'banana', 'apple']
const freq = new Map<string, number>()

for (const word of words) {
  freq.set(word, (freq.get(word) ?? 0) + 1)
}

const result = [...freq.entries()]
  .sort((a, b) => b[1] - a[1])
  .slice(0, 2)
  .map(([word]) => word)

console.log(result)`,
    options: [
      "['apple', 'banana']",
      "['banana', 'apple']",
      "['apple', 'cherry']",
      "['apple', 'banana', 'cherry']",
    ],
    correctAnswer: 0,
    explanation:
      "freq Map: apple→3, banana→2, cherry→1. entries()로 배열화 → b[1]-a[1] 내림차순 정렬 → slice(0,2)로 상위 2개 → map으로 단어만 추출 → ['apple','banana']. freq.get(word) ?? 0 패턴: 처음 등장하는 단어(Map에 없음)는 undefined → ?? 0으로 0으로 처리 후 +1 = 1로 저장합니다.",
    hints: [
      'freq.get(word) ?? 0 — Map에 키가 없으면 undefined, ?? 0으로 0을 기본값으로',
      'sort((a,b) => b[1]-a[1])은 빈도 내림차순입니다',
    ],
    deepDive:
      'Map 빈도 계산 — 알고리즘 문제의 핵심 패턴:\n```typescript\n// 기본 빈도 계산 패턴 (외워두세요)\nconst freq = new Map<string, number>()\nfor (const item of arr) {\n  freq.set(item, (freq.get(item) ?? 0) + 1)\n}\n\n// 응용 1: 가장 많이 등장한 요소\nconst max = [...freq.entries()].reduce(\n  (a, b) => b[1] > a[1] ? b : a\n)\nconsole.log(max[0], max[1]) // "apple", 3\n\n// 응용 2: 딱 한 번만 등장한 요소\nconst unique = [...freq.entries()]\n  .filter(([, count]) => count === 1)\n  .map(([word]) => word)\n\n// 응용 3: Anagram 판별 (문자 빈도가 동일한지)\nfunction isAnagram(s: string, t: string): boolean {\n  if (s.length !== t.length) return false\n  const freq = new Map<string, number>()\n  for (const c of s) freq.set(c, (freq.get(c) ?? 0) + 1)\n  for (const c of t) {\n    const cnt = freq.get(c)\n    if (!cnt) return false\n    freq.set(c, cnt - 1)\n  }\n  return true\n}\n```\n\n이 패턴이 쓰이는 주요 알고리즘:\n• 빈도 기반 정렬 (Top K Frequent)\n• Anagram / 문자 빈도 비교\n• 슬라이딩 윈도우 (윈도우 내 빈도 추적)\n• 중복 감지 (has()로 O(1) 체크)',
    relatedProblems: ['cs-q-007', 'cs-q-010'],
  },
  {
    id: 'cs-q-010',
    category: 'cs-basics',
    subcategory: 'map-set',
    type: 'code-output',
    difficulty: 'hard',
    title: 'Map Two Sum — O(n) vs O(n²) 비교',
    description: '두 구현의 시간복잡도와 출력 결과로 올바른 것은?',
    code: `function twoSumA(nums: number[], target: number): number[] {
  for (let i = 0; i < nums.length; i++)
    for (let j = i + 1; j < nums.length; j++)
      if (nums[i] + nums[j] === target) return [i, j]
  return []
}

function twoSumB(nums: number[], target: number): number[] {
  const seen = new Map<number, number>() // 값 → 인덱스
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i]
    if (seen.has(need)) return [seen.get(need)!, i]
    seen.set(nums[i], i)
  }
  return []
}

console.log(twoSumA([2, 7, 11, 15], 9))
console.log(twoSumB([2, 7, 11, 15], 9))`,
    options: [
      'A: O(n²), B: O(n) / 둘 다 [0, 1] 출력',
      'A: O(n), B: O(n²) / 둘 다 [0, 1] 출력',
      'A: O(n²), B: O(n) / A는 [0,1], B는 [1,0] 출력',
      'A: O(n log n), B: O(n) / 둘 다 [0, 1] 출력',
    ],
    correctAnswer: 0,
    explanation:
      'A: 이중 for문 → O(n²). B: Map 한 번 순회 + has() O(1) → O(n). 결과 추적: nums=[2,7,11,15], target=9. A: i=0,j=1 → 2+7=9 → [0,1]. B: i=0 → need=7, seen={}에 없음 → seen={2:0}. i=1 → need=2, seen.has(2)=true → [seen.get(2)!, 1]=[0,1]. 둘 다 [0,1].',
    hints: [
      'need = target - nums[i] 가 이미 seen에 있으면 정답 쌍입니다',
      'Map.has()는 O(1)이라 전체가 O(n)이 됩니다',
    ],
    deepDive:
      'Two Sum Map 패턴 — 단계별 추적:\n```typescript\n// nums=[2,7,11,15], target=9\n// i=0: need=9-2=7  seen={} → has(7)?No → seen={2:0}\n// i=1: need=9-7=2  seen={2:0} → has(2)?Yes! → [seen.get(2)!,1]=[0,1] ✅\n```\n\nMap을 활용한 O(n) 알고리즘 패턴 모음:\n```typescript\n// 1. 중복 감지\nfunction hasDuplicate(arr: number[]): boolean {\n  return new Set(arr).size !== arr.length\n}\n\n// 2. 두 배열 교집합 O(n+m)\nfunction intersection(a: number[], b: number[]): number[] {\n  const s = new Set(a)\n  return b.filter(x => s.has(x))\n}\n\n// 3. 그룹핑 O(n)\nfunction groupBy<T>(arr: T[], key: keyof T) {\n  return arr.reduce((map, item) => {\n    const k = item[key] as unknown as string\n    map.set(k, [...(map.get(k) ?? []), item])\n    return map\n  }, new Map<string, T[]>())\n}\n\n// 4. 슬라이딩 윈도우 + Map (고유 문자 k개인 최장 부분열)\nfunction longestKUnique(s: string, k: number): number {\n  const freq = new Map<string, number>()\n  let left = 0, max = 0\n  for (let r = 0; r < s.length; r++) {\n    freq.set(s[r], (freq.get(s[r]) ?? 0) + 1)\n    while (freq.size > k) {\n      freq.set(s[left], freq.get(s[left])! - 1)\n      if (freq.get(s[left]) === 0) freq.delete(s[left])\n      left++\n    }\n    max = Math.max(max, r - left + 1)\n  }\n  return max\n}\n```',
    relatedProblems: ['cs-q-008', 'cs-q-009'],
  },
]
