import Link from 'next/link'

export const metadata = {
  title: 'Claude Code Thrifty 세팅 가이드',
  description: 'Claude Code 토큰 절약 훅 설치 방법',
}

export default function ThriftySetupPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-10">
      {/* Header */}
      <div>
        <Link href="/" className="text-sm text-gray-400 hover:text-gray-200 mb-4 inline-block">
          ← 홈으로
        </Link>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">⚡</span>
          <h1 className="text-3xl font-bold text-white">Claude Code Thrifty</h1>
        </div>
        <p className="text-gray-400 text-lg">
          Claude Code의 토큰 낭비를 막는 훅 시스템. 파일 중복 읽기, 불필요한 테스트 출력, 대용량 파일 전체 읽기를 차단해 세션당 비용을 줄인다.
        </p>
        <div className="mt-3 flex gap-2 flex-wrap">
          <span className="bg-emerald-900 text-emerald-300 text-xs px-2 py-1 rounded">보안 검증 완료</span>
          <span className="bg-blue-900 text-blue-300 text-xs px-2 py-1 rounded">네트워크 통신 없음</span>
          <span className="bg-violet-900 text-violet-300 text-xs px-2 py-1 rounded">MIT 라이선스</span>
          <span className="bg-orange-900 text-orange-300 text-xs px-2 py-1 rounded">회사 프로젝트 사용 안전</span>
        </div>
      </div>

      {/* 보안 노트 */}
      <div className="bg-emerald-950 border border-emerald-700 rounded-xl p-5">
        <h2 className="text-emerald-400 font-semibold text-lg mb-3">🔒 보안 검토 결과</h2>
        <ul className="space-y-2 text-sm text-gray-300">
          <li>✅ 외부 네트워크 통신 없음 — 모든 캐시는 <code className="bg-gray-800 px-1 rounded">/tmp</code> 로컬에만 저장</li>
          <li>✅ 회사 코드 유출 위험 없음 — 파일 내용이 외부로 나가지 않음</li>
          <li>✅ 오픈소스(MIT) — 코드 100% 감사 가능</li>
          <li>✅ 재부팅 시 캐시 자동 삭제 — <code className="bg-gray-800 px-1 rounded">/tmp</code> 특성상 흔적 없음</li>
          <li>✅ 임의 코드 실행 없음 — 테스트 출력 필터링, 로그 tail 제한만 수행</li>
        </ul>
      </div>

      {/* 작동 원리 */}
      <div>
        <h2 className="text-white font-semibold text-xl mb-4">어떻게 작동하나?</h2>
        <div className="grid gap-3">
          {[
            {
              hook: 'session-start.sh',
              event: 'SessionStart',
              desc: '세션 시작 시 이전 캐시 초기화 + 7일 지난 캐시 정리',
              color: 'border-blue-700 bg-blue-950',
            },
            {
              hook: 'pre-read.sh',
              event: 'PreToolUse(Read)',
              desc: '이미 읽은 파일 재읽기 차단. 변경된 경우 diff만 반환. 1000줄 이상 파일은 offset/limit 없이 읽기 차단',
              color: 'border-yellow-700 bg-yellow-950',
            },
            {
              hook: 'post-file-cache.sh',
              event: 'PostToolUse(Read/Edit/Write)',
              desc: '읽은 파일을 캐시에 저장. 수정 후엔 캐시 업데이트',
              color: 'border-purple-700 bg-purple-950',
            },
            {
              hook: 'pre-bash.sh',
              event: 'PreToolUse(Bash)',
              desc: 'pytest/jest/vitest 출력 → 핵심만 필터링. cat *.log → 자동 tail -100',
              color: 'border-rose-700 bg-rose-950',
            },
            {
              hook: 'post-compact.sh',
              event: 'PostCompact',
              desc: '컨텍스트 압축 후 모든 캐시 삭제 (재읽기 허용)',
              color: 'border-gray-600 bg-gray-900',
            },
          ].map((item) => (
            <div key={item.hook} className={`border rounded-lg p-4 ${item.color}`}>
              <div className="flex items-center justify-between mb-1">
                <code className="text-white font-mono text-sm">{item.hook}</code>
                <span className="text-xs text-gray-400">{item.event}</span>
              </div>
              <p className="text-gray-300 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 사전 요구사항 */}
      <div>
        <h2 className="text-white font-semibold text-xl mb-4">사전 요구사항</h2>
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-green-400">✅</span>
            <span className="text-gray-300">Claude Code CLI 설치</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-yellow-400">⚠️</span>
            <div>
              <span className="text-gray-300">jq 설치 필요 (JSON 파싱용)</span>
              <div className="mt-2 space-y-1">
                <CodeBlock label="Windows (winget)" code="winget install jqlang.jq" />
                <CodeBlock label="macOS" code="brew install jq" />
                <CodeBlock label="Ubuntu/Debian" code="sudo apt install jq" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-green-400">✅</span>
            <span className="text-gray-300">bash 4.0+ (macOS/Linux 기본 설치, Windows는 Git Bash 사용)</span>
          </div>
        </div>
      </div>

      {/* 설치 방법 */}
      <div>
        <h2 className="text-white font-semibold text-xl mb-4">설치 방법</h2>

        <div className="space-y-6">
          {/* Step 1 */}
          <Step number={1} title="jq 설치 확인">
            <CodeBlock code="jq --version" />
            <p className="text-gray-400 text-sm mt-2">출력 예: <code className="bg-gray-800 px-1 rounded">jq-1.8.1</code></p>
          </Step>

          {/* Step 2 */}
          <Step number={2} title="저장소 클론 및 훅 복사">
            <CodeBlock code={`git clone https://github.com/soonswan-study/claude-code-thrifty.git /tmp/claude-code-thrifty
mkdir -p ~/.claude/hooks
cp /tmp/claude-code-thrifty/hooks/*.sh ~/.claude/hooks/
chmod +x ~/.claude/hooks/*.sh`} />
          </Step>

          {/* Step 3 */}
          <Step number={3} title="settings.json에 훅 설정 추가">
            <p className="text-gray-400 text-sm mb-2">
              <code className="bg-gray-800 px-1 rounded">~/.claude/settings.json</code> 에 아래 내용을 추가. 기존 <code className="bg-gray-800 px-1 rounded">permissions</code> 설정은 유지하고 <code className="bg-gray-800 px-1 rounded">hooks</code> 블록만 병합.
            </p>
            <CodeBlock code={`{
  "permissions": { ... },  // 기존 설정 유지
  "hooks": {
    "SessionStart": [{ "matcher": "*", "hooks": [{ "type": "command", "command": "~/.claude/hooks/session-start.sh", "timeout": 10000 }] }],
    "PreToolUse": [
      { "matcher": "Read", "hooks": [{ "type": "command", "command": "~/.claude/hooks/pre-read.sh", "timeout": 3000 }] },
      { "matcher": "Bash", "hooks": [{ "type": "command", "command": "~/.claude/hooks/pre-bash.sh", "timeout": 3000 }] }
    ],
    "PostToolUse": [{ "matcher": "Read|Edit|Write", "hooks": [{ "type": "command", "command": "~/.claude/hooks/post-file-cache.sh", "timeout": 3000 }] }],
    "PostCompact": [{ "matcher": "*", "hooks": [{ "type": "command", "command": "~/.claude/hooks/post-compact.sh", "timeout": 5000 }] }]
  }
}`} />
          </Step>

          {/* Step 4 */}
          <Step number={4} title="CLAUDE.md에 토큰 효율 원칙 추가 (선택)">
            <p className="text-gray-400 text-sm mb-2">
              <code className="bg-gray-800 px-1 rounded">~/.claude/CLAUDE.md</code> 파일을 만들거나 기존 파일에 추가.
            </p>
            <CodeBlock code={`# Token Efficiency Principles

1. Never re-read a file you already have in context.
2. Run independent tool calls in parallel, not sequentially.
3. Delegate outputs longer than 20 lines to subagents.
4. Never repeat information the user already provided.
5. Run validation once after all changes: lint > build > check > test.`} />
          </Step>

          {/* Step 5 */}
          <Step number={5} title="설치 확인">
            <CodeBlock code="tail -f /tmp/claude-hooks.log" />
            <p className="text-gray-400 text-sm mt-2">
              새 Claude Code 세션 시작 후 로그에 아래 출력이 나오면 성공:
            </p>
            <CodeBlock code={`[20:48:01] session-start: done
[20:48:05] post-file-cache: cached (index.ts)
[20:48:07] pre-read: cache hit, blocked re-read (index.ts)`} />
          </Step>
        </div>
      </div>

      {/* 업데이트 */}
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-5">
        <h2 className="text-white font-semibold text-lg mb-3">업데이트 방법</h2>
        <p className="text-gray-400 text-sm mb-3">심링크 대신 복사본을 사용하므로, 업데이트 시 재복사 필요:</p>
        <CodeBlock code={`cd /tmp/claude-code-thrifty
git pull
cp hooks/*.sh ~/.claude/hooks/
chmod +x ~/.claude/hooks/*.sh`} />
      </div>

      {/* 문제 해결 */}
      <div>
        <h2 className="text-white font-semibold text-xl mb-4">자주 묻는 문제</h2>
        <div className="space-y-3">
          {[
            {
              q: 'session-start.sh에서 osascript 관련 에러가 나온다',
              a: 'macOS 알림 기능 호출인데 || true로 처리되어 에러가 나도 정상 동작. Windows에서는 무시하면 됨.',
            },
            {
              q: '1000줄 이상 파일을 읽어야 할 때 막힌다',
              a: 'offset/limit 파라미터를 사용해 필요한 구간만 읽으면 됨. 예: offset: 500, limit: 100',
            },
            {
              q: 'hooks 실행이 안 된다',
              a: 'chmod +x를 확인하고, settings.json의 hooks 경로가 ~/.claude/hooks/로 올바른지 확인.',
            },
            {
              q: '회사 코드가 외부로 유출될 수 있나?',
              a: '불가능. 모든 처리가 로컬 /tmp에서만 이루어지며 네트워크 호출이 없음.',
            },
          ].map((item) => (
            <details
              key={item.q}
              className="bg-gray-900 border border-gray-700 rounded-lg p-4 cursor-pointer"
            >
              <summary className="text-white font-medium text-sm">{item.q}</summary>
              <p className="text-gray-400 text-sm mt-2">{item.a}</p>
            </details>
          ))}
        </div>
      </div>

      {/* 관련 학습 링크 */}
      <div className="border-t border-gray-700 pt-6">
        <h2 className="text-white font-semibold mb-3">관련 학습</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/learn/ai-tools"
            className="bg-violet-900 text-violet-300 px-4 py-2 rounded-lg text-sm hover:bg-violet-800 transition-colors"
          >
            🤖 AI 도구 학습 카드
          </Link>
          <Link
            href="/categories/ai-tools"
            className="bg-violet-900 text-violet-300 px-4 py-2 rounded-lg text-sm hover:bg-violet-800 transition-colors"
          >
            ⚡ AI 도구 퀴즈 풀기
          </Link>
        </div>
      </div>
    </div>
  )
}

function Step({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-8 h-8 bg-violet-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
        {number}
      </div>
      <div className="flex-1">
        <h3 className="text-white font-medium mb-2">{title}</h3>
        {children}
      </div>
    </div>
  )
}

function CodeBlock({ code, label }: { code: string; label?: string }) {
  return (
    <div>
      {label && <p className="text-xs text-gray-500 mb-1">{label}</p>}
      <pre className="bg-gray-950 border border-gray-700 rounded-lg p-3 text-sm text-gray-300 overflow-x-auto whitespace-pre-wrap font-mono">
        {code}
      </pre>
    </div>
  )
}
