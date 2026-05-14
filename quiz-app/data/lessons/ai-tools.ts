import type { Lesson } from '@/types'

export const aiToolsLessons: Lesson[] = [
  {
    id: 'ai-001',
    category: 'ai-tools',
    subcategory: 'claude-code',
    title: 'Claude Code 핵심 개념',
    description: 'Anthropic의 공식 AI 코딩 CLI — CLAUDE.md, 퍼미션 모드, 설정 파일 완전 정복',
    emoji: '🧠',
    readingTime: 8,
    tags: ['claude-code', 'cli', 'CLAUDE.md'],
    sections: [
      {
        title: 'Claude Code란?',
        content: `Claude Code는 Anthropic이 만든 공식 AI 코딩 CLI(Command Line Interface)입니다. 터미널에서 claude 명령어로 실행하며, 현재 디렉토리의 코드베이스를 이해하고 파일을 읽고 수정하며 명령어를 실행합니다.

단순한 코드 생성 도구가 아니라 **코드베이스를 이해하는 에이전트**입니다. 프로젝트 구조, git 히스토리, 테스트를 파악한 뒤 실제 변경을 수행합니다.

주요 특징:
- 파일 읽기/쓰기/수정
- 터미널 명령 실행
- 웹 검색
- MCP(Model Context Protocol) 서버 연결
- 멀티 에이전트 오케스트레이션`,
      },
      {
        title: 'CLAUDE.md — 프로젝트별 AI 지침서',
        content: `CLAUDE.md는 Claude Code가 프로젝트를 열 때 **자동으로 읽는 지침 파일**입니다. 팀 컨벤션, 금지 패턴, 아키텍처 결정 등을 기록해 두면 AI가 항상 그 맥락에서 동작합니다.

위치별 우선순위:
1. \`~/.claude/CLAUDE.md\` — 전역 (모든 프로젝트에 적용)
2. \`./CLAUDE.md\` — 프로젝트 루트
3. \`./src/CLAUDE.md\` — 하위 디렉토리

**@import 문법**으로 다른 파일을 포함할 수 있습니다:
\`@AGENTS.md\` — AGENTS.md 파일을 자동 포함`,
        code: `# CLAUDE.md 예시

## 프로젝트 개요
Next.js 14 App Router 기반 퀴즈 플랫폼

## 코딩 컨벤션
- TypeScript strict mode 사용
- 컴포넌트는 named export (default export 지양)
- Tailwind CSS 사용, 인라인 스타일 금지

## 금지 사항
- console.log 커밋 금지
- any 타입 사용 금지
- useEffect 의존성 배열 생략 금지

## 데이터베이스
- Supabase 사용
- 직접 SQL 작성 금지, Supabase client 통해서만 접근`,
        language: 'markdown',
      },
      {
        title: 'settings.json — Claude Code 설정',
        content: `Claude Code 설정은 JSON 파일로 관리합니다.

- **전역**: \`~/.claude/settings.json\`
- **프로젝트**: \`.claude/settings.json\`
- **로컬(git 미추적)**: \`.claude/settings.local.json\`

주요 설정 항목:
- \`permissions\`: 도구 허용/거부 규칙
- \`env\`: 환경변수 주입
- \`model\`: 사용할 모델 지정`,
        code: `// .claude/settings.json
{
  "permissions": {
    "allow": [
      "Bash(npm run *)",
      "Bash(git status)",
      "Bash(git diff *)",
      "Edit",
      "Read",
      "Write"
    ],
    "deny": [
      "Bash(rm -rf *)",
      "Bash(git push --force)"
    ]
  },
  "env": {
    "NODE_ENV": "development"
  }
}`,
        language: 'json',
      },
    ],
    keyPoints: [
      'CLAUDE.md는 프로젝트별 AI 지침서 — 팀 컨벤션을 기록하면 AI가 자동 준수',
      'settings.json으로 허용/거부할 Bash 명령어를 세밀하게 제어 가능',
      'Claude Code는 파일 수정 + 터미널 실행 + 웹 검색을 에이전트로 결합',
      '~/.claude/CLAUDE.md에 전역 선호 설정을 저장하면 모든 프로젝트에 적용',
    ],
    relatedProblemIds: ['ai-q-001', 'ai-q-004'],
  },
  {
    id: 'ai-002',
    category: 'ai-tools',
    subcategory: 'claude-code',
    title: 'Claude Code Hooks 시스템',
    description: 'PreToolUse / PostToolUse / Notification 훅으로 AI 행동을 감시하고 제어하는 방법',
    emoji: '🪝',
    readingTime: 6,
    tags: ['claude-code', 'hooks', 'automation'],
    sections: [
      {
        title: 'Hooks란?',
        content: `Claude Code Hooks는 AI가 도구를 실행하기 **전/후**에 셸 명령을 자동 실행하는 시스템입니다. 보안 검사, 자동 포맷팅, 알림, 감사 로그 등에 활용합니다.

**훅 이벤트 종류:**
- \`PreToolUse\` — 도구 실행 직전 (차단 가능)
- \`PostToolUse\` — 도구 실행 직후
- \`Notification\` — Claude가 사용자 입력을 기다릴 때
- \`Stop\` — Claude가 응답 완료 시
- \`SubagentStop\` — 서브에이전트 완료 시`,
      },
      {
        title: 'Hooks 설정 방법',
        content: `settings.json의 \`hooks\` 키에 정의합니다. 각 훅은 \`matcher\`(도구/이벤트 필터)와 \`hooks\`(실행할 명령 목록)로 구성됩니다.

훅 명령의 **exit code**로 동작을 제어합니다:
- \`exit 0\` — 계속 진행
- \`exit 2\` — PreToolUse에서 실행 **차단**
- 그 외 — 경고 표시 후 진행`,
        code: `// .claude/settings.json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "bash ~/.claude/hooks/check-dangerous.sh"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "npx prettier --write $CLAUDE_TOOL_INPUT_FILE_PATH"
          }
        ]
      }
    ],
    "Notification": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "osascript -e 'display notification \"Claude가 기다리고 있습니다\" with title \"Claude Code\"'"
          }
        ]
      }
    ]
  }
}`,
        language: 'json',
      },
      {
        title: '실용적인 훅 활용 예시',
        content: `**1. 위험한 명령 차단**
rm -rf나 git push --force를 실행하려 할 때 자동 차단

**2. 자동 린트/포맷**
파일을 수정할 때마다 자동으로 ESLint + Prettier 실행

**3. 테스트 자동 실행**
파일 수정 후 관련 테스트 자동 실행

**4. Slack/Discord 알림**
Claude가 작업 완료 시 알림 전송

**5. 감사 로그**
모든 파일 수정 내역을 로그 파일에 기록`,
        code: `#!/bin/bash
# ~/.claude/hooks/check-dangerous.sh
# PreToolUse 훅 — 위험한 Bash 명령 차단

COMMAND="$CLAUDE_TOOL_INPUT_COMMAND"

# rm -rf 패턴 감지
if echo "$COMMAND" | grep -qE 'rm\s+-rf|rm\s+--recursive.*--force'; then
  echo "⛔ 위험한 명령이 감지되었습니다: $COMMAND" >&2
  exit 2  # 실행 차단
fi

# git force push 감지
if echo "$COMMAND" | grep -qE 'git\s+push.*--force|git\s+push.*-f'; then
  echo "⛔ Force push는 허용되지 않습니다" >&2
  exit 2
fi

exit 0  # 허용`,
        language: 'bash',
      },
    ],
    keyPoints: [
      'PreToolUse 훅에서 exit 2를 반환하면 도구 실행을 차단할 수 있음',
      'PostToolUse 훅으로 파일 수정 후 자동 포맷팅 구현 가능',
      '$CLAUDE_TOOL_INPUT_* 환경변수로 훅에서 도구 입력값 접근 가능',
      'Notification 훅으로 긴 작업 중 사용자에게 알림 전송 가능',
    ],
    relatedProblemIds: ['ai-q-002'],
  },
  {
    id: 'ai-003',
    category: 'ai-tools',
    subcategory: 'claude-code',
    title: 'MCP (Model Context Protocol)',
    description: 'AI가 외부 도구를 사용하는 표준 프로토콜 — DB, API, Slack 연결하기',
    emoji: '🔌',
    readingTime: 7,
    tags: ['mcp', 'claude-code', 'integration'],
    sections: [
      {
        title: 'MCP란?',
        content: `Model Context Protocol(MCP)은 Anthropic이 오픈소스로 공개한 **AI ↔ 외부 도구 연결 표준 프로토콜**입니다. AI 모델이 데이터베이스, API, 파일 시스템 등 외부 리소스에 안전하게 접근할 수 있도록 표준화된 방법을 제공합니다.

**MCP 이전**: 각 AI 도구가 자체 플러그인 시스템 → 파편화
**MCP 이후**: 한 번 만든 MCP 서버를 Claude, Cursor, Copilot 등 모든 MCP 클라이언트에서 사용 가능

MCP는 **클라이언트-서버 아키텍처**:
- **MCP 서버**: 특정 도구/데이터 제공 (DB 서버, Slack 서버, GitHub 서버 등)
- **MCP 클라이언트**: AI 모델 (Claude Code, Claude Desktop 등)`,
      },
      {
        title: 'MCP 서버 설정',
        content: `Claude Code에 MCP 서버를 추가하는 방법은 두 가지:

**1. CLI로 추가:**
\`claude mcp add <name> <command>\`

**2. settings.json에 직접 추가:**
\`mcpServers\` 키에 서버 목록 정의`,
        code: `// .claude/settings.json — MCP 서버 설정
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": ["@supabase/mcp-server-supabase@latest"],
      "env": {
        "SUPABASE_URL": "https://xxx.supabase.co",
        "SUPABASE_SERVICE_ROLE_KEY": "eyJ..."
      }
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "ghp_..."
      }
    },
    "slack": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-slack"],
      "env": {
        "SLACK_BOT_TOKEN": "xoxb-..."
      }
    },
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/me/projects"
      ]
    }
  }
}`,
        language: 'json',
      },
      {
        title: 'MCP 서버 직접 만들기',
        content: `TypeScript로 커스텀 MCP 서버를 만들 수 있습니다. \`@modelcontextprotocol/sdk\` 패키지를 사용합니다.

MCP 서버가 제공할 수 있는 것:
- **Tools**: AI가 호출할 수 있는 함수
- **Resources**: AI가 읽을 수 있는 데이터 (파일, DB 레코드 등)
- **Prompts**: 재사용 가능한 프롬프트 템플릿`,
        code: `import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'

const server = new McpServer({
  name: 'my-quiz-server',
  version: '1.0.0',
})

// Tool 등록 — AI가 호출 가능한 함수
server.tool(
  'get_problem_stats',
  '퀴즈 문제 통계 조회',
  {
    category: z.string().optional(),
  },
  async ({ category }) => {
    const stats = await fetchStats(category)
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(stats, null, 2),
        },
      ],
    }
  }
)

// Resource 등록 — AI가 읽을 수 있는 데이터
server.resource(
  'problems://all',
  '모든 문제 목록',
  async () => ({
    contents: [
      {
        uri: 'problems://all',
        text: JSON.stringify(getAllProblems()),
      },
    ],
  })
)

const transport = new StdioServerTransport()
await server.connect(transport)`,
        language: 'typescript',
      },
    ],
    keyPoints: [
      'MCP는 AI와 외부 도구를 연결하는 오픈 표준 — Claude, Cursor 등 여러 AI에서 재사용 가능',
      'settings.json의 mcpServers에 서버 목록을 정의해 Claude Code에 연결',
      'Tools(함수), Resources(데이터), Prompts(템플릿) 세 가지를 MCP 서버가 제공 가능',
      '@modelcontextprotocol/sdk로 커스텀 MCP 서버를 직접 만들 수 있음',
    ],
    relatedProblemIds: ['ai-q-003'],
  },
  {
    id: 'ai-004',
    category: 'ai-tools',
    subcategory: 'claude-code',
    title: 'Claude Code 슬래시 커맨드와 메모리 시스템',
    description: '커스텀 슬래시 커맨드 만들기, 프로젝트 메모리 관리, 멀티 에이전트 오케스트레이션',
    emoji: '⌨️',
    readingTime: 5,
    tags: ['claude-code', 'slash-commands', 'memory', 'agents'],
    sections: [
      {
        title: '슬래시 커맨드',
        content: `슬래시 커맨드는 자주 쓰는 프롬프트를 \`/command\` 형태로 저장해 빠르게 호출하는 기능입니다.

**위치**: \`.claude/commands/\` 디렉토리에 마크다운 파일로 저장
**호출**: Claude Code에서 \`/commit\`, \`/review-pr\` 등으로 실행

파일명이 커맨드 이름이 됩니다:
- \`.claude/commands/commit.md\` → \`/commit\`
- \`.claude/commands/review-pr.md\` → \`/review-pr\`

\`$ARGUMENTS\` 플레이스홀더로 인자를 받을 수 있습니다.`,
        code: `# .claude/commands/review-pr.md
# /review-pr 123 처럼 호출

PR #$ARGUMENTS 를 리뷰해주세요.

다음 항목을 확인해주세요:
1. 보안 취약점 (SQL injection, XSS, CSRF)
2. 타입 안전성 — any 사용 여부
3. 에러 핸들링 누락 여부
4. 테스트 커버리지
5. 성능 문제 (N+1 쿼리, 불필요한 렌더링)

gh pr diff $ARGUMENTS 명령어로 diff를 먼저 확인한 뒤 리뷰해주세요.`,
        language: 'markdown',
      },
      {
        title: '메모리 시스템',
        content: `Claude Code는 \`~/.claude/projects/{프로젝트경로}/memory/\` 경로에 마크다운 파일로 **영구 메모리**를 저장합니다.

메모리 타입:
- **user**: 사용자 역할, 선호도, 지식 수준
- **feedback**: 사용자가 교정한 AI 행동 패턴
- **project**: 진행 중인 작업, 결정 사항, 마감일
- **reference**: 외부 시스템 정보 (Linear 프로젝트 ID, Slack 채널 등)

\`MEMORY.md\`가 인덱스 파일 역할을 하며, 각 메모리는 별도 파일로 저장됩니다.`,
        code: `---
name: 코딩 스타일 선호도
description: 사용자가 선호하는 코드 스타일과 하지 말아야 할 패턴
type: feedback
---

응답 끝에 "요약:" 섹션을 붙이지 말 것.

**Why:** 사용자가 diff를 직접 볼 수 있으며 반복 요약이 불필요하다고 명시적으로 요청함

**How to apply:** 코드 수정 후 "무엇을 했는지" 나열하는 대신 변경이 필요한 이유만 간결하게 설명`,
        language: 'markdown',
      },
      {
        title: '멀티 에이전트 오케스트레이션',
        content: `Claude Code는 **서브에이전트(subagent)**를 생성해 병렬로 작업을 수행할 수 있습니다.

**에이전트 타입:**
- \`general-purpose\`: 범용 에이전트
- \`Explore\`: 코드베이스 탐색 전용 (쓰기 도구 없음)
- \`Plan\`: 아키텍처 계획 수립
- \`claude-code-guide\`: Claude Code 관련 질문 답변

**주요 패턴:**
- 독립적인 작업은 **병렬** 실행 (context 효율화)
- 파일 쓰기가 필요 없는 탐색은 Explore 에이전트 사용
- 서브에이전트는 isolation: "worktree" 옵션으로 격리된 git worktree에서 실행 가능`,
        code: `// 에이전트를 병렬로 실행하는 패턴
// Agent 1: 보안 취약점 탐색
// Agent 2: 성능 병목 탐색
// Agent 3: 타입 오류 탐색
// → 세 에이전트가 동시에 실행되어 시간 절약

// worktree 격리 옵션 — 메인 코드베이스 영향 없이 실험
Agent({
  subagent_type: "general-purpose",
  isolation: "worktree",  // 임시 git worktree 생성
  prompt: "새 기능 브랜치에서 실험적 구현 시도"
})`,
        language: 'typescript',
      },
    ],
    keyPoints: [
      '.claude/commands/ 폴더의 마크다운 파일이 슬래시 커맨드가 됨',
      '$ARGUMENTS로 커맨드에 인자 전달 가능 (/review-pr 123)',
      'memory/ 폴더에 user/feedback/project/reference 타입의 영구 메모리 저장',
      '멀티 에이전트로 독립 작업을 병렬 실행해 컨텍스트 효율화',
    ],
    relatedProblemIds: ['ai-q-004'],
  },
  {
    id: 'ai-005',
    category: 'ai-tools',
    subcategory: 'ai-sdk',
    title: 'Anthropic AI SDK — 스트리밍과 Tool Use',
    description: 'Next.js에서 AI SDK로 스트리밍 응답, 도구 호출, 구조화된 출력 구현하기',
    emoji: '⚡',
    readingTime: 7,
    tags: ['ai-sdk', 'anthropic', 'streaming', 'tool-use'],
    sections: [
      {
        title: 'AI SDK 기본 설정',
        content: `Anthropic의 공식 AI SDK(@anthropic-ai/sdk)와 Vercel의 AI SDK(ai 패키지)를 함께 사용하면 Next.js에서 AI 기능을 손쉽게 구현할 수 있습니다.

**두 SDK의 역할:**
- \`@anthropic-ai/sdk\`: Anthropic API 직접 접근
- \`ai\` (Vercel AI SDK): React 훅, 스트리밍 UI, 프레임워크 통합`,
        code: `// app/api/chat/route.ts
import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(req: NextRequest) {
  const { messages } = await req.json()

  // 스트리밍 응답
  const stream = await client.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages,
  })

  // ReadableStream으로 변환
  const readableStream = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (
          chunk.type === 'content_block_delta' &&
          chunk.delta.type === 'text_delta'
        ) {
          controller.enqueue(
            new TextEncoder().encode(chunk.delta.text)
          )
        }
      }
      controller.close()
    },
  })

  return new Response(readableStream, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}`,
        language: 'typescript',
      },
      {
        title: 'Tool Use (함수 호출)',
        content: `Tool Use는 AI가 외부 함수를 호출할 수 있게 하는 기능입니다. AI가 "이 함수가 필요하다"고 판단하면 함수 호출 요청을 보내고, 결과를 받아 답변을 완성합니다.

**흐름:**
1. 사용자 메시지 전송
2. AI가 tool_use 블록으로 함수 호출 요청
3. 서버가 실제 함수 실행
4. tool_result로 결과 반환
5. AI가 최종 답변 생성`,
        code: `import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

// 도구 정의
const tools: Anthropic.Tool[] = [
  {
    name: 'get_problem_hint',
    description: '퀴즈 문제의 힌트를 가져옵니다',
    input_schema: {
      type: 'object',
      properties: {
        problem_id: {
          type: 'string',
          description: '문제 ID',
        },
        hint_level: {
          type: 'number',
          description: '힌트 레벨 (1-3)',
        },
      },
      required: ['problem_id'],
    },
  },
]

async function chatWithTools(userMessage: string) {
  const messages: Anthropic.MessageParam[] = [
    { role: 'user', content: userMessage },
  ]

  while (true) {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      tools,
      messages,
    })

    if (response.stop_reason === 'end_turn') {
      return response.content
    }

    if (response.stop_reason === 'tool_use') {
      const toolResults: Anthropic.MessageParam = {
        role: 'user',
        content: response.content
          .filter((b): b is Anthropic.ToolUseBlock => b.type === 'tool_use')
          .map((toolUse) => ({
            type: 'tool_result' as const,
            tool_use_id: toolUse.id,
            content: executeTool(toolUse.name, toolUse.input),
          })),
      }

      messages.push({ role: 'assistant', content: response.content })
      messages.push(toolResults)
    }
  }
}`,
        language: 'typescript',
      },
      {
        title: '구조화된 출력 (Structured Output)',
        content: `AI의 출력을 JSON 스키마에 맞게 강제할 수 있습니다. 데이터 파싱이 필요한 경우에 유용합니다.

Zod와 함께 사용하면 타입 안전한 구조화 출력을 얻을 수 있습니다.`,
        code: `import Anthropic from '@anthropic-ai/sdk'
import { z } from 'zod'

const client = new Anthropic()

// 출력 스키마 정의
const QuizAnalysisSchema = z.object({
  difficulty: z.enum(['easy', 'medium', 'hard']),
  topics: z.array(z.string()),
  hints: z.array(z.string()).max(3),
  explanation: z.string(),
})

async function analyzeQuestion(question: string) {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: '항상 유효한 JSON으로만 응답하세요.',
    messages: [
      {
        role: 'user',
        content: \`다음 퀴즈 문제를 분석하고 JSON으로 반환하세요:

스키마:
\${JSON.stringify(QuizAnalysisSchema.shape)}

문제: \${question}\`,
      },
    ],
  })

  const text = response.content[0].type === 'text'
    ? response.content[0].text
    : ''

  return QuizAnalysisSchema.parse(JSON.parse(text))
}`,
        language: 'typescript',
      },
    ],
    keyPoints: [
      'client.messages.stream()으로 스트리밍 응답, ReadableStream으로 클라이언트에 전달',
      'Tool Use: stop_reason === "tool_use"일 때 함수 실행 후 tool_result로 반환',
      '구조화된 출력은 system prompt + Zod 스키마 조합으로 타입 안전하게 구현',
      '최신 모델: claude-sonnet-4-6, claude-opus-4-6, claude-haiku-4-5',
    ],
    relatedProblemIds: ['ai-q-006'],
  },
  {
    id: 'ai-006',
    category: 'ai-tools',
    subcategory: 'prompt-engineering',
    title: '프롬프트 엔지니어링 핵심 패턴',
    description: 'Chain-of-Thought, Few-Shot, System Prompt 설계, XML 태그 활용 등 실전 기법',
    emoji: '✍️',
    readingTime: 8,
    tags: ['prompt-engineering', 'anthropic', 'best-practices'],
    sections: [
      {
        title: '효과적인 System Prompt 설계',
        content: `System Prompt는 AI의 **역할, 맥락, 제약**을 정의합니다. 잘 설계된 system prompt는 일관된 품질의 출력을 보장합니다.

**핵심 원칙:**
1. **역할 부여**: "당신은 시니어 TypeScript 개발자입니다"
2. **출력 형식 명시**: "항상 마크다운 코드 블록 사용"
3. **금지 사항 명확히**: "추측하지 말고 모르면 말할 것"
4. **예시 포함**: Few-shot 예시로 기대 출력 보여주기`,
        code: `const systemPrompt = \`당신은 Next.js 14 App Router 전문 개발자입니다.

## 역할
- TypeScript strict mode 코드만 작성
- Tailwind CSS 사용, 인라인 스타일 금지
- Server Component 우선, 필요할 때만 'use client' 사용

## 출력 형식
- 코드는 반드시 \\\`\\\`\\\`typescript 블록으로 감싸기
- 변경 이유를 1-2문장으로 설명
- 파일 경로를 항상 명시

## 금지 사항
- any 타입 사용 금지
- console.log 남기지 않기
- 불필요한 주석 추가 금지\``
        ,
        language: 'typescript',
      },
      {
        title: 'Chain-of-Thought (CoT) 프롬프팅',
        content: `복잡한 문제는 "단계별로 생각해보세요"라는 지시를 추가하면 정확도가 크게 향상됩니다. AI가 중간 추론 과정을 명시적으로 서술하게 만드는 기법입니다.

**일반 프롬프트**: "이 버그를 고쳐주세요"
**CoT 프롬프트**: "이 버그를 분석할 때 (1) 증상 파악 (2) 원인 추론 (3) 수정 방안 순서로 단계별로 설명하고 수정해주세요"

Claude는 \`<thinking>\` 태그 안에서 내부적으로 추론하는 방식을 사용합니다.`,
        code: `// CoT 프롬프트 예시
const prompt = \`
다음 TypeScript 코드에서 버그를 찾아 수정해주세요.

<thinking_instructions>
1단계: 코드가 어떤 동작을 의도하는지 파악
2단계: 실제 실행 시 어떤 일이 일어나는지 추적
3단계: 의도와 실제 동작의 차이점 식별
4단계: 수정 방안 도출
</thinking_instructions>

<code>
\${buggyCode}
</code>

위 단계를 따라 분석 후, 수정된 코드를 제공해주세요.
\``,
        language: 'typescript',
      },
      {
        title: 'XML 태그로 구조화',
        content: `Claude는 XML 태그를 사용한 구조화된 프롬프트에서 더 좋은 성능을 발휘합니다. 문서, 코드, 지시사항을 명확히 구분할 수 있습니다.`,
        code: `const analysisPrompt = \`
<task>
주어진 React 컴포넌트를 리뷰하고 개선 사항을 제안해주세요.
</task>

<context>
이 컴포넌트는 Next.js 14 App Router에서 사용되며,
Tailwind CSS와 TypeScript strict mode를 사용합니다.
</context>

<component>
\${componentCode}
</component>

<review_criteria>
1. 성능 최적화 (memo, useMemo, useCallback 적절한 사용)
2. 접근성 (aria 속성, 시맨틱 HTML)
3. 타입 안전성
4. 재사용성
</review_criteria>

<output_format>
각 항목별로 현재 상태(현황)와 개선 방안(제안)을 구분해 작성해주세요.
</output_format>
\``,
        language: 'typescript',
      },
      {
        title: 'Few-Shot 프롬프팅',
        content: `원하는 출력 형식의 예시를 2-3개 포함시키면 AI가 패턴을 학습해 일관된 형식으로 출력합니다. 특히 특수한 출력 형식이 필요할 때 효과적입니다.`,
        code: `const fewShotPrompt = \`
퀴즈 문제를 다음 형식의 JSON으로 변환해주세요.

예시 1:
입력: "JavaScript에서 == 와 === 의 차이는?"
출력: {
  "type": "multiple-choice",
  "difficulty": "easy",
  "tags": ["javascript", "operators", "type-coercion"]
}

예시 2:
입력: "React에서 useCallback이 필요한 경우를 코드로 보여주세요"
출력: {
  "type": "code-complete",
  "difficulty": "medium",
  "tags": ["react", "hooks", "performance"]
}

이제 다음 문제를 변환해주세요:
입력: "\${question}"
\``,
        language: 'typescript',
      },
    ],
    keyPoints: [
      'System prompt에 역할 + 출력 형식 + 금지 사항을 명확히 정의',
      'Chain-of-Thought: 단계별 추론을 요청하면 복잡한 문제 정확도 향상',
      'Claude는 XML 태그 구조화 프롬프트에서 특히 좋은 성능 발휘',
      'Few-Shot: 2-3개 예시 포함으로 일관된 출력 형식 유지',
    ],
    relatedProblemIds: ['ai-q-005'],
  },
  {
    id: 'ai-008',
    category: 'ai-tools',
    subcategory: 'aws-bedrock',
    title: 'AWS Bedrock으로 Claude 사용하기',
    description: 'Anthropic API와 무엇이 다른가 — IAM 인증, 모델 ID, Cross-Region Inference, Knowledge Base까지',
    emoji: '🏗️',
    readingTime: 9,
    tags: ['aws-bedrock', 'claude', 'iam', 'foundation-model'],
    sections: [
      {
        title: 'AWS Bedrock이란?',
        content: `AWS Bedrock은 AWS가 운영하는 **완전 관리형(Managed) AI 서비스**입니다. Anthropic Claude, Meta Llama, Mistral, Amazon Titan 등 여러 Foundation Model을 서버 설정 없이 API로 호출할 수 있습니다.

**Anthropic API 직접 호출과의 차이:**

| | Anthropic API | AWS Bedrock |
|---|---|---|
| 인증 | ANTHROPIC_API_KEY | AWS IAM (Access Key / Role) |
| 데이터 위치 | Anthropic 서버 | AWS 인프라 내 |
| 모델 | Claude만 | 멀티벤더 |
| 보안 통합 | 없음 | VPC, IAM, CloudTrail, KMS |
| 추가 기능 | 없음 | Knowledge Base, Agents, Guardrails |
| 적합한 환경 | 빠른 프로토타입 | 기업 서비스, 컴플라이언스 필요 시 |

**Bedrock을 선택하는 이유:**
- 데이터가 AWS 인프라 밖으로 나가지 않아야 하는 보안 요건
- 기존 AWS 인프라(EC2, Lambda, ECS)와 통합
- IAM으로 팀/역할별 세밀한 접근 제어
- CloudTrail로 모든 API 호출 감사 로그`,
      },
      {
        title: 'IAM 설정 — Bedrock 권한 부여',
        content: `Bedrock을 사용하려면 AWS 계정에서 **Bedrock 모델 접근 활성화**와 **IAM 권한** 두 가지가 필요합니다.

**1단계:** AWS 콘솔 → Amazon Bedrock → Model Access → Claude 모델 활성화 요청

**2단계:** IAM 정책에 bedrock:InvokeModel 권한 추가

로컬 개발: IAM Access Key + Secret Key를 환경변수로 설정
EC2/Lambda 배포: IAM Role 연결 (credentials 코드에서 생략 가능)`,
        code: `// IAM 정책 예시 (최소 권한 원칙)
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeModel",
        "bedrock:InvokeModelWithResponseStream"
      ],
      "Resource": [
        "arn:aws:bedrock:*::foundation-model/anthropic.claude-*"
      ]
    }
  ]
}

// 환경변수 설정 (로컬 개발)
// .env.local
AWS_ACCESS_KEY_ID=AKIAxxx
AWS_SECRET_ACCESS_KEY=xxx
AWS_REGION=us-east-1`,
        language: 'json',
      },
      {
        title: '@anthropic-ai/bedrock-sdk로 간편하게 사용',
        content: `Anthropic이 공식 제공하는 **@anthropic-ai/bedrock-sdk** 패키지를 사용하면 Anthropic SDK와 거의 동일한 인터페이스로 Bedrock을 사용할 수 있습니다. AWS SDK를 직접 다루는 것보다 훨씬 편리합니다.`,
        code: `// npm install @anthropic-ai/bedrock-sdk
import AnthropicBedrock from "@anthropic-ai/bedrock-sdk"

const client = new AnthropicBedrock({
  // 로컬: 환경변수에서 자동으로 읽어옴
  awsAccessKey: process.env.AWS_ACCESS_KEY_ID,
  awsSecretKey: process.env.AWS_SECRET_ACCESS_KEY,
  awsRegion: "us-east-1",
  // EC2/Lambda에서는 credentials 생략 → IAM Role 자동 사용
})

// ─── 일반 호출 ──────────────────────────────────────────
const response = await client.messages.create({
  model: "anthropic.claude-sonnet-4-5",  // Bedrock 모델 ID
  max_tokens: 1024,
  messages: [{ role: "user", content: "AWS Bedrock이 뭔지 설명해줘" }],
})
console.log(response.content[0].text)

// ─── 스트리밍 ──────────────────────────────────────────
const stream = await client.messages.stream({
  model: "anthropic.claude-sonnet-4-5",
  max_tokens: 1024,
  messages: [{ role: "user", content: "Next.js 14 App Router 설명해줘" }],
})

for await (const chunk of stream) {
  if (
    chunk.type === "content_block_delta" &&
    chunk.delta.type === "text_delta"
  ) {
    process.stdout.write(chunk.delta.text)
  }
}`,
        language: 'typescript',
      },
      {
        title: '모델 ID와 Cross-Region Inference',
        content: `Bedrock에서 Claude를 호출할 때 모델 ID 형식이 두 가지입니다.

**단일 리전 모델 ID:** 해당 리전의 처리 용량만 사용
**Cross-Region Inference Profile:** 여러 리전 용량을 자동 분산 → 트래픽 폭증 시 ThrottlingException 감소

트래픽이 많거나 안정적인 서비스라면 **Inference Profile 사용을 권장**합니다.`,
        code: `// 단일 리전 모델 ID (해당 리전 한도 내에서만)
"anthropic.claude-sonnet-4-5"
"anthropic.claude-opus-4-5"
"anthropic.claude-haiku-4-5"

// Cross-Region Inference Profile (여러 리전 자동 분산)
// 미국 리전 풀 (us-east-1 + us-west-2 등)
"us.anthropic.claude-sonnet-4-5-20251001-v2:0"

// 유럽 리전 풀
"eu.anthropic.claude-sonnet-4-5-20251001-v2:0"

// 사용 예시
const client = new AnthropicBedrock({ awsRegion: "us-east-1" })

const response = await client.messages.create({
  // Inference Profile: "us." 접두사 → 미국 여러 리전 분산
  model: "us.anthropic.claude-sonnet-4-5-20251001-v2:0",
  max_tokens: 1024,
  messages: [{ role: "user", content: "안녕" }],
})`,
        language: 'typescript',
      },
      {
        title: 'AWS SDK v3 직접 사용 (저수준 제어)',
        content: `더 세밀한 제어가 필요하다면 **@aws-sdk/client-bedrock-runtime**을 직접 사용할 수 있습니다. Lambda, EC2에서 IAM Role을 사용할 때도 이 방식이 적합합니다.`,
        code: `import {
  BedrockRuntimeClient,
  InvokeModelCommand,
  InvokeModelWithResponseStreamCommand,
} from "@aws-sdk/client-bedrock-runtime"

// EC2/Lambda: credentials 생략 → IAM Role 자동 적용
const client = new BedrockRuntimeClient({ region: "us-east-1" })

// ─── 일반 호출 ──────────────────────────────────────────
const command = new InvokeModelCommand({
  modelId: "anthropic.claude-sonnet-4-5",
  contentType: "application/json",
  accept: "application/json",
  body: JSON.stringify({
    anthropic_version: "bedrock-2023-05-31",  // Bedrock 필수 필드
    max_tokens: 1024,
    messages: [{ role: "user", content: "안녕하세요" }],
  }),
})

const response = await client.send(command)
const result = JSON.parse(new TextDecoder().decode(response.body))
console.log(result.content[0].text)

// ─── 스트리밍 ──────────────────────────────────────────
const streamCommand = new InvokeModelWithResponseStreamCommand({
  modelId: "anthropic.claude-sonnet-4-5",
  contentType: "application/json",
  accept: "application/json",
  body: JSON.stringify({
    anthropic_version: "bedrock-2023-05-31",
    max_tokens: 1024,
    messages: [{ role: "user", content: "Node.js 이벤트 루프 설명해줘" }],
  }),
})

const streamResponse = await client.send(streamCommand)
for await (const event of streamResponse.body!) {
  if (event.chunk?.bytes) {
    const chunk = JSON.parse(new TextDecoder().decode(event.chunk.bytes))
    if (chunk.type === "content_block_delta" && chunk.delta?.text) {
      process.stdout.write(chunk.delta.text)
    }
  }
}`,
        language: 'typescript',
      },
      {
        title: 'Next.js App Router에서 Bedrock 연동',
        content: `Next.js Server Action 또는 Route Handler에서 Bedrock을 호출하는 패턴입니다. 클라이언트에 AWS 자격증명이 노출되지 않습니다.`,
        code: `// app/api/ai/route.ts — Route Handler
import AnthropicBedrock from "@anthropic-ai/bedrock-sdk"
import { NextRequest } from "next/server"

const bedrock = new AnthropicBedrock({
  awsRegion: process.env.AWS_REGION ?? "us-east-1",
  // Vercel/서버리스: 환경변수로 credentials 주입
  // AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY 환경변수 자동 감지
})

export async function POST(req: NextRequest) {
  const { message } = await req.json()

  // 스트리밍 응답
  const stream = await bedrock.messages.stream({
    model: "us.anthropic.claude-sonnet-4-5-20251001-v2:0",
    max_tokens: 2048,
    system: "당신은 친절한 개발 도우미입니다.",
    messages: [{ role: "user", content: message }],
  })

  const readableStream = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (
          chunk.type === "content_block_delta" &&
          chunk.delta.type === "text_delta"
        ) {
          controller.enqueue(new TextEncoder().encode(chunk.delta.text))
        }
      }
      controller.close()
    },
  })

  return new Response(readableStream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}

// ─── 클라이언트 컴포넌트에서 스트리밍 수신 ───────────────
// "use client"
async function sendMessage(message: string) {
  const response = await fetch("/api/ai", {
    method: "POST",
    body: JSON.stringify({ message }),
    headers: { "Content-Type": "application/json" },
  })

  const reader = response.body!.getReader()
  const decoder = new TextDecoder()

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    setAnswer((prev) => prev + decoder.decode(value))
  }
}`,
        language: 'typescript',
      },
      {
        title: 'Bedrock Knowledge Base — RAG 구현',
        content: `Bedrock Knowledge Base는 S3에 업로드한 문서를 자동으로 임베딩하고 벡터 DB에 저장하여, **RAG(Retrieval-Augmented Generation)** 를 코드 없이 구축할 수 있게 해줍니다.

**구성:** S3 버킷에 PDF/MD/TXT 업로드 → Bedrock이 자동 임베딩 → 질문 시 관련 문서 검색 → Claude에 컨텍스트로 주입

직접 벡터 DB(Pinecone, pgvector)를 구축하지 않고도 엔터프라이즈급 RAG를 구현할 수 있습니다.`,
        code: `import {
  BedrockAgentRuntimeClient,
  RetrieveAndGenerateCommand,
} from "@aws-sdk/client-bedrock-agent-runtime"

const agentClient = new BedrockAgentRuntimeClient({ region: "us-east-1" })

// Knowledge Base에서 검색 + 답변 생성 (RAG)
const command = new RetrieveAndGenerateCommand({
  input: { text: "환불 정책이 어떻게 되나요?" },
  retrieveAndGenerateConfiguration: {
    type: "KNOWLEDGE_BASE",
    knowledgeBaseConfiguration: {
      knowledgeBaseId: process.env.BEDROCK_KB_ID!,
      modelArn:
        "arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-sonnet-4-5",
    },
  },
})

const response = await agentClient.send(command)
console.log(response.output?.text)

// 참조 문서 확인
response.citations?.forEach((citation) => {
  citation.retrievedReferences?.forEach((ref) => {
    console.log("출처:", ref.location?.s3Location?.uri)
    console.log("내용:", ref.content?.text?.slice(0, 100))
  })
})`,
        language: 'typescript',
      },
    ],
    keyPoints: [
      'Bedrock은 IAM 인증(SigV4) — Anthropic API Key 불필요, AWS 자격증명 사용',
      'EC2/Lambda에서는 IAM Role 연결 시 credentials 코드 생략 가능 (자동 감지)',
      '@anthropic-ai/bedrock-sdk 사용 시 Anthropic SDK와 거의 동일한 인터페이스',
      'Bedrock 모델 ID: "anthropic.claude-sonnet-4-5", Cross-Region은 "us." 접두사',
      'AWS SDK 직접 사용 시 body에 anthropic_version: "bedrock-2023-05-31" 필수',
      'Knowledge Base로 코드 없이 RAG 구축 가능 — S3 문서 자동 임베딩',
      'ThrottlingException 빈번 시 Cross-Region Inference Profile로 전환',
    ],
    relatedProblemIds: ['ai-q-007', 'ai-q-008', 'ai-q-009'],
  },

  {
    id: 'ai-007',
    category: 'ai-tools',
    subcategory: 'cursor',
    title: 'Cursor와 AI IDE 도구 생태계',
    description: 'Cursor, GitHub Copilot, Windsurf 비교 — Rules 파일, Composer, Agent 모드 활용',
    emoji: '🖱️',
    readingTime: 5,
    tags: ['cursor', 'copilot', 'ai-ide', 'windsurf'],
    sections: [
      {
        title: 'AI IDE 도구 비교',
        content: `**Cursor**: VS Code 포크 기반, Claude/GPT-4 사용, Composer(멀티파일 편집), Agent 모드 지원
**GitHub Copilot**: GitHub/MS 공식, 코드 자동완성 중심, Workspace 에이전트
**Windsurf (Codeium)**: Cascade라는 에이전트 시스템, 강력한 코드베이스 이해
**Claude Code**: Anthropic 공식 CLI, 터미널 기반, MCP 연동, 가장 강력한 에이전트 모드

**선택 기준:**
- IDE 내장 경험 원함 → Cursor or Copilot
- 터미널 친화적, 강력한 에이전트 → Claude Code
- 무료 자동완성 → GitHub Copilot Free`,
      },
      {
        title: 'Cursor Rules 파일',
        content: `Cursor의 \`.cursorrules\` 또는 \`.cursor/rules/\` 파일은 Claude Code의 CLAUDE.md와 동일한 역할을 합니다. AI에게 프로젝트 컨벤션을 알려주는 파일입니다.

**주요 차이점:**
- Cursor: \`.cursorrules\` (단일 파일) 또는 \`.cursor/rules/\` (복수 파일)
- Claude Code: \`CLAUDE.md\` + \`@import\` 문법

두 도구를 함께 쓴다면 CLAUDE.md와 .cursorrules를 **동기화**하거나, CLAUDE.md에서 .cursorrules를 @import하는 방식을 권장합니다.`,
        code: `# .cursorrules 예시

## 기술 스택
- Next.js 14 (App Router)
- TypeScript strict mode
- Tailwind CSS v3
- Zustand (상태관리)
- Supabase (DB)

## 코딩 규칙
- Server Component 우선 사용
- Data fetching은 Server Component에서
- 이벤트 핸들러가 있을 때만 'use client' 사용
- 파일명: kebab-case (예: user-profile.tsx)
- 컴포넌트명: PascalCase

## 금지 패턴
- useEffect로 데이터 페칭 (Server Component 사용)
- any 타입
- 하드코딩된 색상 (Tailwind 클래스 사용)`,
        language: 'markdown',
      },
      {
        title: 'Cursor Composer와 Agent 모드',
        content: `**Composer (Cmd+I)**: 여러 파일을 동시에 수정. 자연어로 "UserProfile 컴포넌트에 아바타 업로드 기능 추가해줘"라고 하면 관련 파일을 모두 수정.

**Agent 모드**: 터미널 명령 실행, 파일 검색, 테스트 실행까지 자율적으로 수행. Claude Code의 에이전트 모드와 유사.

**활용 팁:**
- 새 기능 추가: Composer로 "어떤 기능을 어떻게" 설명
- 버그 수정: 에러 메시지 붙여넣기 → Agent가 자동 탐색 및 수정
- 리팩토링: "이 파일의 모든 useEffect 제거하고 Server Action으로 교체"`,
      },
    ],
    keyPoints: [
      'Cursor는 IDE 내장 경험, Claude Code는 터미널 에이전트 — 용도에 따라 선택',
      '.cursorrules와 CLAUDE.md는 같은 역할 — 두 도구 사용 시 동기화 권장',
      'Cursor Composer로 여러 파일 동시 수정, Agent 모드로 자율 작업',
      'AI IDE는 도구일 뿐 — 아키텍처 결정과 코드 리뷰는 개발자의 역할',
    ],
    relatedProblemIds: [],
  },
]
