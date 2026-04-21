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
    deepDive: `🤝 interface 확장 vs type 교차(Intersection)

// interface 방식
interface Animal { name: string }
interface Dog extends Animal { breed: string }
// Dog = { name: string; breed: string }

// type 방식
type Animal = { name: string }
type Dog = Animal & { breed: string }
// Dog = { name: string; breed: string }

두 방식의 실질적 차이:
// interface extends: 충돌하는 속성은 컴파일 에러
interface A { x: string }
interface B extends A { x: number } // ❌ 에러: string과 number 충돌

// type &: 충돌하면 never가 됨 (에러 없음, 사용 시 에러)
type A = { x: string }
type B = A & { x: number }
// B.x의 타입 = string & number = never

💡 언제 interface, 언제 type?
- 객체 구조: interface (성능 미세하게 유리, 에러 메시지 명확)
- 유니온/교차/조건부: type (interface로 불가)
- 외부 라이브러리 확장: interface (선언 병합 필수)`,
    relatedProblems: ['ts-009', 'ts-005'],
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
    deepDive: `🧰 자주 쓰는 유틸리티 타입 총정리

// 1. Pick / Omit — 필드 선택/제거
type UserPreview = Pick<User, 'id' | 'name'>
// { id: number; name: string }

type UserWithoutEmail = Omit<User, 'email'>
// { id: number; name: string }

// 2. Record — 키-값 맵 타입
type Roles = Record<'admin' | 'user' | 'guest', string[]>
// { admin: string[]; user: string[]; guest: string[] }

// 3. Extract / Exclude — 유니온 필터링
type StringOrNumber = string | number | boolean
type OnlyString = Extract<StringOrNumber, string>   // string
type NoBoolean  = Exclude<StringOrNumber, boolean>  // string | number

// 4. NonNullable — null/undefined 제거
type MaybeString = string | null | undefined
type SafeString = NonNullable<MaybeString> // string

// 5. Parameters / ReturnType — 함수 타입 분해
type Fn = (a: string, b: number) => boolean
type Params = Parameters<Fn>    // [string, number]
type Result = ReturnType<Fn>    // boolean`,
    relatedProblems: ['ts-009', 'ts-007'],
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
    deepDive: `🔗 제네릭 제약 심화: 여러 타입 파라미터 조합

// 중첩 키 안전 접근
type NestedKey<T, K1 extends keyof T, K2 extends keyof T[K1]> =
  T[K1][K2]

// 두 객체의 공통 키만 허용
function merge<T, U>(a: T, b: U): T & U {
  return { ...a, ...b } as T & U
}

// 제네릭 + 기본값
function createState<T extends object>(initial: T) {
  let state = { ...initial }
  return {
    get: <K extends keyof T>(key: K): T[K] => state[key],
    set: <K extends keyof T>(key: K, val: T[K]) => { state[key] = val },
  }
}

const store = createState({ count: 0, name: 'app' })
store.get('count')        // number
store.set('count', 1)     // OK
store.set('count', 'hi')  // ❌ 컴파일 에러: string은 number가 아님

// 제네릭 함수를 설계할 때 extends 제약은
// "이 타입 파라미터는 최소 이 조건을 만족해야 한다"는 뜻입니다.`,
    relatedProblems: ['ts-006', 'ts-010'],
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
    deepDive: `🎯 타입 내로잉(Narrowing) 기법 총정리

// 1. typeof — 원시값 구분
if (typeof x === 'string') { /* x: string */ }

// 2. instanceof — 클래스 인스턴스 구분
if (x instanceof Date) { /* x: Date */ }

// 3. in 연산자 — 프로퍼티 존재 확인
if ('fly' in animal) { /* animal에 fly 있음 */ }

// 4. 동등 비교 — 리터럴 타입 좁히기
type Dir = 'left' | 'right' | 'up'
if (dir === 'left') { /* dir: 'left' */ }

// 5. 커스텀 타입 가드 (User-Defined Type Guard)
function isString(x: unknown): x is string {
  return typeof x === 'string'
}
// x is string → 이 함수가 true를 반환하면 x는 string

// 6. 단언 함수 (Assertion Function)
function assert(val: unknown): asserts val is string {
  if (typeof val !== 'string') throw new Error('Not a string')
}
assert(value) // 이후 value: string으로 좁혀짐

// 7. never를 이용한 Exhaustive Check
function assertNever(x: never): never {
  throw new Error('Unexpected value: ' + x)
}`,
    relatedProblems: ['ts-005', 'ts-012'],
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
    deepDive: `🏗️ 판별 유니온 실전 패턴: API 응답 타입 모델링

// API 응답을 판별 유니온으로 모델링
type ApiResult<T> =
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; message: string; code: number }

function render<T>(result: ApiResult<T>) {
  switch (result.status) {
    case 'loading':
      return <Spinner />
    case 'success':
      return <DataView data={result.data} />  // result.data가 T 타입으로 좁혀짐
    case 'error':
      return <ErrorView msg={result.message} /> // result.message가 string으로 좁혀짐
  }
}

// 장점: result.status를 확인하면 나머지 필드가 자동으로 좁혀짐
// result.status === 'loading'이면 data, message 없음
// result.status === 'success'이면 data 있음, message 없음

// React 상태 관리에 활용
type State =
  | { phase: 'idle' }
  | { phase: 'submitting'; values: FormData }
  | { phase: 'done'; result: string }
  | { phase: 'error'; error: Error }`,
    relatedProblems: ['ts-012', 'ts-004'],
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
    deepDive: `🗝️ keyof + Indexed Access 고급 패턴

// 중첩 객체 타입에서 값 타입 추출
type Config = {
  server: { host: string; port: number }
  db: { url: string; name: string }
}

type ServerConfig = Config['server']           // { host: string; port: number }
type DbKeys = keyof Config['db']               // 'url' | 'name'
type ConfigKeys = keyof Config                  // 'server' | 'db'

// 배열 요소 타입 추출
const palette = ['red', 'green', 'blue'] as const
type Color = typeof palette[number]  // 'red' | 'green' | 'blue'

// 깊이 있는 타입 추출
type DeepKeys<T> = {
  [K in keyof T]: T[K] extends object
    ? K | \`\${string & K}.\${string & DeepKeys<T[K]>}\`
    : K
}[keyof T]
// Config → 'server' | 'server.host' | 'server.port' | 'db' | 'db.url' | 'db.name'

// 실무 활용: i18n 키 타입 안전성
type TranslationKeys = DeepKeys<typeof translations>
function t(key: TranslationKeys): string { ... }
t('server.host') // ✅
t('typo.path')   // ❌ 컴파일 에러`,
    relatedProblems: ['ts-003', 'ts-011'],
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
    deepDive: `🔒 as const로 깊은 불변성 적용

// as const: 모든 값을 리터럴 타입 + readonly로 만들기
const config = {
  host: 'localhost',
  port: 3000,
  flags: ['debug', 'verbose'],
} as const

// 결과 타입:
// {
//   readonly host: 'localhost';     ← 'localhost' 리터럴, string 아님
//   readonly port: 3000;            ← 3000 리터럴, number 아님
//   readonly flags: readonly ['debug', 'verbose'];
// }

config.host = 'other'   // ❌ readonly
config.port = 8080      // ❌ readonly

// as const를 쓰면 좋은 경우:
// 1. 설정 객체 (변경 불필요)
// 2. 유니온 타입 추출
const DIRECTIONS = ['left', 'right', 'up', 'down'] as const
type Direction = typeof DIRECTIONS[number]
// 'left' | 'right' | 'up' | 'down'  ← string이 아닌 리터럴 유니온!

// Object.freeze vs readonly:
// readonly: 컴파일 타임만, 런타임 수정 가능
// Object.freeze: 런타임도 차단 (단, 얕은 freeze)`,
    relatedProblems: ['ts-013', 'ts-002'],
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
    deepDive: `⚙️ 함수 관련 유틸리티 타입 실전 활용

// API 함수의 타입을 자동으로 추론하는 패턴
async function getUser(id: number) {
  const res = await fetch(\`/api/users/\${id}\`)
  return res.json() as Promise<{ id: number; name: string; email: string }>
}

type GetUserReturn = Awaited<ReturnType<typeof getUser>>
// { id: number; name: string; email: string }

type GetUserParams = Parameters<typeof getUser>
// [number]

// React Query / SWR 연동 시 유용
function useUser(id: number) {
  return useQuery<GetUserReturn>({
    queryKey: ['user', id],
    queryFn: () => getUser(id),
  })
}

// 고차 함수 타입 보존
function withLogging<T extends (...args: any[]) => any>(fn: T): T {
  return ((...args: Parameters<T>): ReturnType<T> => {
    console.log('calling', fn.name)
    return fn(...args)
  }) as T
}
// 원래 함수의 파라미터/반환 타입을 완전히 보존`,
    relatedProblems: ['ts-010', 'ts-003'],
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
    deepDive: `🗺️ 맵드 타입으로 커스텀 유틸리티 타입 만들기

// 특정 키만 optional로
type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

type User = { id: number; name: string; email: string }
type CreateUserInput = PartialBy<User, 'id'>
// { name: string; email: string; id?: number }
// → id는 optional, 나머지는 필수

// 특정 키만 readonly로
type ReadonlyBy<T, K extends keyof T> =
  Omit<T, K> & Readonly<Pick<T, K>>

// 중첩 Readonly (DeepReadonly)
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object
    ? DeepReadonly<T[K]>
    : T[K]
}

// Nullable — 모든 값에 null 가능
type Nullable<T> = { [K in keyof T]: T[K] | null }

// 값 타입을 변환하는 맵드 타입
type Stringify<T> = { [K in keyof T]: string }
type Getters<T> = { [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K] }
// { getName: () => string; getId: () => number; ... }`,
    relatedProblems: ['ts-002', 'ts-010'],
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
    deepDive: `🔍 infer 고급 패턴

// 재귀 infer: Promise 여러 겹 벗기기
type DeepAwaited<T> = T extends Promise<infer U>
  ? DeepAwaited<U>
  : T

type A = DeepAwaited<Promise<Promise<Promise<string>>>> // string

// 함수 오버로드의 마지막 오버로드 타입 추출
type LastOverload<T> = T extends {
  (...args: infer A1): infer R1
  (...args: infer A2): infer R2
} ? (...args: A2) => R2 : T

// 배열/튜플 요소 타입 추출
type Head<T extends any[]> = T extends [infer H, ...any[]] ? H : never
type Tail<T extends any[]> = T extends [any, ...infer T] ? T : never
type Last<T extends any[]> = T extends [...any[], infer L] ? L : never

type T1 = Head<[1, 2, 3]>  // 1
type T2 = Tail<[1, 2, 3]>  // [2, 3]
type T3 = Last<[1, 2, 3]>  // 3

// 실전: API 응답에서 배열 요소 타입 추출
type Item<T> = T extends (infer U)[] ? U : never
type UserItem = Item<User[]>  // User`,
    relatedProblems: ['ts-008', 'ts-009'],
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
    deepDive: `✨ 템플릿 리터럴 타입 실전 활용

// 1. 이벤트 시스템 타입 안전성
type EventMap = {
  click: MouseEvent
  keydown: KeyboardEvent
  resize: UIEvent
}
type EventName = keyof EventMap
type HandlerName = \`on\${Capitalize<EventName>}\`
// 'onClick' | 'onKeydown' | 'onResize'

// 2. 상태 액션 타입 자동 생성
type Entity = 'User' | 'Post' | 'Comment'
type Action = 'Create' | 'Update' | 'Delete'
type ActionType = \`\${Lowercase<Action>}\${Entity}\`
// 'createUser' | 'updateUser' | 'deleteUser' | 'createPost' | ...

// 3. 중첩 객체 경로 타입 (깊이 2단계)
type PathTo<T, K extends keyof T = keyof T> =
  K extends string
    ? T[K] extends Record<string, unknown>
      ? \`\${K}.\${keyof T[K] & string}\` | K
      : K
    : never

// 4. Getters 자동 생성
type WithGetters<T> = T & {
  [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K]
}`,
    relatedProblems: ['ts-006', 'ts-015'],
  },
  {
    id: 'ts-012',
    category: 'typescript',
    subcategory: 'never 타입',
    type: 'multiple-choice',
    difficulty: 'hard',
    title: 'never로 완전성 검사',
    description: "'triangle'을 추가했을 때 어떻게 되나요?",
    code: `type Shape = 'circle' | 'square' // 'triangle' 추가하면?

function describe(shape: Shape): string {
  switch (shape) {
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
    deepDive: `🚫 never 타입의 3가지 역할

// 역할 1: 도달 불가능한 코드 표시
function throwError(msg: string): never {
  throw new Error(msg) // 이 함수는 절대 값을 반환하지 않음
}

// 역할 2: Exhaustive Check (판별 유니온과 조합)
function assertNever(x: never): never {
  throw new Error('처리되지 않은 케이스: ' + String(x))
}

type Direction = 'north' | 'south' | 'east' | 'west'
function move(dir: Direction) {
  switch (dir) {
    case 'north': return '위'
    case 'south': return '아래'
    case 'east': return '오른쪽'
    // 'west' 처리 안 하면 → default에서 'west'가 never에 할당 안 됨 → 에러
    default: assertNever(dir)
  }
}

// 역할 3: 조건부 타입에서 필터링
type NonNullable<T> = T extends null | undefined ? never : T
// never는 유니온에서 자동으로 제거됨
// string | never = string`,
    relatedProblems: ['ts-005', 'ts-004'],
  },
  {
    id: 'ts-013',
    category: 'typescript',
    subcategory: 'satisfies',
    type: 'multiple-choice',
    difficulty: 'hard',
    title: 'satisfies 연산자 (TS 4.9)',
    description: 'as 단언 대신 satisfies를 쓸 때의 차이는?',
    code: `type Colors = Record<string, string | [number, number, number]>

// A: as 단언
const palette1 = {
  red: [255, 0, 0],
  green: '#00ff00',
} as Colors

// B: satisfies
const palette2 = {
  red: [255, 0, 0],
  green: '#00ff00',
} satisfies Colors

palette1.red.toUpperCase() // ???
palette2.red.toUpperCase() // ???`,
    options: [
      '둘 다 컴파일 에러가 발생한다',
      '둘 다 정상 동작한다',
      'palette1.red는 컴파일 에러 없음, palette2.red는 컴파일 에러 발생',
      'palette1.red는 컴파일 에러 없음 (런타임 에러), palette2.red는 컴파일 에러 발생',
    ],
    correctAnswer: 3,
    explanation: `as 단언: 타입 검사를 억제하고 개발자가 단언한 타입으로 취급
→ palette1의 타입은 Colors → red의 타입은 string | [number, number, number]
→ toUpperCase()는 string에만 있지만, 타입이 넓어서 컴파일 에러 없음
→ 런타임에는 배열에 toUpperCase가 없어 에러 발생

satisfies: 타입 검사는 하되, 더 좁은 추론된 타입을 유지
→ palette2.red의 타입은 [number, number, number] (실제 값 기반 추론)
→ toUpperCase()는 배열에 없으므로 컴파일 에러 발생 ← 버그를 미리 잡음

satisfies = "이 타입을 만족하는지 검사해 주되, 내 타입은 더 정확하게 추론해줘"`,
    hints: ['as는 타입을 넓히고, satisfies는 타입을 유지합니다'],
    deepDive: `✅ satisfies가 빛나는 실전 패턴

// 설정 객체의 타입 안전성 + 자동완성
type Config = {
  port: number
  host: string
  db: { url: string; name: string }
}

// as를 쓰면: config.db.url에 자동완성 없음 (Config 타입으로 넓어짐)
// satisfies를 쓰면: 원래 추론 타입 유지 + Config 준수 여부 검사

const config = {
  port: 3000,
  host: 'localhost',
  db: { url: 'mongodb://...', name: 'mydb' },
} satisfies Config

// ✅ port는 3000 (number 리터럴)으로 추론됨 — Config 검사도 통과
// ✅ 잘못된 필드 추가 시 에러: extra: true → Config에 없는 키

// 라우트 정의에 활용
type Route = { path: string; component: React.FC }
const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About },
] satisfies Route[]
// 각 요소의 타입이 Route[]로 넓혀지지 않고 각각 유지됨`,
    relatedProblems: ['ts-007', 'ts-001'],
  },
  {
    id: 'ts-014',
    category: 'typescript',
    subcategory: '조건부 타입',
    type: 'code-output',
    difficulty: 'hard',
    title: '분배적 조건부 타입',
    description: 'A와 B의 타입은?',
    code: `type ToArray<T> = T extends any ? T[] : never

type A = ToArray<string | number>
type B = ToArray<string | number> // 같아 보이지만...

// 비교용:
type ToArrayNonDist<T> = [T] extends [any] ? T[] : never
type C = ToArrayNonDist<string | number>`,
    options: [
      'A: (string | number)[], B: (string | number)[], C: (string | number)[]',
      'A: string[] | number[], B: string[] | number[], C: (string | number)[]',
      'A: string[] | number[], B: string[] | number[], C: never',
      'A: never, B: never, C: (string | number)[]',
    ],
    correctAnswer: 1,
    explanation: `조건부 타입에 유니온이 들어오면 각 멤버에 분배(distribute)됩니다.

ToArray<string | number>
→ ToArray<string> | ToArray<number>  (유니온에 분배)
→ string[] | number[]

이것이 분배적 조건부 타입(Distributive Conditional Types)입니다.

ToArrayNonDist<T>: [T] extends [any]로 감싸면 분배 막음
→ T = string | number 전체에 적용
→ (string | number)[]

언제 분배를 막나?
- 유니온 전체를 하나의 타입으로 다루고 싶을 때
- NonNullable<T>같은 필터링은 분배가 필요
- 튜플로 감싸면 분배 방지`,
    hints: ['조건부 타입은 유니온에 자동으로 분배됩니다'],
    deepDive: `🔀 분배적 조건부 타입 활용: 유니온 필터링

// 유니온에서 특정 타입만 추출 (분배 덕분에 동작)
type Filter<T, U> = T extends U ? T : never

type OnlyString = Filter<string | number | boolean, string>
// = Filter<string, string> | Filter<number, string> | Filter<boolean, string>
// = string | never | never
// = string  ← never는 유니온에서 자동 제거!

// 내장 Extract / Exclude가 이 방식으로 구현됨
type Extract<T, U> = T extends U ? T : never
type Exclude<T, U> = T extends U ? never : T

// 실용 예: 특정 키만 허용하는 타입 필터
type KeysOfType<T, V> = {
  [K in keyof T]: T[K] extends V ? K : never
}[keyof T]

// User에서 string 타입 필드의 키만 추출
type User = { id: number; name: string; email: string; age: number }
type StringKeys = KeysOfType<User, string>  // 'name' | 'email'

// Pick과 조합
type PickByType<T, V> = Pick<T, KeysOfType<T, V>>
type StringFields = PickByType<User, string>  // { name: string; email: string }`,
    relatedProblems: ['ts-010', 'ts-009'],
  },
  {
    id: 'ts-015',
    category: 'typescript',
    subcategory: '템플릿 리터럴 타입',
    type: 'multiple-choice',
    difficulty: 'hard',
    title: '맵드 타입 + 키 리매핑',
    description: 'Getters<User>의 결과 타입은?',
    code: `type User = { id: number; name: string }

type Getters<T> = {
  [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K]
}

type UserGetters = Getters<User>`,
    options: [
      '{ id: () => number; name: () => string }',
      '{ getId: () => number; getName: () => string }',
      '{ getid: () => number; getname: () => string }',
      '{ get_id: () => number; get_name: () => string }',
    ],
    correctAnswer: 1,
    explanation: `as 절을 이용한 키 리매핑(Key Remapping):

[K in keyof T as 새키]: 값
→ K를 순회하면서 키를 변환

\`get\${Capitalize<string & K>}\`:
- string & K: K가 string 타입임을 보장
- Capitalize<'id'> = 'Id'
- \`get\${'Id'}\` = 'getId'

처리 흐름:
K = 'id'   → 'getId'   : () => number
K = 'name' → 'getName' : () => string

결과: { getId: () => number; getName: () => string }

as 절로 키를 필터링할 수도 있습니다:
// boolean 값 키 제거
[K in keyof T as T[K] extends boolean ? never : K]`,
    hints: ['as 절은 맵드 타입의 키를 변환합니다'],
    deepDive: `🔑 키 리매핑 고급 패턴

// 특정 타입의 키 필터링 (as + never)
type OmitByType<T, U> = {
  [K in keyof T as T[K] extends U ? never : K]: T[K]
}

type User = { id: number; name: string; active: boolean; age: number }
type NoBoolean = OmitByType<User, boolean>
// { id: number; name: string; age: number }

// Setters 생성
type Setters<T> = {
  [K in keyof T as \`set\${Capitalize<string & K>}\`]: (val: T[K]) => void
}

// 이벤트 핸들러 타입 생성
type EventMap = { click: MouseEvent; change: InputEvent }
type Handlers = {
  [K in keyof EventMap as \`on\${Capitalize<string & K>}\`]?: (e: EventMap[K]) => void
}
// { onClick?: (e: MouseEvent) => void; onChange?: (e: InputEvent) => void }

// 읽기 전용 버전 생성 (키 변환 없이 타입만 변환)
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K]
}`,
    relatedProblems: ['ts-011', 'ts-009'],
  },
]
