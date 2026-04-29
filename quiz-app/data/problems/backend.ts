import type { Problem } from '@/types'

export const backendProblems: Problem[] = [
  // ─── REST API ────────────────────────────────────────────────────────────────

  {
    id: 'be-q-001',
    category: 'backend',
    subcategory: 'rest-api',
    type: 'multiple-choice',
    difficulty: 'easy',
    title: 'HTTP Method — CRUD 매핑과 idempotency',
    description: '다음 중 "멱등성(Idempotency)"을 가지는 HTTP 메서드가 아닌 것은?',
    options: ['GET', 'PUT', 'DELETE', 'POST'],
    correctAnswer: 3,
    explanation:
      'POST는 멱등성이 없습니다. 같은 POST 요청을 여러 번 보내면 리소스가 여러 개 생성됩니다. GET(조회), PUT(전체 교체), DELETE(삭제)는 멱등성이 있어 여러 번 호출해도 결과가 동일합니다. PATCH는 부분 업데이트로 구현에 따라 멱등할 수도 아닐 수도 있습니다.',
    hints: ['멱등성 = 여러 번 요청해도 결과가 같음', '주문 생성 API를 여러 번 누르면?'],
    deepDive:
      'HTTP Method 완전 정리:\n• GET: 조회, 멱등, 안전(Safe), 캐시 가능\n• POST: 생성, 비멱등, 비안전, 캐시 불가\n• PUT: 전체 교체, 멱등, 비안전\n• PATCH: 부분 수정, 보통 멱등하지 않음, 비안전\n• DELETE: 삭제, 멱등(두 번 삭제해도 "없음"으로 동일), 비안전\n• HEAD: GET과 동일하지만 Body 없음 (헤더만)\n• OPTIONS: 가능한 메서드 조회 (CORS preflight)\n\n안전(Safe) = 서버 상태 변경 없음 (GET, HEAD, OPTIONS)\n멱등(Idempotent) = 여러 번 호출해도 동일 결과 (GET, PUT, DELETE, HEAD, OPTIONS)',
    relatedProblems: ['be-q-002', 'be-q-003'],
  },
  {
    id: 'be-q-002',
    category: 'backend',
    subcategory: 'rest-api',
    type: 'multiple-choice',
    difficulty: 'easy',
    title: 'HTTP Status Code — 의미 매핑',
    description: '다음 상황과 HTTP 상태 코드 매핑이 잘못된 것은?',
    options: [
      '회원가입 성공 → 201 Created',
      '잘못된 요청 형식 (유효성 검사 실패) → 400 Bad Request',
      '인증 토큰 없음 (로그인 안 됨) → 403 Forbidden',
      '존재하지 않는 리소스 → 404 Not Found',
    ],
    correctAnswer: 2,
    explanation:
      '인증 토큰이 없거나 토큰이 만료된 경우는 401 Unauthorized입니다. 403 Forbidden은 인증은 됐지만 해당 리소스에 접근 권한이 없는 경우입니다. 401 = "당신이 누구인지 모름", 403 = "당신이 누구인지는 알지만 권한 없음". 이 구분이 면접에서 자주 나옵니다.',
    hints: ['401 vs 403의 차이: 인증(Authentication) vs 인가(Authorization)'],
    deepDive:
      'HTTP Status Code 실무 핵심:\n\n2xx 성공:\n• 200 OK — 일반 성공\n• 201 Created — 리소스 생성 성공 (POST)\n• 204 No Content — 성공이지만 Body 없음 (DELETE)\n\n3xx 리다이렉트:\n• 301 Moved Permanently — 영구 이동 (SEO에 영향)\n• 302 Found — 임시 이동\n• 304 Not Modified — 캐시 유효 (조건부 GET)\n\n4xx 클라이언트 오류:\n• 400 Bad Request — 잘못된 요청 (유효성 실패)\n• 401 Unauthorized — 미인증\n• 403 Forbidden — 권한 없음\n• 404 Not Found — 없는 리소스\n• 409 Conflict — 충돌 (이미 존재하는 이메일 등)\n• 422 Unprocessable Entity — 의미적으로 잘못된 요청\n• 429 Too Many Requests — 레이트 리밋\n\n5xx 서버 오류:\n• 500 Internal Server Error — 서버 예외\n• 502 Bad Gateway — 업스트림 서버 오류\n• 503 Service Unavailable — 일시적 서비스 불가',
    relatedProblems: ['be-q-001', 'auth-q-001'],
  },
  {
    id: 'be-q-003',
    category: 'backend',
    subcategory: 'rest-api',
    type: 'multiple-choice',
    difficulty: 'easy',
    title: 'Path Params vs Query Params vs Request Body',
    description: '다음 중 올바른 API 설계가 아닌 것은?',
    options: [
      'GET /users/:id — 특정 사용자 조회',
      'GET /users?page=1&limit=20 — 페이지네이션 목록',
      'GET /users/:id?password=1234 — 비밀번호 확인',
      'POST /users — Body에 { name, email, password } 전송하여 생성',
    ],
    correctAnswer: 2,
    explanation:
      '비밀번호를 Query Parameter로 전송하면 절대 안 됩니다. URL은 서버 로그, 브라우저 히스토리, 리퍼러 헤더에 그대로 기록되어 민감 정보가 노출됩니다. 민감한 데이터는 반드시 Request Body(POST)나 Authorization 헤더로 전송해야 합니다.',
    hints: ['URL에 노출되면 어떤 위험이 있나요?', '로그와 히스토리를 생각해보세요'],
    deepDive:
      '세 가지 파라미터 용도:\n\nPath Params (/users/:id):\n• 특정 리소스를 식별할 때\n• 없으면 다른 리소스가 되는 경우 (userId 없으면 전체 목록)\n• 예: /posts/:postId/comments/:commentId\n\nQuery Params (?key=value):\n• 필터링, 정렬, 페이지네이션 (선택적 조건)\n• 예: /products?category=전자기기&sort=price&page=1\n• GET 요청에서 사용\n• 민감 정보 절대 금지!\n\nRequest Body:\n• 데이터 생성/수정 시 (POST, PUT, PATCH)\n• 민감한 데이터 (비밀번호, 개인정보)\n• 대용량 데이터\n• GET에는 Body 사용 지양 (일부 클라이언트/프록시가 무시)\n\nHeaders:\n• Authorization: Bearer {token}\n• Content-Type: application/json\n• 인증, 메타데이터',
    relatedProblems: ['be-q-001', 'be-q-004'],
  },
  {
    id: 'be-q-004',
    category: 'backend',
    subcategory: 'rest-api',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'RESTful URL 설계 원칙',
    description: '다음 중 REST 설계 원칙을 올바르게 따른 URL은?',
    options: [
      'POST /createUser',
      'GET /getUserById?id=123',
      'DELETE /users/123',
      'GET /deletePost/456',
    ],
    correctAnswer: 2,
    explanation:
      'REST URL은 리소스(명사)를 표현하고, 행위는 HTTP Method로 표현합니다. DELETE /users/123은 "users 중 123번 리소스를 삭제(DELETE)"로 올바릅니다. /createUser, /getUserById, /deletePost는 동사가 URL에 포함되어 RESTful 원칙에 어긋납니다.',
    hints: ['URL에는 명사, 동작은 HTTP Method', '동사가 URL에 있으면 REST가 아니다'],
    deepDive:
      'RESTful URL 설계 원칙:\n\n1. 리소스는 복수 명사: /users, /posts, /orders\n2. 계층 관계 표현: /users/:id/orders/:orderId\n3. HTTP Method로 행위 표현:\n   GET    /users        → 목록 조회\n   POST   /users        → 생성\n   GET    /users/:id    → 단건 조회\n   PUT    /users/:id    → 전체 수정\n   PATCH  /users/:id    → 부분 수정\n   DELETE /users/:id    → 삭제\n4. 소문자, 하이픈(kebab-case): /user-profiles (언더스코어 사용 X)\n5. 파일 확장자 URL에 포함 금지: /users.json (X)\n6. 버전 관리: /api/v1/users\n\n비RESTful → RESTful:\n/getUsers → GET /users\n/createPost → POST /posts\n/deleteUser?id=1 → DELETE /users/1\n/updateUserEmail → PATCH /users/:id',
    relatedProblems: ['be-q-001', 'be-q-005'],
  },
  {
    id: 'be-q-005',
    category: 'backend',
    subcategory: 'rest-api',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'HTTP Headers — Content-Type vs Accept vs Authorization',
    description: 'NestJS API에서 클라이언트가 "JSON 형식으로 응답을 원한다"고 서버에 알리는 헤더는?',
    options: [
      'Content-Type: application/json',
      'Accept: application/json',
      'Authorization: Bearer {token}',
      'Cache-Control: no-cache',
    ],
    correctAnswer: 1,
    explanation:
      'Accept 헤더는 클라이언트가 원하는 응답 형식을 서버에 알립니다. Content-Type은 현재 요청에서 보내는 데이터의 형식을 명시합니다. Authorization은 인증 토큰, Cache-Control은 캐시 정책입니다.',
    hints: ['Content-Type = 내가 보내는 형식, Accept = 받고 싶은 형식'],
    deepDive:
      '주요 HTTP Headers:\n\n요청 헤더:\n• Content-Type: 요청 Body 형식 (application/json, multipart/form-data)\n• Accept: 원하는 응답 형식 (application/json, text/html)\n• Authorization: Bearer {JWT} 또는 Basic {base64}\n• Cookie: 쿠키 전송\n• Origin: CORS 요청 출처\n• Referer: 이전 페이지 URL\n• User-Agent: 클라이언트 환경 정보\n• Cache-Control: max-age=3600 (캐시 정책)\n\n응답 헤더:\n• Content-Type: 응답 형식\n• Set-Cookie: 쿠키 설정\n• Access-Control-Allow-Origin: CORS 허용 출처\n• Cache-Control: no-cache, no-store\n• ETag: 리소스 버전 식별자 (조건부 GET에 사용)\n• Location: 201 Created 시 새 리소스 URL\n• WWW-Authenticate: 401 응답 시 인증 방법 명시',
    relatedProblems: ['be-q-001', 'auth-q-001'],
  },

  // ─── NestJS ──────────────────────────────────────────────────────────────────

  {
    id: 'be-q-006',
    category: 'backend',
    subcategory: 'nestjs',
    type: 'multiple-choice',
    difficulty: 'easy',
    title: 'NestJS 삼각구조 — Module / Controller / Service',
    description: 'NestJS에서 "비즈니스 로직(DB 쿼리, 계산 등)"은 어디에 작성해야 하는가?',
    options: [
      'Module — 의존성 등록과 비즈니스 로직을 함께 처리',
      'Controller — 요청을 받고 직접 DB 쿼리 실행',
      'Service — 비즈니스 로직과 데이터 접근 담당',
      'Decorator — 메서드에 직접 로직을 주입',
    ],
    correctAnswer: 2,
    explanation:
      'NestJS 역할 분리: Controller = 요청/응답 처리(라우팅, DTO 변환), Service = 비즈니스 로직(DB 쿼리, 계산, 외부 API), Module = 의존성 관리(Controller + Service + Provider 묶음). Controller에 직접 DB 쿼리를 넣으면 테스트와 재사용이 어려워집니다.',
    hints: ['SRP(단일 책임 원칙)', '테스트하기 쉬운 코드 구조'],
    deepDive:
      '```typescript\n// Module — 묶음 단위\n@Module({\n  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],\n  controllers: [UserController],  // 요청 처리\n  providers: [UserService],       // 비즈니스 로직\n  exports: [UserService],         // 다른 모듈에서 사용 가능\n})\nexport class UserModule {}\n\n// Controller — 라우팅 + 요청/응답\n@Controller("users")\nexport class UserController {\n  constructor(private readonly userService: UserService) {}\n\n  @Get(":id")\n  findOne(@Param("id") id: string) {\n    return this.userService.findOne(id)  // 로직은 Service에 위임\n  }\n}\n\n// Service — 비즈니스 로직\n@Injectable()\nexport class UserService {\n  constructor(@InjectModel(User.name) private userModel: Model<User>) {}\n\n  async findOne(id: string) {\n    return this.userModel.findById(id).lean()\n  }\n}\n```',
    relatedProblems: ['be-q-007', 'be-q-008'],
  },
  {
    id: 'be-q-007',
    category: 'backend',
    subcategory: 'nestjs',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'Dependency Injection (DI) — 의존성 주입',
    description: 'NestJS에서 @Injectable() 데코레이터가 하는 역할은?',
    options: [
      '클래스를 HTTP 라우트 핸들러로 등록한다',
      '클래스를 NestJS IoC Container에 등록하여 다른 곳에서 주입 가능하게 한다',
      '클래스의 메서드를 자동으로 비동기 처리한다',
      '클래스를 싱글턴 패턴으로 인스턴스화한다',
    ],
    correctAnswer: 1,
    explanation:
      '@Injectable()은 클래스를 NestJS IoC(Inversion of Control) 컨테이너에 Provider로 등록합니다. 이 컨테이너가 인스턴스 생성과 주입을 관리합니다. 결과적으로 NestJS는 기본적으로 Singleton 스코프로 인스턴스를 관리하지만, 이것은 @Injectable()의 직접적 기능이 아닌 IoC 컨테이너의 기본 동작입니다.',
    hints: ['IoC = 제어의 역전', '내가 직접 new 하지 않아도 됩니다'],
    deepDive:
      '의존성 주입(DI) 없이 vs 있을 때:\n```typescript\n// DI 없이 (직접 생성)\nclass OrderController {\n  private service = new OrderService()  // 강하게 결합\n  // 테스트 시 OrderService를 Mock으로 교체 불가\n}\n\n// DI 있을 때 (NestJS)\n@Controller("orders")\nclass OrderController {\n  constructor(private readonly orderService: OrderService) {}\n  // NestJS가 OrderService 인스턴스를 자동으로 주입\n  // 테스트 시 Mock으로 쉽게 교체 가능\n}\n\n// Provider 범위 (Scope)\n@Injectable({ scope: Scope.DEFAULT })  // 싱글턴 (기본값)\n@Injectable({ scope: Scope.REQUEST })  // 요청마다 새 인스턴스\n@Injectable({ scope: Scope.TRANSIENT }) // 주입할 때마다 새 인스턴스\n```',
    relatedProblems: ['be-q-006', 'be-q-008'],
  },
  {
    id: 'be-q-008',
    category: 'backend',
    subcategory: 'nestjs',
    type: 'multiple-choice',
    difficulty: 'hard',
    title: 'NestJS — Guard vs Interceptor vs Pipe vs Filter',
    description: 'NestJS 요청 처리 파이프라인에서 실행 순서로 올바른 것은?',
    options: [
      'Filter → Guard → Interceptor → Pipe → Controller',
      'Guard → Interceptor → Pipe → Controller → Filter(예외 발생 시)',
      'Pipe → Guard → Controller → Interceptor → Filter',
      'Interceptor → Guard → Pipe → Filter → Controller',
    ],
    correctAnswer: 1,
    explanation:
      'NestJS 요청 처리 순서: Middleware → Guard → Interceptor(before) → Pipe → Controller/Handler → Interceptor(after) → 예외 발생 시 ExceptionFilter. Guard(인증/인가), Interceptor(요청/응답 변환, 로깅), Pipe(유효성 검사/변환), Filter(예외 처리).',
    hints: ['문지기(Guard) → 가로채기(Interceptor) → 파이프(데이터 변환) → 실행'],
    deepDive:
      '각 컴포넌트 역할:\n\n• Guard (@UseGuards): 요청 허용/거부 결정 (인증, 권한 확인)\n  ```typescript\n  @UseGuards(JwtAuthGuard)  // JWT 유효성 확인\n  @Get("profile")\n  getProfile() {}\n  ```\n\n• Interceptor (@UseInterceptors): 요청/응답 전후 처리 (로깅, 응답 형식 변환, 캐싱)\n  ```typescript\n  @UseInterceptors(LoggingInterceptor, TransformInterceptor)\n  ```\n\n• Pipe (@UsePipes): 입력 데이터 유효성 검사 및 변환\n  ```typescript\n  @Body(ValidationPipe) createUserDto: CreateUserDto  // class-validator 적용\n  @Param("id", ParseIntPipe) id: number  // 문자열 → 숫자 변환\n  ```\n\n• Exception Filter (@UseFilters): 예외를 HTTP 응답으로 변환\n  ```typescript\n  @UseFilters(MongoExceptionFilter)  // MongoDB 에러 → 400 응답\n  ```',
    relatedProblems: ['be-q-006', 'be-q-009'],
  },
  {
    id: 'be-q-009',
    category: 'backend',
    subcategory: 'nestjs',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'DTO vs Entity vs Interface',
    description: 'NestJS + MongoDB(Mongoose) 프로젝트에서 DTO, Entity, Interface의 용도로 올바른 것은?',
    options: [
      'DTO = DB 스키마 정의, Entity = API 응답 형태, Interface = 유효성 검사',
      'DTO = API 요청/응답 데이터 형태 + 유효성 검사, Entity/Schema = DB 구조 정의, Interface = 순수 타입 정의',
      'DTO와 Entity는 동일하며 Interface만 따로 사용한다',
      'Mongoose를 쓰면 DTO가 필요 없다',
    ],
    correctAnswer: 1,
    explanation:
      'DTO(Data Transfer Object): API 경계에서 데이터 형태 정의 + class-validator로 유효성 검사. Entity/Mongoose Schema: DB 저장 구조 정의. Interface: 순수 TypeScript 타입 계약. DTO와 Schema를 분리하면 API 인터페이스 변경이 DB 구조에 영향을 주지 않아 유지보수가 쉬워집니다.',
    hints: ['API 경계와 DB 경계를 분리하는 이유는?'],
    deepDive:
      '```typescript\n// DTO — API 요청 형태 + 유효성 검사\nexport class CreateUserDto {\n  @IsString()\n  @MinLength(2)\n  name: string\n\n  @IsEmail()\n  email: string\n\n  @IsString()\n  @MinLength(8)\n  password: string\n}\n\n// Mongoose Schema — DB 구조\n@Schema({ timestamps: true })\nexport class User {\n  @Prop({ required: true })\n  name: string\n\n  @Prop({ unique: true })\n  email: string\n\n  @Prop({ select: false })  // 기본 쿼리에서 제외\n  password: string\n}\n\n// Interface — 순수 타입\nexport interface IUser {\n  _id: string\n  name: string\n  email: string\n  createdAt: Date\n}\n```\n\nDTO 분리의 이점:\n• CreateUserDto vs UpdateUserDto로 생성/수정 요구사항 분리\n• DB password 필드를 응답 DTO에서 제외 (보안)\n• API 스펙과 DB 스키마를 독립적으로 변경 가능',
    relatedProblems: ['be-q-008', 'be-q-010'],
  },
  {
    id: 'be-q-010',
    category: 'backend',
    subcategory: 'nestjs',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'NestJS Decorator 동작 원리',
    description: '다음 NestJS 코드에서 @Get(":id")가 하는 역할은?',
    code: `@Controller("users")
export class UserController {
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.userService.findOne(id)
  }
}`,
    options: [
      '@Get(":id")는 클래스를 상속하는 문법이다',
      '@Get(":id")는 해당 메서드를 GET /users/:id 라우트 핸들러로 등록하는 메타데이터를 붙인다',
      '@Get(":id")는 id 파라미터를 자동으로 DB에서 조회한다',
      '@Get(":id")는 id가 숫자임을 강제한다',
    ],
    correctAnswer: 1,
    explanation:
      'NestJS Decorator는 TypeScript의 메타데이터 API를 활용하여 클래스/메서드/파라미터에 정보를 부착합니다. @Get(":id")는 "이 메서드는 GET 요청이고 /users/:id 경로와 매핑된다"는 메타데이터를 저장하고, NestJS 프레임워크가 부팅 시 이 메타데이터를 읽어 라우터에 등록합니다.',
    hints: ['Decorator = 메타데이터 부착', '런타임에 프레임워크가 읽어서 처리'],
    deepDive:
      '자주 사용하는 NestJS Decorator:\n\n클래스 레벨:\n• @Controller("path") — 라우트 prefix\n• @Injectable() — Provider 등록\n• @Module({}) — 모듈 정의\n• @UseGuards(), @UseInterceptors(), @UseFilters()\n\n메서드 레벨:\n• @Get(), @Post(), @Put(), @Patch(), @Delete()\n• @HttpCode(201) — 기본 200 응답 코드 변경\n• @Header("key", "value") — 응답 헤더 설정\n• @Redirect("url") — 리다이렉트\n\n파라미터 레벨:\n• @Param("id") — 경로 파라미터\n• @Query("page") — 쿼리 파라미터\n• @Body() — 요청 Body\n• @Req(), @Res() — Express Request/Response 직접 접근\n• @Headers("authorization") — 특정 헤더 값\n• @CurrentUser() — 커스텀 데코레이터 (자주 만들어 씀)',
    relatedProblems: ['be-q-008', 'be-q-011'],
  },
  {
    id: 'be-q-011',
    category: 'backend',
    subcategory: 'nestjs',
    type: 'multiple-choice',
    difficulty: 'hard',
    title: 'NestJS 요청 라이프사이클 순서',
    description: 'NestJS에서 클라이언트 요청이 들어올 때 처리 순서로 올바른 것은?',
    options: [
      'Controller → Guard → Pipe → Service → Response',
      'Middleware → Guard → Interceptor → Pipe → Controller → Interceptor → Response',
      'Guard → Middleware → Controller → Pipe → Response',
      'Interceptor → Middleware → Guard → Pipe → Controller',
    ],
    correctAnswer: 1,
    explanation:
      'NestJS 전체 요청 라이프사이클: ① Middleware(Express 레벨) → ② Guard(인증/인가) → ③ Interceptor before() → ④ Pipe(유효성 검사/변환) → ⑤ Controller(Route Handler) → ⑥ Service → ⑦ Interceptor after() → ⑧ Response 전송. 예외 발생 시 어느 단계에서든 ExceptionFilter로 이동.',
    hints: ['Middleware는 Express 레벨 (가장 먼저)', 'Interceptor는 앞뒤로 감쌉니다'],
    deepDive:
      '전체 라이프사이클 다이어그램:\n\n요청 → [Middleware] → [Guard] → [Interceptor.intercept() 시작]\n      → [Pipe] → [Controller Method] → [Service] \n      → [Interceptor.intercept() 완료] → 응답\n\n예외 발생 시:\n어느 단계에서든 → [Exception Filter] → 에러 응답\n\n실무 활용 예:\n• Middleware: Request 로깅, CORS 처리, 세션 파싱\n• Guard: JWT 검증, Role 확인\n• Interceptor: 응답 형식 통일, 캐싱, 성능 측정\n• Pipe: DTO 유효성 검사, 타입 변환\n\n전역 적용:\n```typescript\n// main.ts\napp.use(LoggerMiddleware)          // 전역 Middleware\napp.useGlobalGuards(JwtAuthGuard)  // 전역 Guard\napp.useGlobalPipes(new ValidationPipe({ whitelist: true }))\napp.useGlobalFilters(new AllExceptionsFilter())\n```',
    relatedProblems: ['be-q-008', 'be-q-012'],
  },
  {
    id: 'be-q-012',
    category: 'backend',
    subcategory: 'nestjs',
    type: 'bug-find',
    difficulty: 'hard',
    title: 'NestJS Exception Filter — 어디서 에러를 잡는가',
    description: '다음 코드에서 MongoDB CastError(잘못된 ObjectId)가 500으로 응답되는 이유는?',
    code: `@Controller("users")
export class UserController {
  @Get(":id")
  async findOne(@Param("id") id: string) {
    // id가 유효하지 않은 ObjectId면 Mongoose CastError 발생
    return await this.userService.findById(id)
  }
}

// main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  // ExceptionFilter 등록 없음
  await app.listen(3000)
}`,
    options: [
      '@Param()이 잘못된 타입을 처리하지 못해서',
      'NestJS 기본 Exception Filter는 HttpException만 처리하며, Mongoose CastError는 일반 Error여서 500으로 떨어진다',
      'MongoDB는 NestJS와 호환되지 않는다',
      'async/await를 사용하면 에러가 자동으로 500이 된다',
    ],
    correctAnswer: 1,
    explanation:
      'NestJS 내장 Exception Filter는 HttpException(과 그 서브클래스)만 인식합니다. Mongoose CastError는 일반 JavaScript Error여서 인식되지 않고 500 Internal Server Error로 처리됩니다. 해결: 커스텀 ExceptionFilter를 만들어 MongoError, CastError를 적절한 HTTP 응답(400)으로 변환해야 합니다.',
    hints: ['HttpException vs 일반 Error', '커스텀 ExceptionFilter가 필요합니다'],
    deepDive:
      '```typescript\n// MongoDB 에러 처리 커스텀 Filter\n@Catch()\nexport class AllExceptionsFilter implements ExceptionFilter {\n  catch(exception: unknown, host: ArgumentsHost) {\n    const ctx = host.switchToHttp()\n    const response = ctx.getResponse<Response>()\n\n    // Mongoose CastError (잘못된 ObjectId)\n    if (exception instanceof mongoose.Error.CastError) {\n      return response.status(400).json({\n        statusCode: 400,\n        message: `Invalid ID format: ${exception.value}`,\n      })\n    }\n\n    // MongoDB 중복 키 (이메일 중복 등)\n    if ((exception as any).code === 11000) {\n      return response.status(409).json({\n        statusCode: 409,\n        message: "Already exists",\n      })\n    }\n\n    // HttpException (NestJS 기본)\n    if (exception instanceof HttpException) {\n      return response.status(exception.getStatus()).json(exception.getResponse())\n    }\n\n    // 그 외 500\n    return response.status(500).json({ statusCode: 500, message: "Internal server error" })\n  }\n}\n\n// 전역 등록\napp.useGlobalFilters(new AllExceptionsFilter())\n```',
    relatedProblems: ['be-q-008', 'be-q-011'],
  },

  // ─── Node.js ─────────────────────────────────────────────────────────────────

  {
    id: 'be-q-013',
    category: 'backend',
    subcategory: 'nodejs',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'CommonJS vs ESM — require vs import',
    description: '다음 중 Node.js에서 CommonJS와 ESM의 차이로 올바른 것은?',
    code: `// CommonJS
const express = require("express")
module.exports = { handler }

// ESM
import express from "express"
export { handler }`,
    options: [
      'CommonJS는 비동기 로딩, ESM은 동기 로딩이다',
      'CommonJS는 동기 require(), 정적 분석 불가. ESM은 정적 import, 트리 쉐이킹 가능하고 Top-level await 지원',
      'ESM은 Node.js에서 사용할 수 없다',
      'CommonJS와 ESM은 완전히 동일하게 동작한다',
    ],
    correctAnswer: 1,
    explanation:
      'CommonJS(require): 동기 로딩, 런타임에 동적으로 모듈 결정 가능(if문 안에서 require 가능), 정적 분석이 어려워 트리 쉐이킹 불리. ESM(import/export): 정적 구조(컴파일 타임에 분석), 트리 쉐이킹 가능, Top-level await 지원, .mjs 파일 또는 package.json "type": "module"로 활성화.',
    hints: ['Next.js는 기본으로 ESM을 사용합니다', 'require()는 어디서든 호출 가능합니다'],
    deepDive:
      'Node.js 모듈 시스템 혼용 주의사항:\n```javascript\n// package.json\n{"type": "module"}  // ESM 기본\n{"type": "commonjs"}  // CJS 기본 (기본값)\n\n// ESM에서 CJS 모듈 사용\nimport pkg from "some-cjs-package"  // default import로 가져오기\n\n// CJS에서 ESM 모듈 사용 (동적 import)\nconst module = await import("esm-only-package")\n\n// __dirname, __filename (ESM에서 없음)\nimport { fileURLToPath } from "url"\nimport { dirname } from "path"\nconst __filename = fileURLToPath(import.meta.url)\nconst __dirname = dirname(__filename)\n```\n\nNext.js 프로젝트: 기본 ESM, next.config.ts/js는 CJS\nNestJS: TypeScript + CommonJS가 일반적이나 ESM도 지원',
    relatedProblems: ['be-q-014'],
  },
  {
    id: 'be-q-014',
    category: 'backend',
    subcategory: 'nodejs',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'Middleware 체인 — next() 호출',
    description: '다음 Express/NestJS Middleware에서 next()를 호출하지 않으면 어떤 일이 발생하는가?',
    code: `function loggerMiddleware(req, res, next) {
  console.log(\`[\${req.method}] \${req.path}\`)
  // next() 호출 없음
}

app.use(loggerMiddleware)
app.get("/users", (req, res) => res.json({ users: [] }))`,
    options: [
      '다음 미들웨어와 라우트 핸들러로 정상적으로 넘어간다',
      '요청이 해당 미들웨어에서 멈춰 응답이 오지 않는다 (hanging)',
      '자동으로 500 에러가 발생한다',
      '미들웨어를 건너뛰고 라우트 핸들러가 실행된다',
    ],
    correctAnswer: 1,
    explanation:
      'Express/NestJS Middleware에서 next()를 호출하지 않으면 요청 처리 체인이 멈춥니다. 클라이언트는 응답을 기다리다 타임아웃이 발생합니다. res.send()나 res.json()으로 응답을 보내거나 next()로 다음 핸들러에 제어권을 넘겨야 합니다.',
    hints: ['체인 구조: 다음 단계로 넘어가려면 next() 필요'],
    deepDive:
      'Middleware 패턴 종류:\n```javascript\n// 1. Pass-through (통과형): 처리 후 next()\nfunction logger(req, res, next) {\n  console.log(req.path)\n  next()  // 반드시 호출!\n}\n\n// 2. Short-circuit (중단형): 조건부로 응답\nfunction authMiddleware(req, res, next) {\n  if (!req.headers.authorization) {\n    return res.status(401).json({ message: "Unauthorized" })\n    // return으로 next() 호출 방지\n  }\n  next()\n}\n\n// 3. Error-passing: 에러를 다음 에러 핸들러로\nfunction asyncMiddleware(req, res, next) {\n  someAsyncOp()\n    .then(() => next())\n    .catch(next)  // next(err) 호출 → 에러 미들웨어로\n}\n\n// NestJS Middleware\n@Injectable()\nexport class LoggerMiddleware implements NestMiddleware {\n  use(req: Request, res: Response, next: NextFunction) {\n    console.log(req.path)\n    next()  // 필수!\n  }\n}\n```',
    relatedProblems: ['be-q-011', 'be-q-013'],
  },
  {
    id: 'be-q-015',
    category: 'backend',
    subcategory: 'nodejs',
    type: 'multiple-choice',
    difficulty: 'hard',
    title: 'Stream vs Buffer — 대용량 파일 처리',
    description: '10GB 파일을 클라이언트에게 전송할 때 Buffer 방식 대신 Stream을 사용해야 하는 이유는?',
    options: [
      'Stream이 코드가 더 짧기 때문이다',
      'Buffer는 전체 파일을 메모리에 올린 후 전송하여 메모리 부족이 발생하지만, Stream은 청크 단위로 읽으면서 바로 전송하여 메모리를 적게 사용한다',
      'Buffer는 비동기, Stream은 동기 처리 방식이다',
      '파일 전송에는 반드시 Stream을 사용해야 하는 Node.js 규칙이 있다',
    ],
    correctAnswer: 1,
    explanation:
      'Buffer 방식은 파일 전체를 메모리에 올린 후 응답으로 내보내어 대용량 파일에서 메모리 부족(OOM)이 발생합니다. Stream은 파일을 청크(chunk) 단위로 읽으면서 즉시 클라이언트에게 전송하므로 메모리를 일정하게 유지합니다. Node.js의 HTTP 응답, 파일 시스템, 데이터베이스 커서가 모두 Stream 기반입니다.',
    hints: ['메모리 = 전체 vs 청크 단위'],
    deepDive:
      '```javascript\n// Buffer 방식 (나쁜 예 — 10GB 메모리 필요)\napp.get("/download", (req, res) => {\n  const file = fs.readFileSync("huge-file.zip")  // 전체 메모리 로드!\n  res.send(file)\n})\n\n// Stream 방식 (좋은 예 — 일정한 메모리)\napp.get("/download", (req, res) => {\n  const stream = fs.createReadStream("huge-file.zip")\n  stream.pipe(res)  // 읽는 즉시 응답으로 전송\n})\n\n// NestJS에서 Stream 응답\n@Get("download")\nasync download(@Res() res: Response) {\n  const file = createReadStream("huge-file.zip")\n  res.set("Content-Type", "application/zip")\n  file.pipe(res)\n}\n\n// Stream 종류\n// Readable: 데이터 읽기 (fs.createReadStream, HTTP 요청 body)\n// Writable: 데이터 쓰기 (fs.createWriteStream, HTTP 응답)\n// Duplex: 읽기+쓰기 (TCP 소켓)\n// Transform: 읽기+변환+쓰기 (zlib.createGzip)\n```',
    relatedProblems: ['be-q-013'],
  },
]
