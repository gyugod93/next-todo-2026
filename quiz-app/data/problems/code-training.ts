import type { Problem } from '@/types'

export const codeTrainingProblems: Problem[] = [
  // ─── code-fix: 직접 버그 수정 ────────────────────────────────────────────────

  {
    id: 'fix-q-001',
    category: 'code-training',
    subcategory: 'react-hooks',
    type: 'code-fix',
    difficulty: 'medium',
    title: 'useEffect 무한 루프 — dependency array 수정',
    description:
      '아래 코드를 실행하면 무한 API 호출이 발생합니다. dependency array를 수정해서 컴포넌트 마운트 시 한 번만 호출되도록 고쳐보세요.',
    code: `function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    fetch(\`/api/users/\${userId}\`)
      .then(res => res.json())
      .then(data => setUser(data))
  }) // 매 렌더마다 실행됨

  return <div>{user?.name}</div>
}`,
    correctAnswer: `function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    fetch(\`/api/users/\${userId}\`)
      .then(res => res.json())
      .then(data => setUser(data))
  }, [userId]) // userId가 바뀔 때만 재실행

  return <div>{user?.name}</div>
}`,
    explanation:
      'useEffect에 두 번째 인수(dependency array)가 없으면 매 렌더링마다 실행됩니다. setUser가 호출되면 렌더링 → useEffect 재실행 → setUser → 무한 반복. [userId]를 추가하면 userId가 바뀔 때만 재실행되고, 마운트 시 한 번 실행됩니다.',
    hints: [
      'useEffect 두 번째 인수가 없으면 매 렌더마다 실행됩니다',
      'userId가 바뀔 때만 다시 조회해야 합니다',
    ],
    deepDive:
      'dependency array 규칙:\n• [] → 마운트 시 한 번만\n• [a, b] → a 또는 b가 바뀔 때마다\n• 생략 → 매 렌더마다\n\nESLint react-hooks/exhaustive-deps 규칙이 dependency array 누락을 자동 감지합니다. 반드시 활성화하세요.\n\n함수를 dependency에 넣을 때 무한 루프 주의:\n```tsx\n// 잘못됨: fetchUser가 매 렌더마다 새 함수\nconst fetchUser = () => fetch(...)\nuseEffect(() => { fetchUser() }, [fetchUser]) // 무한 루프!\n\n// 해결: useCallback으로 안정화\nconst fetchUser = useCallback(() => fetch(...), [userId])\nuseEffect(() => { fetchUser() }, [fetchUser])\n```',
    relatedProblems: ['fix-q-006'],
  },

  {
    id: 'fix-q-002',
    category: 'code-training',
    subcategory: 'async-await',
    type: 'code-fix',
    difficulty: 'easy',
    title: 'Promise 처리 오류 — await 누락',
    description:
      '아래 코드에서 user가 항상 undefined입니다. 버그를 찾아 수정하세요.',
    code: `async function getUser(id: string) {
  const res = fetch(\`/api/users/\${id}\`) // await 없음
  const user = res.json()               // await 없음
  return user
}

// 사용하는 쪽
const user = await getUser("123")
console.log(user.name) // TypeError: Cannot read properties of undefined`,
    correctAnswer: `async function getUser(id: string) {
  const res = await fetch(\`/api/users/\${id}\`)
  const user = await res.json()
  return user
}`,
    explanation:
      'await 없이 fetch()를 호출하면 Promise 객체 자체가 반환됩니다. res는 Response 객체가 아닌 Promise<Response>이고, res.json()도 Promise<any>입니다. 두 곳 모두 await를 붙여야 실제 값을 받을 수 있습니다.',
    hints: [
      'fetch()는 Promise를 반환합니다',
      'async 함수 안에서 Promise 값을 쓰려면 await가 필요합니다',
    ],
    deepDive:
      '자주 하는 실수 패턴:\n```typescript\n// 1. then 체인과 await 혼용 (문제 없지만 일관성 없음)\nconst res = await fetch(url)\nconst data = res.json().then(d => d) // 여기도 await 필요!\n\n// 2. forEach 안에서 await (동작 안 함)\nids.forEach(async (id) => {\n  const user = await getUser(id) // forEach는 async를 기다리지 않음!\n})\n// 해결:\nfor (const id of ids) {\n  const user = await getUser(id)\n}\n// 또는 병렬 처리:\nconst users = await Promise.all(ids.map(id => getUser(id)))\n\n// 3. try-catch가 없는 async 함수 (프로덕션에서 반드시 추가)\nasync function getUser(id: string) {\n  try {\n    const res = await fetch(`/api/users/${id}`)\n    if (!res.ok) throw new Error(`HTTP ${res.status}`)\n    return await res.json()\n  } catch (err) {\n    console.error("getUser failed:", err)\n    throw err // 또는 null 반환\n  }\n}\n```',
    relatedProblems: ['fix-q-003'],
  },

  {
    id: 'fix-q-003',
    category: 'code-training',
    subcategory: 'mongoose',
    type: 'code-fix',
    difficulty: 'hard',
    title: 'Mongoose N+1 쿼리 — forEach 안 populate',
    description:
      '게시글 목록 API가 매우 느립니다. 100개 게시글을 조회하면 DB 쿼리가 101번 발생합니다. 수정하세요.',
    code: `// 게시글 목록 조회 API
async function getPosts() {
  const posts = await Post.find({}).lean()

  // 각 게시글마다 작성자 정보를 별도로 조회 (N+1 문제!)
  for (const post of posts) {
    const author = await User.findById(post.authorId).lean()
    post.author = author
  }

  return posts
}`,
    correctAnswer: `async function getPosts() {
  const posts = await Post.find({})
    .populate('authorId', 'name email avatar')
    .lean()

  return posts
}`,
    explanation:
      'N+1 문제: Post 목록 1번 + 각 Post마다 User 조회 N번 = 총 N+1번의 DB 쿼리 발생. populate()를 사용하면 Mongoose가 내부적으로 필요한 User _id 목록을 모아 User.find({ _id: { $in: [...] } }) 단 1번만 실행합니다. 총 쿼리: 1 + 1 = 2번.',
    hints: [
      'Mongoose populate()를 사용하면 한 번의 추가 쿼리로 모든 참조를 해결합니다',
      'for 반복문 안에서 DB 쿼리는 N+1 문제의 신호입니다',
    ],
    deepDive:
      'populate 동작 원리:\n```javascript\n// Mongoose 내부에서 실행되는 쿼리:\n// 1. Post.find({}) → posts 조회\n// 2. User.find({ _id: { $in: [id1, id2, ...] } }) → 한 번에 조회\n\n// 필드 선택으로 불필요한 데이터 제외\nPost.find({}).populate(\'authorId\', \'name email\') // select: "name email"\n\n// 중첩 populate\nPost.find({}).populate({\n  path: \'authorId\',\n  select: \'name\',\n  populate: { path: \'department\', select: \'name\' }\n})\n\n// 대안: Aggregation $lookup (더 복잡하지만 대용량에 유리)\nPost.aggregate([\n  { $lookup: {\n    from: \'users\',\n    localField: \'authorId\',\n    foreignField: \'_id\',\n    as: \'author\'\n  }},\n  { $unwind: \'$author\' }\n])\n```\n\n언제 populate 대신 $lookup?\n• 복잡한 집계(GROUP BY, COUNT)가 필요할 때\n• 수십만 건 이상 대용량 데이터\n• 조인 조건이 복잡할 때',
    relatedProblems: ['db-q-008', 'db-q-013'],
  },

  {
    id: 'fix-q-004',
    category: 'code-training',
    subcategory: 'nextjs',
    type: 'code-fix',
    difficulty: 'easy',
    title: "Next.js 'use client' 누락 — useState in Server Component",
    description:
      '아래 코드를 실행하면 에러가 발생합니다. 최소한의 수정으로 고쳐보세요.',
    code: `// app/components/Counter.tsx
import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)

  return (
    <button onClick={() => setCount(c => c + 1)}>
      클릭 {count}
    </button>
  )
}`,
    correctAnswer: `'use client'

import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)

  return (
    <button onClick={() => setCount(c => c + 1)}>
      클릭 {count}
    </button>
  )
}`,
    explanation:
      "Next.js App Router에서 파일은 기본적으로 Server Component입니다. useState, useEffect, onClick 등 브라우저 전용 API는 Client Component에서만 사용 가능합니다. 파일 최상단에 'use client'를 추가하면 해당 파일과 그 하위 임포트가 클라이언트 번들에 포함됩니다.",
    hints: [
      "useState는 브라우저에서만 동작합니다",
      "App Router에서 클라이언트 기능을 쓰려면 파일 맨 위에 한 줄 추가가 필요합니다",
    ],
    deepDive:
      "Server Component vs Client Component 경계:\n```\n'use client' 경계 규칙:\n• 'use client'를 선언한 파일부터 클라이언트 컴포넌트\n• 그 파일이 import하는 모든 모듈도 클라이언트 번들에 포함\n• Server Component는 Client Component를 import 가능\n• Client Component는 Server Component를 직접 import 불가\n  (단, children prop으로 전달은 가능)\n```\n\n클라이언트에서만 쓸 수 있는 것:\n• useState, useEffect, useRef, useContext 등 모든 hooks\n• onClick, onChange 등 이벤트 핸들러\n• window, document, localStorage 등 브라우저 API\n\n서버에서만 쓸 수 있는 것:\n• 직접 DB 접근 (Mongoose, Prisma)\n• 파일 시스템 (fs)\n• 환경변수 중 NEXT_PUBLIC_ 없는 것\n• async/await를 컴포넌트 최상위에서 (서버에서는 가능)",
    relatedProblems: ['fix-q-005'],
  },

  {
    id: 'fix-q-005',
    category: 'code-training',
    subcategory: 'nextjs',
    type: 'code-fix',
    difficulty: 'medium',
    title: 'Server Component에서 클라이언트 라이브러리 import',
    description:
      "아래 Server Component에서 에러가 발생합니다. 구조를 올바르게 분리해서 고쳐보세요. (toast는 브라우저에서만 동작합니다)",
    code: `// app/posts/page.tsx (Server Component)
import { toast } from 'sonner'  // 브라우저 전용 라이브러리
import { getPosts } from '@/lib/db'

export default async function PostsPage() {
  const posts = await getPosts() // 서버에서 DB 직접 조회

  const handleDelete = async (id: string) => {
    await fetch(\`/api/posts/\${id}\`, { method: 'DELETE' })
    toast.success('삭제 완료') // 서버에서 실행 불가
  }

  return (
    <div>
      {posts.map(post => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <button onClick={() => handleDelete(post.id)}>삭제</button>
        </div>
      ))}
    </div>
  )
}`,
    correctAnswer: `// app/posts/page.tsx (Server Component — DB 조회 담당)
import { getPosts } from '@/lib/db'
import PostList from './PostList'

export default async function PostsPage() {
  const posts = await getPosts()
  return <PostList posts={posts} />
}

// app/posts/PostList.tsx (Client Component — 인터랙션 담당)
'use client'
import { toast } from 'sonner'

export default function PostList({ posts }) {
  const handleDelete = async (id: string) => {
    await fetch(\`/api/posts/\${id}\`, { method: 'DELETE' })
    toast.success('삭제 완료')
  }

  return (
    <div>
      {posts.map(post => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <button onClick={() => handleDelete(post.id)}>삭제</button>
        </div>
      ))}
    </div>
  )
}`,
    explanation:
      "Server Component는 브라우저 전용 라이브러리(toast, 이벤트 핸들러 등)를 사용할 수 없습니다. 해결 패턴: Server Component는 데이터 페칭만 담당하고, 상호작용이 필요한 부분은 별도 Client Component('use client')로 분리하여 props로 데이터를 전달합니다.",
    hints: [
      '컴포넌트를 역할별로 분리해보세요: 데이터 조회 vs 사용자 인터랙션',
      "인터랙션이 있는 부분만 'use client' 파일로 따로 만드세요",
    ],
    deepDive:
      "분리 전략 — 최소 클라이언트 번들 원칙:\n```\n✅ 좋은 구조:\napp/posts/\n  page.tsx      ← Server Component (DB 조회, async)\n  PostList.tsx  ← Client Component (onClick, toast)\n  PostCard.tsx  ← Server Component (단순 표시만)\n\n❌ 피해야 할 구조:\n• 전체 페이지를 'use client'로 만드는 것\n  → 서버 렌더링 이점 포기, 번들 크기 증가\n```\n\n데이터 전달 패턴:\n```tsx\n// Server → Client: props로 직렬화 가능한 데이터만\n// 가능: string, number, boolean, plain object, array\n// 불가능: Date 객체(string으로 변환), 함수, class 인스턴스\n\n// Server Component에서 Suspense 활용\nexport default function Page() {\n  return (\n    <Suspense fallback={<Skeleton />}>\n      <AsyncPosts />  {/* Server Component, async */}\n    </Suspense>\n  )\n}\n```",
    relatedProblems: ['fix-q-004'],
  },

  {
    id: 'fix-q-006',
    category: 'code-training',
    subcategory: 'react-hooks',
    type: 'code-fix',
    difficulty: 'medium',
    title: 'useEffect 메모리 누수 — cleanup 함수 누락',
    description:
      '아래 컴포넌트가 언마운트될 때 타이머가 계속 실행되어 메모리 누수가 발생합니다. 수정하세요.',
    code: `function LiveTimer() {
  const [time, setTime] = useState(new Date().toLocaleTimeString())

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString())
    }, 1000)
    // 컴포넌트 언마운트 후에도 interval이 계속 실행!
    // "Can't perform a React state update on an unmounted component"
  }, [])

  return <p>현재 시각: {time}</p>
}`,
    correctAnswer: `function LiveTimer() {
  const [time, setTime] = useState(new Date().toLocaleTimeString())

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString())
    }, 1000)

    return () => clearInterval(interval) // cleanup: 언마운트 시 타이머 해제
  }, [])

  return <p>현재 시각: {time}</p>
}`,
    explanation:
      'useEffect의 return 함수(cleanup)는 컴포넌트 언마운트 시, 또는 effect 재실행 직전에 호출됩니다. setInterval, setTimeout, EventListener, WebSocket 등 외부 리소스를 사용할 때 반드시 cleanup에서 해제해야 합니다. 누락 시 언마운트된 컴포넌트에 state 업데이트가 시도되어 메모리 누수와 경고가 발생합니다.',
    hints: [
      'useEffect는 cleanup 함수를 반환할 수 있습니다',
      'clearInterval()로 타이머를 해제하세요',
    ],
    deepDive:
      'cleanup이 필요한 패턴들:\n```typescript\n// 1. setInterval / setTimeout\nuseEffect(() => {\n  const id = setInterval(fn, 1000)\n  return () => clearInterval(id)\n}, [])\n\n// 2. EventListener\nuseEffect(() => {\n  window.addEventListener(\'resize\', handleResize)\n  return () => window.removeEventListener(\'resize\', handleResize)\n}, [])\n\n// 3. WebSocket / EventSource\nuseEffect(() => {\n  const ws = new WebSocket(url)\n  ws.onmessage = handleMessage\n  return () => ws.close()\n}, [url])\n\n// 4. AbortController (fetch 취소)\nuseEffect(() => {\n  const controller = new AbortController()\n  fetch(url, { signal: controller.signal })\n    .then(r => r.json())\n    .then(setData)\n    .catch(err => {\n      if (err.name !== \'AbortError\') setError(err)\n    })\n  return () => controller.abort()\n}, [url])\n\n// 5. Intersection Observer\nuseEffect(() => {\n  const observer = new IntersectionObserver(callback)\n  observer.observe(ref.current)\n  return () => observer.disconnect()\n}, [])\n```',
    relatedProblems: ['fix-q-001'],
  },

  {
    id: 'fix-q-007',
    category: 'code-training',
    subcategory: 'nestjs',
    type: 'code-fix',
    difficulty: 'medium',
    title: 'NestJS — ValidationPipe 없이 DTO 사용',
    description:
      '아래 NestJS 코드에서 사용자가 age에 문자열 "abc"를 전달해도 오류가 발생하지 않습니다. 수정하세요.',
    code: `// create-user.dto.ts
import { IsString, IsEmail, IsNumber, Min } from 'class-validator'

export class CreateUserDto {
  @IsString()
  name: string

  @IsEmail()
  email: string

  @IsNumber()
  @Min(0)
  age: number
}

// user.controller.ts
@Controller('users')
export class UserController {
  @Post()
  create(@Body() dto: CreateUserDto) {
    // dto.age = "abc"여도 그냥 통과됨
    return this.userService.create(dto)
  }
}

// main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  // ValidationPipe 등록 없음
  await app.listen(3000)
}`,
    correctAnswer: `// main.ts — ValidationPipe 전역 등록
async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,       // DTO에 없는 필드 자동 제거
      forbidNonWhitelisted: true, // 불필요 필드 있으면 400 반환
      transform: true,       // 타입 자동 변환 (string "1" → number 1)
    })
  )
  await app.listen(3000)
}`,
    explanation:
      'class-validator 데코레이터(@IsString, @IsEmail 등)는 선언만으로는 작동하지 않습니다. NestJS ValidationPipe가 요청이 들어올 때 DTO 클래스에 붙은 데코레이터를 실행합니다. ValidationPipe 없이는 타입 검사 없이 그대로 통과됩니다. main.ts에 전역 등록하거나 @UsePipes() 데코레이터로 특정 라우트에만 적용할 수 있습니다.',
    hints: [
      'DTO 데코레이터는 ValidationPipe가 있어야 실행됩니다',
      'main.ts에서 전역으로 파이프를 등록해보세요',
    ],
    deepDive:
      'ValidationPipe 옵션 설명:\n```typescript\nnew ValidationPipe({\n  // whitelist: true — DTO에 정의되지 않은 필드를 자동 제거\n  // 예: { name, email, hacked: "injection" } → { name, email }\n  whitelist: true,\n\n  // forbidNonWhitelisted: true — 불필요 필드 있으면 400 에러\n  forbidNonWhitelisted: true,\n\n  // transform: true — 쿼리 파라미터/경로 파라미터 타입 변환\n  // ?page=1 → page: 1 (number, not string)\n  transform: true,\n\n  // transformOptions: class-transformer 설정\n  transformOptions: { enableImplicitConversion: true },\n\n  // exceptionFactory: 에러 응답 커스텀\n  exceptionFactory: (errors) => new BadRequestException(errors),\n})\n\n// 특정 라우트에만 적용 (파이프 범위)\n@Post()\n@UsePipes(new ValidationPipe())\ncreate(@Body() dto: CreateUserDto) {}\n\n// 특정 파라미터에만 적용\ncreate(@Body(ValidationPipe) dto: CreateUserDto) {}\n```\n\n필수 설치:\nnpm install class-validator class-transformer',
    relatedProblems: ['be-q-009', 'fix-q-008'],
  },

  {
    id: 'fix-q-008',
    category: 'code-training',
    subcategory: 'react-hooks',
    type: 'code-fix',
    difficulty: 'medium',
    title: 'React state 직접 변경 — 배열 mutation',
    description:
      '아래 코드에서 항목을 추가해도 화면이 업데이트되지 않습니다. 버그를 수정하세요.',
    code: `function TodoList() {
  const [todos, setTodos] = useState(['React 공부', 'NestJS 공부'])

  const addTodo = (text: string) => {
    todos.push(text)    // state 직접 변경 (mutation)
    setTodos(todos)     // 같은 참조 → React가 변경 감지 못 함
  }

  const removeTodo = (index: number) => {
    todos.splice(index, 1) // 직접 splice도 mutation
    setTodos(todos)
  }

  return (
    <ul>
      {todos.map((todo, i) => (
        <li key={i}>
          {todo}
          <button onClick={() => removeTodo(i)}>삭제</button>
        </li>
      ))}
      <button onClick={() => addTodo('새 항목')}>추가</button>
    </ul>
  )
}`,
    correctAnswer: `function TodoList() {
  const [todos, setTodos] = useState(['React 공부', 'NestJS 공부'])

  const addTodo = (text: string) => {
    setTodos(prev => [...prev, text]) // 새 배열 반환
  }

  const removeTodo = (index: number) => {
    setTodos(prev => prev.filter((_, i) => i !== index)) // 새 배열 반환
  }

  return (
    <ul>
      {todos.map((todo, i) => (
        <li key={i}>
          {todo}
          <button onClick={() => removeTodo(i)}>삭제</button>
        </li>
      ))}
      <button onClick={() => addTodo('새 항목')}>추가</button>
    </ul>
  )
}`,
    explanation:
      'React는 state 변경을 감지할 때 참조(reference)를 비교합니다. todos.push() 후 setTodos(todos)를 해도 todos 배열의 참조가 같아 React는 변경이 없다고 판단하여 리렌더링하지 않습니다. 스프레드 연산자([...prev, text])나 filter(), map()으로 항상 새 배열을 반환해야 합니다.',
    hints: [
      'React는 같은 참조면 변경이 없다고 판단합니다',
      '스프레드 연산자로 새 배열을 만들어보세요',
    ],
    deepDive:
      '불변성(Immutability) 패턴:\n```typescript\n// 배열 조작\nsetItems(prev => [...prev, newItem])           // 추가\nsetItems(prev => prev.filter(i => i.id !== id)) // 삭제\nsetItems(prev => prev.map(i =>                  // 수정\n  i.id === id ? { ...i, done: true } : i\n))\n\n// 객체 조작\nsetUser(prev => ({ ...prev, name: "홍길동" })) // 필드 수정\nsetUser(prev => ({ ...prev,                    // 중첩 객체 수정\n  address: { ...prev.address, city: "서울" }\n}))\n\n// 복잡한 중첩 → Immer 라이브러리 활용\nimport produce from \'immer\'\nsetState(produce(draft => {\n  draft.users[0].address.city = \'서울\'  // 직접 수정처럼 작성 가능\n}))\n\n// Zustand + Immer\nimport { immer } from \'zustand/middleware/immer\'\nconst useStore = create(immer((set) => ({\n  update: (id) => set(state => { state.items[id].done = true })\n})))\n```',
    relatedProblems: ['fix-q-001'],
  },

  {
    id: 'fix-q-009',
    category: 'code-training',
    subcategory: 'mongoose',
    type: 'code-fix',
    difficulty: 'medium',
    title: 'Mongoose updateOne — $set 없이 전체 document 교체',
    description:
      '아래 코드에서 이름만 업데이트하려 했는데 실행 후 email, age 필드가 사라졌습니다. 왜 그런지 파악하고 수정하세요.',
    code: `// 사용자 이름만 바꾸려는 의도
async function updateUserName(id: string, name: string) {
  await User.updateOne(
    { _id: id },
    { name }  // $set 없이 전달 → 전체 document를 { name }으로 교체!
  )
}

// 실행 결과:
// Before: { _id: "...", name: "김철수", email: "cs@test.com", age: 30 }
// After:  { _id: "...", name: "홍길동" }  ← email, age 사라짐!`,
    correctAnswer: `async function updateUserName(id: string, name: string) {
  await User.updateOne(
    { _id: id },
    { $set: { name } }  // $set으로 해당 필드만 업데이트
  )
}`,
    explanation:
      'Mongoose updateOne()의 두 번째 인수에 $set, $push 같은 업데이트 연산자 없이 일반 객체를 전달하면 MongoDB가 해당 document를 통째로 교체(replace)합니다. 특정 필드만 업데이트하려면 반드시 $set을 사용해야 합니다. $set은 명시한 필드만 변경하고 나머지는 그대로 둡니다.',
    hints: [
      'MongoDB 업데이트 연산자($set)를 사용해야 합니다',
      '$set 없이 객체를 전달하면 전체 document를 교체합니다',
    ],
    deepDive:
      '안전한 Mongoose 업데이트 패턴:\n```typescript\n// ✅ $set으로 특정 필드만 업데이트\nawait User.updateOne({ _id: id }, { $set: { name, updatedAt: new Date() } })\n\n// ✅ findByIdAndUpdate — new: true로 업데이트된 document 반환\nconst updated = await User.findByIdAndUpdate(\n  id,\n  { $set: { name } },\n  { new: true, runValidators: true } // 스키마 검증 실행\n)\n\n// ✅ save() — 인스턴스로 업데이트 (pre(\'save\') 훅 실행됨)\nconst user = await User.findById(id)\nuser.name = name\nawait user.save()\n\n// ❌ 위험한 패턴들\nawait User.updateOne({ _id: id }, { name })           // 교체!\nawait User.findByIdAndUpdate(id, { name })             // 교체!\nawait User.replaceOne({ _id: id }, { name })           // 의도적 교체 시만 사용\n\n// $set 없이 안전하게 — spread로 명시적 관리\nconst updateData = { $set: { ...dto } } // DTO 전체를 $set으로\nawait User.updateOne({ _id: id }, updateData)\n```',
    relatedProblems: ['db-q-006', 'db-q-009'],
  },

  {
    id: 'fix-q-010',
    category: 'code-training',
    subcategory: 'nestjs',
    type: 'code-fix',
    difficulty: 'hard',
    title: 'NestJS Guard — 인증 없이 보호된 라우트 접근 가능',
    description:
      '아래 코드에서 토큰 없이도 /profile에 접근됩니다. 인증 가드를 올바르게 적용하세요.',
    code: `// jwt-auth.guard.ts
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

// user.controller.ts
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('profile')
  // @UseGuards(JwtAuthGuard) ← 주석 처리되어 있음
  getProfile(@Request() req) {
    return req.user // undefined — Guard 없어서 user 주입 안 됨
  }

  @Get('public')
  getPublicInfo() {
    return { status: 'ok' }
  }
}`,
    correctAnswer: `@Controller('users')
@UseGuards(JwtAuthGuard) // 컨트롤러 전체에 가드 적용
export class UserController {
  constructor(private userService: UserService) {}

  @Get('profile')
  getProfile(@Request() req) {
    return req.user // JwtStrategy가 주입한 user 객체
  }

  @Get('public')
  @SkipAuth() // 특정 라우트만 가드 제외 (커스텀 데코레이터)
  getPublicInfo() {
    return { status: 'ok' }
  }
}`,
    explanation:
      '@UseGuards(JwtAuthGuard)를 라우트 핸들러 또는 컨트롤러에 적용해야 JWT 검증이 실행됩니다. 컨트롤러 레벨에 적용하면 모든 라우트에 자동 적용됩니다. 일부 라우트만 공개하려면 @SkipAuth() 같은 커스텀 데코레이터 + Guard 내부의 Reflector로 예외 처리합니다.',
    hints: [
      '@UseGuards() 데코레이터 위치를 확인하세요',
      '컨트롤러 레벨에 적용하면 모든 라우트에 적용됩니다',
    ],
    deepDive:
      '@SkipAuth() 패턴 구현:\n```typescript\n// skip-auth.decorator.ts\nimport { SetMetadata } from \'@nestjs/common\'\nexport const IS_PUBLIC_KEY = \'isPublic\'\nexport const SkipAuth = () => SetMetadata(IS_PUBLIC_KEY, true)\n\n// jwt-auth.guard.ts\n@Injectable()\nexport class JwtAuthGuard extends AuthGuard(\'jwt\') {\n  constructor(private reflector: Reflector) { super() }\n\n  canActivate(context: ExecutionContext) {\n    const isPublic = this.reflector.getAllAndOverride<boolean>(\n      IS_PUBLIC_KEY,\n      [context.getHandler(), context.getClass()]\n    )\n    if (isPublic) return true\n    return super.canActivate(context)\n  }\n}\n\n// main.ts — 전역 가드 등록 (모든 라우트에 적용)\napp.useGlobalGuards(new JwtAuthGuard(reflector))\n// 이후 공개 라우트에만 @SkipAuth() 추가하는 방식\n```\n\n가드 적용 범위 (좁은 → 넓은):\n1. @UseGuards() on method — 해당 라우트만\n2. @UseGuards() on class — 컨트롤러 전체\n3. app.useGlobalGuards() — 앱 전체',
    relatedProblems: ['be-q-008', 'be-q-010'],
  },


  {
    id: 'fix-q-011',
    category: 'code-training',
    subcategory: 'react-hooks',
    type: 'code-fix',
    difficulty: 'medium',
    title: 'useEffect 무한 루프 — 객체 참조 동일성',
    description:
      '버튼을 클릭하지 않았는데도 무한 API 호출이 발생합니다. 원인을 파악하고 수정하세요.',
    code: `function UserList() {
  const [users, setUsers] = useState([])
  // 렌더마다 새 객체 생성!
  const filters = { role: 'all', active: true }

  useEffect(() => {
    fetchUsers(filters).then(setUsers)
  }, [filters]) // 항상 새 참조 → 항상 변경 감지 → 무한루프

  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>
}`,
    correctAnswer: `function UserList() {
  const [users, setUsers] = useState([])
  const [role, setRole] = useState('all')
  const [active, setActive] = useState(true)

  useEffect(() => {
    fetchUsers({ role, active }).then(setUsers)
  }, [role, active]) // 원시값: 실제 변경 시에만 실행

  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>
}`,
    explanation:
      "JavaScript는 객체를 참조(메모리 주소)로 비교합니다. { role: 'all' } === { role: 'all' }는 false입니다. 컴포넌트 안에서 const filters = { ... }를 선언하면 렌더마다 새 객체가 생성됩니다. React의 useEffect는 deps를 Object.is()로 비교하는데 항상 새 참조 → 항상 변경으로 판단 → effect 실행 → setUsers → 리렌더 → 또 새 filters → 무한루프. 원시값(string, boolean)을 deps에 넣으면 실제 값이 바뀔 때만 실행됩니다.",
    hints: [
      "객체 비교: { role: 'all' } === { role: 'all' } // false (다른 참조)",
      'deps에는 원시값(string, number, boolean)이 안전합니다',
    ],
    deepDive:
      '해결 방법 3가지:\n\n1. 원시값으로 분리 (권장)\nconst [role, setRole] = useState("all")\nconst [active, setActive] = useState(true)\nuseEffect(() => { fetchUsers({role, active}).then(setUsers) }, [role, active])\n\n2. useState에 객체 저장\nconst [filters, setFilters] = useState({ role: "all", active: true })\nuseEffect(() => { fetchUsers(filters).then(setUsers) }, [filters])\n\n3. useMemo로 참조 안정화\nconst stable = useMemo(() => ({ role, active }), [role, active])\nuseEffect(() => { fetchUsers(stable).then(setUsers) }, [stable])\n\n규칙: deps에는 원시값이 안전. 객체는 참조가 안정적인 것만.',
    relatedProblems: ['fix-q-001', 'fix-q-006', 'cs-q-007'],
  },

  // ─── self-check: 직접 작성 후 모범 답안 비교 ─────────────────────────────────

  {
    id: 'sc-q-001',
    category: 'code-training',
    subcategory: 'refactoring',
    type: 'self-check',
    difficulty: 'hard',
    title: '거대한 useEffect를 Custom Hook으로 추출하기',
    description:
      '아래 컴포넌트의 useEffect가 너무 많은 일을 합니다. 웹소켓 연결 로직을 Custom Hook으로 추출하여 컴포넌트를 단순하게 만들어보세요.',
    code: `// 현재 코드 — 리팩토링 대상
function ChatRoom({ roomId }: { roomId: string }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    const ws = new WebSocket(\`wss://api.example.com/chat/\${roomId}\`)
    wsRef.current = ws

    ws.onopen = () => setIsConnected(true)
    ws.onclose = () => setIsConnected(false)
    ws.onerror = () => setIsConnected(false)
    ws.onmessage = (e) => {
      const msg = JSON.parse(e.data)
      setMessages(prev => [...prev, msg])
    }

    return () => {
      ws.close()
      wsRef.current = null
    }
  }, [roomId])

  const sendMessage = (text: string) => {
    wsRef.current?.send(JSON.stringify({ text, roomId }))
  }

  return (
    <div>
      <p>{isConnected ? '연결됨' : '연결 중...'}</p>
      <MessageList messages={messages} />
      <MessageInput onSend={sendMessage} />
    </div>
  )
}`,
    correctAnswer: `// Custom Hook으로 추출
function useChatRoom(roomId: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    const ws = new WebSocket(\`wss://api.example.com/chat/\${roomId}\`)
    wsRef.current = ws

    ws.onopen = () => setIsConnected(true)
    ws.onclose = () => setIsConnected(false)
    ws.onerror = () => setIsConnected(false)
    ws.onmessage = (e) => {
      const msg = JSON.parse(e.data)
      setMessages(prev => [...prev, msg])
    }

    return () => {
      ws.close()
      wsRef.current = null
    }
  }, [roomId])

  const sendMessage = (text: string) => {
    wsRef.current?.send(JSON.stringify({ text, roomId }))
  }

  return { messages, isConnected, sendMessage }
}

// 컴포넌트가 단순해짐
function ChatRoom({ roomId }: { roomId: string }) {
  const { messages, isConnected, sendMessage } = useChatRoom(roomId)

  return (
    <div>
      <p>{isConnected ? '연결됨' : '연결 중...'}</p>
      <MessageList messages={messages} />
      <MessageInput onSend={sendMessage} />
    </div>
  )
}`,
    explanation:
      'Custom Hook 추출 기준: ① 같은 useEffect 로직이 여러 컴포넌트에서 반복될 때 ② 컴포넌트가 지나치게 복잡해질 때 ③ 로직을 독립적으로 테스트하고 싶을 때. Hook은 use로 시작하는 이름의 함수이며 내부에서 다른 Hook을 사용할 수 있습니다. 컴포넌트는 렌더링 UI에만 집중하게 됩니다.',
    hints: [
      'use로 시작하는 함수를 만들어 Hook 로직을 이동시켜 보세요',
      '컴포넌트가 필요한 값을 return으로 제공하면 됩니다',
    ],
    deepDive:
      'Custom Hook 설계 원칙:\n• 단일 책임: 한 Hook은 한 가지 관심사만\n• 반환값 설계: 컴포넌트가 필요한 것만 노출\n• 테스트 용이성: @testing-library/react-hooks로 독립 테스트 가능\n\n실무에서 자주 만드는 Custom Hook:\n• useDebounce(value, delay)\n• useIntersectionObserver(ref, options)\n• useLocalStorage(key, initialValue)\n• useAsync(asyncFn, deps)\n• useForm(initialValues, validate)',
    relatedProblems: ['fix-q-006'],
  },

  {
    id: 'sc-q-002',
    category: 'code-training',
    subcategory: 'refactoring',
    type: 'self-check',
    difficulty: 'hard',
    title: '반복되는 API fetch 로직 — 공통 유틸로 추출',
    description:
      '아래 코드에서 동일한 패턴의 API 호출이 반복됩니다. 에러 처리, 토큰 추가, 응답 파싱을 공통으로 처리하는 fetcher 함수를 작성해보세요.',
    code: `// 반복되는 패턴
async function getUser(id: string) {
  const token = localStorage.getItem('token')
  const res = await fetch(\`/api/users/\${id}\`, {
    headers: { Authorization: \`Bearer \${token}\` }
  })
  if (!res.ok) throw new Error(\`HTTP \${res.status}\`)
  return res.json()
}

async function getPosts() {
  const token = localStorage.getItem('token')
  const res = await fetch('/api/posts', {
    headers: { Authorization: \`Bearer \${token}\` }
  })
  if (!res.ok) throw new Error(\`HTTP \${res.status}\`)
  return res.json()
}

async function createPost(data: PostData) {
  const token = localStorage.getItem('token')
  const res = await fetch('/api/posts', {
    method: 'POST',
    headers: {
      Authorization: \`Bearer \${token}\`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  if (!res.ok) throw new Error(\`HTTP \${res.status}\`)
  return res.json()
}`,
    correctAnswer: `// 공통 fetcher 유틸
type FetchOptions = RequestInit & { skipAuth?: boolean }

async function fetcher<T>(url: string, options: FetchOptions = {}): Promise<T> {
  const { skipAuth = false, ...fetchOptions } = options

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  }

  if (!skipAuth) {
    const token = localStorage.getItem('token')
    if (token) headers['Authorization'] = \`Bearer \${token}\`
  }

  const res = await fetch(url, { ...fetchOptions, headers })

  if (res.status === 401) {
    // 토큰 만료 처리
    localStorage.removeItem('token')
    window.location.href = '/login'
    throw new Error('Unauthorized')
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.message ?? \`HTTP \${res.status}\`)
  }

  return res.json()
}

// 사용
const user = await fetcher<User>(\`/api/users/\${id}\`)
const posts = await fetcher<Post[]>('/api/posts')
const newPost = await fetcher<Post>('/api/posts', {
  method: 'POST',
  body: JSON.stringify(data),
})`,
    explanation:
      'DRY(Don\'t Repeat Yourself) 원칙: 동일한 로직이 3번 이상 반복되면 추상화를 고려합니다. 공통 fetcher를 만들면 ① 인증 토큰 관리 한 곳에서 ② 에러 처리 통일 ③ 401 자동 처리 ④ 타입 안전성(제네릭) 등 모든 API 호출에 일관성이 생깁니다. TanStack Query와 함께 사용하면 queryFn으로 활용됩니다.',
    hints: [
      '반복되는 부분(토큰, 헤더, 에러 처리)을 파라미터로 추상화해보세요',
      'TypeScript 제네릭으로 반환 타입을 표현할 수 있습니다',
    ],
    deepDive:
      'axios 인스턴스 vs 커스텀 fetcher:\n```typescript\n// axios 방식\nconst api = axios.create({ baseURL: \'/api\' })\napi.interceptors.request.use(config => {\n  config.headers.Authorization = `Bearer ${getToken()}`\n  return config\n})\napi.interceptors.response.use(null, error => {\n  if (error.response?.status === 401) redirect(\'/login\')\n  return Promise.reject(error)\n})\n\n// TanStack Query와 fetcher 조합\nconst { data } = useQuery({\n  queryKey: [\'user\', id],\n  queryFn: () => fetcher<User>(`/api/users/${id}`),\n})\n```',
    relatedProblems: ['fix-q-002'],
  },

  {
    id: 'sc-q-003',
    category: 'code-training',
    subcategory: 'typescript',
    type: 'self-check',
    difficulty: 'medium',
    title: 'API 응답 타입 안전하게 설계하기',
    description:
      '아래처럼 any가 가득한 코드를 TypeScript 타입으로 안전하게 만들어보세요. API 응답 wrapper 타입과 실제 데이터 타입을 설계하세요.',
    code: `// 현재 — any 투성이
async function getUser(id: string): Promise<any> {
  const res = await fetcher(\`/api/users/\${id}\`)
  return res // 타입: any
}

async function getPosts(): Promise<any[]> {
  const res = await fetcher('/api/posts')
  return res.data // 타입: any
}

// 사용하는 쪽에서 오타도 에러 없음
const user = await getUser('1')
console.log(user.naem)  // 오타인데 에러 없음!
user.nonExistentField   // 존재하지 않는 필드도 에러 없음!`,
    correctAnswer: `// 공통 API 응답 wrapper 타입
interface ApiResponse<T> {
  data: T
  message: string
  statusCode: number
}

interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}

// 도메인 타입 정의
interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user'
  createdAt: string
}

interface Post {
  id: string
  title: string
  content: string
  authorId: string
  author?: Pick<User, 'id' | 'name'>
  createdAt: string
}

// 타입 안전한 API 함수
async function getUser(id: string): Promise<User> {
  const res = await fetcher<ApiResponse<User>>(\`/api/users/\${id}\`)
  return res.data
}

async function getPosts(): Promise<PaginatedResponse<Post>> {
  return fetcher<PaginatedResponse<Post>>('/api/posts')
}

// 사용하는 쪽 — 타입 에러 즉시 감지
const user = await getUser('1')
console.log(user.naem)          // TS 에러: 'naem'은 없음
user.nonExistentField           // TS 에러: 없는 필드`,
    explanation:
      'any 타입은 TypeScript의 타입 안전성을 완전히 포기합니다. 제네릭(Generic)을 활용한 ApiResponse<T>로 래퍼 구조를 공통화하고, 각 도메인 타입(User, Post)을 명확히 정의하면 오타, 없는 필드 접근 등을 컴파일 타임에 잡을 수 있습니다.',
    hints: [
      '서버 응답의 공통 구조(data, message, statusCode)를 제네릭 타입으로 표현해보세요',
      'Pick, Omit 같은 유틸리티 타입을 활용해 User의 일부 필드만 선택할 수 있습니다',
    ],
    deepDive:
      '유용한 유틸리티 타입 활용:\n```typescript\n// Pick — 일부 필드만 선택\ntype UserPreview = Pick<User, \'id\' | \'name\' | \'avatar\'>\n\n// Omit — 특정 필드 제외\ntype CreateUserDto = Omit<User, \'id\' | \'createdAt\'>\n\n// Partial — 모든 필드 선택적\ntype UpdateUserDto = Partial<CreateUserDto>\n\n// Required — 모든 필드 필수로\ntype StrictUser = Required<Partial<User>>\n\n// Record — 키-값 맵\ntype RolePermissions = Record<User[\'role\'], string[]>\n\n// Discriminated Union — 상태별 타입 분기\ntype ApiState<T> =\n  | { status: \'loading\' }\n  | { status: \'success\'; data: T }\n  | { status: \'error\'; error: string }\n```',
    relatedProblems: ['fix-q-007'],
  },

  {
    id: 'sc-q-004',
    category: 'code-training',
    subcategory: 'mongoose',
    type: 'self-check',
    difficulty: 'hard',
    title: 'Mongoose Schema 설계 — 블로그 시스템',
    description:
      '블로그 시스템에서 User, Post, Comment 간의 관계를 Mongoose Schema로 설계해보세요.\n\n요구사항:\n• User는 여러 Post를 작성할 수 있다\n• Post는 여러 Comment를 가질 수 있다\n• Comment는 User가 작성한다\n• Post 목록 조회 시 작성자 이름이 필요하다\n• Comment는 최대 100개로 제한된다 (Embedding 고려)',
    code: `// 힌트: Mongoose Schema 기본 구조
import { Schema, model, Types } from 'mongoose'

// User, Post, Comment Schema를 설계하세요
// 각각 어떤 필드가 필요한지,
// 관계를 Embedding으로 할지 Referencing으로 할지 결정하세요`,
    correctAnswer: `import { Schema, model, Types, Document } from 'mongoose'

// User Schema
interface IUser extends Document {
  name: string
  email: string
  avatar?: string
  createdAt: Date
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  avatar: String,
}, { timestamps: true })

export const User = model<IUser>('User', UserSchema)

// Comment — Post에 Embedding (최대 100개, 함께 조회)
interface IComment {
  _id: Types.ObjectId
  authorId: Types.ObjectId
  content: string
  createdAt: Date
}

const CommentSchema = new Schema<IComment>({
  authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true, maxlength: 500 },
}, { timestamps: true, _id: true })

// Post Schema
interface IPost extends Document {
  title: string
  content: string
  authorId: Types.ObjectId
  tags: string[]
  comments: IComment[]
  viewCount: number
  createdAt: Date
}

const PostSchema = new Schema<IPost>({
  title: { type: String, required: true, maxlength: 200 },
  content: { type: String, required: true },
  authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  tags: [{ type: String }],
  comments: {
    type: [CommentSchema],
    validate: [(v: IComment[]) => v.length <= 100, '댓글은 최대 100개']
  },
  viewCount: { type: Number, default: 0 },
}, { timestamps: true })

// 자주 쓰는 쿼리 최적화 인덱스
PostSchema.index({ authorId: 1, createdAt: -1 })
PostSchema.index({ tags: 1 })

export const Post = model<IPost>('Post', PostSchema)

// 사용 예시
const posts = await Post.find({})
  .populate('authorId', 'name avatar')  // 작성자 이름만
  .sort({ createdAt: -1 })
  .limit(20)
  .lean()`,
    explanation:
      'Comment는 Post에 Embedding했습니다. 이유: ① Post와 항상 함께 조회 ② 최대 100개로 제한 ③ 독립적인 Comment 조회 불필요. 반면 Author는 Referencing: 동일한 User가 여러 Post에 공유되고 User 정보가 독립적으로 수정될 수 있기 때문입니다.',
    hints: [
      'Comment가 독립적으로 사용될지, 항상 Post와 함께 사용될지 생각해보세요',
      '개수가 제한적인 데이터는 Embedding이 유리합니다',
    ],
    deepDive:
      '스키마 설계 결정 체크리스트:\n\nEmbedding 선택 시:\n✅ 항상 부모 document와 함께 읽음\n✅ 개수가 제한적 (< 수백 개)\n✅ 독립적으로 쿼리할 일 없음\n✅ 원자적 업데이트 필요\n\nReferencing 선택 시:\n✅ 여러 document에서 공유되는 데이터\n✅ 개수가 무한정 증가 가능\n✅ 독립적으로 CRUD 필요\n✅ 16MB document 한도 초과 위험',
    relatedProblems: ['db-q-005', 'db-q-007'],
  },

  {
    id: 'sc-q-005',
    category: 'code-training',
    subcategory: 'nestjs',
    type: 'self-check',
    difficulty: 'hard',
    title: 'NestJS Module 구조 설계 — 기능별 분리',
    description:
      '아래 하나의 파일에 모든 로직이 들어있는 코드를 NestJS 모듈 구조로 분리해보세요.\n\n요구사항: UserModule, AuthModule을 분리하고 AuthModule이 UserModule에 의존하도록 구성하세요.',
    code: `// 현재 — 모든 게 한 파일에 (나쁜 예)
@Controller('auth')
export class AppController {
  constructor(
    private jwtService: JwtService,
    @InjectModel('User') private userModel: Model<User>
  ) {}

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const user = await this.userModel.findOne({ email: dto.email })
    const valid = await bcrypt.compare(dto.password, user.password)
    if (!valid) throw new UnauthorizedException()
    return { token: this.jwtService.sign({ sub: user._id }) }
  }

  @Get('users')
  getUsers() {
    return this.userModel.find()
  }
}`,
    correctAnswer: `// ✅ user.module.ts
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
  ],
  providers: [UserService],
  exports: [UserService],  // AuthModule에서 사용할 수 있도록 export
})
export class UserModule {}

// ✅ user.service.ts
@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).select('+password')
  }

  async findAll() {
    return this.userModel.find().lean()
  }
}

// ✅ user.controller.ts
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  findAll() { return this.userService.findAll() }
}

// ✅ auth.module.ts
@Module({
  imports: [
    UserModule,  // UserService를 가져오기 위해 import
    JwtModule.register({ secret: process.env.JWT_SECRET, signOptions: { expiresIn: '15m' } }),
    PassportModule,
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}

// ✅ auth.service.ts
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,  // UserModule에서 export된 서비스
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.userService.findByEmail(dto.email)
    if (!user || !await bcrypt.compare(dto.password, user.password)) {
      throw new UnauthorizedException()
    }
    return { accessToken: this.jwtService.sign({ sub: user._id, role: user.role }) }
  }
}`,
    explanation:
      'NestJS 모듈 분리 원칙: ① 기능 단위로 모듈 분리 (User, Auth, Post...) ② 다른 모듈이 필요한 것만 exports ③ 모듈 간 의존성은 imports로 명시. AuthModule이 UserService를 쓰려면 UserModule에서 exports: [UserService]를 선언하고 AuthModule에서 imports: [UserModule]로 가져와야 합니다.',
    hints: [
      'UserModule이 UserService를 exports해야 다른 모듈에서 사용 가능합니다',
      'Controller, Service, Module의 역할을 파일로 분리하세요',
    ],
    deepDive:
      '모듈 의존성 패턴:\n```\nAppModule\n├── UserModule (exports: [UserService])\n│   ├── UserController\n│   └── UserService\n├── AuthModule (imports: [UserModule, JwtModule])\n│   ├── AuthController\n│   ├── AuthService → UserService 주입받아 사용\n│   └── JwtStrategy\n└── PostModule (imports: [UserModule])\n    ├── PostController\n    └── PostService → UserService 주입받아 사용\n```\n\n순환 참조 문제:\n• UserModule ↔ AuthModule이 서로 import하면 순환 의존성 오류\n• 해결: forwardRef() 사용 또는 공통 모듈로 분리',
    relatedProblems: ['be-q-006', 'be-q-007'],
  },

  {
    id: 'sc-q-006',
    category: 'code-training',
    subcategory: 'refactoring',
    type: 'self-check',
    difficulty: 'medium',
    title: '코드 쪼개기 — 비대한 컴포넌트 분리',
    description:
      '아래 컴포넌트는 300줄이 넘습니다. 어떤 기준으로 어떻게 쪼갤지 설계하고 분리된 구조를 코드로 작성해보세요.',
    code: `// DashboardPage.tsx — 너무 많은 일을 하는 컴포넌트
export default function DashboardPage() {
  // 상태: 통계, 유저 목록, 필터, 모달, 폼 등 20개 이상
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [filter, setFilter] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [formData, setFormData] = useState({...})
  // ... 15개 더

  // 데이터 패칭
  useEffect(() => { /* 통계 조회 */ }, [])
  useEffect(() => { /* 유저 조회 */ }, [filter])

  // 이벤트 핸들러 10개 이상
  const handleFilterChange = ...
  const handleUserSelect = ...
  const handleFormSubmit = ...
  // ... 7개 더

  // JSX — 탭, 테이블, 모달, 폼이 한 곳에 다 있음
  return (
    <div>
      {/* 300줄의 JSX */}
    </div>
  )
}`,
    correctAnswer: `// 분리 기준: 관심사(역할)별로 쪼개기

// 1. Custom Hooks — 데이터/로직 분리
function useDashboardStats() {
  const [stats, setStats] = useState(null)
  useEffect(() => { /* 통계 조회 */ }, [])
  return { stats }
}

function useUserManagement(filter: string) {
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  useEffect(() => { /* 유저 조회 */ }, [filter])
  const handleUserSelect = (user) => setSelectedUser(user)
  const handleUserDelete = async (id) => { /* 삭제 */ }
  return { users, selectedUser, handleUserSelect, handleUserDelete }
}

// 2. 컴포넌트 분리 — UI 단위로
function StatsCards({ stats }) { /* 통계 카드 */ }

function UserFilter({ value, onChange }) { /* 필터 UI */ }

function UserTable({ users, onSelect, onDelete }) { /* 유저 테이블 */ }

function UserEditModal({ user, onClose, onSave }) { /* 수정 모달 */ }

// 3. DashboardPage — 조립만 담당
export default function DashboardPage() {
  const [filter, setFilter] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { stats } = useDashboardStats()
  const { users, selectedUser, handleUserSelect } = useUserManagement(filter)

  return (
    <div>
      <StatsCards stats={stats} />
      <UserFilter value={filter} onChange={setFilter} />
      <UserTable
        users={users}
        onSelect={(user) => { handleUserSelect(user); setIsModalOpen(true) }}
      />
      {isModalOpen && (
        <UserEditModal user={selectedUser} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  )
}`,
    explanation:
      '컴포넌트 분리 기준: ① 재사용 가능한 단위 (버튼, 모달, 카드) ② 독립적으로 테스트 가능한 단위 ③ 변경 이유가 다른 단위 (데이터 패칭 vs UI 렌더링). 최상위 페이지 컴포넌트는 "조립"만 담당하고, 세부 로직은 Custom Hook으로, UI는 하위 컴포넌트로 분리합니다.',
    hints: [
      '같은 이유로 바뀌는 코드를 함께 두세요 (SRP)',
      'Custom Hook으로 상태+로직을, 컴포넌트로 UI를 분리하세요',
    ],
    deepDive:
      '분리 기준 체크리스트:\n• 100줄 이상의 JSX → 하위 컴포넌트로\n• 3개 이상의 useState가 연관 → Custom Hook으로\n• 같은 패턴이 2번 반복 → 재사용 컴포넌트로\n• 테스트하기 어려운 로직 → 함수/Hook으로 분리\n\n폴더 구조 예시:\n```\ncomponents/\n  dashboard/\n    DashboardPage.tsx   ← 조립\n    StatsCards.tsx\n    UserTable.tsx\n    UserEditModal.tsx\n    hooks/\n      useDashboardStats.ts\n      useUserManagement.ts\n```',
    relatedProblems: ['sc-q-001'],
  },

  {
    id: 'sc-q-007',
    category: 'code-training',
    subcategory: 'typescript',
    type: 'self-check',
    difficulty: 'medium',
    title: 'TypeScript — 실무 유틸리티 타입 직접 구현',
    description:
      '아래 유틸리티 타입을 직접 구현해보세요. TypeScript 내장 유틸리티 타입의 원리를 이해하는 훈련입니다.',
    code: `// 아래를 직접 구현해보세요 (내장 타입 사용 금지)

// 1. MyPartial<T> — 모든 필드를 optional로 만들기
type MyPartial<T> = /* 구현 */

// 2. MyRequired<T> — 모든 필드를 required로 만들기
type MyRequired<T> = /* 구현 */

// 3. MyReadonly<T> — 모든 필드를 readonly로 만들기
type MyReadonly<T> = /* 구현 */

// 4. MyPick<T, K> — T에서 K 키만 선택하기
type MyPick<T, K extends keyof T> = /* 구현 */

// 5. MyExclude<T, U> — T에서 U에 해당하는 타입 제거
type MyExclude<T, U> = /* 구현 */

// 테스트
interface User { id: number; name: string; email: string }
type PartialUser = MyPartial<User>           // { id?: number; name?: string; email?: string }
type NameOnly = MyPick<User, 'name'>        // { name: string }
type WithoutEmail = MyExclude<'a' | 'b' | 'c', 'b'> // 'a' | 'c'`,
    correctAnswer: `// 1. MyPartial — mapped type + ? modifier
type MyPartial<T> = {
  [K in keyof T]?: T[K]
}

// 2. MyRequired — -? 로 optional 제거
type MyRequired<T> = {
  [K in keyof T]-?: T[K]
}

// 3. MyReadonly — readonly modifier 추가
type MyReadonly<T> = {
  readonly [K in keyof T]: T[K]
}

// 4. MyPick — K extends keyof T로 키 제한
type MyPick<T, K extends keyof T> = {
  [P in K]: T[P]
}

// 5. MyExclude — Conditional Type (분배 법칙)
type MyExclude<T, U> = T extends U ? never : T
// T = 'a' | 'b' | 'c', U = 'b'
// 'a' extends 'b' ? never : 'a' → 'a'
// 'b' extends 'b' ? never : 'b' → never
// 'c' extends 'b' ? never : 'c' → 'c'
// 결과: 'a' | never | 'c' = 'a' | 'c'

// 보너스: MyReturnType — infer 키워드
type MyReturnType<T extends (...args: any) => any> =
  T extends (...args: any) => infer R ? R : never`,
    explanation:
      'TypeScript 내장 유틸리티 타입(Partial, Required, Pick 등)은 Mapped Types와 Conditional Types로 구현됩니다. [K in keyof T]는 T의 모든 키를 순회하고, T extends U ? X : Y는 조건부 타입입니다. Union 타입에서 Conditional Type은 분배(distribute)되어 각 멤버에 개별 적용됩니다.',
    hints: [
      '[K in keyof T]로 타입의 모든 키를 순회할 수 있습니다',
      'T extends U ? X : Y 형태가 Conditional Type입니다',
    ],
    deepDive:
      '더 복잡한 타입 유틸리티:\n```typescript\n// DeepPartial — 중첩 객체도 모두 optional\ntype DeepPartial<T> = T extends object ? {\n  [K in keyof T]?: DeepPartial<T[K]>\n} : T\n\n// NonNullable 구현\ntype MyNonNullable<T> = T extends null | undefined ? never : T\n\n// Parameters — 함수 파라미터 타입 추출\ntype MyParameters<T extends (...args: any) => any> =\n  T extends (...args: infer P) => any ? P : never\n\n// Awaited — Promise 내부 타입 추출\ntype MyAwaited<T> = T extends Promise<infer U> ? MyAwaited<U> : T\n\n// Flatten — 중첩 배열 타입 평탄화\ntype Flatten<T> = T extends Array<infer U> ? U : T\n```',
    relatedProblems: ['sc-q-003'],
  },

  {
    id: 'sc-q-008',
    category: 'code-training',
    subcategory: 'nestjs',
    type: 'self-check',
    difficulty: 'hard',
    title: 'NestJS 전체 인증 흐름 직접 작성',
    description:
      '회원가입 → 로그인 → 보호된 라우트 접근까지 NestJS + Mongoose + JWT 전체 흐름을 직접 구현해보세요.\n\n필요한 것: AuthController, AuthService, JwtStrategy, CreateUserDto, LoginDto',
    code: `// 힌트: 필요한 패키지
// @nestjs/jwt, @nestjs/passport, passport-jwt
// class-validator, bcrypt

// 구현해야 할 엔드포인트
// POST /auth/signup   — 회원가입
// POST /auth/login    — 로그인 (JWT 반환)
// GET  /auth/me       — 내 정보 (JWT 필요)

// JwtStrategy가 어떻게 req.user를 채우는지
// Guard가 어떻게 라우트를 보호하는지 이해하면서 작성해보세요`,
    correctAnswer: `// auth.dto.ts
export class CreateUserDto {
  @IsString() @MinLength(2) name: string
  @IsEmail() email: string
  @IsString() @MinLength(8) password: string
}

export class LoginDto {
  @IsEmail() email: string
  @IsString() password: string
}

// jwt.strategy.ts — 토큰 검증 후 req.user에 주입
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    })
  }

  async validate(payload: { sub: string; email: string }) {
    const user = await this.userService.findById(payload.sub)
    if (!user) throw new UnauthorizedException()
    return user  // → req.user에 주입됨
  }
}

// auth.service.ts
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signup(dto: CreateUserDto) {
    const exists = await this.userService.findByEmail(dto.email)
    if (exists) throw new ConflictException('이미 존재하는 이메일')
    const hashed = await bcrypt.hash(dto.password, 10)
    const user = await this.userService.create({ ...dto, password: hashed })
    const { password, ...result } = user.toObject()
    return result
  }

  async login(dto: LoginDto) {
    const user = await this.userService.findByEmail(dto.email)
    if (!user || !await bcrypt.compare(dto.password, user.password)) {
      throw new UnauthorizedException('이메일 또는 비밀번호 오류')
    }
    const payload = { sub: user._id.toString(), email: user.email }
    return {
      accessToken: this.jwtService.sign(payload, { expiresIn: '15m' }),
      refreshToken: this.jwtService.sign(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d',
      }),
    }
  }
}

// auth.controller.ts
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  signup(@Body() dto: CreateUserDto) {
    return this.authService.signup(dto)
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto)
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))  // JwtStrategy 실행 → req.user 주입
  getMe(@Request() req) {
    return req.user  // JwtStrategy.validate()가 반환한 user
  }
}`,
    explanation:
      'JWT 인증 흐름: ① 로그인 → AuthService가 비밀번호 검증 → JWT 발급 ② 보호된 라우트 요청 → AuthGuard("jwt") 실행 → JwtStrategy.validate() 호출 → 반환값이 req.user에 주입 ③ 컨트롤러에서 @Request() req로 접근. JwtStrategy는 토큰 서명 검증 + 사용자 존재 여부를 검증합니다.',
    hints: [
      'JwtStrategy.validate()의 반환값이 req.user가 됩니다',
      'AuthGuard("jwt")가 JwtStrategy를 자동으로 실행합니다',
    ],
    deepDive:
      '요청 흐름 전체:\n```\nPOST /auth/login\n  → LoginDto 유효성 검사 (ValidationPipe)\n  → AuthService.login()\n  → User 조회 + bcrypt.compare()\n  → jwtService.sign({ sub: userId }) → JWT 반환\n\nGET /auth/me (Bearer Token 포함)\n  → AuthGuard("jwt") 실행\n  → passport-jwt가 헤더에서 토큰 추출\n  → jwtService.verify()로 서명 검증\n  → JwtStrategy.validate({ sub, email }) 호출\n  → userService.findById(sub)로 DB에서 사용자 조회\n  → 반환값 → req.user\n  → Controller @Request() req.user로 접근\n```',
    relatedProblems: ['auth-q-001', 'auth-q-002', 'be-q-008'],
  },
]
