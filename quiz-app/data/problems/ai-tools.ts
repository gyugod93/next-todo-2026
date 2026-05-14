import type { Problem } from '@/types'

export const aiToolsProblems: Problem[] = [
  {
    id: 'ai-q-001',
    category: 'ai-tools',
    subcategory: 'claude-code',
    type: 'multiple-choice',
    difficulty: 'easy',
    title: 'CLAUDE.md의 역할',
    description: 'Claude Code가 프로젝트를 열 때 자동으로 읽는 CLAUDE.md 파일에 대한 설명으로 올바른 것은?',
    options: [
      'Claude API 인증 키를 저장하는 파일이다',
      '프로젝트별 AI 지침서로, 팀 컨벤션과 금지 패턴을 기록해 AI가 자동으로 준수하게 한다',
      'Claude Code가 생성한 코드를 저장하는 캐시 파일이다',
      'git commit 시 자동으로 실행되는 훅 스크립트다',
    ],
    correctAnswer: 1,
    explanation:
      'CLAUDE.md는 Claude Code가 프로젝트를 열 때 자동으로 읽는 지침 파일입니다. 코딩 컨벤션, 금지 패턴, 아키텍처 결정 등을 기록해 두면 AI가 항상 그 맥락에서 동작합니다. @import 문법으로 다른 파일을 포함할 수 있으며, 전역(~/.claude/CLAUDE.md), 프로젝트 루트, 하위 디렉토리 순으로 우선순위가 적용됩니다.',
    hints: ['Claude Code가 시작할 때 가장 먼저 읽는 파일을 생각해보세요'],
    deepDive:
      '위치별 우선순위: ① ~/.claude/CLAUDE.md (전역, 모든 프로젝트 적용) → ② ./CLAUDE.md (프로젝트 루트) → ③ ./src/CLAUDE.md (하위 디렉토리). @AGENTS.md처럼 @파일명 문법으로 다른 파일을 포함할 수 있습니다. 이 파일에 팀 컨벤션을 집약하면 새 팀원의 온보딩과 AI 코드 생성 품질이 동시에 향상됩니다.',
    relatedProblems: ['ai-q-002', 'ai-q-003'],
  },
  {
    id: 'ai-q-002',
    category: 'ai-tools',
    subcategory: 'claude-code',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'PreToolUse 훅에서 실행을 차단하려면?',
    description: 'Claude Code의 PreToolUse 훅에서 특정 Bash 명령 실행을 차단하려면 exit code를 어떻게 반환해야 하는가?',
    options: ['exit 0', 'exit 1', 'exit 2', 'exit 3'],
    correctAnswer: 2,
    explanation:
      'PreToolUse 훅에서 exit 2를 반환하면 해당 도구 실행이 차단됩니다. exit 0은 계속 진행, exit 2는 차단, 그 외 코드는 경고를 표시하고 진행합니다. 이를 활용해 rm -rf나 git push --force 같은 위험한 명령어를 자동으로 차단할 수 있습니다.',
    hints: ['0은 성공, 1은 일반 오류... 차단 전용 exit code를 확인해보세요'],
    deepDive:
      'Hooks 이벤트 종류: PreToolUse(도구 실행 전, 차단 가능), PostToolUse(실행 후), Notification(사용자 입력 대기 시), Stop(응답 완료), SubagentStop(서브에이전트 완료). PostToolUse 훅은 파일 수정 후 자동 포맷팅(prettier, eslint --fix)에 활용하기 좋습니다. $CLAUDE_TOOL_INPUT_* 환경변수로 도구 입력값에 접근할 수 있습니다.',
    relatedProblems: ['ai-q-001', 'ai-q-003'],
  },
  {
    id: 'ai-q-003',
    category: 'ai-tools',
    subcategory: 'mcp',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'MCP(Model Context Protocol)란?',
    description: 'MCP에 대한 설명으로 올바른 것은?',
    options: [
      'Anthropic이 독점 관리하는 Claude 전용 플러그인 시스템이다',
      'AI 모델과 외부 도구(DB, API 등)를 연결하는 오픈 표준 프로토콜로, Claude 외 다른 AI도 사용 가능하다',
      'Claude Code에서만 작동하는 도구 실행 시스템이다',
      'MCP는 Model Context Protocol의 약자로, 프롬프트 압축 알고리즘이다',
    ],
    correctAnswer: 1,
    explanation:
      'MCP(Model Context Protocol)는 Anthropic이 오픈소스로 공개한 AI↔외부 도구 연결 표준 프로토콜입니다. Claude뿐만 아니라 Cursor, GitHub Copilot 등 MCP 클라이언트를 지원하는 모든 AI에서 재사용할 수 있습니다. 한 번 MCP 서버를 만들면 여러 AI 도구에서 사용할 수 있다는 것이 핵심 장점입니다.',
    hints: ['오픈 표준이라는 점에 주목하세요'],
    deepDive:
      'MCP 서버가 제공할 수 있는 세 가지: ① Tools(AI가 호출할 수 있는 함수) ② Resources(AI가 읽을 수 있는 데이터 — 파일, DB 레코드 등) ③ Prompts(재사용 가능한 프롬프트 템플릿). settings.json의 mcpServers 키에 서버를 등록합니다. 공식 MCP 서버: @modelcontextprotocol/server-github, server-slack, server-filesystem 등.',
    relatedProblems: ['ai-q-001', 'ai-q-004'],
  },
  {
    id: 'ai-q-004',
    category: 'ai-tools',
    subcategory: 'claude-code',
    type: 'multiple-choice',
    difficulty: 'easy',
    title: '슬래시 커맨드 파일 위치',
    description: 'Claude Code에서 /commit, /review-pr 같은 커스텀 슬래시 커맨드를 만들려면 파일을 어디에 저장해야 하는가?',
    options: [
      '~/.claude/settings.json의 commands 배열에 추가',
      '.claude/commands/ 디렉토리에 마크다운 파일로 저장',
      'CLAUDE.md 파일 내 ## Commands 섹션에 정의',
      '/usr/local/bin/ 에 셸 스크립트로 저장',
    ],
    correctAnswer: 1,
    explanation:
      '.claude/commands/ 디렉토리에 마크다운 파일로 저장하면 파일명이 슬래시 커맨드가 됩니다. 예: .claude/commands/commit.md → /commit, .claude/commands/review-pr.md → /review-pr. $ARGUMENTS 플레이스홀더로 인자를 받을 수 있습니다 (/review-pr 123처럼 호출).',
    hints: ['.claude 디렉토리 안을 생각해보세요'],
    deepDive:
      '슬래시 커맨드 활용 예시: /commit (커밋 메시지 자동 생성), /review-pr $ARGUMENTS (PR 번호를 받아 리뷰), /test (테스트 실행 + 결과 요약), /refactor (현재 파일 리팩토링). 팀 공통 커맨드를 .claude/commands/에 저장하고 git으로 공유하면 팀 전체가 동일한 AI 워크플로우를 사용할 수 있습니다.',
    relatedProblems: ['ai-q-001', 'ai-q-002'],
  },
  {
    id: 'ai-q-005',
    category: 'ai-tools',
    subcategory: 'prompt-engineering',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'Chain-of-Thought 프롬프팅',
    description: '복잡한 문제에서 AI의 정확도를 높이는 Chain-of-Thought(CoT) 프롬프팅의 핵심 원리는?',
    options: [
      '짧고 간결한 프롬프트를 여러 번 반복해서 답을 평균내는 기법',
      'AI에게 중간 추론 과정을 단계별로 명시적으로 서술하게 요청하는 기법',
      'Few-Shot 예시를 100개 이상 제공하는 기법',
      '온도(temperature)를 0으로 고정해 결정론적 답변을 유도하는 기법',
    ],
    correctAnswer: 1,
    explanation:
      'Chain-of-Thought(CoT)는 AI에게 "단계별로 생각해보세요" 혹은 "1단계: ~, 2단계: ~, 3단계: ~순서로 분석해주세요"처럼 중간 추론 과정을 명시적으로 서술하게 요청하는 기법입니다. 복잡한 수학, 논리 추론, 버그 분석에서 정확도가 크게 향상됩니다. Claude는 내부적으로 <thinking> 태그를 통해 추론 과정을 거칩니다.',
    hints: ['Chain이라는 단어 — 사고의 연쇄(사슬)를 떠올려보세요'],
    deepDive:
      'CoT와 함께 쓰면 좋은 기법들: ① XML 태그 구조화 (<task>, <context>, <output_format>) — Claude가 특히 잘 반응 ② Few-Shot: 원하는 출력 형식의 예시 2-3개 포함 ③ System Prompt에 역할 부여 ("당신은 시니어 Next.js 개발자입니다"). 세 기법을 조합하면 일관된 고품질 출력을 얻을 수 있습니다.',
    relatedProblems: ['ai-q-003'],
  },
  // ─── AWS Bedrock ─────────────────────────────────────────────────────────────

  {
    id: 'ai-q-007',
    category: 'ai-tools',
    subcategory: 'aws-bedrock',
    type: 'multiple-choice',
    difficulty: 'easy',
    title: 'AWS Bedrock이란?',
    description: 'AWS Bedrock에 대한 설명으로 올바른 것은?',
    options: [
      'Anthropic이 AWS 서버에 배포한 Claude 전용 서비스다',
      'AWS가 운영하는 관리형 AI 서비스로, Claude · Llama · Mistral 등 여러 Foundation Model을 단일 API로 호출할 수 있다',
      'AWS EC2에 AI 모델을 직접 설치해 사용하는 자체 호스팅 방식이다',
      'Bedrock은 AWS S3에 AI 모델 가중치를 저장하는 서비스다',
    ],
    correctAnswer: 1,
    explanation:
      'AWS Bedrock은 AWS가 운영하는 완전 관리형(Managed) AI 서비스입니다. Anthropic Claude, Meta Llama, Mistral, Amazon Titan 등 다양한 Foundation Model을 서버 설정 없이 API로 호출할 수 있습니다. 모델 인프라는 AWS가 관리하고, 데이터는 AWS 인프라 안에 머물러 컴플라이언스/보안 요건을 충족합니다. Anthropic API를 직접 쓰는 것과 달리, 기업 환경에서 IAM, VPC, CloudTrail 등 AWS 보안 체계와 통합됩니다.',
    hints: ['관리형(Managed) = 서버/인프라 설정 불필요', 'Foundation Model = 대형 사전 학습 모델'],
    deepDive:
      'Bedrock vs Anthropic API 직접 호출 비교:\n\n| | Bedrock | Anthropic API |\n|---|---|---|\n| 인증 | AWS IAM (SigV4) | API Key |\n| 데이터 위치 | AWS 인프라 내 | Anthropic 서버 |\n| 모델 종류 | 멀티벤더 | Claude만 |\n| 추가 기능 | Knowledge Base, Agents, Guardrails | 없음 |\n| 보안 통합 | VPC, CloudTrail, KMS | 없음 |\n| 비용 | AWS 과금 | Anthropic 과금 |\n\nBedrock 주요 기능:\n• **InvokeModel**: 단일 모델 호출\n• **Knowledge Bases**: RAG(문서 검색 증강 생성)\n• **Agents for Bedrock**: 멀티스텝 태스크 자동화\n• **Guardrails**: 유해 콘텐츠 필터\n• **Model Evaluation**: 모델 품질 평가\n• **Provisioned Throughput**: 고정 처리량 예약',
    relatedProblems: ['ai-q-008', 'ai-q-009'],
  },
  {
    id: 'ai-q-008',
    category: 'ai-tools',
    subcategory: 'aws-bedrock',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'Bedrock 인증 — IAM vs API Key',
    description: '다음 코드에서 Bedrock 호출 방식으로 올바른 것은?',
    code: `// 방법 A — Anthropic SDK
import Anthropic from "@anthropic-ai/sdk"
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
await client.messages.create({ model: "claude-sonnet-4-6", ... })

// 방법 B — Bedrock SDK (AWS SDK v3)
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime"
const client = new BedrockRuntimeClient({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})`,
    options: [
      '방법 A와 B는 동일한 엔드포인트로 통신한다',
      '방법 A는 Anthropic API Key로 인증하고, 방법 B는 AWS IAM 자격증명(SigV4)으로 인증한다. 모델 ID 형식도 다르다',
      '방법 B에서 ANTHROPIC_API_KEY도 함께 필요하다',
      '방법 B는 Bedrock이 아닌 EC2에서만 동작한다',
    ],
    correctAnswer: 1,
    explanation:
      '방법 A는 Anthropic API(api.anthropic.com)에 ANTHROPIC_API_KEY로 인증합니다. 방법 B는 AWS Bedrock(bedrock-runtime.us-east-1.amazonaws.com)에 IAM Access Key/Secret Key로 인증(AWS Signature v4)합니다. 모델 ID도 다릅니다: Anthropic API는 "claude-sonnet-4-6", Bedrock은 "anthropic.claude-sonnet-4-5" 또는 Cross-Region Inference Profile "us.anthropic.claude-sonnet-4-5-20251001-v2:0" 형식을 사용합니다.',
    hints: ['인증 주체가 다름 — Anthropic 계정 vs AWS 계정'],
    deepDive:
      'Bedrock에서 Claude 호출 — @anthropic-ai/sdk를 Bedrock과 함께 사용:\n```typescript\nimport AnthropicBedrock from "@anthropic-ai/bedrock-sdk"\n// npm install @anthropic-ai/bedrock-sdk\n\nconst client = new AnthropicBedrock({\n  awsAccessKey: process.env.AWS_ACCESS_KEY_ID,\n  awsSecretKey: process.env.AWS_SECRET_ACCESS_KEY,\n  awsRegion: "us-east-1",\n})\n\nconst response = await client.messages.create({\n  model: "anthropic.claude-sonnet-4-5",  // Bedrock 모델 ID\n  max_tokens: 1024,\n  messages: [{ role: "user", content: "안녕하세요" }],\n})\n```\n\nAWS SDK 직접 사용:\n```typescript\nimport { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime"\n\nconst client = new BedrockRuntimeClient({ region: "us-east-1" })\n// EC2/Lambda에서는 IAM Role 사용 (credentials 생략 가능 — 환경변수 자동 감지)\n\nconst command = new InvokeModelCommand({\n  modelId: "anthropic.claude-sonnet-4-5",\n  contentType: "application/json",\n  accept: "application/json",\n  body: JSON.stringify({\n    anthropic_version: "bedrock-2023-05-31",\n    max_tokens: 1024,\n    messages: [{ role: "user", content: "안녕하세요" }],\n  }),\n})\nconst response = await client.send(command)\nconst result = JSON.parse(new TextDecoder().decode(response.body))\n```\n\nEC2/Lambda 환경: IAM Role 연결 시 credentials 명시 불필요 (Instance Metadata에서 자동 취득)',
    relatedProblems: ['ai-q-007', 'ai-q-009'],
  },
  {
    id: 'ai-q-009',
    category: 'ai-tools',
    subcategory: 'aws-bedrock',
    type: 'multiple-choice',
    difficulty: 'hard',
    title: 'Bedrock 모델 ID와 Cross-Region Inference',
    description: 'Bedrock에서 모델 호출 시 발생하는 ThrottlingException을 줄이기 위한 방법은?',
    options: [
      'API Key를 여러 개 발급받아 로테이션한다',
      'Cross-Region Inference Profile을 사용해 여러 AWS 리전의 처리 용량을 자동으로 분산한다',
      'Bedrock은 ThrottlingException이 발생하지 않는다',
      'EC2 인스턴스 타입을 높여 처리량을 늘린다',
    ],
    correctAnswer: 1,
    explanation:
      'Bedrock의 각 리전은 모델별로 처리량(TPM/RPM) 한도가 있습니다. Cross-Region Inference Profile은 단일 모델 ID로 여러 리전(예: us-east-1, us-west-2, eu-west-1)의 처리 용량을 자동 분산합니다. 모델 ID가 "us.anthropic.claude-sonnet-4-5-20251001-v2:0"처럼 "us." 또는 "eu." 접두사가 붙은 것이 Inference Profile입니다. 트래픽이 많을 때 단순 리전 모델 ID보다 안정적입니다.',
    hints: ['Cross-Region = 여러 리전 용량을 합쳐서 사용'],
    deepDive:
      'Bedrock Claude 모델 ID 형식:\n```\n// 단일 리전 모델 (리전 내 한도만 사용)\nanthropic.claude-sonnet-4-5\nanthropic.claude-opus-4-5\nanthropic.claude-haiku-4-5\n\n// Cross-Region Inference Profile (여러 리전 용량 자동 분산)\nus.anthropic.claude-sonnet-4-5-20251001-v2:0  // 미국 리전 풀\neu.anthropic.claude-sonnet-4-5-20251001-v2:0  // 유럽 리전 풀\n```\n\nProvisioned Throughput (예약 처리량):\n```typescript\n// 고정 처리량 예약 — 안정적인 서비스 운영 시\n// Bedrock 콘솔에서 구매 후 ARN 사용\nconst command = new InvokeModelCommand({\n  modelId: "arn:aws:bedrock:us-east-1::provisioned-model/xxxxx",\n  ...\n})\n```\n\nBedrock IAM 권한 최소화:\n```json\n{\n  "Version": "2012-10-17",\n  "Statement": [{\n    "Effect": "Allow",\n    "Action": [\n      "bedrock:InvokeModel",\n      "bedrock:InvokeModelWithResponseStream"\n    ],\n    "Resource": [\n      "arn:aws:bedrock:*::foundation-model/anthropic.claude-*"\n    ]\n  }]\n}\n```\n\nBedrock 스트리밍:\n```typescript\nimport { InvokeModelWithResponseStreamCommand } from "@aws-sdk/client-bedrock-runtime"\n\nconst command = new InvokeModelWithResponseStreamCommand({ modelId, body })\nconst response = await client.send(command)\n\nfor await (const event of response.body!) {\n  if (event.chunk?.bytes) {\n    const chunk = JSON.parse(new TextDecoder().decode(event.chunk.bytes))\n    if (chunk.type === "content_block_delta") {\n      process.stdout.write(chunk.delta.text)\n    }\n  }\n}\n```',
    relatedProblems: ['ai-q-007', 'ai-q-008'],
  },

  {
    id: 'ai-q-006',
    category: 'ai-tools',
    subcategory: 'ai-sdk',
    type: 'code-output',
    difficulty: 'hard',
    title: 'AI SDK Tool Use 흐름',
    description: '다음 코드에서 AI가 tool_use를 요청했을 때 올바른 다음 단계는?',
    code: `const response = await client.messages.create({
  model: 'claude-sonnet-4-6',
  max_tokens: 1024,
  tools: [searchTool],
  messages: [{ role: 'user', content: '오늘 날씨 알려줘' }],
})

if (response.stop_reason === 'tool_use') {
  // 다음에 무엇을 해야 하는가?
}`,
    options: [
      '응답을 그대로 사용자에게 반환한다',
      '실제 함수를 실행한 뒤 tool_result 메시지를 추가해 AI에게 다시 전송한다',
      'messages 배열을 초기화하고 새 대화를 시작한다',
      'response.content를 파싱해 tool 이름만 추출하면 완료된다',
    ],
    correctAnswer: 1,
    explanation:
      'stop_reason === "tool_use"이면 AI가 함수 호출을 요청한 것입니다. 이때는 ① AI의 tool_use 블록에서 함수명과 인자 추출 ② 실제 함수 실행 ③ tool_result 타입으로 결과를 messages에 추가 ④ 동일 conversation으로 AI에 재전송 순서로 처리합니다. AI는 tool_result를 받아 최종 자연어 답변을 생성합니다.',
    hints: ['AI가 요청했다면, 실행하고 결과를 돌려줘야 완성됩니다'],
    deepDive:
      'Tool Use 전체 흐름: user message → AI가 tool_use 요청(stop_reason: "tool_use") → 서버에서 함수 실행 → tool_result 추가 → AI 재호출 → AI가 최종 답변(stop_reason: "end_turn"). 여러 tool을 동시에 요청할 수 있으며(parallel tool use), 각각 tool_result를 준비해 한 번에 반환합니다.',
    relatedProblems: ['ai-q-005'],
  },
]
