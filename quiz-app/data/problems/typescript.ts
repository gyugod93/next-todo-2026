import type { Problem } from '@/types'

export const typescriptProblems: Problem[] = [
  {
    id: 'ts-001',
    category: 'typescript',
    subcategory: 'type vs interface',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'type vs interface 차이',
    description: 'TypeScript의 type과 interface 차이로 올바른 것은?',
    options: [
      'interface는 union 타입을 직접 정의할 수 없다',
      'type은 extends 키워드를 사용할 수 없다',
      'interface는 원시 타입에 별칭을 줄 수 있다',
      'type은 선언 병합(declaration merging)이 가능하다',
    ],
    correctAnswer: 0,
    explanation: `interface와 type의 주요 차이:

interface만 가능:
- 선언 병합: 같은 이름으로 여러 번 선언 시 자동 병합
  interface User { name: string }
  interface User { age: number }  // { name: string; age: number }

type만 가능:
- Union 타입: type ID = string | number
- 원시 타입 별칭: type Name = string
- 조건부 타입, 맵드 타입, 튜플 등

공통:
- 객체 구조 정의
- extends/intersection(&)으로 확장

실무 관례:
- 라이브러리 공개 API → interface (선언 병합 허용)
- 복잡한 타입 표현 → type`,
    hints: ['union 타입을 직접 표현할 수 있는지 생각해보세요'],
  },
  {
    id: 'ts-002',
    category: 'typescript',
    subcategory: '유틸리티 타입',
    type: 'multiple-choice',
    difficulty: 'easy',
    title: 'Partial<T> 동작',
    description: 'Partial<User>의 결과 타입은?',
    code: `interface User {
  id: number
  name: string
  email: string
}

type PartialUser = Partial<User>`,
    options: [
      '{ id?: number; name?: string; email?: string }',
      '{ id: number; name: string; email: string }',
      '{ id: number | undefined; name: string | undefined; email: string | undefined }',
      '{ id?: number | undefined; name?: string | undefined; email?: string | undefined }',
    ],
    correctAnswer: 0,
    explanation: `Partial<T>는 T의 모든 프로퍼티를 선택적(optional)으로 만듭니다.

// Partial 구현:
type Partial<T> = {
  [P in keyof T]?: T[P]
}

실용 예시:
function updateUser(id: number, updates: Partial<User>) {
  // name만 업데이트하거나, email만 업데이트하거나...
}
updateUser(1, { name: 'Bob' }) // OK
updateUser(1, { name: 'Bob', email: 'bob@example.com' }) // OK

관련 유틸리티 타입:
- Required<T>: 모든 프로퍼티를 필수로
- Readonly<T>: 모든 프로퍼티를 읽기 전용으로
- Pick<T, K>: T에서 K 프로퍼티만 선택
- Omit<T, K>: T에서 K 프로퍼티 제외`,
    hints: ['Partial은 모든 필드를 optional(?)로 만듭니다'],
  },
  {
    id: 'ts-003',
    category: 'typescript',
    subcategory: '제네릭',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: '제네릭 제약 (extends)',
    description: 'getProperty 함수에서 컴파일 에러가 발생하는 줄은?',
    code: `function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}

const user = { name: 'Alice', age: 30 }

const a = getProperty(user, 'name')   // (1)
const b = getProperty(user, 'age')    // (2)
const c = getProperty(user, 'email')  // (3)`,
    options: [
      '(1) — name은 string이라 불가',
      '(2) — age가 number라 불가',
      '(3) — email은 user의 키가 아님',
      '에러 없음 — 모두 정상',
    ],
    correctAnswer: 2,
    explanation: `K extends keyof T 제약은 K가 반드시 T의 키 중 하나여야 함을 강제합니다.

keyof typeof user = 'name' | 'age'

(1) getProperty(user, 'name') → K = 'name', T[K] = string ✅
(2) getProperty(user, 'age')  → K = 'age',  T[K] = number ✅
(3) getProperty(user, 'email') → 'email'은 keyof user가 아님 ❌ 컴파일 에러

이 패턴의 장점:
런타임에 undefined를 반환하는 대신
컴파일 타임에 잘못된 키 접근을 차단합니다.

반환 타입 T[K]는 Indexed Access Type으로
키에 따라 정확한 값 타입을 추론합니다.`,
    hints: ["'email'은 user 객체의 키가 아닙니다"],
  },
  {
    id: 'ts-004',
    category: 'typescript',
    subcategory: '타입 내로잉',
    type: 'code-output',
    difficulty: 'easy',
    title: 'typeof 타입 가드',
    description: 'if 블록 내부에서 value의 타입은?',
    code: `function process(value: string | number | boolean) {
  if (typeof value === 'string') {
    // 여기서 value의 타입은?
    return value.toUpperCase()
  }
  if (typeof value === 'number') {
    return value.toFixed(2)
  }
  return value // 여기서 value의 타입은?
}`,
    options: [
      '첫 번째 블록: string | number | boolean, 마지막 return: boolean',
      '첫 번째 블록: string, 마지막 return: boolean',
      '첫 번째 블록: string, 마지막 return: string | number | boolean',
      '첫 번째 블록: string | number, 마지막 return: boolean',
    ],
    correctAnswer: 1,
    explanation: `TypeScript는 타입 가드를 통해 타입을 자동으로 좁힙니다(Type Narrowing).

typeof value === 'string' 블록 내부:
→ value: string (string만 진입 가능)

typeof value === 'number' 블록 내부:
→ value: number

마지막 return (두 블록 모두 통과하지 못한 경우):
→ string과 number를 제거하면 boolean만 남음
→ value: boolean

TypeScript는 코드 흐름을 분석하여 가능한 타입을 추적합니다.
이를 Control Flow Analysis라고 합니다.`,
    hints: ['TypeScript는 조건문을 분석해 타입을 좁힙니다'],
  },
  {
    id: 'ts-005',
    category: 'typescript',
    subcategory: '판별 유니온',
    type: 'multiple-choice',
    difficulty: 'hard',
    title: '판별 유니온 (Discriminated Union)',
    description: "'circle' case 내에서 shape.side에 접근하면?",
    code: `type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'square'; side: number }

function getArea(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2
      // shape.side 접근 시 어떻게 될까?
    case 'square':
      return shape.side ** 2
  }
}`,
    options: [
      '런타임에 undefined를 반환한다',
      "TypeScript 컴파일 에러 (circle 타입에 'side' 없음)",
      '0을 반환한다',
      '정상적으로 접근 가능하다',
    ],
    correctAnswer: 1,
    explanation: `판별 유니온(Discriminated Union)은 공통 리터럴 타입 필드(kind)로 구분됩니다.

'circle' case 내에서 TypeScript는 shape의 타입을
{ kind: 'circle'; radius: number }로 좁힙니다.

이 타입에는 'side'가 없으므로 컴파일 에러 발생.
런타임 전에 잘못된 접근을 차단합니다.

판별 유니온의 장점:
1. 타입 안전성 (컴파일 타임 검사)
2. 자동완성 (해당 타입의 필드만 제안)
3. 완전성 검사 가능 (never 타입 활용)

// switch 완전성 검사:
default:
  const _check: never = shape // 모든 케이스를 처리했는지 검증`,
    hints: ["'circle' 케이스에서 TypeScript는 shape 타입을 circle로 좁힙니다"],
  },
  {
    id: 'ts-006',
    category: 'typescript',
    subcategory: 'keyof',
    type: 'code-output',
    difficulty: 'medium',
    title: 'keyof 연산자',
    description: 'UserKey와 ValueOf의 타입은?',
    code: `type User = {
  id: number
  name: string
  email: string
}

type UserKey = keyof User
type ValueOf = User[keyof User]`,
    options: [
      "UserKey: string, ValueOf: string",
      "UserKey: 'id' | 'name' | 'email', ValueOf: number | string",
      "UserKey: 'id' | 'name' | 'email', ValueOf: string",
      "UserKey: string | number, ValueOf: any",
    ],
    correctAnswer: 1,
    explanation: `keyof T: T의 모든 키를 유니온 타입으로 반환
keyof User = 'id' | 'name' | 'email'

T[keyof T]: Indexed Access Type으로 모든 값 타입의 유니온
User[keyof User] = User['id'] | User['name'] | User['email']
                 = number | string | string
                 = number | string

활용 예:
function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  // keys로 지정한 프로퍼티만 추출
}

const user: User = { id: 1, name: 'Alice', email: 'a@a.com' }
pick(user, ['id', 'name']) // { id: 1, name: 'Alice' }`,
    hints: ['keyof는 객체 타입의 키들을 유니온으로 만듭니다'],
  },
  {
    id: 'ts-007',
    category: 'typescript',
    subcategory: 'readonly',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'readonly vs const',
    description: 'TypeScript에서 readonly와 const의 차이로 올바른 것은?',
    code: `const arr = [1, 2, 3]
arr.push(4) // 가능

const readonlyArr: readonly number[] = [1, 2, 3]
readonlyArr.push(4) // ???`,
    options: [
      'const는 변수 재할당을, readonly는 타입 프로퍼티 수정을 막는다',
      'const와 readonly는 완전히 동일하다',
      'readonly는 런타임에도 수정을 막는다',
      'const 배열은 수정 불가이고 readonly는 수정 가능이다',
    ],
    correctAnswer: 0,
    explanation: `const: 변수 재할당 방지 (바인딩 고정)
const arr = [1, 2, 3]
arr = [4, 5, 6] // ❌ 재할당 불가
arr.push(4)     // ✅ 내부 수정은 가능

readonly: 타입 레벨에서 수정 방지 (컴파일 타임에만)
const readonlyArr: readonly number[] = [1, 2, 3]
readonlyArr.push(4) // ❌ 컴파일 에러

주의: readonly는 컴파일 타임 검사만 합니다.
런타임에는 실제로 수정 가능합니다.
(런타임 불변성은 Object.freeze() 사용)

Readonly<T> 유틸리티 타입:
type ReadonlyUser = Readonly<User>
// 모든 프로퍼티가 readonly가 됨`,
    hints: ['const는 재할당을, readonly는 프로퍼티 수정을 막습니다'],
  },
  {
    id: 'ts-008',
    category: 'typescript',
    subcategory: '유틸리티 타입',
    type: 'code-output',
    difficulty: 'hard',
    title: 'ReturnType과 Awaited',
    description: 'A와 B의 타입은?',
    code: `async function fetchUser() {
  return { id: 1, name: 'Alice' }
}

type A = ReturnType<typeof fetchUser>
type B = Awaited<ReturnType<typeof fetchUser>>`,
    options: [
      'A: { id: number; name: string }, B: { id: number; name: string }',
      'A: Promise<{ id: number; name: string }>, B: { id: number; name: string }',
      'A: Promise<any>, B: any',
      'A: { id: number; name: string }, B: Promise<{ id: number; name: string }>',
    ],
    correctAnswer: 1,
    explanation: `async 함수는 항상 Promise를 반환합니다.
ReturnType<typeof fetchUser> = Promise<{ id: number; name: string }>

Awaited<T>는 Promise를 벗겨냅니다:
Awaited<Promise<{ id: number; name: string }>> = { id: number; name: string }

중첩 Promise도 처리합니다:
Awaited<Promise<Promise<string>>> = string

유용한 조합:
type ApiResponse = Awaited<ReturnType<typeof fetchUser>>
→ 실제 응답 타입을 추출할 때 활용

관련 유틸리티:
- Parameters<T>: 함수의 파라미터 타입 튜플
- ConstructorParameters<T>: 생성자 파라미터 타입`,
    hints: ['async 함수는 항상 Promise를 반환합니다'],
  },
  {
    id: 'ts-009',
    category: 'typescript',
    subcategory: '맵드 타입',
    type: 'multiple-choice',
    difficulty: 'hard',
    title: '맵드 타입 수정자',
    description: '아래 맵드 타입의 결과는?',
    code: `type Mutable<T> = {
  -readonly [K in keyof T]-?: T[K]
}

type User = {
  readonly id: number
  name?: string
}

type MutableUser = Mutable<User>`,
    options: [
      '{ readonly id?: number; name?: string }',
      '{ id: number; name: string }',
      '{ readonly id: number; name: string }',
      '{ id?: number; name?: string }',
    ],
    correctAnswer: 1,
    explanation: `맵드 타입의 수정자(modifier):

[K in keyof T]: 모든 키를 순회
readonly [K in keyof T]: readonly 추가
-readonly [K in keyof T]: readonly 제거 ← 이 경우

?: 선택적으로 만들기
-?: 필수로 만들기 ← 이 경우

Mutable<T>:
- -readonly: readonly 제거 (id가 readonly → 일반)
- -?: optional 제거 (name?이 필수 → name)

결과:
{ id: number; name: string }

내장 유틸리티 구현:
// Required<T>
type Required<T> = { [K in keyof T]-?: T[K] }

// Readonly<T>
type Readonly<T> = { readonly [K in keyof T]: T[K] }`,
    hints: ['-readonly는 readonly를 제거하고, -?는 optional을 제거합니다'],
  },
  {
    id: 'ts-010',
    category: 'typescript',
    subcategory: '조건부 타입',
    type: 'code-output',
    difficulty: 'hard',
    title: 'infer로 타입 추출',
    description: 'A, B, C의 타입은?',
    code: `type UnwrapPromise<T> = T extends Promise<infer U> ? U : T
type FirstArg<T> = T extends (arg: infer A, ...rest: any[]) => any ? A : never

type A = UnwrapPromise<Promise<string>>
type B = UnwrapPromise<number>
type C = FirstArg<(name: string, age: number) => void>`,
    options: [
      'A: string, B: number, C: string',
      'A: Promise<string>, B: number, C: never',
      'A: string, B: never, C: string | number',
      'A: string, B: number, C: never',
    ],
    correctAnswer: 0,
    explanation: `infer 키워드는 조건부 타입에서 타입을 캡처합니다.

UnwrapPromise<T>:
- T가 Promise<U> 형태면 → U를 infer로 캡처하여 반환
- 아니면 → T 그대로 반환

A = UnwrapPromise<Promise<string>>
→ Promise<string>은 Promise<U> 형태 → U = string → A: string

B = UnwrapPromise<number>
→ number는 Promise<U> 형태가 아님 → B: number

FirstArg<T>:
- T가 (arg: A, ...) => any 형태면 첫 번째 인자 타입 반환

C = FirstArg<(name: string, age: number) => void>
→ 첫 번째 파라미터: string → C: string

활용: ReturnType, Parameters 같은 내장 유틸리티가 이 방식으로 구현됨`,
    hints: ['infer는 조건부 타입 내에서 타입을 추출합니다'],
  },
  {
    id: 'ts-011',
    category: 'typescript',
    subcategory: '템플릿 리터럴 타입',
    type: 'code-output',
    difficulty: 'hard',
    title: '템플릿 리터럴 타입',
    description: 'EventHandler의 타입은?',
    code: `type Event = 'click' | 'focus' | 'blur'
type EventHandler = \`on\${Capitalize<Event>}\`

type CSSProperty = 'margin' | 'padding'
type CSSValue = 'top' | 'bottom'
type FullProperty = \`\${CSSProperty}-\${CSSValue}\``,
    options: [
      "EventHandler: string, FullProperty: string",
      "EventHandler: 'onClick' | 'onFocus' | 'onBlur', FullProperty: 'margin-top' | 'margin-bottom' | 'padding-top' | 'padding-bottom'",
      "EventHandler: 'onEvent', FullProperty: 'margin-padding'",
      "EventHandler: 'onClick', FullProperty: 'margin-top'",
    ],
    correctAnswer: 1,
    explanation: `템플릿 리터럴 타입은 유니온과 결합하면 카테시안 곱(모든 조합)을 생성합니다.

\`on\${Capitalize<Event>}\`
= 'on' + ('Click' | 'Focus' | 'Blur')
= 'onClick' | 'onFocus' | 'onBlur'

\`\${CSSProperty}-\${CSSValue}\`
= ('margin' | 'padding') + '-' + ('top' | 'bottom')
= 'margin-top' | 'margin-bottom' | 'padding-top' | 'padding-bottom'

내장 문자열 조작 타입:
- Uppercase<S>: 대문자 변환
- Lowercase<S>: 소문자 변환
- Capitalize<S>: 첫 글자 대문자
- Uncapitalize<S>: 첫 글자 소문자

활용: React 이벤트 핸들러 타입, CSS 프로퍼티 타입 안전성`,
    hints: ['유니온 타입과 결합하면 모든 조합이 생성됩니다'],
  },
  {
    id: 'ts-012',
    category: 'typescript',
    subcategory: 'never 타입',
    type: 'multiple-choice',
    difficulty: 'hard',
    title: 'never로 완전성 검사',
    description: "아래 코드에서 'triangle'을 추가했을 때 어떻게 되나요?",
    code: `type Shape = 'circle' | 'square' // 'triangle' 추가하면?

function describe(shape: Shape): string {
  switch (shape.kind) {
    case 'circle': return '원'
    case 'square': return '사각형'
    default:
      const _check: never = shape // 완전성 검사
      throw new Error(\`처리 안 된 shape: \${_check}\`)
  }
}`,
    options: [
      "런타임에 에러가 발생한다",
      "'triangle'을 처리하는 case가 없어서 TypeScript 컴파일 에러가 발생한다",
      "자동으로 '삼각형'을 반환한다",
      "never 타입으로 자동 변환된다",
    ],
    correctAnswer: 1,
    explanation: `never 타입은 "절대 발생할 수 없는 값"을 나타냅니다.

모든 케이스를 처리한 후 default에서는
이론적으로 도달할 수 없으므로 shape: never가 됩니다.

'triangle'을 추가하면:
- Shape = 'circle' | 'square' | 'triangle'
- circle, square만 처리 → default에서 shape: 'triangle' (never가 아님)
- const _check: never = shape → 'triangle'을 never에 할당 ❌ 컴파일 에러

이 패턴을 Exhaustive Check라고 합니다:
- 새 케이스가 추가될 때 처리를 강제
- 실수로 빠뜨린 케이스를 컴파일 타임에 감지

유니온 타입에 새 멤버를 추가하면
모든 switch 문에서 컴파일 에러가 발생하여
수정이 필요한 모든 곳을 즉시 알 수 있습니다.`,
    hints: ['never에 다른 타입을 할당하면 컴파일 에러가 발생합니다'],
  },
]
