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

✅ 해결책: let 사용 (블록 스코프) 또는 IIFE로 i를 캡처합니다.

// let 사용
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 1000) // 0, 1, 2
}

// IIFE 사용
for (var i = 0; i < 3; i++) {
  ;(function (j) {
    setTimeout(() => console.log(j), 1000)
  })(i)
}`,
    hints: ['var는 블록 스코프가 없습니다', 'setTimeout은 비동기입니다'],
  },
  {
    id: 'js-002',
    category: 'javascript',
    subcategory: '이벤트 루프',
    type: 'code-output',
    difficulty: 'hard',
    title: 'Promise와 마이크로태스크 큐',
    description: '아래 코드의 출력 순서를 맞춰보세요.',
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

결과: 1 → 4 → 3 → 2

💡 마이크로태스크(Promise, queueMicrotask)는 항상 매크로태스크(setTimeout, setInterval)보다 먼저 실행됩니다.`,
    hints: [
      'Promise.then은 마이크로태스크 큐에 들어갑니다',
      'setTimeout은 매크로태스크 큐에 들어갑니다',
    ],
  },
  {
    id: 'js-003',
    category: 'javascript',
    subcategory: 'this 바인딩',
    type: 'bug-find',
    difficulty: 'medium',
    title: 'this 바인딩 버그',
    description:
      '아래 코드는 의도대로 동작하지 않습니다. 버그를 찾고 올바른 코드를 작성하세요.',
    code: `const counter = {
  count: 0,
  start() {
    setInterval(function () {
      this.count++
      console.log(this.count)
    }, 1000)
  },
}

counter.start() // NaN, NaN, NaN...`,
    correctAnswer: `const counter = {
  count: 0,
  start() {
    setInterval(() => {
      this.count++
      console.log(this.count)
    }, 1000)
  },
}`,
    explanation: `일반 함수(function)는 호출 방식에 따라 this가 결정됩니다.
setTimeout/setInterval의 콜백은 전역 컨텍스트에서 실행되므로
this는 window(또는 undefined in strict mode)가 됩니다.

🔧 해결책 3가지:
1. 화살표 함수 사용 (this를 렉시컬 스코프에서 상속)
   setInterval(() => { this.count++ }, 1000)

2. 변수에 this 저장
   const self = this
   setInterval(function() { self.count++ }, 1000)

3. bind 사용
   setInterval(function() { this.count++ }.bind(this), 1000)`,
    hints: [
      '화살표 함수와 일반 함수의 this 바인딩 차이를 생각해보세요',
      'setInterval 콜백의 this는 누구일까요?',
    ],
  },
  {
    id: 'js-004',
    category: 'javascript',
    subcategory: '비동기',
    type: 'code-complete',
    difficulty: 'hard',
    title: 'debounce 구현',
    description:
      'debounce 함수를 구현하세요. 마지막 호출 후 delay(ms)가 지나야 fn이 실행됩니다.',
    code: `function debounce(fn, delay) {
  // 여기를 완성하세요
}

// 사용 예시
const handleInput = debounce((value) => {
  console.log('검색:', value)
}, 300)

handleInput('a')    // 실행 안됨
handleInput('ab')   // 실행 안됨
handleInput('abc')  // 300ms 뒤 '검색: abc' 출력`,
    correctAnswer: `function debounce(fn, delay) {
  let timer = null
  return function (...args) {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}`,
    explanation: `debounce 핵심 원리:
1. 클로저로 timer 변수를 유지합니다
2. 호출될 때마다 이전 타이머를 취소(clearTimeout)합니다
3. 새 타이머를 설정합니다
4. delay 동안 호출이 없으면 fn을 실행합니다

💡 throttle과 차이:
- debounce: 마지막 호출 후 delay만큼 기다림 (검색창, resize)
- throttle: delay마다 최대 한 번 실행 (scroll, mousemove)`,
    hints: [
      'clearTimeout을 활용하세요',
      '클로저로 timer 변수를 유지해야 합니다',
    ],
  },
  {
    id: 'js-005',
    category: 'javascript',
    subcategory: '프로토타입',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: '프로토타입 체인',
    description: '아래 코드에서 `dog.speak()`의 출력값은?',
    code: `function Animal(name) {
  this.name = name
}

Animal.prototype.speak = function () {
  return \`\${this.name}이(가) 소리를 냅니다\`
}

function Dog(name) {
  Animal.call(this, name)
}

Dog.prototype = Object.create(Animal.prototype)
Dog.prototype.constructor = Dog

const dog = new Dog('멍멍이')
console.log(dog.speak())`,
    options: [
      'undefined이(가) 소리를 냅니다',
      '멍멍이이(가) 소리를 냅니다',
      'TypeError: dog.speak is not a function',
      'null이(가) 소리를 냅니다',
    ],
    correctAnswer: 1,
    explanation: `프로토타입 체인 상속 동작:
1. Animal.call(this, name): Dog 생성자에서 Animal 생성자를 호출해 this.name 설정
2. Object.create(Animal.prototype): Dog.prototype이 Animal.prototype을 상속
3. dog.speak() 호출 시 프로토타입 체인으로 Animal.prototype.speak를 찾아 실행

결과: "멍멍이이(가) 소리를 냅니다"

💡 ES6 class로 동일하게 표현:
class Animal {
  constructor(name) { this.name = name }
  speak() { return \`\${this.name}이(가) 소리를 냅니다\` }
}
class Dog extends Animal {}`,
    hints: [
      'Animal.call(this, name)이 뭘 하는지 생각해보세요',
      'Object.create는 프로토타입 체인을 설정합니다',
    ],
  },
]
