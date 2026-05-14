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
]
