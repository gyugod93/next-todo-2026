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
  },
]
