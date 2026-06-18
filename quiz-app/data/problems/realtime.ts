import type { Problem } from '@/types'

export const realtimeProblems: Problem[] = [
  // ─── concepts ────────────────────────────────────────────────────────────────

  {
    id: 'rt-q-001',
    category: 'realtime',
    subcategory: 'concepts',
    type: 'multiple-choice',
    difficulty: 'easy',
    title: 'Polling vs Long Polling vs SSE vs WebSocket 비교',
    description: '실시간 기능 구현 방법 4가지를 상황에 맞게 선택하는 기준으로 올바른 것은?',
    conceptExplanation:
      '실시간 통신은 서버의 변경 사항을 클라이언트에 즉시 전달하는 기술입니다. 구현 방식에는 클라이언트가 주기적으로 서버에 요청하는 Polling, 서버가 응답을 보류하다가 데이터가 생기면 응답하는 Long Polling, 서버에서 클라이언트로 단방향 스트리밍하는 SSE, 클라이언트와 서버가 양방향으로 통신하는 WebSocket이 있으며 각각 적합한 사용 사례가 다릅니다.',
    options: [
      'WebSocket이 항상 가장 빠르므로 모든 실시간 기능에 WebSocket을 사용해야 한다',
      'Polling은 단순 주기적 조회, Long Polling은 응답 보류로 지연 감소, SSE는 서버→클라이언트 단방향 스트리밍, WebSocket은 양방향 실시간 통신에 각각 적합하다',
      'SSE는 양방향 통신을 지원하므로 채팅 앱에 WebSocket보다 적합하다',
      'Long Polling은 SSE보다 서버 부하가 낮으므로 실시간 알림에 항상 Long Polling을 사용해야 한다',
    ],
    correctAnswer: 1,
    explanation:
      '각 방식의 트레이드오프: Polling(단순하지만 불필요한 요청 많음), Long Polling(Polling보다 효율적이지만 연결 관리 복잡), SSE(HTTP 기반으로 방화벽 친화적, 자동 재연결, 단방향), WebSocket(양방향이지만 초기 핸드셰이크 비용, 방화벽 이슈 가능). 알림/대시보드는 SSE, 채팅/협업 도구는 WebSocket을 권장합니다.',
    hints: ['채팅 = 양방향 → WebSocket, 알림 = 단방향 → SSE'],
    deepDive:
      '```\n방법별 비교:\n┌──────────────┬────────────┬──────────┬────────────────────────┐\n│ 방식          │ 방향       │ 프로토콜  │ 적합한 사용 사례       │\n├──────────────┼────────────┼──────────┼────────────────────────┤\n│ Polling      │ 단방향     │ HTTP     │ 주기적 데이터 갱신     │\n│              │ (클→서버)  │          │ (매 30초 주가 조회)    │\n├──────────────┼────────────┼──────────┼────────────────────────┤\n│ Long Polling │ 단방향     │ HTTP     │ 즉시성 필요한 알림     │\n│              │ (클→서버)  │          │ (응답까지 연결 유지)   │\n├──────────────┼────────────┼──────────┼────────────────────────┤\n│ SSE          │ 단방향     │ HTTP/2   │ 실시간 피드, 알림,     │\n│              │ (서버→클)  │          │ AI 스트리밍 응답       │\n├──────────────┼────────────┼──────────┼────────────────────────┤\n│ WebSocket    │ 양방향     │ WS/WSS   │ 채팅, 협업, 게임,      │\n│              │            │          │ 금융 실시간 거래       │\n└──────────────┴────────────┴──────────┴────────────────────────┘\n\nSSE 장점:\n- HTTP/2 멀티플렉싱 활용 가능\n- 방화벽/프록시 통과 용이\n- 자동 재연결 내장 (EventSource API)\n- 서버 자원 효율적 (연결 유지 비용 낮음)\n```',
    relatedProblems: ['rt-q-002', 'rt-q-003'],
  },
  {
    id: 'rt-q-002',
    category: 'realtime',
    subcategory: 'concepts',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'SSE 단방향 특성 — 적합한 사용 사례',
    description: 'SSE(Server-Sent Events)가 WebSocket보다 적합한 사용 사례로 올바른 것은?',
    conceptExplanation:
      'SSE(Server-Sent Events)는 서버에서 클라이언트 방향으로만 데이터를 스트리밍하는 HTTP 기반 기술입니다. 브라우저의 EventSource API를 통해 연결하며, 연결이 끊기면 자동으로 재연결을 시도합니다. HTTP/2와 호환되어 방화벽 통과가 용이하고, 실시간 알림이나 AI 응답 스트리밍처럼 서버→클라이언트 단방향 흐름에 최적화되어 있습니다.',
    options: [
      '멀티플레이어 실시간 게임 — 플레이어 위치를 양방향으로 동기화',
      '실시간 알림, AI 응답 스트리밍, 실시간 대시보드처럼 서버→클라이언트 단방향 데이터 흐름인 경우',
      '그룹 채팅 — 여러 사용자가 동시에 메시지를 주고받는 경우',
      '협업 텍스트 에디터 — 여러 사람이 동시에 편집하는 경우',
    ],
    correctAnswer: 1,
    explanation:
      'SSE는 서버 → 클라이언트 단방향 통신입니다. 실시간 알림(새 댓글, 좋아요), AI 스트리밍 응답(ChatGPT처럼 토큰 단위 출력), 실시간 대시보드(서버 모니터링, 주문 현황)에 최적입니다. 클라이언트→서버 데이터 전송은 별도 HTTP 요청으로 처리합니다. ChatGPT의 스트리밍 응답도 SSE를 사용합니다.',
    hints: ['SSE로 ChatGPT처럼 AI 응답을 실시간으로 스트리밍할 수 있습니다'],
    deepDive:
      '```\nSSE 데이터 형식 (text/event-stream):\n\ndata: 첫 번째 메시지\\n\\n           ← 가장 단순한 형태\n\nevent: notification\\n              ← 이벤트 타입 지정\ndata: {"title":"새 댓글","count":3}\\n\\n\n\nid: 1234\\n                          ← 이벤트 ID (재연결 시 Last-Event-ID로 전송)\ndata: {"message":"hello"}\\n\\n\n\nretry: 3000\\n                       ← 재연결 간격 (ms)\ndata: 재연결 설정\\n\\n\n```\n\n```typescript\n// Next.js App Router SSE Route Handler\n// app/api/notifications/stream/route.ts\nexport async function GET(request: Request) {\n  const encoder = new TextEncoder()\n  let intervalId: NodeJS.Timeout\n\n  const stream = new ReadableStream({\n    start(controller) {\n      // 초기 연결 알림\n      controller.enqueue(encoder.encode("data: connected\\n\\n"))\n\n      // 주기적으로 알림 전송\n      intervalId = setInterval(async () => {\n        const notifications = await getUnreadNotifications()\n        const data = JSON.stringify(notifications)\n        controller.enqueue(encoder.encode(`data: ${data}\\n\\n`))\n      }, 5000)\n    },\n    cancel() {\n      clearInterval(intervalId) // 클라이언트 연결 해제 시 정리\n    },\n  })\n\n  return new Response(stream, {\n    headers: {\n      "Content-Type": "text/event-stream",\n      "Cache-Control": "no-cache",\n      Connection: "keep-alive",\n    },\n  })\n}\n```',
    relatedProblems: ['rt-q-001', 'rt-q-004', 'rt-q-005'],
  },
  {
    id: 'rt-q-003',
    category: 'realtime',
    subcategory: 'concepts',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'WebSocket 핸드셰이크 과정',
    description: 'WebSocket 연결 수립 과정(핸드셰이크)에 대한 설명으로 올바른 것은?',
    conceptExplanation:
      'WebSocket은 브라우저와 서버 사이에 지속적인 연결을 유지하며 실시간으로 데이터를 양방향으로 주고받는 프로토콜입니다. 최초 연결은 HTTP 프로토콜로 시작되어 101 Switching Protocols 응답을 통해 WebSocket 프로토콜로 업그레이드되며, 이후 연결이 유지되는 동안 낮은 오버헤드로 메시지를 자유롭게 교환할 수 있습니다.',
    options: [
      'WebSocket은 UDP 기반이므로 TCP 핸드셰이크 없이 즉시 연결된다',
      'HTTP Upgrade 요청으로 시작하여 서버가 101 Switching Protocols로 응답하면 WebSocket 프로토콜로 업그레이드된다',
      'WebSocket 연결은 HTTPS와 완전히 별개의 프로토콜이므로 포트 443을 사용할 수 없다',
      'WebSocket은 매 메시지마다 새로운 HTTP 요청을 보내는 방식으로 동작한다',
    ],
    correctAnswer: 1,
    explanation:
      'WebSocket은 HTTP 업그레이드로 시작합니다. 클라이언트가 Upgrade: websocket 헤더로 HTTP 요청 → 서버가 101 Switching Protocols 응답 → 이후 WebSocket 프로토콜(ws:// 또는 wss://)로 전환. HTTPS 포트(443)에서도 wss://로 동작합니다. 한 번 연결되면 연결이 유지되며 낮은 오버헤드로 메시지를 주고받습니다.',
    hints: ['101 Switching Protocols가 WebSocket 전환의 핵심입니다'],
    deepDive:
      '```\nWebSocket 핸드셰이크:\n\n클라이언트 → 서버 (HTTP 요청):\nGET /chat HTTP/1.1\nHost: example.com\nUpgrade: websocket          ← WebSocket으로 전환 요청\nConnection: Upgrade\nSec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==  ← 랜덤 Base64\nSec-WebSocket-Version: 13\n\n서버 → 클라이언트 (HTTP 응답):\nHTTP/1.1 101 Switching Protocols\nUpgrade: websocket\nConnection: Upgrade\nSec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=  ← Key 검증\n\n이후: WebSocket 프로토콜로 전환\n← 더 이상 HTTP가 아님, 양방향 이진/텍스트 프레임\n```\n\n```typescript\n// 클라이언트 WebSocket API\nconst ws = new WebSocket("wss://api.example.com/ws")\n\nws.onopen = () => {\n  console.log("연결됨")\n  ws.send(JSON.stringify({ type: "join", room: "general" }))\n}\n\nws.onmessage = (event) => {\n  const data = JSON.parse(event.data)\n  console.log("메시지:", data)\n}\n\nws.onerror = (error) => console.error("에러:", error)\n\nws.onclose = (event) => {\n  console.log("연결 종료:", event.code, event.reason)\n  // code 1000: 정상 종료\n  // code 1006: 비정상 종료 (재연결 필요)\n}\n\n// NestJS WebSocket Gateway\nimport { WebSocketGateway, WebSocketServer, OnGatewayConnection } from "@nestjs/websockets"\nimport { Server, Socket } from "socket.io"\n\n@WebSocketGateway({ cors: { origin: process.env.FRONTEND_URL } })\nexport class ChatGateway implements OnGatewayConnection {\n  @WebSocketServer() server: Server\n\n  handleConnection(client: Socket) {\n    console.log("클라이언트 연결:", client.id)\n  }\n}\n```',
    relatedProblems: ['rt-q-001', 'rt-q-007', 'rt-q-009'],
  },

  // ─── sse ─────────────────────────────────────────────────────────────────────

  {
    id: 'rt-q-004',
    category: 'realtime',
    subcategory: 'sse',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'Next.js App Router — SSE Route Handler 구현',
    description: 'Next.js App Router에서 SSE(Server-Sent Events)를 올바르게 구현하는 방법은?',
    conceptExplanation:
      'Next.js App Router의 Route Handler는 Web 표준 Request/Response API를 기반으로 동작합니다. SSE를 구현할 때는 ReadableStream을 반환하고 Content-Type을 text/event-stream으로 설정하며, "data: ...\\n\\n" 형식으로 각 이벤트를 인코딩하여 스트리밍합니다. Pages Router의 res.write() 방식과 달리 Web Streams API를 사용하는 것이 특징입니다.',
    options: [
      'SSE는 Next.js Pages Router에서만 지원하므로 App Router에서는 별도 라이브러리가 필요하다',
      'Route Handler에서 ReadableStream과 text/event-stream Content-Type을 사용해 SSE를 구현하고, Cache-Control: no-cache로 캐싱을 비활성화한다',
      'app/api/route.ts에서 res.write()를 사용해 데이터를 스트리밍한다',
      'Next.js는 내장 SSE 함수를 제공하므로 import { sse } from "next/server"로 사용한다',
    ],
    correctAnswer: 1,
    explanation:
      'Next.js App Router의 Route Handler는 Web API의 ReadableStream을 반환할 수 있습니다. Content-Type: text/event-stream으로 설정하고, "data: ...\\n\\n" 형식으로 데이터를 인코딩하여 전송합니다. Cache-Control: no-cache는 중간 프록시가 응답을 캐싱하지 못하도록 필수 설정입니다.',
    hints: ['App Router에서는 res.write() 대신 ReadableStream을 반환합니다'],
    deepDive:
      '```typescript\n// app/api/stream/route.ts\nexport const dynamic = "force-dynamic" // 정적 최적화 비활성화\n\nexport async function GET(request: Request) {\n  const { searchParams } = new URL(request.url)\n  const userId = searchParams.get("userId")\n\n  const encoder = new TextEncoder()\n  let cleanup: (() => void) | undefined\n\n  const stream = new ReadableStream({\n    async start(controller) {\n      const send = (event: string, data: unknown) => {\n        const payload = `event: ${event}\\ndata: ${JSON.stringify(data)}\\n\\n`\n        controller.enqueue(encoder.encode(payload))\n      }\n\n      // 초기 데이터 전송\n      send("connected", { userId, timestamp: Date.now() })\n\n      // DB 변경 감지 (MongoDB Change Stream 예시)\n      const changeStream = await watchUserNotifications(userId!)\n      changeStream.on("change", (change) => {\n        send("notification", {\n          id: change.fullDocument._id,\n          message: change.fullDocument.message,\n        })\n      })\n\n      // 30초마다 heartbeat (연결 유지)\n      const heartbeat = setInterval(() => {\n        controller.enqueue(encoder.encode(": heartbeat\\n\\n"))\n      }, 30000)\n\n      cleanup = () => {\n        clearInterval(heartbeat)\n        changeStream.close()\n      }\n    },\n    cancel() {\n      cleanup?.()\n    },\n  })\n\n  return new Response(stream, {\n    headers: {\n      "Content-Type": "text/event-stream",\n      "Cache-Control": "no-cache, no-transform",\n      Connection: "keep-alive",\n      "X-Accel-Buffering": "no", // nginx 버퍼링 비활성화\n    },\n  })\n}\n```',
    relatedProblems: ['rt-q-002', 'rt-q-005', 'rt-q-006'],
  },
  {
    id: 'rt-q-005',
    category: 'realtime',
    subcategory: 'sse',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'EventSource API — 재연결 처리',
    description: 'EventSource API를 사용할 때 연결이 끊어진 경우 재연결 처리에 대한 설명으로 올바른 것은?',
    conceptExplanation:
      'EventSource는 브라우저에서 SSE 서버에 연결하는 내장 API입니다. new EventSource(url)로 연결하면 서버가 text/event-stream 형식으로 전송하는 메시지를 onmessage 핸들러로 수신합니다. 연결이 끊기면 브라우저가 자동으로 재연결을 시도하며, 서버가 이벤트에 id를 설정하면 재연결 시 Last-Event-ID 헤더로 마지막으로 받은 이벤트 위치를 알려줍니다.',
    options: [
      'EventSource는 자동 재연결 기능이 없으므로 직접 setTimeout으로 재연결 로직을 구현해야 한다',
      'EventSource는 연결이 끊기면 자동으로 재연결을 시도하며, 서버가 이벤트 id를 전송하면 Last-Event-ID 헤더로 이어받을 위치를 알 수 있다',
      'EventSource는 재연결 시 항상 처음부터 스트림을 다시 받아야 한다',
      'EventSource의 재연결 간격은 변경할 수 없으며 기본 1초로 고정되어 있다',
    ],
    correctAnswer: 1,
    explanation:
      'EventSource API는 자동 재연결을 내장합니다. 기본 재연결 간격은 3000ms이고, 서버에서 retry: N 명령으로 변경 가능합니다. 서버가 각 이벤트에 id를 설정하면, 재연결 시 Last-Event-ID 헤더로 마지막으로 받은 이벤트 ID를 서버에 전달해 이후 이벤트만 받을 수 있습니다.',
    hints: ['이벤트 id + Last-Event-ID 조합으로 메시지 손실을 방지할 수 있습니다'],
    deepDive:
      '```typescript\n// 클라이언트 — EventSource 기본 사용\nconst es = new EventSource("/api/stream?userId=123", {\n  withCredentials: true, // 쿠키 포함\n})\n\n// 기본 message 이벤트\nes.onmessage = (event) => {\n  console.log(JSON.parse(event.data))\n}\n\n// 커스텀 이벤트 타입\nes.addEventListener("notification", (event) => {\n  const notification = JSON.parse(event.data)\n  showToast(notification.message)\n})\n\nes.addEventListener("error", (event) => {\n  if (es.readyState === EventSource.CLOSED) {\n    console.log("연결 종료됨")\n    // readyState:\n    // 0 = CONNECTING (재연결 중)\n    // 1 = OPEN (연결됨)\n    // 2 = CLOSED (완전 종료)\n  }\n  // readyState === CONNECTING이면 자동 재연결 중\n})\n\n// 명시적 종료\nes.close()\n\n// 서버 — 이벤트 ID 전송 (재연결 지원)\n// app/api/stream/route.ts\nconst send = (id: string, event: string, data: unknown) => {\n  return [\n    `id: ${id}`,           // 이벤트 ID\n    `event: ${event}`,\n    `data: ${JSON.stringify(data)}`,\n    "",\n    "",\n  ].join("\\n")\n}\n\n// 서버에서 Last-Event-ID 읽기\nexport async function GET(request: Request) {\n  const lastEventId = request.headers.get("Last-Event-ID")\n  // lastEventId 이후의 이벤트만 전송하여 누락 방지\n  const missedEvents = await getEventsSince(lastEventId)\n  // ...\n}\n```',
    relatedProblems: ['rt-q-004', 'rt-q-006', 'rt-q-010'],
  },
  {
    id: 'rt-q-006',
    category: 'realtime',
    subcategory: 'sse',
    type: 'multiple-choice',
    difficulty: 'hard',
    title: 'React + SSE — 상태 동기화 패턴',
    description: 'React 컴포넌트에서 SSE 스트림을 구독하고 상태를 동기화하는 올바른 패턴은?',
    conceptExplanation:
      'React 컴포넌트에서 외부 데이터 소스(SSE·WebSocket·타이머 등)를 구독할 때는 useEffect 내에서 연결을 생성하고, 반드시 cleanup 함수에서 연결을 해제해야 합니다. 이를 지키지 않으면 컴포넌트가 언마운트된 후에도 연결이 유지되어 메모리 누수가 발생합니다. 커스텀 훅으로 분리하면 여러 컴포넌트에서 재사용할 수 있습니다.',
    options: [
      'SSE는 컴포넌트 외부에 전역 변수로 선언해야 리렌더링 시 재연결되지 않는다',
      'useEffect에서 EventSource를 생성하고, cleanup 함수에서 .close()를 호출하며, AbortController로 요청을 취소한다',
      'useState 내부에서 EventSource를 생성하면 상태 변경 시 자동으로 재연결된다',
      'SSE는 서버 컴포넌트에서만 사용 가능하다',
    ],
    correctAnswer: 1,
    explanation:
      'useEffect cleanup에서 EventSource.close()를 반드시 호출해야 컴포넌트 언마운트 시 연결이 종료됩니다. 이를 빠뜨리면 메모리 누수와 불필요한 서버 연결이 유지됩니다. 커스텀 훅으로 분리하면 재사용성이 높아집니다. React 18 Strict Mode에서는 useEffect가 두 번 실행되므로 cleanup이 더욱 중요합니다.',
    hints: ['cleanup 없는 EventSource는 메모리 누수의 주범입니다'],
    deepDive:
      '```typescript\n// hooks/useSSE.ts — 재사용 가능한 SSE 커스텀 훅\nimport { useState, useEffect, useCallback } from "react"\n\ninterface SSEOptions {\n  onMessage?: (data: unknown) => void\n  onError?: (error: Event) => void\n}\n\nexport function useSSE<T>(url: string, options: SSEOptions = {}) {\n  const [data, setData] = useState<T | null>(null)\n  const [status, setStatus] = useState<"connecting" | "open" | "closed">("connecting")\n\n  useEffect(() => {\n    const es = new EventSource(url, { withCredentials: true })\n\n    es.onopen = () => setStatus("open")\n\n    es.onmessage = (event) => {\n      try {\n        const parsed = JSON.parse(event.data) as T\n        setData(parsed)\n        options.onMessage?.(parsed)\n      } catch (e) {\n        console.error("SSE 파싱 에러:", e)\n      }\n    }\n\n    es.onerror = (error) => {\n      setStatus(es.readyState === EventSource.CLOSED ? "closed" : "connecting")\n      options.onError?.(error)\n    }\n\n    // ← cleanup 필수! 언마운트 시 연결 종료\n    return () => {\n      es.close()\n      setStatus("closed")\n    }\n  }, [url]) // url 변경 시 재연결\n\n  return { data, status }\n}\n\n// 컴포넌트에서 사용\nfunction NotificationBell() {\n  const { data: notifications, status } = useSSE<Notification[]>(\n    "/api/notifications/stream"\n  )\n\n  return (\n    <div>\n      {status === "connecting" && <Spinner />}\n      {notifications?.map(n => (\n        <NotificationItem key={n.id} notification={n} />\n      ))}\n    </div>\n  )\n}\n\n// 커스텀 이벤트 타입 구독\nuseEffect(() => {\n  const es = new EventSource("/api/stream")\n  es.addEventListener("order-update", (event) => {\n    dispatch({ type: "UPDATE_ORDER", payload: JSON.parse(event.data) })\n  })\n  return () => es.close()\n}, [])\n```',
    relatedProblems: ['rt-q-004', 'rt-q-005'],
  },

  // ─── websocket ───────────────────────────────────────────────────────────────

  {
    id: 'rt-q-007',
    category: 'realtime',
    subcategory: 'websocket',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'Socket.io rooms & namespaces — 채팅 구조',
    description: 'Socket.io에서 rooms와 namespaces의 차이와 실전 채팅 앱에서의 활용으로 올바른 것은?',
    conceptExplanation:
      'Socket.io는 WebSocket을 기반으로 한 실시간 통신 라이브러리로, 폴링 폴백·자동 재연결·룸 관리 등 편의 기능을 내장합니다. Namespace는 /chat, /admin처럼 서로 완전히 격리된 별도의 통신 채널이고, Room은 같은 Namespace 안에서 소켓을 논리적으로 그룹화하여 특정 그룹에만 메시지를 보낼 수 있게 해주는 단위입니다.',
    options: [
      'rooms와 namespaces는 동일한 개념이며 혼용해서 사용한다',
      'namespace는 별도 WebSocket 엔드포인트로 완전히 분리된 통신 채널이고, room은 같은 namespace 내에서 소켓을 그룹핑하는 논리적 단위다',
      'room은 서버에서만 관리하고 클라이언트는 room을 알 수 없다',
      'namespace는 클라이언트가 생성하고 room은 서버만 생성할 수 있다',
    ],
    correctAnswer: 1,
    explanation:
      'Namespace는 /chat, /admin처럼 별도 엔드포인트로 완전히 분리됩니다. Room은 같은 namespace 내에서 소켓을 그룹으로 묶는 논리적 단위입니다. 채팅 앱에서 namespace는 서비스 구분(/general, /support), room은 채팅방 ID(room-123)로 활용합니다. socket.to(room).emit()으로 특정 방에만 메시지를 보냅니다.',
    hints: ['namespace = 완전 분리, room = 논리적 그룹'],
    deepDive:
      '```typescript\n// NestJS + Socket.io 채팅 구조\n// chat/chat.gateway.ts\nimport {\n  WebSocketGateway, WebSocketServer,\n  SubscribeMessage, ConnectedSocket, MessageBody,\n  OnGatewayConnection, OnGatewayDisconnect\n} from "@nestjs/websockets"\nimport { Server, Socket } from "socket.io"\n\n@WebSocketGateway({\n  namespace: "/chat",           // 별도 namespace\n  cors: { origin: process.env.FRONTEND_URL },\n})\nexport class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {\n  @WebSocketServer() server: Server\n\n  handleConnection(client: Socket) {\n    console.log("채팅 연결:", client.id)\n  }\n\n  handleDisconnect(client: Socket) {\n    // 유저가 속한 모든 방에서 나가기\n    client.rooms.forEach(room => {\n      if (room !== client.id) { // 기본 방(소켓ID) 제외\n        this.server.to(room).emit("user-left", { userId: client.data.userId })\n      }\n    })\n  }\n\n  @SubscribeMessage("join-room")\n  handleJoinRoom(\n    @ConnectedSocket() client: Socket,\n    @MessageBody() data: { roomId: string; userId: string }\n  ) {\n    client.join(data.roomId)   // room 입장\n    client.data.userId = data.userId // 클라이언트에 메타데이터 저장\n\n    // 방의 다른 사람들에게 알림 (본인 제외)\n    client.to(data.roomId).emit("user-joined", { userId: data.userId })\n\n    // 현재 방 인원 수 전송\n    const roomSize = this.server.sockets.adapter.rooms.get(data.roomId)?.size ?? 0\n    client.emit("room-info", { roomId: data.roomId, memberCount: roomSize })\n  }\n\n  @SubscribeMessage("send-message")\n  handleMessage(\n    @ConnectedSocket() client: Socket,\n    @MessageBody() data: { roomId: string; message: string }\n  ) {\n    const payload = {\n      userId: client.data.userId,\n      message: data.message,\n      timestamp: new Date().toISOString(),\n    }\n    // 방의 모든 사람에게 전송 (본인 포함: emit, 본인 제외: to)\n    this.server.to(data.roomId).emit("new-message", payload)\n  }\n}\n```',
    relatedProblems: ['rt-q-003', 'rt-q-008', 'rt-q-009'],
  },
  {
    id: 'rt-q-008',
    category: 'realtime',
    subcategory: 'websocket',
    type: 'multiple-choice',
    difficulty: 'hard',
    title: 'NestJS @WebSocketGateway + @SubscribeMessage',
    description: 'NestJS에서 WebSocket Gateway를 올바르게 구현하는 방법은?',
    conceptExplanation:
      'NestJS Gateway는 WebSocket 서버를 NestJS의 모듈 시스템과 통합하는 클래스입니다. @WebSocketGateway() 데코레이터로 WebSocket 서버를 선언하고, @SubscribeMessage()로 특정 이벤트를 처리하는 메서드를 등록하며, @WebSocketServer()로 서버 인스턴스에 직접 접근할 수 있습니다. NestJS의 DI·Guard·Pipe 등 기존 기능과 함께 사용할 수 있습니다.',
    options: [
      '@WebSocketGateway는 @Controller와 동일하게 동작하며 HTTP 요청도 처리한다',
      '@WebSocketGateway로 게이트웨이를 선언하고, @SubscribeMessage로 특정 이벤트를 구독하며, @WebSocketServer()로 서버 인스턴스에 접근한다',
      'NestJS Gateway는 하나의 모듈에 하나만 등록할 수 있다',
      '@SubscribeMessage 메서드는 반드시 void를 반환해야 한다',
    ],
    correctAnswer: 1,
    explanation:
      '@WebSocketGateway()는 WebSocket 서버를 설정합니다. @WebSocketServer()로 Server 인스턴스를 주입받아 모든 소켓에 브로드캐스트할 수 있습니다. @SubscribeMessage("event-name")으로 특정 이벤트를 처리하는 메서드를 등록합니다. Gateway는 HTTP Controller와 달리 다른 Service/Guard와 함께 사용 가능합니다.',
    hints: ['Gateway는 NestJS의 DI 시스템과 완전히 통합됩니다'],
    deepDive:
      '```typescript\n// notifications/notifications.gateway.ts\nimport {\n  WebSocketGateway, WebSocketServer,\n  SubscribeMessage, ConnectedSocket, MessageBody,\n  OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect\n} from "@nestjs/websockets"\nimport { UseGuards, Logger } from "@nestjs/common"\nimport { Server, Socket } from "socket.io"\nimport { WsJwtGuard } from "../auth/ws-jwt.guard"\nimport { NotificationsService } from "./notifications.service"\n\n@WebSocketGateway({\n  port: 3001,                    // 별도 포트 (선택)\n  cors: { origin: "*" },\n  transports: ["websocket"],     // polling 비활성화\n})\nexport class NotificationsGateway\n  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect\n{\n  @WebSocketServer() server: Server\n  private readonly logger = new Logger(NotificationsGateway.name)\n\n  constructor(private readonly notificationsService: NotificationsService) {}\n\n  afterInit(server: Server) {\n    this.logger.log("WebSocket 서버 초기화")\n  }\n\n  async handleConnection(client: Socket) {\n    // 연결 시 인증 토큰 검증\n    const token = client.handshake.auth.token\n    const user = await this.notificationsService.verifyToken(token)\n    if (!user) {\n      client.disconnect()\n      return\n    }\n    client.data.user = user\n    client.join(`user:${user.id}`) // 유저별 방에 자동 입장\n    this.logger.log(`연결: ${user.id}`)\n  }\n\n  handleDisconnect(client: Socket) {\n    this.logger.log(`연결 해제: ${client.data.user?.id}`)\n  }\n\n  @SubscribeMessage("mark-read")\n  async handleMarkRead(\n    @ConnectedSocket() client: Socket,\n    @MessageBody() data: { notificationId: string }\n  ) {\n    const userId = client.data.user.id\n    await this.notificationsService.markAsRead(userId, data.notificationId)\n    // ACK 응답\n    return { success: true }\n  }\n\n  // 서비스에서 특정 유저에게 알림 푸시\n  sendToUser(userId: string, event: string, payload: unknown) {\n    this.server.to(`user:${userId}`).emit(event, payload)\n  }\n}\n```',
    relatedProblems: ['rt-q-007', 'rt-q-009'],
  },
  {
    id: 'rt-q-009',
    category: 'realtime',
    subcategory: 'websocket',
    type: 'multiple-choice',
    difficulty: 'hard',
    title: 'WebSocket 인증 — JWT를 핸드셰이크에서 검증',
    description: 'NestJS Socket.io에서 WebSocket 연결 시 JWT 인증을 처리하는 올바른 방법은?',
    conceptExplanation:
      'WebSocket 연결은 초기 HTTP 핸드셰이크 이후 프로토콜이 전환되므로, HTTP 요청처럼 매 요청마다 Authorization 헤더를 보낼 수 없습니다. Socket.io는 핸드셰이크 단계에서 handshake.auth, handshake.headers, handshake.query를 통해 인증 정보를 전달받을 수 있으며, 연결 초기에 JWT를 검증하여 인증되지 않은 연결을 즉시 차단하는 것이 보안상 중요합니다.',
    options: [
      'WebSocket은 HTTP 헤더를 지원하지 않으므로 인증이 불가능하다',
      'handshake.auth 또는 handshake.headers에 JWT를 전달하고, handleConnection 또는 WsGuard에서 검증하여 비인증 연결을 즉시 차단한다',
      'WebSocket 연결 후 첫 번째 메시지로 토큰을 보내는 것이 표준 방식이다',
      'JWT는 REST API에서만 사용하고 WebSocket은 Session 쿠키로만 인증한다',
    ],
    correctAnswer: 1,
    explanation:
      'WebSocket 핸드셰이크(초기 HTTP 요청)에서 토큰을 전달하고 검증하는 것이 가장 안전합니다. Socket.io는 handshake.auth, handshake.headers, handshake.query를 통해 토큰을 전달받을 수 있습니다. 연결 후 메시지로 인증하는 방식은 인증 전 잠깐의 연결이 허용되는 취약점이 있습니다.',
    hints: ['연결 시점(핸드셰이크)에서 인증하면 비인증 연결이 서버에 도달하지 않습니다'],
    deepDive:
      '```typescript\n// 클라이언트 — JWT를 handshake.auth로 전달\nimport { io } from "socket.io-client"\n\nconst socket = io("wss://api.example.com/chat", {\n  auth: {\n    token: localStorage.getItem("access_token"),\n    // 또는 쿠키 기반이라면 withCredentials: true 사용\n  },\n  // 헤더로 전달 (일부 환경에서 제한)\n  // extraHeaders: { Authorization: `Bearer ${token}` },\n})\n\n// NestJS — WsJwtGuard\n// auth/ws-jwt.guard.ts\nimport { CanActivate, ExecutionContext, Injectable } from "@nestjs/common"\nimport { WsException } from "@nestjs/websockets"\nimport { JwtService } from "@nestjs/jwt"\nimport { Socket } from "socket.io"\n\n@Injectable()\nexport class WsJwtGuard implements CanActivate {\n  constructor(private jwtService: JwtService) {}\n\n  async canActivate(context: ExecutionContext): Promise<boolean> {\n    const client: Socket = context.switchToWs().getClient()\n    const token =\n      client.handshake.auth?.token ||\n      client.handshake.headers?.authorization?.replace("Bearer ", "")\n\n    if (!token) throw new WsException("토큰이 없습니다")\n\n    try {\n      const payload = await this.jwtService.verifyAsync(token)\n      client.data.user = payload // 검증된 유저 정보 저장\n      return true\n    } catch {\n      throw new WsException("유효하지 않은 토큰")\n    }\n  }\n}\n\n// Gateway에서 사용\n@UseGuards(WsJwtGuard)\n@SubscribeMessage("send-message")\nhandleMessage(@ConnectedSocket() client: Socket, @MessageBody() data: MessageDto) {\n  const user = client.data.user // 인증된 유저 정보\n  // ...\n}\n\n// handleConnection에서 즉시 차단 (Guard보다 이른 시점)\nasync handleConnection(client: Socket) {\n  const token = client.handshake.auth.token\n  try {\n    const user = await this.jwtService.verifyAsync(token)\n    client.data.user = user\n  } catch {\n    client.disconnect() // 즉시 연결 차단\n  }\n}\n```',
    relatedProblems: ['rt-q-007', 'rt-q-008'],
  },

  // ─── patterns ────────────────────────────────────────────────────────────────

  {
    id: 'rt-q-010',
    category: 'realtime',
    subcategory: 'patterns',
    type: 'multiple-choice',
    difficulty: 'hard',
    title: 'Exponential Backoff 재연결 전략',
    description: '실시간 연결이 끊어졌을 때 재연결 전략으로 가장 올바른 것은?',
    conceptExplanation:
      'Exponential Backoff(지수 백오프)는 요청 실패 시 재시도 간격을 1초, 2초, 4초, 8초처럼 지수적으로 늘려가는 전략입니다. 서버 장애 시 많은 클라이언트가 동시에 재연결을 시도하면 서버가 추가로 과부하(Thundering Herd 문제)를 받을 수 있는데, 재시도 간격에 Jitter(랜덤 지연)를 더하면 클라이언트들의 재시도 타이밍이 분산되어 이를 완화합니다.',
    options: [
      '연결이 끊기면 즉시 무한 반복으로 재연결을 시도한다',
      'Exponential Backoff: 재연결 간격을 1s, 2s, 4s, 8s처럼 지수적으로 늘리고 Jitter(랜덤)를 추가하여 서버 부하를 분산한다',
      '재연결은 항상 5초 간격으로 고정하는 것이 예측 가능하여 좋다',
      '연결 실패 시 사용자에게 수동으로 새로고침하도록 안내하는 것이 최선이다',
    ],
    correctAnswer: 1,
    explanation:
      'Exponential Backoff는 재연결 간격을 지수적으로 늘려 서버가 다운됐을 때 클라이언트들이 동시에 재연결을 시도하는 "Thundering Herd" 문제를 방지합니다. Jitter(랜덤 지연)를 추가하면 여러 클라이언트의 재연결 타이밍이 분산됩니다. 최대 간격(예: 30초)을 두어 너무 오래 기다리지 않도록 합니다.',
    hints: ['모든 클라이언트가 동시에 재연결하면 서버가 또 다운될 수 있습니다'],
    deepDive:
      '```typescript\n// Exponential Backoff 구현\nclass ReconnectingWebSocket {\n  private ws: WebSocket | null = null\n  private retryCount = 0\n  private maxRetries = 10\n  private baseDelay = 1000  // 1초\n  private maxDelay = 30000  // 30초\n\n  connect(url: string) {\n    this.ws = new WebSocket(url)\n\n    this.ws.onopen = () => {\n      console.log("연결 성공")\n      this.retryCount = 0 // 성공 시 초기화\n    }\n\n    this.ws.onclose = (event) => {\n      if (event.code === 1000) return // 정상 종료는 재연결 X\n      this.scheduleReconnect(url)\n    }\n  }\n\n  private scheduleReconnect(url: string) {\n    if (this.retryCount >= this.maxRetries) {\n      console.error("최대 재시도 횟수 초과")\n      return\n    }\n\n    // Exponential Backoff + Jitter\n    const exponentialDelay = Math.min(\n      this.baseDelay * Math.pow(2, this.retryCount),\n      this.maxDelay\n    )\n    // Jitter: ±20% 랜덤\n    const jitter = exponentialDelay * 0.2 * (Math.random() - 0.5)\n    const delay = exponentialDelay + jitter\n\n    console.log(`${this.retryCount + 1}번째 재시도 (${Math.round(delay)}ms 후)`)\n    // 0회: 1s, 1회: 2s, 2회: 4s, 3회: 8s, ...\n\n    setTimeout(() => {\n      this.retryCount++\n      this.connect(url)\n    }, delay)\n  }\n\n  disconnect() {\n    this.ws?.close(1000) // 정상 종료 코드\n  }\n}\n\n// React 훅으로 구현\nfunction useWebSocketWithBackoff(url: string) {\n  const [status, setStatus] = useState<"connecting" | "open" | "closed">("connecting")\n  const wsRef = useRef<ReconnectingWebSocket | null>(null)\n\n  useEffect(() => {\n    wsRef.current = new ReconnectingWebSocket()\n    wsRef.current.connect(url)\n    return () => wsRef.current?.disconnect()\n  }, [url])\n\n  return { status }\n}\n```',
    relatedProblems: ['rt-q-005', 'rt-q-011'],
  },
  {
    id: 'rt-q-011',
    category: 'realtime',
    subcategory: 'patterns',
    type: 'multiple-choice',
    difficulty: 'hard',
    title: 'React Query + SSE 조합 패턴',
    description: 'React Query와 SSE를 함께 사용하여 실시간 데이터를 처리하는 올바른 패턴은?',
    conceptExplanation:
      'React Query는 서버 상태의 캐싱·동기화·갱신을 관리하는 라이브러리이고, SSE는 서버 변경 사항을 클라이언트에 즉시 알리는 통신 방식입니다. 두 기술을 조합하면 React Query가 데이터 캐시를 담당하고 SSE가 변경 알림을 담당하는 역할 분리 패턴을 구현할 수 있으며, SSE 이벤트 수신 시 invalidateQueries나 setQueryData로 캐시를 업데이트합니다.',
    options: [
      'React Query는 polling 전용이므로 SSE와 함께 사용할 수 없다',
      'SSE 이벤트를 수신하면 queryClient.invalidateQueries()로 캐시를 무효화하거나 queryClient.setQueryData()로 직접 캐시를 업데이트하여 실시간 반영한다',
      'SSE와 React Query를 함께 사용하면 두 번 렌더링이 발생하므로 하나만 선택해야 한다',
      'React Query의 refetchInterval을 1초로 설정하는 것이 SSE보다 더 효율적이다',
    ],
    correctAnswer: 1,
    explanation:
      'React Query는 서버 상태의 캐싱/동기화를 담당하고, SSE는 서버 변경 알림을 담당하는 역할 분리 패턴입니다. SSE 이벤트 수신 시 invalidateQueries로 재페치하거나, setQueryData로 캐시를 즉시 업데이트합니다. invalidateQueries는 간단하지만 추가 요청이 발생하고, setQueryData는 즉각적이지만 데이터 일관성을 직접 관리해야 합니다.',
    hints: ['SSE = "뭔가 바뀌었다" 알림, React Query = 실제 데이터 가져오기/캐싱'],
    deepDive:
      '```typescript\n// React Query + SSE 조합\nimport { useQueryClient } from "@tanstack/react-query"\n\nfunction useRealtimeOrders() {\n  const queryClient = useQueryClient()\n\n  // 일반 React Query 쿼리 (초기 로드 + 캐시 관리)\n  const { data: orders } = useQuery({\n    queryKey: ["orders"],\n    queryFn: () => fetch("/api/orders").then(r => r.json()),\n    staleTime: 30_000, // 30초간 fresh\n  })\n\n  // SSE로 실시간 업데이트 수신\n  useEffect(() => {\n    const es = new EventSource("/api/orders/stream")\n\n    // 방법 1: 캐시 무효화 (재페치 발생)\n    es.addEventListener("order-created", () => {\n      queryClient.invalidateQueries({ queryKey: ["orders"] })\n    })\n\n    // 방법 2: 캐시 직접 업데이트 (재페치 없음, 즉각 반영)\n    es.addEventListener("order-updated", (event) => {\n      const updatedOrder = JSON.parse(event.data)\n      queryClient.setQueryData<Order[]>(["orders"], (old) =>\n        old?.map(order =>\n          order.id === updatedOrder.id ? updatedOrder : order\n        ) ?? []\n      )\n    })\n\n    // 방법 3: Optimistic Update + SSE 확인\n    es.addEventListener("order-deleted", (event) => {\n      const { id } = JSON.parse(event.data)\n      queryClient.setQueryData<Order[]>(["orders"], (old) =>\n        old?.filter(order => order.id !== id) ?? []\n      )\n    })\n\n    return () => es.close()\n  }, [queryClient])\n\n  return { orders }\n}\n\n// 컴포넌트\nfunction OrderDashboard() {\n  const { orders } = useRealtimeOrders()\n  // orders는 항상 최신 상태 유지\n  // 초기: React Query fetch\n  // 이후: SSE 이벤트로 자동 업데이트\n}\n```',
    relatedProblems: ['rt-q-010', 'rt-q-012'],
  },
  {
    id: 'rt-q-012',
    category: 'realtime',
    subcategory: 'patterns',
    type: 'multiple-choice',
    difficulty: 'hard',
    title: '실시간 알림 시스템 설계 — DB Polling vs Change Stream vs 메시지 큐',
    description: '대규모 실시간 알림 시스템을 설계할 때 각 방식의 적합한 사용 사례는?',
    conceptExplanation:
      '실시간 알림 시스템은 서버에서 발생한 이벤트를 연결된 클라이언트에 전달하는 구조입니다. 구현 방법으로는 주기적으로 DB를 조회하는 Polling, MongoDB의 oplog를 구독하는 Change Stream, 서비스 간 메시지를 브로드캐스트하는 Redis Pub/Sub 또는 Kafka 등이 있으며, 각 방식은 규모와 복잡도 면에서 서로 다른 트레이드오프를 가집니다.',
    options: [
      '모든 규모에서 DB Polling이 가장 단순하고 안정적이므로 항상 DB Polling을 사용한다',
      'DB Polling은 소규모·단순 알림, MongoDB Change Stream은 DB 변경 기반 알림, 메시지 큐(Redis/Kafka)는 고가용성·마이크로서비스 환경에 각각 적합하다',
      'Change Stream은 항상 메시지 큐보다 성능이 우수하다',
      '메시지 큐는 복잡성이 너무 높아 실무에서는 거의 사용하지 않는다',
    ],
    correctAnswer: 1,
    explanation:
      'DB Polling: setInterval로 주기적으로 DB 조회, 단순하지만 불필요한 쿼리 발생. Change Stream(MongoDB): DB 변경을 실시간 이벤트로 받음, MongoDB 전용이지만 강력. 메시지 큐(Redis Pub/Sub, Kafka): 서비스 간 디커플링, 여러 서버 인스턴스에 브로드캐스트 가능, 메시지 영속성. 실무에서는 규모와 요구사항에 따라 선택합니다.',
    hints: ['여러 서버 인스턴스가 있다면 Redis Pub/Sub이 필수입니다'],
    deepDive:
      '```typescript\n// 방법 1: DB Polling (소규모, 단순)\nsetInterval(async () => {\n  const unread = await Notification.find({\n    userId, isRead: false, createdAt: { $gt: lastChecked }\n  })\n  if (unread.length > 0) {\n    sendToClient(unread)\n  }\n  lastChecked = new Date()\n}, 5000) // 5초마다 폴링\n\n// 방법 2: MongoDB Change Stream\n// 실제 NestJS 서비스에서\nasync watchNotifications(userId: string, onNew: (notification: Notification) => void) {\n  const changeStream = this.notificationModel.watch(\n    [{ $match: { "fullDocument.userId": userId, operationType: "insert" } }],\n    { fullDocument: "updateLookup" }\n  )\n\n  changeStream.on("change", (change) => {\n    onNew(change.fullDocument as Notification)\n  })\n\n  changeStream.on("error", (error) => {\n    // Change Stream이 끊기면 재연결\n    this.watchNotifications(userId, onNew)\n  })\n\n  return changeStream\n}\n\n// 방법 3: Redis Pub/Sub (다중 서버 인스턴스 환경)\n// notification.service.ts\nimport { InjectRedis } from "@nestjs-modules/ioredis"\nimport Redis from "ioredis"\n\n@Injectable()\nexport class NotificationService {\n  constructor(\n    @InjectRedis() private readonly redis: Redis,\n    private readonly gateway: NotificationsGateway,\n  ) {\n    // Subscribe: 다른 서버 인스턴스가 발행한 알림 수신\n    const subscriber = redis.duplicate()\n    subscriber.subscribe("notifications")\n    subscriber.on("message", (channel, message) => {\n      const { userId, notification } = JSON.parse(message)\n      this.gateway.sendToUser(userId, "notification", notification)\n    })\n  }\n\n  async createNotification(userId: string, message: string) {\n    const notification = await this.save({ userId, message })\n    // Publish: 어느 서버 인스턴스가 처리할지 모르므로 브로드캐스트\n    await this.redis.publish(\n      "notifications",\n      JSON.stringify({ userId, notification })\n    )\n  }\n}\n// → 여러 서버 인스턴스 중 해당 userId가 연결된 인스턴스가\n//   WebSocket으로 실제 전달\n```',
    relatedProblems: ['rt-q-010', 'rt-q-011'],
  },
]
