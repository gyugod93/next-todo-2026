import type { Problem } from '@/types'

export const javascriptProblems: Problem[] = [
  {
    id: 'js-001',
    category: 'javascript',
    subcategory: '클로저',
    type: 'code-output',
    difficulty: 'medium',
    title: '클로저와 루프',
    description: '아래 코드를 실행하면 1초 뒤에 무엇이 출력될까요?',
    code: `for (var i = 0; i < 3; i++) {
  setTimeout(function () {
    console.log(i)
  }, 1000)
}`,
    options: ['0, 1, 2', '3, 3, 3', '0, 0, 0', '에러 발생'],
    correctAnswer: 1,
    explanation: `var는 함수 스코프라 루프가 끝난 뒤 i = 3이 됩니다.
setTimeout 콜백이 실행될 때 이미 i = 3이므로 3이 세 번 출력됩니다.

✅ 해결책: let 사용 (블록 스코프)
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 1000) // 0, 1, 2
}`,
    hints: ['var는 블록 스코프가 없습니다', 'setTimeout은 비동기로 실행됩니다'],
    deepDive: `🔒 클로저 완전 정복

클로저는 "함수 + 그 함수가 선언된 스코프의 변수에 대한 참조"입니다.

// 클로저로 private 변수 구현
function createCounter(initial = 0) {
  let count = initial  // 외부에서 접근 불가

  return {
    increment: () => ++count,
    decrement: () => --count,
    getCount: () => count,
  }
}

const counter = createCounter(10)
counter.increment() // 11
counter.getCount()  // 11
// count에 직접 접근 불가

// 클로저 + 루프 패턴 비교
// 문제: var는 단일 스코프 공유
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0) // 3, 3, 3
}

// 해결 1: let (블록 스코프 → 반복마다 새 바인딩)
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0) // 0, 1, 2
}

// 해결 2: IIFE로 즉시 실행 (클래식 방법)
for (var i = 0; i < 3; i++) {
  ;((j) => setTimeout(() => console.log(j), 0))(i)
}`,
    relatedProblems: ['js-005', 'js-002'],
  },
  {
    id: 'js-002',
    category: 'javascript',
    subcategory: '이벤트 루프',
    type: 'code-output',
    difficulty: 'hard',
    title: 'Promise와 마이크로태스크 큐',
    description: '아래 코드의 출력 순서를 고르세요.',
    code: `console.log('1')
setTimeout(() => console.log('2'), 0)
Promise.resolve().then(() => console.log('3'))
console.log('4')`,
    options: ['1, 2, 3, 4', '1, 4, 3, 2', '1, 4, 2, 3', '1, 3, 4, 2'],
    correctAnswer: 1,
    explanation: `이벤트 루프 실행 순서:
1. 동기 코드 실행: "1" → "4"
2. 마이크로태스크 큐 (Promise.then): "3"
3. 매크로태스크 큐 (setTimeout): "2"

💡 마이크로태스크(Promise.then, queueMicrotask)는
항상 매크로태스크(setTimeout, setInterval)보다 먼저 실행됩니다.`,
    hints: [
      'Promise.then은 마이크로태스크 큐에 들어갑니다',
      'setTimeout은 매크로태스크 큐에 들어갑니다',
    ],
    deepDive: `⚙️ 이벤트 루프 완전 정복

JavaScript는 싱글 스레드지만 비동기가 가능한 이유:

Call Stack → Web APIs → Task Queue → Event Loop

실행 우선순위:
1. Call Stack (동기 코드)
2. Microtask Queue: Promise.then, queueMicrotask, MutationObserver
3. Macrotask Queue: setTimeout, setInterval, I/O, UI rendering

console.log('start')                    // 1
setTimeout(() => console.log('macro'), 0) // 4 (macrotask)
Promise.resolve()
  .then(() => console.log('micro1'))    // 2 (microtask)
  .then(() => console.log('micro2'))    // 3 (microtask - 이전 .then 후 즉시)
console.log('end')                      // (동기)

// 출력: start → end → micro1 → micro2 → macro

// 중요: 마이크로태스크는 큐가 빌 때까지 모두 처리 후 다음 매크로태스크
// → Promise 체인이 길면 다음 setTimeout이 많이 지연될 수 있음

// queueMicrotask로 직접 마이크로태스크 추가:
queueMicrotask(() => console.log('custom microtask'))`,
    relatedProblems: ['js-008', 'js-013'],
  },
  {
    id: 'js-003',
    category: 'javascript',
    subcategory: '타입 변환',
    type: 'code-output',
    difficulty: 'easy',
    title: 'Nullish Coalescing vs OR',
    description: '아래 코드의 출력값은?',
    code: `const a = 0 ?? 'default'
const b = 0 || 'default'
const c = null ?? 'fallback'

console.log(a, b, c)`,
    options: [
      '0  "default"  "fallback"',
      '"default"  "default"  "fallback"',
      '0  0  null',
      '"default"  "default"  null',
    ],
    correctAnswer: 0,
    explanation: `?? (Nullish Coalescing)는 오직 null과 undefined일 때만 오른쪽을 반환합니다.
|| (OR)는 falsy 값(0, '', false, null, undefined)이면 오른쪽을 반환합니다.

a = 0 ?? 'default' → 0 (0은 null/undefined가 아님)
b = 0 || 'default' → 'default' (0은 falsy)
c = null ?? 'fallback' → 'fallback' (null이므로 오른쪽 반환)

💡 실수하기 쉬운 케이스: 0이나 ''도 유효한 값으로 취급하려면 ?? 를 쓰세요.`,
    hints: ['??는 null과 undefined만 체크합니다', '0은 falsy이지만 null은 아닙니다'],
    deepDive: `🔗 Nullish 패턴 심화: ??= 할당 연산자

// ??= (Nullish Assignment): null/undefined일 때만 할당
let user = null
user ??= { name: 'Guest' }  // user가 null이므로 할당
// user = { name: 'Guest' }

let count = 0
count ??= 10  // 0은 null/undefined가 아님 → 할당 안 함
// count = 0

// ||= vs &&= vs ??=
let a = null
a ||= 'default'   // falsy면 할당 → 'default'
a &&= 'other'     // truthy면 할당 → 'other' (a = 'default'이므로)
a ??= 'backup'    // null/undefined면 할당 → 이미 'other', 할당 안 함

// 실전 패턴: 옵션 객체 기본값
function createConfig(options = {}) {
  options.timeout ??= 5000     // 없으면 기본값
  options.retries ??= 3
  options.debug ??= false
  return options
}

// Optional Chaining + Nullish Coalescing 조합
const city = user?.address?.city ?? '알 수 없음'`,
    relatedProblems: ['js-004', 'js-010'],
  },
  {
    id: 'js-004',
    category: 'javascript',
    subcategory: '옵셔널 체이닝',
    type: 'code-output',
    difficulty: 'easy',
    title: '옵셔널 체이닝 동작',
    description: '아래 코드의 출력값은?',
    code: `const user = {
  profile: null,
  getName: () => 'Alice',
}

console.log(user.profile?.address?.city)
console.log(user.getName?.())
console.log(user.missing?.())`,
    options: [
      'undefined  "Alice"  undefined',
      'null  "Alice"  null',
      '에러  "Alice"  undefined',
      'undefined  undefined  undefined',
    ],
    correctAnswer: 0,
    explanation: `?. (Optional Chaining)은 왼쪽이 null/undefined면 undefined를 반환하고 멈춥니다.

user.profile?.address?.city
→ user.profile이 null이므로 undefined 반환

user.getName?.()
→ getName이 존재하므로 호출 → 'Alice'

user.missing?.()
→ missing이 undefined이므로 호출 안 하고 undefined 반환

💡 ?. 는 TypeError를 방지하는 안전한 접근법입니다.`,
    hints: ['?.은 null/undefined면 즉시 undefined를 반환합니다'],
    deepDive: `⛓️ Optional Chaining 활용 패턴

// 1. 메서드 호출
obj.method?.()             // method가 없으면 undefined
obj?.method?.()            // obj도 null/undefined일 수 있을 때

// 2. 배열/동적 프로퍼티
arr?.[0]                   // arr이 null/undefined면 undefined
obj?.[key]                 // 동적 키 접근

// 3. 깊은 중첩 접근
const lat = response?.data?.location?.coordinates?.lat ?? 0

// 4. 함수 파라미터에서
function notify(callback?: () => void) {
  callback?.()  // callback이 없으면 조용히 무시
}

// ⚠️ 주의: ?. 남용 시 버그 숨김
// 이런 코드는 user가 없을 때 조용히 undefined가 되어 버그 추적 어려움
const name = user?.name  // user가 필수라면 ?. 쓰지 말 것

// 언제 쓰나?
// ✅ 정말로 없을 수 있는 값 (옵션, API 응답 필드)
// ❌ 있어야만 하는 값 (논리 에러를 숨김)`,
    relatedProblems: ['js-003'],
  },
  {
    id: 'js-005',
    category: 'javascript',
    subcategory: '호이스팅',
    type: 'code-output',
    difficulty: 'hard',
    title: 'TDZ (Temporal Dead Zone)',
    description: '아래 코드를 실행하면 어떻게 될까요?',
    code: `console.log(a) // (1)
console.log(b) // (2)

var a = 1
let b = 2`,
    options: [
      '(1) undefined, (2) undefined',
      '(1) undefined, (2) ReferenceError',
      '(1) ReferenceError, (2) ReferenceError',
      '(1) 1, (2) 2',
    ],
    correctAnswer: 1,
    explanation: `var는 선언이 호이스팅되고 undefined로 초기화됩니다.
let/const는 선언이 호이스팅되지만 초기화는 안 됩니다 (TDZ).

(1) var a → 호이스팅되어 undefined
(2) let b → TDZ 구간이므로 ReferenceError 발생

TDZ(Temporal Dead Zone): let/const 변수가 선언 이전에
접근할 수 없는 구간. 선언문에 도달해야 초기화됩니다.`,
    hints: ['var는 호이스팅 시 undefined로 초기화됩니다', 'let/const는 TDZ가 있습니다'],
    deepDive: `🏗️ 호이스팅 완전 정복

// 1. var 호이스팅: 선언 + undefined 초기화
console.log(x) // undefined (에러 아님)
var x = 5

// 컴파일러가 이렇게 해석:
var x        // 맨 위로 호이스팅, undefined
console.log(x) // undefined
x = 5

// 2. 함수 선언문: 전체 함수가 호이스팅
sayHello()  // ✅ "Hello" — 에러 없음
function sayHello() { console.log('Hello') }

// 3. 함수 표현식: 변수만 호이스팅 (함수 본체는 아님)
sayBye()    // ❌ TypeError: sayBye is not a function
var sayBye = function() { console.log('Bye') }

// 4. let/const TDZ: 선언은 호이스팅되지만 초기화 안 됨
// TDZ 시작 (블록 시작)
console.log(y) // ❌ ReferenceError
let y = 10     // TDZ 끝 (초기화)

// 실수 방지: TDZ 때문에 let이 var보다 안전
// var는 undefined를 반환해 조용히 버그를 만들 수 있음`,
    relatedProblems: ['js-001', 'js-006'],
  },
  {
    id: 'js-006',
    category: 'javascript',
    subcategory: '타입',
    type: 'code-output',
    difficulty: 'easy',
    title: 'typeof 함정',
    description: '아래 코드의 출력값은?',
    code: `console.log(typeof null)
console.log(typeof undefined)
console.log(typeof [])
console.log(typeof function(){})`,
    options: [
      '"object"  "undefined"  "object"  "function"',
      '"null"  "undefined"  "array"  "function"',
      '"object"  "undefined"  "array"  "object"',
      '"null"  "null"  "object"  "function"',
    ],
    correctAnswer: 0,
    explanation: `typeof의 악명 높은 특성들:

typeof null === 'object'
→ 자바스크립트 역사적 버그. null은 객체가 아닙니다.

typeof undefined === 'undefined'
typeof [] === 'object'
→ 배열 확인은 Array.isArray()를 사용하세요.

typeof function(){} === 'function'
→ 함수는 객체지만 typeof로 'function'을 반환합니다.

💡 null 체크: value === null
   배열 체크: Array.isArray(value)`,
    hints: ['typeof null은 "null"이 아닙니다', '배열도 객체의 일종입니다'],
    deepDive: `🔍 JavaScript 타입 확인 완전 가이드

// 정확한 타입 확인 방법
// 1. null 확인
value === null

// 2. undefined 확인
value === undefined
typeof value === 'undefined'  // 선언 안 된 변수도 에러 없이 확인

// 3. 배열 확인
Array.isArray(value)          // ✅ 가장 안전
value instanceof Array        // ✅ (iframe 환경에서 실패 가능)

// 4. 객체 확인 (null 제외)
typeof value === 'object' && value !== null

// 5. 정확한 타입 문자열 추출
Object.prototype.toString.call(null)      // '[object Null]'
Object.prototype.toString.call(undefined) // '[object Undefined]'
Object.prototype.toString.call([])        // '[object Array]'
Object.prototype.toString.call({})        // '[object Object]'
Object.prototype.toString.call(new Date()) // '[object Date]'
Object.prototype.toString.call(/regex/)   // '[object RegExp]'

// 유틸 함수로 만들기
function typeOf(value) {
  return Object.prototype.toString.call(value).slice(8, -1).toLowerCase()
}
typeOf([])   // 'array'
typeOf(null) // 'null'`,
    relatedProblems: ['js-005', 'js-007'],
  },
  {
    id: 'js-007',
    category: 'javascript',
    subcategory: '참조 타입',
    type: 'code-output',
    difficulty: 'medium',
    title: 'Spread와 중첩 객체',
    description: '아래 코드의 출력값은?',
    code: `const obj1 = { a: 1, nested: { b: 2 } }
const obj2 = { ...obj1 }

obj2.a = 99
obj2.nested.b = 99

console.log(obj1.a, obj1.nested.b)`,
    options: ['1  2', '99  99', '1  99', '99  2'],
    correctAnswer: 2,
    explanation: `Spread 연산자는 얕은 복사(shallow copy)를 합니다.

obj2.a = 99
→ obj2의 a는 원시값이므로 독립적으로 복사됨. obj1.a는 여전히 1.

obj2.nested.b = 99
→ nested는 참조값. obj1과 obj2가 같은 객체를 가리킴.
→ obj1.nested.b도 99로 변경됨.

💡 깊은 복사가 필요하면:
- structuredClone(obj)
- JSON.parse(JSON.stringify(obj)) (함수/Date 제외)`,
    hints: ['Spread는 1단계만 복사합니다', '객체는 참조로 복사됩니다'],
    deepDive: `📋 깊은 복사 방법 비교

// 1. structuredClone (모던 방법, 권장)
const deep = structuredClone(original)
// ✅ 중첩 객체, 배열, Date, Map, Set 모두 지원
// ❌ 함수, DOM 노드, 클래스 인스턴스 불가

// 2. JSON 왕복 (구식, 제한적)
const deep2 = JSON.parse(JSON.stringify(original))
// ❌ undefined, 함수, Symbol 사라짐
// ❌ Date → 문자열로 변환
// ❌ Map, Set → {} 로 변환

// 3. 직접 구현 (완전한 제어)
function deepClone(obj, visited = new WeakMap()) {
  if (obj === null || typeof obj !== 'object') return obj
  if (visited.has(obj)) return visited.get(obj) // 순환 참조 처리

  const clone = Array.isArray(obj) ? [] : {}
  visited.set(obj, clone)

  for (const key of Object.keys(obj)) {
    clone[key] = deepClone(obj[key], visited)
  }
  return clone
}

// 얕은 복사로 충분한 경우:
// → 중첩 객체 수정 없이 최상위 속성만 변경
// → React state 업데이트: { ...state, count: state.count + 1 }`,
    relatedProblems: ['js-006'],
  },
  {
    id: 'js-008',
    category: 'javascript',
    subcategory: '비동기',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'Promise.all vs Promise.allSettled',
    description: 'Promise.all과 Promise.allSettled의 차이를 가장 잘 설명한 것은?',
    options: [
      'Promise.all이 더 빠르다',
      'Promise.all은 하나라도 reject되면 즉시 실패하지만, Promise.allSettled는 모든 결과를 기다린다',
      'Promise.allSettled는 reject된 Promise를 무시한다',
      'Promise.all은 배열만 받고, Promise.allSettled는 객체도 받는다',
    ],
    correctAnswer: 1,
    explanation: `Promise.all([p1, p2, p3])
→ 하나라도 reject되면 즉시 catch로 넘어감 (Fast-fail)
→ 모두 성공하면 resolve 값 배열 반환

Promise.allSettled([p1, p2, p3])
→ 모두 완료될 때까지 기다림
→ 각 결과를 { status: 'fulfilled'|'rejected', value|reason } 형태로 반환

언제 쓰나?
- Promise.all: 하나라도 실패하면 의미없는 경우 (트랜잭션)
- Promise.allSettled: 부분 성공을 허용하는 경우 (배치 작업)`,
    hints: ['all과 allSettled의 에러 처리 방식을 비교해보세요'],
    deepDive: `⚡ Promise 조합자 완전 가이드

// 1. Promise.all — 모두 성공해야 함, 하나 실패시 즉시 reject
const [user, posts] = await Promise.all([getUser(id), getPosts(id)])

// 2. Promise.allSettled — 모두 완료 대기, 성공/실패 모두 수집
const results = await Promise.allSettled([uploadImg(), uploadDoc()])
const succeeded = results.filter(r => r.status === 'fulfilled')
const failed = results.filter(r => r.status === 'rejected')

// 3. Promise.race — 가장 먼저 완료된 것 (성공이든 실패든)
const result = await Promise.race([
  fetchData(),
  new Promise((_, reject) => setTimeout(() => reject('timeout'), 5000))
])

// 4. Promise.any — 가장 먼저 성공한 것 (모두 실패하면 AggregateError)
const fastestCDN = await Promise.any([
  fetch('https://cdn1.example.com/data.json'),
  fetch('https://cdn2.example.com/data.json'),
])

// 조합 패턴: 병렬 + 순서 유지
async function fetchAll(ids: number[]) {
  return Promise.all(ids.map(id => fetchItem(id)))
  // ids 순서대로 결과 반환, 병렬로 실행
}`,
    relatedProblems: ['js-013', 'js-002'],
  },
  {
    id: 'js-009',
    category: 'javascript',
    subcategory: '제너레이터',
    type: 'code-output',
    difficulty: 'hard',
    title: 'Generator next() 동작',
    description: '아래 코드의 출력값은?',
    code: `function* gen() {
  yield 1
  yield 2
  return 3
}

const g = gen()
console.log(g.next().value)
console.log(g.next().value)
console.log(g.next().value)
console.log(g.next().value)`,
    options: [
      '1  2  3  undefined',
      '1  2  undefined  undefined',
      '1  2  3  3',
      '에러 발생',
    ],
    correctAnswer: 0,
    explanation: `Generator는 yield 지점에서 일시 정지합니다.

g.next() → { value: 1, done: false }  → .value = 1
g.next() → { value: 2, done: false }  → .value = 2
g.next() → { value: 3, done: true }   → .value = 3 (return 값)
g.next() → { value: undefined, done: true } → .value = undefined

💡 return 값은 한 번만 나오고 이후엔 undefined입니다.
for...of 루프는 done: true인 값(return)을 포함하지 않습니다.`,
    hints: ['return 값도 next()로 꺼낼 수 있습니다', '완료 후에는 undefined가 반환됩니다'],
    deepDive: `🔄 Generator 실전 활용 패턴

// 1. 무한 시퀀스 (lazy evaluation)
function* range(start = 0, end = Infinity, step = 1) {
  for (let i = start; i < end; i += step) {
    yield i
  }
}

const evens = range(0, Infinity, 2)
evens.next().value // 0
evens.next().value // 2
// 메모리에 전체 배열을 만들지 않음

// 2. 상태 기계 (State Machine)
function* trafficLight() {
  while (true) {
    yield '빨강'
    yield '초록'
    yield '노랑'
  }
}

const light = trafficLight()
light.next().value // '빨강'
light.next().value // '초록'

// 3. async generator — 비동기 이터레이션
async function* streamData(url) {
  const response = await fetch(url)
  const reader = response.body.getReader()
  while (true) {
    const { done, value } = await reader.read()
    if (done) return
    yield new TextDecoder().decode(value)
  }
}

// 4. for...of와 연동
for (const n of range(1, 5)) {
  console.log(n) // 1 2 3 4 (return 값 5는 포함 안 됨)
}`,
    relatedProblems: ['js-014'],
  },
  {
    id: 'js-010',
    category: 'javascript',
    subcategory: '구조 분해',
    type: 'code-output',
    difficulty: 'medium',
    title: '구조 분해 기본값',
    description: '아래 코드의 출력값은?',
    code: `const [a = 10, b = 20] = [1, undefined]
const { x = 5, y = 5 } = { x: 0, y: null }

console.log(a, b)
console.log(x, y)`,
    options: [
      '1  20  0  null',
      '1  20  5  5',
      '10  20  0  null',
      '1  undefined  0  5',
    ],
    correctAnswer: 0,
    explanation: `구조 분해 기본값은 오직 undefined일 때만 적용됩니다.

[a = 10, b = 20] = [1, undefined]
→ a: 1 (값이 있으므로 기본값 무시)
→ b: 20 (undefined이므로 기본값 적용)

{ x = 5, y = 5 } = { x: 0, y: null }
→ x: 0 (0은 undefined가 아님, 기본값 무시)
→ y: null (null도 undefined가 아님, 기본값 무시)

💡 null은 기본값 트리거가 아닙니다. 명시적 null 체크가 필요하면 ?? 사용.`,
    hints: ['기본값은 undefined일 때만 적용됩니다', 'null과 undefined는 다릅니다'],
    deepDive: `🎯 구조 분해 고급 패턴

// 1. 중첩 구조 분해
const { a: { b: { c } } } = { a: { b: { c: 42 } } }
// c = 42

// 2. 별칭(rename)
const { name: firstName, age: years = 0 } = user
// firstName = user.name, years = user.age ?? 0

// 3. 나머지(rest)
const { id, ...rest } = user
// rest = { name, email, ... } (id 제외)

const [first, ...others] = [1, 2, 3, 4]
// first = 1, others = [2, 3, 4]

// 4. 함수 파라미터 구조 분해
function render({ title, children, className = '' }) {
  // ...
}

// 5. 이터러블 구조 분해
const [a, , c] = [1, 2, 3]  // 인덱스 1 건너뜀
// a = 1, c = 3

// 6. swap 트릭
let x = 1, y = 2
;[x, y] = [y, x]
// x = 2, y = 1

// 7. 동적 키 구조 분해
const key = 'name'
const { [key]: value } = user  // value = user.name`,
    relatedProblems: ['js-003'],
  },
  {
    id: 'js-011',
    category: 'javascript',
    subcategory: 'WeakMap',
    type: 'multiple-choice',
    difficulty: 'hard',
    title: 'WeakMap의 핵심 특성',
    description: 'WeakMap과 Map의 차이로 올바른 것은?',
    options: [
      'WeakMap은 Map보다 성능이 항상 빠르다',
      'WeakMap의 키는 객체만 가능하며, 해당 객체에 다른 참조가 없으면 GC 대상이 된다',
      'WeakMap은 for...of로 순회할 수 있다',
      'WeakMap은 원시값(number, string)도 키로 사용할 수 있다',
    ],
    correctAnswer: 1,
    explanation: `WeakMap의 핵심 특성:

1. 키는 반드시 객체 (원시값 불가)
2. 키 객체에 다른 참조가 없으면 자동으로 GC됨 (메모리 누수 방지)
3. 이터러블 불가 (keys, values, forEach 없음)
4. size 프로퍼티 없음

언제 쓰나?
- DOM 요소에 데이터를 연결할 때 (요소가 제거되면 데이터도 자동 제거)
- 외부 객체에 대한 부가 정보를 저장할 때

예시:
const cache = new WeakMap()
function process(obj) {
  if (cache.has(obj)) return cache.get(obj)
  const result = expensiveCompute(obj)
  cache.set(obj, result)
  return result
}`,
    hints: ['GC와의 관계를 생각해보세요'],
    deepDive: `🗑️ WeakMap/WeakSet/WeakRef 완전 정복

// WeakMap: 키가 GC되면 항목도 자동 제거
const domData = new WeakMap()
function attachData(element, data) {
  domData.set(element, data)
}
// element가 DOM에서 제거되면 → GC → domData 항목도 사라짐

// WeakSet: 객체 집합, 이터러블 불가
const visited = new WeakSet()
function processNode(node) {
  if (visited.has(node)) return  // 순환 참조 방지
  visited.add(node)
  // 처리...
}

// WeakRef: 약한 참조 (GC 허용)
const weakRef = new WeakRef(largeObject)
// GC가 언제든 수집 가능

// 나중에 사용할 때 살아있는지 확인
const obj = weakRef.deref()
if (obj) {
  // GC 되지 않았음
} else {
  // GC 됨
}

// FinalizationRegistry: 객체가 GC될 때 콜백
const registry = new FinalizationRegistry((key) => {
  console.log(\`\${key} GC됨\`)
  cache.delete(key)
})
registry.register(targetObj, 'myCache')`,
    relatedProblems: ['js-007'],
  },
  {
    id: 'js-012',
    category: 'javascript',
    subcategory: '프로토타입',
    type: 'code-output',
    difficulty: 'medium',
    title: '프로토타입 체인',
    description: '아래 코드에서 dog.speak()의 출력값은?',
    code: `function Animal(name) {
  this.name = name
}
Animal.prototype.speak = function () {
  return this.name + '이(가) 소리를 냅니다'
}

function Dog(name) {
  Animal.call(this, name)
}
Dog.prototype = Object.create(Animal.prototype)

const dog = new Dog('멍멍이')
console.log(dog.speak())
console.log(dog instanceof Dog)
console.log(dog instanceof Animal)`,
    options: [
      '"멍멍이이(가) 소리를 냅니다"  true  true',
      '"멍멍이이(가) 소리를 냅니다"  true  false',
      'TypeError: dog.speak is not a function',
      '"undefined이(가) 소리를 냅니다"  true  true',
    ],
    correctAnswer: 0,
    explanation: `Animal.call(this, name): Dog 생성자 내에서 Animal을 호출해 this.name 설정
Object.create(Animal.prototype): Dog.prototype이 Animal.prototype을 상속

dog.speak()
→ dog 자신에 speak 없음 → Dog.prototype에 없음 → Animal.prototype.speak 발견 → 실행

instanceof 확인:
→ dog의 프로토타입 체인: Dog.prototype → Animal.prototype → Object.prototype
→ Dog과 Animal 모두 체인에 있으므로 둘 다 true

💡 ES6 class: class Dog extends Animal {} 로 동일하게 표현 가능`,
    hints: ['프로토타입 체인을 따라 올라갑니다', 'instanceof는 프로토타입 체인을 확인합니다'],
    deepDive: `⛓️ 프로토타입 vs class 문법 비교

// 구식 프로토타입 방식
function Animal(name) {
  this.name = name
}
Animal.prototype.speak = function() {
  return this.name + ' speaks'
}

// 모던 class 문법 (동일하게 동작)
class Animal {
  constructor(name) {
    this.name = name
  }
  speak() {    // Animal.prototype.speak와 동일
    return this.name + ' speaks'
  }
}

// class는 프로토타입의 문법적 설탕(syntactic sugar)
// 내부적으로 동일한 프로토타입 체인 생성

// 프로토타입 확인 방법
Object.getPrototypeOf(dog) === Dog.prototype   // true
Dog.prototype.isPrototypeOf(dog)               // true

// 주의: __proto__ 직접 접근은 지양
dog.__proto__  // 가능하지만 권장 안 함
Object.getPrototypeOf(dog)  // 표준 방법

// class 상속
class Dog extends Animal {
  bark() { return 'Woof!' }
}
// Dog.prototype이 Animal.prototype을 상속하도록 자동 설정`,
    relatedProblems: ['js-015'],
  },
  {
    id: 'js-013',
    category: 'javascript',
    subcategory: '비동기',
    type: 'multiple-choice',
    difficulty: 'hard',
    title: 'async/await 에러 처리 패턴',
    description: '아래 코드에서 fetchUser가 reject될 때 어떻게 되나요?',
    code: `async function getUser(id) {
  const user = await fetchUser(id)
  const posts = await fetchPosts(user.id) // fetchUser 실패 시?
  return { user, posts }
}

// 호출부
getUser(1)
  .then(data => console.log(data))
  .catch(err => console.error(err))`,
    options: [
      'fetchUser 에러가 무시되고 fetchPosts가 실행된다',
      'fetchUser에서 reject되면 async 함수 전체가 reject된 Promise를 반환하고 catch로 전파된다',
      'async 함수는 에러를 자동으로 undefined로 변환한다',
      'fetchPosts는 fetchUser 실패와 관계없이 항상 실행된다',
    ],
    correctAnswer: 1,
    explanation: `async 함수 내 await에서 reject되면:
1. 해당 지점에서 예외(throw)가 발생한 것처럼 처리
2. 남은 코드(fetchPosts 등)는 실행되지 않음
3. async 함수는 reject된 Promise를 반환
4. .catch() 또는 try/catch로 처리 가능

async/await는 Promise의 문법적 설탕이므로
await가 reject를 throw로 변환하여 동기적 흐름처럼 처리 가능합니다.`,
    hints: ['await에서 reject는 throw와 같습니다'],
    deepDive: `🛡️ async/await 에러 처리 완전 가이드

// 1. try/catch (기본 패턴)
async function getUser(id) {
  try {
    const user = await fetchUser(id)
    return user
  } catch (error) {
    console.error('유저 조회 실패:', error)
    return null
  }
}

// 2. 에러 우선 패턴 (Go 스타일)
async function safeAwait(promise) {
  try {
    const data = await promise
    return [null, data]
  } catch (error) {
    return [error, null]
  }
}

const [err, user] = await safeAwait(fetchUser(id))
if (err) { /* 에러 처리 */ }

// 3. 특정 에러만 처리
async function getUser(id) {
  try {
    return await fetchUser(id)
  } catch (error) {
    if (error instanceof NotFoundError) return null
    throw error  // 모르는 에러는 다시 던지기
  }
}

// 4. 병렬 + 에러 처리
const [userResult, postsResult] = await Promise.allSettled([
  fetchUser(id),
  fetchPosts(id),
])
// 각 결과 독립적으로 처리 가능`,
    relatedProblems: ['js-008', 'js-002'],
  },
  {
    id: 'js-014',
    category: 'javascript',
    subcategory: 'Proxy',
    type: 'multiple-choice',
    difficulty: 'hard',
    title: 'Proxy 핸들러 동작',
    description: 'Proxy get 핸들러를 활용한 아래 코드에서 user.name의 결과는?',
    code: `const handler = {
  get(target, key) {
    return key in target
      ? target[key]
      : \`\${String(key)} 속성이 없습니다\`
  }
}

const user = new Proxy({ name: 'Alice', age: 30 }, handler)

console.log(user.name)
console.log(user.email)`,
    options: [
      '"Alice"  undefined',
      '"Alice"  "email 속성이 없습니다"',
      'TypeError 발생',
      '"Alice"  null',
    ],
    correctAnswer: 1,
    explanation: `Proxy는 객체의 기본 동작을 가로채서 커스텀 동작을 추가합니다.

get 핸들러: 프로퍼티 접근을 가로챔
- target: 원본 객체
- key: 접근하는 프로퍼티 이름

user.name:
→ 'name' in target → true → target['name'] = 'Alice'

user.email:
→ 'email' in target → false → 'email 속성이 없습니다'

Proxy 주요 트랩(trap):
- get: 프로퍼티 읽기
- set: 프로퍼티 쓰기
- has: in 연산자
- deleteProperty: delete 연산자
- apply: 함수 호출`,
    hints: ['Proxy는 객체 접근을 가로채는 래퍼입니다'],
    deepDive: `🪄 Proxy 실전 활용 패턴

// 1. 유효성 검사
const validator = {
  set(target, key, value) {
    if (key === 'age' && (typeof value !== 'number' || value < 0)) {
      throw new TypeError('age는 0 이상의 숫자여야 합니다')
    }
    target[key] = value
    return true  // set 트랩은 반드시 true 반환
  }
}

const user = new Proxy({}, validator)
user.age = 25   // OK
user.age = -1   // ❌ TypeError

// 2. 관찰자 패턴 (Vue 3 반응성 시스템 원리)
function reactive(obj) {
  return new Proxy(obj, {
    get(target, key) {
      track(target, key)  // 의존성 추적
      return Reflect.get(target, key)
    },
    set(target, key, value) {
      Reflect.set(target, key, value)
      trigger(target, key)  // 변경 알림
      return true
    }
  })
}

// 3. 기본값 제공 (default dict)
const defaultDict = (defaultFn) => new Proxy({}, {
  get: (target, key) => key in target ? target[key] : (target[key] = defaultFn())
})

const counter = defaultDict(() => 0)
counter.a++  // counter.a = 1 (없으면 0으로 시작)`,
    relatedProblems: ['js-011', 'js-009'],
  },
  {
    id: 'js-015',
    category: 'javascript',
    subcategory: '클래스',
    type: 'code-output',
    difficulty: 'medium',
    title: 'Private 클래스 필드',
    description: '아래 코드의 출력값은?',
    code: `class BankAccount {
  #balance = 0   // private 필드

  deposit(amount) {
    this.#balance += amount
  }

  get balance() {
    return this.#balance
  }
}

const account = new BankAccount()
account.deposit(100)

console.log(account.balance)
console.log(account.#balance)`,
    options: [
      '100  100',
      '100  SyntaxError (클래스 외부에서 #balance 접근)',
      '100  undefined',
      '0  SyntaxError',
    ],
    correctAnswer: 1,
    explanation: `# 접두사는 ECMAScript 공식 private 필드를 나타냅니다.

account.balance
→ getter를 통해 접근 → this.#balance → 100 반환

account.#balance
→ 클래스 외부에서 private 필드 직접 접근 → SyntaxError

# private 필드 특성:
- 클래스 내부에서만 접근 가능 (진짜 private, 트릭으로 우회 불가)
- WeakMap 방식과 달리 성능 오버헤드 없음
- in 연산자로 존재 확인: #balance in account (클래스 내부에서만)
- TypeScript의 private과 다름 (TS private은 컴파일 타임만, 런타임엔 접근 가능)`,
    hints: ['# private 필드는 클래스 외부에서 접근 자체가 불가합니다'],
    deepDive: `🔒 클래스 필드 완전 가이드

class Counter {
  // public 필드
  count = 0

  // private 필드
  #step = 1

  // static public
  static instances = 0

  // static private
  static #maxCount = 100

  constructor() {
    Counter.instances++
  }

  // private 메서드
  #validate(n) {
    return n <= Counter.#maxCount
  }

  increment() {
    if (this.#validate(this.count + this.#step)) {
      this.count += this.#step
    }
  }

  // getter/setter
  get step() { return this.#step }
  set step(val) {
    if (val > 0) this.#step = val
  }
}

// TypeScript private vs # private 차이:
class Example {
  private tsPrivate = 1  // 컴파일 후 사라짐, 런타임 접근 가능
  #jsPrivate = 2         // 런타임에도 진짜 private

  // (example as any).tsPrivate → 1 (TS 우회 가능)
  // example.#jsPrivate → SyntaxError (우회 불가)
}`,
    relatedProblems: ['js-012', 'js-011'],
  },
]
