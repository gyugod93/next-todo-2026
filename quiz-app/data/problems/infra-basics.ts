import type { Problem } from '@/types'

export const infraBasicsProblems: Problem[] = [
  // ─── Docker ──────────────────────────────────────────────────────────────────

  {
    id: 'infra-q-001',
    category: 'infra-basics',
    subcategory: 'docker',
    type: 'multiple-choice',
    difficulty: 'easy',
    title: 'Docker Image vs Container',
    description: 'Docker Image와 Container의 관계로 올바른 것은?',
    options: [
      'Image와 Container는 동일한 개념이다',
      'Image는 실행 중인 프로세스이고, Container는 설계도이다',
      'Image는 읽기 전용 템플릿(설계도)이고, Container는 Image를 실행한 인스턴스(실제 실행 환경)이다',
      'Image는 Docker Hub에만 존재하고 로컬에서는 Container만 사용한다',
    ],
    correctAnswer: 2,
    explanation:
      'Image = 읽기 전용 레이어 스택 (OS + 런타임 + 앱 코드 + 의존성). Container = Image를 실행한 인스턴스로 실제 프로세스가 동작합니다. 하나의 Image로 여러 Container를 만들 수 있습니다. 클래스(Image)와 인스턴스(Container) 관계로 이해하면 쉽습니다.',
    hints: ['클래스(설계도) vs 인스턴스(실제 실행)로 비유'],
    deepDive:
      '기본 Docker 명령어:\n```bash\n# Image 관련\ndocker pull node:20-alpine      # Docker Hub에서 이미지 다운로드\ndocker images                    # 로컬 이미지 목록\ndocker build -t myapp:1.0 .     # Dockerfile로 이미지 빌드\ndocker rmi myapp:1.0            # 이미지 삭제\n\n# Container 관련\ndocker run -d -p 3000:3000 --name myapp myapp:1.0  # 컨테이너 생성+실행\ndocker ps                        # 실행 중인 컨테이너 목록\ndocker ps -a                     # 모든 컨테이너 (중지 포함)\ndocker stop myapp                # 컨테이너 중지\ndocker rm myapp                  # 컨테이너 삭제\ndocker logs -f myapp             # 로그 확인 (실시간)\ndocker exec -it myapp sh         # 컨테이너 내부 접속\n\n# Image Layer:\n# FROM node:20 → OS + Node.js 레이어\n# COPY package.json → package.json 레이어\n# RUN npm install → 의존성 레이어 (캐시됨)\n# COPY . . → 앱 코드 레이어\n```',
    relatedProblems: ['infra-q-002', 'infra-q-003', 'infra-q-004'],
  },
  {
    id: 'infra-q-002',
    category: 'infra-basics',
    subcategory: 'docker',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'Docker Volume vs Bind Mount',
    description: 'Node.js 앱 컨테이너에서 MongoDB 데이터를 컨테이너 재시작 후에도 유지하려면?',
    options: [
      '데이터는 컨테이너 내부에 저장하면 자동으로 유지된다',
      'Docker Volume을 사용하여 컨테이너 외부 저장소와 연결한다',
      '컨테이너를 절대 재시작하지 않으면 된다',
      'Docker Image를 컨테이너와 동기화하면 된다',
    ],
    correctAnswer: 1,
    explanation:
      '컨테이너 내부의 데이터는 컨테이너가 삭제되면 함께 사라집니다. Docker Volume을 사용하면 데이터를 호스트(또는 외부 스토리지)에 저장하여 컨테이너가 재시작/삭제되어도 데이터가 유지됩니다. MongoDB, PostgreSQL 등의 DB 컨테이너는 반드시 Volume을 사용해야 합니다.',
    hints: ['컨테이너는 기본적으로 ephemeral(일시적)'],
    deepDive:
      '```yaml\n# docker-compose.yml에서 Volume 설정\nservices:\n  mongodb:\n    image: mongo:7\n    volumes:\n      - mongo_data:/data/db  # Named Volume (권장)\n    environment:\n      MONGO_INITDB_ROOT_USERNAME: admin\n      MONGO_INITDB_ROOT_PASSWORD: password\n\n  app:\n    build: .\n    volumes:\n      - .:/app              # Bind Mount (개발 시 코드 동기화)\n      - /app/node_modules   # node_modules는 제외\n    ports:\n      - "3000:3000"\n    environment:\n      - MONGODB_URI=mongodb://admin:password@mongodb:27017/mydb\n    depends_on:\n      - mongodb\n\nvolumes:\n  mongo_data:  # Named Volume 선언\n```\n\nVolume vs Bind Mount:\n• Named Volume: Docker가 관리, 위치 자동, 배포 환경 권장\n• Bind Mount: 호스트 경로 지정, 개발 시 코드 변경 즉시 반영 (nodemon과 조합)\n• tmpfs: 메모리에만 저장, 컨테이너 종료 시 소멸 (캐시용)',
    relatedProblems: ['infra-q-001', 'infra-q-004'],
  },
  {
    id: 'infra-q-003',
    category: 'infra-basics',
    subcategory: 'docker',
    type: 'multiple-choice',
    difficulty: 'easy',
    title: 'Docker Port Mapping — -p 옵션',
    description: '`docker run -p 3000:8080 myapp`에서 포트 매핑의 의미는?',
    options: [
      '컨테이너 포트 3000을 호스트 포트 8080에 연결',
      '호스트 포트 3000을 컨테이너 포트 8080에 연결 (호스트:컨테이너)',
      '3000~8080 포트를 모두 개방',
      '포트 3000과 8080을 모두 컨테이너 내부에서 사용',
    ],
    correctAnswer: 1,
    explanation:
      '포트 매핑 형식: `-p {호스트포트}:{컨테이너포트}`. -p 3000:8080은 "컨테이너 내부 8080 포트를 호스트(내 PC)의 3000 포트로 매핑"합니다. 브라우저에서 localhost:3000으로 접근하면 컨테이너의 8080 포트에 도달합니다.',
    hints: ['순서: 호스트:컨테이너'],
    deepDive:
      '```bash\n# -p {HOST_PORT}:{CONTAINER_PORT}\ndocker run -p 3000:8080 myapp\n#  ↑ 내 PC(호스트)   ↑ 컨테이너 내부\n# 브라우저: localhost:3000 → 컨테이너:8080\n\n# 실전 예시\ndocker run -p 3000:3000 nextjs-app   # Next.js\ndocker run -p 8080:8080 nestjs-app   # NestJS\ndocker run -p 27017:27017 mongo      # MongoDB\ndocker run -p 6379:6379 redis        # Redis\n\n# 포트 확인\ndocker port myapp   # 컨테이너의 포트 매핑 목록\n\n# docker-compose.yml\nservices:\n  app:\n    ports:\n      - "3000:3000"   # 호스트:컨테이너\n      - "9229:9229"   # Node.js 디버거 포트\n```\n\n주의: EXPOSE 명령어는 문서화 목적일 뿐, 실제 포트 개방은 -p 옵션으로만 가능',
    relatedProblems: ['infra-q-001', 'infra-q-004'],
  },
  {
    id: 'infra-q-004',
    category: 'infra-basics',
    subcategory: 'docker',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'Docker Compose — 멀티 컨테이너 관리',
    description: 'Docker Compose를 사용하는 주된 이유는?',
    options: [
      'Docker보다 빠른 컨테이너 실행을 위해',
      '여러 컨테이너(앱 + DB + Redis 등)를 하나의 YAML 파일로 정의하고 함께 관리하기 위해',
      'Docker Image를 자동으로 최적화하기 위해',
      'Docker 없이 컨테이너를 실행하기 위해',
    ],
    correctAnswer: 1,
    explanation:
      'Docker Compose는 여러 컨테이너로 구성된 애플리케이션(예: Next.js + NestJS + MongoDB + Redis)을 docker-compose.yml 파일 하나로 정의하고, `docker compose up` 명령 하나로 모두 실행/중지합니다. 각 컨테이너가 자동으로 같은 네트워크에 속하여 서비스 이름으로 통신 가능합니다.',
    hints: ['여러 컨테이너를 한 번에 실행/중지'],
    deepDive:
      '```yaml\n# docker-compose.yml — 실전 Next.js + NestJS + MongoDB 구성\nservices:\n  frontend:\n    build:\n      context: ./next-app\n      dockerfile: Dockerfile\n    ports:\n      - "3000:3000"\n    environment:\n      - API_URL=http://backend:8080  # 서비스명으로 통신\n    depends_on:\n      - backend\n\n  backend:\n    build:\n      context: ./nest-app\n    ports:\n      - "8080:8080"\n    environment:\n      - MONGODB_URI=mongodb://mongodb:27017/mydb\n      - REDIS_URL=redis://redis:6379\n    depends_on:\n      - mongodb\n      - redis\n\n  mongodb:\n    image: mongo:7\n    volumes:\n      - mongo_data:/data/db\n\n  redis:\n    image: redis:7-alpine\n\nvolumes:\n  mongo_data:\n\n# 실행 명령\n# docker compose up -d        # 백그라운드 실행\n# docker compose down         # 중지 및 컨테이너 삭제\n# docker compose logs -f      # 전체 로그\n# docker compose restart app  # 특정 서비스 재시작\n```',
    relatedProblems: ['infra-q-001', 'infra-q-002', 'infra-q-005'],
  },

  // ─── 배포/아키텍처 ──────────────────────────────────────────────────────────

  {
    id: 'infra-q-005',
    category: 'infra-basics',
    subcategory: 'environment',
    type: 'multiple-choice',
    difficulty: 'easy',
    title: '환경변수 — .env 파일 관리',
    description: 'Next.js 프로젝트에서 `.env.local`과 `.env.production`의 차이는?',
    options: [
      '.env.local은 배포 환경에서 사용되고, .env.production은 로컬 개발에서 사용된다',
      '.env.local은 로컬 개발에서만 로드되고 git에 커밋하지 않으며, .env.production은 배포 시 적용되는 환경변수다',
      '두 파일의 차이는 없고 파일명만 다르다',
      '.env.local은 클라이언트에, .env.production은 서버에만 적용된다',
    ],
    correctAnswer: 1,
    explanation:
      'Next.js 환경변수 파일 우선순위: .env.local이 가장 높습니다. .env.local은 개인 설정(API 키, DB URL)을 위해 .gitignore에 포함합니다. .env.production은 프로덕션 빌드 시 적용되며 git에 커밋 가능한 비민감 설정에 사용합니다. .env.development는 개발 환경 기본값입니다.',
    hints: ['.gitignore에 어떤 파일이 들어가야 하는가?', 'local = 개인 비밀 설정'],
    deepDive:
      'Next.js 환경변수 파일 우선순위 (높음 → 낮음):\n1. .env.local (모든 환경에서 최우선, git 커밋 X)\n2. .env.development / .env.production (환경별)\n3. .env (기본값, git 커밋 가능)\n\n클라이언트 vs 서버:\n```bash\n# NEXT_PUBLIC_ 접두사: 클라이언트(브라우저)에서도 접근 가능\nNEXT_PUBLIC_API_URL=https://api.example.com\n\n# 접두사 없음: 서버(Node.js)에서만 접근 가능 (보안)\nMONGODB_URI=mongodb://...\nJWT_SECRET=supersecret\nNEXTAUTH_SECRET=anothersecret\n```\n\n.gitignore 필수 항목:\n```\n.env.local\n.env.*.local\n```\n\n실수 방지:\n• .env.example 파일로 필요한 변수 목록 공유 (실제 값 없이)\n• 팀원이 .env.local을 직접 작성\n• Vercel, Railway 등 배포 플랫폼의 환경변수 설정 UI 사용',
    relatedProblems: ['infra-q-006'],
  },
  {
    id: 'infra-q-006',
    category: 'infra-basics',
    subcategory: 'cicd',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'CI/CD 파이프라인 — 단계별 역할',
    description: 'CI/CD 파이프라인의 일반적인 단계 순서로 올바른 것은?',
    options: [
      'Deploy → Build → Test → Code 커밋',
      'Code 커밋 → CI(빌드+테스트+린트) → CD(스테이징 배포 → 프로덕션 배포)',
      'Test → Deploy → Build → 커밋',
      'CI와 CD는 항상 동시에 실행된다',
    ],
    correctAnswer: 1,
    explanation:
      'CI(Continuous Integration): 코드 커밋 → 자동 빌드 → 테스트 → 린트 → 코드 품질 검사. CD(Continuous Delivery/Deployment): CI 통과 → 스테이징 배포 → (승인) → 프로덕션 배포. GitHub Actions, GitLab CI, Jenkins 등이 이 파이프라인을 자동화합니다.',
    hints: ['CI = 통합, CD = 배포', '코드 변경 → 자동화'],
    deepDive:
      '```yaml\n# .github/workflows/deploy.yml — GitHub Actions 예시\nname: CI/CD\n\non:\n  push:\n    branches: [main]\n  pull_request:\n    branches: [main]\n\njobs:\n  ci:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with:\n          node-version: 20\n          cache: "npm"\n\n      - name: Install\n        run: npm ci\n\n      - name: Lint\n        run: npm run lint\n\n      - name: Type Check\n        run: npm run type-check\n\n      - name: Test\n        run: npm test -- --coverage\n\n      - name: Build\n        run: npm run build\n\n  cd:\n    needs: ci  # CI 통과 후 실행\n    if: github.ref == "refs/heads/main"\n    runs-on: ubuntu-latest\n    steps:\n      - name: Deploy to Production\n        run: |\n          # Vercel, Railway, AWS 등 배포 명령\n```',
    relatedProblems: ['infra-q-007', 'infra-q-008'],
  },
  {
    id: 'infra-q-007',
    category: 'infra-basics',
    subcategory: 'architecture',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'Monolith vs Microservices',
    description: '스타트업 초기 단계에서 Monolith 아키텍처를 선택하는 이유로 올바른 것은?',
    options: [
      'Monolith는 Microservices보다 항상 성능이 좋다',
      'Monolith는 단순한 개발/배포 구조로 빠른 개발과 초기 비용 절감에 유리하며, 확장 필요 시 Microservices로 전환할 수 있다',
      'Monolith는 절대 확장할 수 없다',
      'Microservices는 팀 규모에 상관없이 항상 Monolith보다 낫다',
    ],
    correctAnswer: 1,
    explanation:
      'Monolith(단일 서비스): 모든 기능이 하나의 코드베이스/배포 단위. 초기 개발 속도 빠름, 디버깅 쉬움, 인프라 단순. Microservices: 기능별 독립 서비스. 독립 배포/확장 가능, 기술 스택 다양화 가능하지만 복잡도 높음. "모든 성공적인 MSA는 Monolith로 시작했다" — Martin Fowler.',
    hints: ['스타트업 초기 = 빠른 개발이 우선', '복잡도 vs 속도 트레이드오프'],
    deepDive:
      '비교표:\n\nMonolith:\n✅ 개발 속도 빠름\n✅ 배포 단순 (하나만 배포)\n✅ 트랜잭션 관리 쉬움 (단일 DB)\n✅ 디버깅 쉬움\n❌ 팀/코드 규모 커지면 느려짐\n❌ 한 서비스 장애가 전체에 영향\n❌ 기술 스택 변경 어려움\n\nMicroservices:\n✅ 독립적 확장/배포\n✅ 장애 격리\n✅ 팀별 독립 개발\n✅ 서비스별 최적 기술 선택\n❌ 네트워크 오버헤드\n❌ 분산 트랜잭션 복잡\n❌ 운영/모니터링 복잡\n❌ 초기 인프라 비용 높음\n\nNest.js는 Monolith와 Microservices 모두 지원:\n• @nestjs/microservices로 MSA 통신 구현\n• Module 기반 구조로 Monolith → MSA 마이그레이션 용이',
    relatedProblems: ['infra-q-006', 'infra-q-008'],
  },
  {
    id: 'infra-q-008',
    category: 'infra-basics',
    subcategory: 'architecture',
    type: 'multiple-choice',
    difficulty: 'hard',
    title: 'Blue-Green Deployment vs Canary',
    description: 'Blue-Green 배포 전략의 핵심 이점은?',
    options: [
      '서버 비용을 50% 절감할 수 있다',
      '새 버전을 별도 환경(Green)에 배포하고 트래픽을 즉시 전환하여, 문제 발생 시 이전 버전(Blue)으로 즉각 롤백이 가능하다',
      'Blue는 개발, Green은 운영 환경을 뜻한다',
      '배포 중 서버를 완전히 종료하지 않는다는 의미이다',
    ],
    correctAnswer: 1,
    explanation:
      'Blue-Green: Blue(현재 운영) + Green(신규 버전)으로 두 환경을 유지합니다. 신버전을 Green에 배포하고 테스트 후 트래픽을 Blue→Green으로 전환. 문제 발생 시 즉시 Blue로 롤백. 단점: 두 배의 서버 비용. Canary: 트래픽의 일부(5~10%)만 신버전으로 보내 점진적 검증.',
    hints: ['두 환경 동시 운영 = 즉각 롤백 가능'],
    deepDive:
      '배포 전략 비교:\n\nBlue-Green:\n• 두 동일 환경 유지 (2배 비용)\n• 즉각 롤백 가능\n• 전환 시 짧은 순간 불일치 가능\n• 적합: DB 스키마 변경, 큰 변경사항\n\nCanary Release:\n• 트래픽 일부(5% → 25% → 50% → 100%) 단계적 전환\n• 문제 발생 시 영향 범위 최소화\n• 점진적 검증 가능\n• 적합: 기능 플래그, A/B 테스트\n\nRolling Update:\n• 인스턴스를 하나씩 순차적으로 교체\n• 비용 효율적\n• 롤백이 느림\n• Kubernetes 기본 배포 방식\n\nRecreate:\n• 모든 인스턴스 종료 후 신버전 배포\n• 다운타임 발생\n• 스테이징 환경에 적합\n\nNext.js + Vercel: 기본적으로 Blue-Green 유사 배포 제공',
    relatedProblems: ['infra-q-006', 'infra-q-009'],
  },
  {
    id: 'infra-q-009',
    category: 'infra-basics',
    subcategory: 'architecture',
    type: 'multiple-choice',
    difficulty: 'easy',
    title: 'CDN — Content Delivery Network',
    description: 'CDN을 사용하는 주된 이유는?',
    options: [
      'DB 쿼리 속도를 높이기 위해',
      '사용자와 지리적으로 가까운 엣지 서버에서 정적 파일(이미지, JS, CSS)을 제공하여 응답 속도를 높이고 원본 서버 부하를 줄이기 위해',
      'API 서버의 비즈니스 로직을 처리하기 위해',
      'Docker 컨테이너를 분산 실행하기 위해',
    ],
    correctAnswer: 1,
    explanation:
      'CDN은 전 세계 엣지 서버에 정적 파일을 캐싱하여 사용자와 가장 가까운 서버에서 응답합니다. 한국 사용자가 미국 원본 서버 대신 서울 엣지 서버에서 받으면 응답 시간이 크게 단축됩니다. Next.js는 Vercel CDN, 이미지 최적화 CDN을 기본 제공합니다.',
    hints: ['물리적 거리 = 응답 속도', '캐시 = 원본 서버 부하 감소'],
    deepDive:
      'CDN 활용 케이스:\n• 정적 파일: JS, CSS, 이미지, 폰트\n• Next.js Static Export: 전체를 CDN에서 서빙\n• 이미지 최적화: next/image → Vercel Image CDN\n\nCache-Control 헤더:\n```\n# 정적 파일 (1년 캐시)\nCache-Control: public, max-age=31536000, immutable\n\n# API 응답 (캐시 안 함)\nCache-Control: no-cache, no-store, must-revalidate\n\n# CDN 캐시만 (브라우저는 매번 검증)\nCache-Control: public, max-age=0, s-maxage=86400\n```\n\n주요 CDN 서비스:\n• Vercel Edge Network (Next.js 프로젝트 기본)\n• Cloudflare (무료 티어 제공)\n• AWS CloudFront\n• Fastly\n\nEdge Functions vs CDN:\n• CDN: 정적 파일 캐싱/서빙\n• Edge Functions: CDN 엣지에서 서버 코드 실행 (Next.js Middleware)',
    relatedProblems: ['infra-q-010'],
  },
  {
    id: 'infra-q-010',
    category: 'infra-basics',
    subcategory: 'architecture',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'Load Balancer — 역할과 알고리즘',
    description: '다음 중 Load Balancer가 해결하는 문제가 아닌 것은?',
    options: [
      '하나의 서버에 트래픽이 집중되어 과부하가 걸리는 문제',
      '특정 서버 장애 시 다른 서버로 자동 전환',
      'DB 쿼리 결과를 캐싱하여 응답 속도를 높이는 것',
      '여러 서버로 요청을 분산하여 가용성을 높이는 것',
    ],
    correctAnswer: 2,
    explanation:
      'DB 쿼리 캐싱은 Redis나 인메모리 캐시가 담당합니다. Load Balancer는 여러 서버에 트래픽을 분산하고, 서버 장애 시 헬스체크로 자동 감지하여 정상 서버로만 요청을 보냅니다. 선택지 1, 2, 4는 모두 Load Balancer의 역할입니다.',
    hints: ['로드 밸런서 = 트래픽 분산', '캐싱은 다른 레이어의 역할'],
    deepDive:
      '로드 밸런싱 알고리즘:\n• Round Robin: 순서대로 돌아가며 분산 (기본)\n• Least Connections: 현재 연결 수가 가장 적은 서버로\n• IP Hash: 같은 사용자는 항상 같은 서버로 (세션 유지에 유용)\n• Weighted Round Robin: 서버 성능에 따라 가중치 부여\n\n헬스체크:\n• 주기적으로 서버 상태 확인 (HTTP GET /health)\n• 실패 시 자동으로 풀에서 제거\n\n실무 환경:\n• Nginx (가장 많이 사용, 리버스 프록시도 겸함)\n• AWS ALB/NLB\n• Cloudflare Load Balancing\n\n```nginx\n# nginx.conf — 로드 밸런싱 설정\nupstream nestjs_app {\n  server app1:8080;\n  server app2:8080;\n  server app3:8080;\n}\n\nserver {\n  listen 80;\n  location /api {\n    proxy_pass http://nestjs_app;\n  }\n}\n```\n\nNestJS + JWT: Load Balancer 뒤에서도 Stateless JWT는 어느 서버에서나 검증 가능 (Session과 달리 서버 공유 불필요)',
    relatedProblems: ['infra-q-009', 'infra-q-007'],
  },
]
