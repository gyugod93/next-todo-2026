import type { Lesson } from '@/types'

export const authSecurityLessons: Lesson[] = [
  {
    id: 'auth-sec-001',
    category: 'auth-security',
    subcategory: 'biometric',
    title: '생체 인식 인증 & Passkeys (WebAuthn)',
    description: '비밀번호 없는 미래 — 지문/Face ID가 피싱까지 막는 원리, navigator.credentials API, NestJS 구현까지',
    emoji: '🔏',
    readingTime: 10,
    sections: [
      {
        title: '왜 비밀번호는 한계에 왔는가',
        content: `비밀번호 방식의 근본 문제:

**서버 유출:** 비밀번호 해시가 DB에 저장되므로, 서버가 해킹되면 크랙 위험이 있습니다.

**피싱:** 사용자가 가짜 사이트에서 비밀번호를 입력하면 그대로 탈취됩니다.

**재사용:** 사람들은 여러 사이트에 같은 비밀번호를 사용합니다. 한 곳이 뚫리면 연쇄 피해가 발생합니다.

**2FA의 한계:** SMS OTP도 SIM 스와핑, MITM 공격에 취약합니다.

**Passkeys(WebAuthn/FIDO2)** 는 이 모든 문제를 공개키 암호화로 해결합니다.`,
      },
      {
        title: 'Passkeys 핵심 원리 — 공개키 암호화',
        content: `Passkeys는 **공개키/개인키 쌍**을 사용합니다.

| 키 | 저장 위치 | 역할 |
|---|---|---|
| 공개키 (Public Key) | 서버 DB | 서명 검증용 |
| 개인키 (Private Key) | 기기 보안 칩 (Secure Enclave) | 서명 생성용, 절대 외부 유출 없음 |

**생체 인식의 역할:** 지문/Face ID는 기기 안에 잠긴 개인키를 꺼내는 열쇠입니다. 생체 데이터 자체는 기기 밖으로 나가지 않습니다.

**피싱 면역:** 개인키는 등록한 도메인(예: myapp.com)에서만 동작합니다. 가짜 사이트(myapp-evil.com)에서는 키 자체가 작동하지 않습니다 — 이를 **Origin Binding**이라 합니다.`,
        code: `// 등록 흐름 요약
// 1. 서버 → 클라이언트: challenge (랜덤 바이트)
// 2. 기기: 생체 인식 확인 → 공개키/개인키 쌍 생성
// 3. 기기 → 서버: 공개키 전달 (개인키는 절대 전송 안 됨)
// 4. 서버: 공개키 저장

// 인증 흐름 요약
// 1. 서버 → 클라이언트: challenge (매번 새 랜덤값 — 재사용 공격 방지)
// 2. 기기: 생체 인식으로 개인키 잠금 해제
// 3. 기기: 개인키로 challenge에 서명(signature) 생성
// 4. 기기 → 서버: signature 전달
// 5. 서버: 저장된 공개키로 signature 검증 → 인증 성공`,
        language: 'typescript',
      },
      {
        title: 'Browser API — navigator.credentials',
        content: `WebAuthn은 **navigator.credentials** API를 통해 브라우저에서 사용합니다.

**등록:** \`navigator.credentials.create()\`
**인증:** \`navigator.credentials.get()\`

서버에서 직접 구현하기보다 **@simplewebauthn/browser** 라이브러리 사용을 권장합니다.`,
        code: `import {
  startRegistration,
  startAuthentication,
} from "@simplewebauthn/browser"

// ─── 등록 ───────────────────────────────────────────────
async function registerPasskey() {
  // 1. 서버에서 등록 옵션(challenge 포함) 가져오기
  const optionsRes = await fetch("/auth/passkey/register/start", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: currentUser.id }),
  })
  const options = await optionsRes.json()

  // 2. 브라우저가 생체 인식 프롬프트 띄우고 credential 생성
  const credential = await startRegistration(options)

  // 3. 서버에 검증 요청 (공개키 저장)
  const verifyRes = await fetch("/auth/passkey/register/finish", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credential),
  })
  const result = await verifyRes.json()
  console.log("Passkey 등록 완료:", result.verified)
}

// ─── 인증 ───────────────────────────────────────────────
async function loginWithPasskey() {
  // 1. 서버에서 인증 옵션(challenge 포함) 가져오기
  const optionsRes = await fetch("/auth/passkey/login/start", {
    method: "POST",
  })
  const options = await optionsRes.json()

  // 2. 브라우저가 생체 인식 프롬프트 — 개인키로 challenge 서명
  const assertion = await startAuthentication(options)

  // 3. 서버에서 서명 검증 → JWT 발급
  const verifyRes = await fetch("/auth/passkey/login/finish", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(assertion),
  })
  const { accessToken } = await verifyRes.json()
}`,
        language: 'typescript',
      },
      {
        title: 'NestJS 서버 구현',
        content: `서버에서는 **@simplewebauthn/server** 로 challenge 생성 및 서명 검증을 처리합니다. Challenge는 Redis에 임시 저장하여 검증 후 즉시 삭제합니다(Replay Attack 방지).`,
        code: `import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from "@simplewebauthn/server"
import { Injectable } from "@nestjs/common"

@Injectable()
export class PasskeyService {
  constructor(
    private readonly redis: RedisService,
    private readonly userRepo: UserRepository,
  ) {}

  // ─── 등록 시작: challenge 생성 ─────────────────────────
  async startRegistration(userId: string) {
    const user = await this.userRepo.findById(userId)

    const options = await generateRegistrationOptions({
      rpName: "MyApp",
      rpID: "myapp.com",
      userID: userId,
      userName: user.email,
      userDisplayName: user.name,
      attestationType: "none",
      authenticatorSelection: {
        authenticatorAttachment: "platform", // 기기 내장 (Face ID, Touch ID, Windows Hello)
        residentKey: "required",             // Passkey: 사용자명 없이 로그인
        userVerification: "required",        // 생체/PIN 필수
      },
      supportedAlgorithmIDs: [-7, -257],     // ES256, RS256
    })

    // challenge를 Redis에 임시 저장 (5분 TTL)
    await this.redis.set(\`passkey:reg:\${userId}\`, options.challenge, 300)

    return options
  }

  // ─── 등록 완료: 공개키 저장 ────────────────────────────
  async finishRegistration(userId: string, credential: any) {
    const expectedChallenge = await this.redis.get(\`passkey:reg:\${userId}\`)

    const verification = await verifyRegistrationResponse({
      response: credential,
      expectedChallenge,
      expectedOrigin: "https://myapp.com",
      expectedRPID: "myapp.com",
    })

    if (!verification.verified) throw new Error("등록 검증 실패")

    const { credentialPublicKey, credentialID, counter } =
      verification.registrationInfo!

    // 공개키를 DB에 저장 (개인키는 서버에 절대 오지 않음)
    await this.userRepo.savePasskey(userId, {
      credentialID: Buffer.from(credentialID),
      credentialPublicKey: Buffer.from(credentialPublicKey),
      counter,
    })

    await this.redis.del(\`passkey:reg:\${userId}\`)
    return { verified: true }
  }

  // ─── 인증 시작 ─────────────────────────────────────────
  async startAuthentication() {
    const options = await generateAuthenticationOptions({
      rpID: "myapp.com",
      userVerification: "required",
    })

    await this.redis.set(\`passkey:auth:\${options.challenge}\`, "pending", 300)
    return options
  }

  // ─── 인증 완료: 서명 검증 → JWT 발급 ─────────────────
  async finishAuthentication(assertion: any) {
    const expectedChallenge = assertion.response.clientDataJSON
      // 실제로는 클라이언트에서 challenge를 함께 전달
    const storedCredential = await this.userRepo.findPasskeyByCredentialId(
      assertion.id,
    )

    const verification = await verifyAuthenticationResponse({
      response: assertion,
      expectedChallenge: storedCredential.lastChallenge,
      expectedOrigin: "https://myapp.com",
      expectedRPID: "myapp.com",
      authenticator: {
        credentialPublicKey: storedCredential.credentialPublicKey,
        credentialID: storedCredential.credentialID,
        counter: storedCredential.counter,
      },
    })

    if (!verification.verified) throw new Error("인증 실패")

    // counter 업데이트 (복제 공격 감지용)
    await this.userRepo.updatePasskeyCounter(
      storedCredential.id,
      verification.authenticationInfo.newCounter,
    )

    return { accessToken: this.jwtService.sign({ sub: storedCredential.userId }) }
  }
}`,
        language: 'typescript',
      },
      {
        title: '기기 분실 및 폴백 전략',
        content: `**기기 분실 시 복구:**
- **iCloud Keychain / Google Password Manager:** 같은 계정으로 연결된 다른 기기에서 자동 복원
- **Cross-Device Authentication:** QR 코드로 다른 기기의 Passkey를 활용 가능
- **복구 코드:** 회원가입 시 일회용 복구 코드 발급 필수

**폴백 처리:**
- Passkeys를 지원하지 않는 구형 기기를 위해 비밀번호 또는 이메일 OTP 폴백 제공
- 점진적 전환: 기존 사용자에게 Passkey 추가 등록 유도`,
        code: `// Passkeys 지원 여부 확인 후 UI 분기
async function checkPasskeySupport() {
  const isSupported =
    window.PublicKeyCredential &&
    (await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable())

  if (isSupported) {
    // Passkey 버튼 표시
    showPasskeyButton()
  } else {
    // 비밀번호/OTP 폴백 UI
    showPasswordForm()
  }
}

// Conditional UI (자동완성처럼 Passkey 제안)
// <input autocomplete="username webauthn" />
// navigator.credentials.get({ mediation: "conditional" })
// → 비밀번호 자동완성 목록에 Passkey가 나타남`,
        language: 'typescript',
      },
    ],
    keyPoints: [
      '개인키는 기기 보안 칩(Secure Enclave)에서 절대 나가지 않음 — 서버 유출 무의미',
      '생체 데이터(지문/얼굴)는 기기 로컬에서만 처리, 서버 전송 없음',
      'Origin Binding: 개인키는 등록된 도메인에서만 동작 → 피싱 원천 차단',
      'Challenge: 매 인증마다 새 랜덤값 → Replay Attack 방지, Redis에 TTL로 임시 저장',
      'Counter: 인증마다 증가, 이전 값 재사용 시 복제 공격 감지',
      '폴백 필수: isUserVerifyingPlatformAuthenticatorAvailable()로 지원 여부 확인 후 UI 분기',
      'simplewebauthn 라이브러리: 서버(@simplewebauthn/server) + 클라이언트(@simplewebauthn/browser)',
    ],
    relatedProblemIds: ['auth-q-013', 'auth-q-014', 'auth-q-015'],
    tags: ['webauthn', 'passkeys', 'fido2', 'biometric', 'navigator.credentials', 'public-key', 'secure-enclave'],
  },

  // ─── auth-sec-004 ────────────────────────────────────────────────────────────
  {
    id: 'auth-sec-004',
    category: 'auth-security',
    subcategory: 'web-security',
    title: '웹 보안 방어 레이어 — Security Headers · CSP · Rate Limiting · 시크릿 관리',
    description: 'HTTPS 너머의 방어: HTTP 응답 헤더로 XSS·Clickjacking 차단, CSP로 스크립트 통제, Rate Limiting으로 브루트포스 방어, 환경변수 보안까지',
    emoji: '🛡️',
    readingTime: 10,
    sections: [
      {
        title: '왜 HTTPS만으로 부족한가',
        content: `HTTPS는 전송 계층(Transport Layer)을 보호합니다. 도청·변조·가짜 서버를 막아주지만, 애플리케이션 계층 공격은 방어하지 못합니다.

**HTTPS가 막지 못하는 것:**
- **XSS**: 공격자 스크립트가 이미 페이지에 삽입되어 실행
- **Clickjacking**: 투명 iframe으로 클릭 가로채기
- **MIME 스니핑**: 브라우저가 Content-Type을 무시하고 파일 실행
- **브루트포스**: 합법적인 HTTPS 요청으로 비밀번호 무한 시도

따라서 **HTTPS 위에 추가 방어 레이어**가 필요합니다. 응답 헤더, CSP, Rate Limiting이 그 역할을 합니다.`,
      },
      {
        title: 'HTTP Security Headers 설정',
        content: `서버 응답 헤더로 브라우저에게 보안 정책을 지시합니다. Next.js에서는 \`next.config.ts\`에서 일괄 설정할 수 있습니다.`,
        code: `// next.config.ts
const securityHeaders = [
  // HTTPS 강제 (1년, 서브도메인 포함)
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  // MIME 스니핑 방지
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Clickjacking 방어 (iframe 금지)
  { key: 'X-Frame-Options', value: 'DENY' },
  // Referer 정보 제한
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // 카메라/마이크/위치 접근 제한
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
]

module.exports = {
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }]
  },
}`,
        language: 'typescript',
      },
      {
        title: 'Content Security Policy — 인라인 스크립트 차단',
        content: `CSP는 브라우저에게 **어떤 출처의 리소스를 허용할지** 화이트리스트로 지정합니다. 인라인 스크립트를 기본 차단하여 XSS의 심층 방어 역할을 합니다.

**nonce 방식**: 서버가 매 요청마다 랜덤 nonce를 생성하여, 그 nonce가 있는 스크립트만 실행 허용.`,
        code: `// middleware.ts에서 nonce 기반 CSP 설정
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
  const cspHeader = [
    \`default-src 'self'\`,
    \`script-src 'self' 'nonce-\${nonce}' 'strict-dynamic'\`,
    \`style-src 'self' 'nonce-\${nonce}'\`,
    \`img-src 'self' blob: data:\`,
    \`font-src 'self'\`,
    \`object-src 'none'\`,
    \`frame-ancestors 'none'\`,  // Clickjacking 방어 (CSP 방식)
    \`upgrade-insecure-requests\`,
  ].join('; ')

  const response = NextResponse.next()
  response.headers.set('Content-Security-Policy', cspHeader)
  response.headers.set('x-nonce', nonce)  // Server Components에서 사용
  return response
}`,
        language: 'typescript',
      },
      {
        title: 'Rate Limiting — 로그인 보호',
        content: `브루트포스 공격: 공격자가 초당 수천 개의 비밀번호를 시도합니다. Rate Limiting으로 시도 횟수를 제한하면 공격이 수백만 배 느려집니다.

**두 단위로 제한:**
- **IP별 제한**: IP 우회 없이는 반복 시도 불가
- **계정별 제한**: IP를 바꿔도 동일 계정 반복 공격 차단

**지수 백오프**: 실패 시마다 대기 시간을 2배씩 늘려 정상 사용자 불편 최소화.`,
        code: `// NestJS + @nestjs/throttler
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler'
import { ThrottlerStorageRedisService } from 'nestjs-throttler-storage-redis'

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 60000, limit: 5 }],  // 1분에 5회
      storage: new ThrottlerStorageRedisService(redisClient),  // 분산 환경
    }),
  ],
})
export class AppModule {}

// 로그인 컨트롤러에 적용
@UseGuards(ThrottlerGuard)
@Post('login')
async login(@Body() dto: LoginDto) { ... }

// 계정 잠금 (10회 실패 시 15분 잠금)
async checkLoginAttempts(email: string) {
  const key = \`login_fail:\${email}\`
  const attempts = await redis.incr(key)
  if (attempts === 1) await redis.expire(key, 900)  // 15분 TTL
  if (attempts > 10) throw new TooManyRequestsException('계정이 일시 잠금되었습니다')
}`,
        language: 'typescript',
      },
      {
        title: '시크릿 관리 — 환경변수와 API Key',
        content: `**Next.js 환경변수 규칙:**
- \`NEXT_PUBLIC_\` 접두어: 클라이언트 번들에 포함 → 브라우저에서 누구나 볼 수 있음
- 접두어 없음: 서버(Node.js)에서만 접근 가능

**절대 규칙:** JWT_SECRET, DB 비밀번호, API Key에는 절대 \`NEXT_PUBLIC_\`을 사용하지 말 것.

**API Key 관리:**
- 환경변수에만 저장
- 코드/git에 절대 하드코딩 금지
- 노출 시 즉시 폐기·재발급 가능하도록 서비스별 개별 키 사용`,
        code: `// .env.local (git 제외)
DATABASE_URL=mongodb://...
JWT_SECRET=very-long-random-secret-32-chars-min
OPENAI_API_KEY=sk-xxxx

// 공개 가능한 값만 NEXT_PUBLIC_
NEXT_PUBLIC_API_URL=https://api.myapp.com

// ❌ 절대 금지
// NEXT_PUBLIC_JWT_SECRET=xxx  ← 브라우저에 노출!

// 서버 시작 시 환경변수 검증 (lib/env.ts)
import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  OPENAI_API_KEY: z.string().startsWith('sk-'),
})

export const env = envSchema.parse(process.env)
// 잘못된 환경변수로 서버가 시작되는 것을 방지`,
        language: 'typescript',
      },
    ],
    keyPoints: [
      'HTTPS/TLS: 기밀성(암호화) + 무결성(변조 감지) + 인증(서버 신원) 세 가지 동시 보장',
      'HSTS: 브라우저에 1년간 HTTPS만 허용 강제, preload로 하드코딩 가능',
      'X-Frame-Options: DENY / CSP frame-ancestors: none — Clickjacking 방어',
      'CSP default-src: inline script 기본 차단 → XSS 심층 방어, nonce 방식으로 허용 스크립트 지정',
      'Rate Limiting: IP+계정 단위, 지수 백오프, 계정 잠금으로 브루트포스 방어',
      'NEXT_PUBLIC_: 브라우저에 노출됨 — JWT_SECRET, DB URL에 절대 사용 금지',
      'API Key는 환경변수에만, 코드·git에 절대 하드코딩 금지',
    ],
    relatedProblemIds: ['auth-q-031', 'auth-q-032', 'auth-q-033', 'auth-q-034', 'auth-q-035', 'auth-q-036', 'auth-q-037', 'auth-q-038'],
    tags: ['https', 'tls', 'hsts', 'csp', 'security-headers', 'rate-limiting', 'clickjacking', 'api-key', 'env-security'],
  },
]
