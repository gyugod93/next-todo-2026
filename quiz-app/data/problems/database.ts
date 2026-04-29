import type { Problem } from '@/types'

export const databaseProblems: Problem[] = [
  // ─── MongoDB 기초 용어 ───────────────────────────────────────────────────────

  {
    id: 'db-q-001',
    category: 'database',
    subcategory: 'mongodb-terms',
    type: 'multiple-choice',
    difficulty: 'easy',
    title: 'Collection vs Table',
    description: 'MongoDB에서 RDBMS의 "테이블(Table)"에 해당하는 개념은?',
    options: ['Document', 'Collection', 'Field', 'Schema'],
    correctAnswer: 1,
    explanation:
      'Collection은 RDBMS의 Table에 해당합니다. MongoDB에서는 비슷한 Documents의 묶음을 Collection이라 부릅니다. 단, RDBMS 테이블과 달리 Collection은 고정된 스키마가 없어 각 Document가 서로 다른 필드를 가질 수 있습니다.',
    hints: ['RDBMS: Table → MongoDB: ?', 'Document들의 묶음을 뭐라고 부를까요?'],
    deepDive:
      'RDBMS vs MongoDB 전체 대응표:\n• Database → Database (동일)\n• Table → Collection\n• Row/Record → Document\n• Column → Field\n• Primary Key → _id\n• JOIN → $lookup 또는 Embedded Document\n• Schema → 없음(Schema-less) 또는 Mongoose Schema\n• Index → Index (동일 개념, 문법 다름)',
    relatedProblems: ['db-q-002', 'db-q-003'],
  },
  {
    id: 'db-q-002',
    category: 'database',
    subcategory: 'mongodb-terms',
    type: 'multiple-choice',
    difficulty: 'easy',
    title: 'Document vs Row',
    description: 'MongoDB Document에 대한 설명으로 올바른 것은?',
    options: [
      'Document는 반드시 동일한 필드 구조를 가져야 한다',
      'Document는 JSON 형태의 데이터 단위이며, 같은 Collection 안에서도 구조가 달라도 된다',
      'Document는 RDBMS의 Column에 해당한다',
      'Document는 최대 1MB까지만 저장 가능하다',
    ],
    correctAnswer: 1,
    explanation:
      'MongoDB Document는 BSON(Binary JSON) 형식으로 저장되는 데이터의 기본 단위입니다. RDBMS의 Row와 달리, 같은 Collection 안에서도 각 Document가 서로 다른 필드를 가질 수 있습니다(Schema-less). 실제 저장 한도는 16MB입니다.',
    hints: ['MongoDB는 Schema-less 구조입니다', 'RDBMS Row와 비교해보세요'],
    deepDive:
      'MongoDB Document 특징:\n• BSON(Binary JSON) 형식으로 저장 — JSON보다 더 많은 데이터 타입 지원(Date, ObjectId, Binary 등)\n• 최대 크기: 16MB\n• 중첩(Embedded) Document 가능: { name: "김철수", address: { city: "서울", zip: "12345" } }\n• 배열 필드 가능: { tags: ["node", "mongodb", "backend"] }\n• Schema-less이지만 Mongoose를 사용하면 스키마를 강제할 수 있음',
    relatedProblems: ['db-q-001', 'db-q-007'],
  },
  {
    id: 'db-q-003',
    category: 'database',
    subcategory: 'mongodb-terms',
    type: 'multiple-choice',
    difficulty: 'easy',
    title: 'Field vs Column',
    description: 'MongoDB에서 RDBMS의 "컬럼(Column)"에 해당하는 개념과 그 특징은?',
    options: [
      'Document — 모든 Document에서 동일한 필드를 반드시 가져야 한다',
      'Field — Document 안의 키-값 쌍이며, 각 Document마다 다른 필드를 가질 수 있다',
      'Schema — MongoDB는 스키마가 있어 컬럼을 미리 정의해야 한다',
      'Index — 검색 최적화를 위한 필드 정의이다',
    ],
    correctAnswer: 1,
    explanation:
      'Field는 RDBMS의 Column에 해당하며, Document 안의 키-값(key-value) 쌍입니다. RDBMS 컬럼과 달리 각 Document마다 다른 필드를 가질 수 있고, 필드가 없어도 됩니다. 예: { name: "김철수", age: 30 }에서 name과 age가 Field입니다.',
    hints: ['Document 안의 키-값 쌍', 'key: value 구조'],
    deepDive:
      'MongoDB Field 타입 지원:\n• String, Number, Boolean, Date, ObjectId\n• Array: { hobbies: ["독서", "코딩"] }\n• Embedded Document: { address: { city: "서울" } }\n• Null\n\nRDBMS 컬럼과의 차이:\n• RDBMS: 테이블 생성 시 컬럼을 미리 정의, NULL 허용 여부 지정\n• MongoDB: 필드는 Document마다 자유롭게 추가/생략 가능\n• Mongoose Schema를 사용하면 RDBMS처럼 필드를 강제로 정의 가능',
    relatedProblems: ['db-q-001', 'db-q-007'],
  },
  {
    id: 'db-q-004',
    category: 'database',
    subcategory: 'mongodb-terms',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'ObjectId — _id 구조',
    description: 'MongoDB의 _id 필드와 ObjectId에 대한 설명으로 올바른 것은?',
    options: [
      '_id는 반드시 숫자여야 하며 자동 증가(AUTO_INCREMENT)된다',
      '_id는 12바이트 ObjectId가 기본값이며, 타임스탬프·머신ID·랜덤값으로 구성된다',
      '_id는 UUID 형식만 허용된다',
      '_id는 선택사항이며 없어도 Document를 저장할 수 있다',
    ],
    correctAnswer: 1,
    explanation:
      'MongoDB _id는 기본적으로 12바이트 ObjectId가 자동 생성됩니다. 구성: 4바이트 타임스탬프 + 5바이트 랜덤값(머신ID+프로세스ID) + 3바이트 카운터. 이 구조 덕분에 ObjectId에서 생성 시간을 추출할 수 있습니다: new ObjectId().getTimestamp(). _id는 필수이며 없으면 MongoDB가 자동 생성합니다.',
    hints: ['12바이트로 구성됩니다', '생성 시간 정보가 포함되어 있습니다'],
    deepDive:
      'ObjectId 활용:\n```javascript\nconst id = new mongoose.Types.ObjectId()\nconsole.log(id.toString())       // "507f1f77bcf86cd799439011"\nconsole.log(id.getTimestamp())   // 생성 시간 Date 객체\n```\n\nRDBMS AUTO_INCREMENT vs ObjectId:\n• AUTO_INCREMENT: 순차적, 예측 가능, 단일 DB에서 유일\n• ObjectId: 분산 시스템에서도 충돌 없이 유일, 시간순 정렬 가능\n\n주의: ObjectId를 API 응답으로 내보낼 때 toString()으로 문자열 변환 필요\nTypeScript: string vs ObjectId 타입 혼동 주의',
    relatedProblems: ['db-q-001', 'db-q-016'],
  },
  {
    id: 'db-q-005',
    category: 'database',
    subcategory: 'mongodb-terms',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'Embedding vs Referencing — 언제 무엇을?',
    description: '사용자(User)와 주문(Order) 데이터를 설계할 때, Referencing(참조)이 더 적합한 경우는?',
    options: [
      '사용자의 기본 주소처럼 항상 함께 조회되고 독립적으로 쓰이지 않는 데이터',
      '주문 내역이 무한정 늘어날 수 있고, 주문을 독립적으로 조회/수정해야 하는 경우',
      '사용자 프로필 내 소셜 링크처럼 2~3개 고정 항목인 경우',
      '댓글이 최대 5개로 제한되어 있는 경우',
    ],
    correctAnswer: 1,
    explanation:
      '주문(Order)이 무한정 늘어날 수 있고 독립적으로 관리해야 한다면 Referencing이 적합합니다. MongoDB Document 최대 크기는 16MB이므로, User Document에 모든 주문을 임베딩하면 한도 초과 위험이 있습니다. Referencing: Order Collection에 userId를 저장하고 $lookup으로 조인합니다.',
    hints: ['MongoDB Document 최대 크기는 16MB', '데이터가 얼마나 늘어날 수 있나요?'],
    deepDive:
      'Embedding(임베딩) 적합 케이스:\n• 항상 함께 조회하는 데이터 (사용자 + 프로필)\n• 데이터 개수가 제한적 (주소 1~3개)\n• 단일 쿼리로 처리하고 싶을 때\n\nReferencing(참조) 적합 케이스:\n• 데이터가 무한정 늘어날 수 있을 때 (주문, 댓글)\n• 독립적으로 조회/수정이 필요할 때\n• 여러 Collection에서 공유되는 데이터 (태그, 카테고리)\n\n실무 패턴:\n```javascript\n// Referencing 예시 (Mongoose)\nconst OrderSchema = new Schema({\n  userId: { type: Schema.Types.ObjectId, ref: "User" },\n  items: [{ productId: ObjectId, qty: Number }],\n})\n// User 쿼리 시 populate\nOrder.find({ userId }).populate("userId", "name email")\n```',
    relatedProblems: ['db-q-008', 'db-q-013'],
  },
  {
    id: 'db-q-006',
    category: 'database',
    subcategory: 'mongodb-terms',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'MongoDB CRUD 연산자',
    description: '다음 중 MongoDB 업데이트 연산자와 설명이 잘못 짝지어진 것은?',
    options: [
      '$set — 특정 필드 값을 설정(없으면 추가)',
      '$push — 배열 필드에 요소를 추가',
      '$pull — 배열에서 조건에 맞는 요소를 제거',
      '$inc — 배열 필드의 마지막 요소를 삭제',
    ],
    correctAnswer: 3,
    explanation:
      '$inc는 숫자 필드를 증가/감소시키는 연산자입니다 (increment). 배열 마지막 요소를 제거하는 연산자는 $pop(1이면 마지막, -1이면 첫 번째 제거)입니다. 선택지 1~3은 모두 올바른 설명입니다.',
    hints: ['$inc = increment(증가)', '배열에서 삭제하는 연산자는 따로 있습니다'],
    deepDive:
      '핵심 MongoDB 업데이트 연산자:\n• $set: { $set: { name: "홍길동" } } — 필드 설정\n• $unset: { $unset: { tempField: "" } } — 필드 삭제\n• $inc: { $inc: { views: 1 } } — 숫자 증감\n• $push: { $push: { tags: "nodejs" } } — 배열에 추가\n• $pull: { $pull: { tags: "old" } } — 조건부 배열 제거\n• $pop: { $pop: { items: 1 } } — 배열 끝/앞 제거\n• $addToSet: 중복 없이 배열에 추가\n• $rename: 필드명 변경\n\n주의: MongoDB update 시 반드시 $set 같은 연산자를 써야 함\n틀린 예: db.users.updateOne({_id}, { name: "홍길동" }) → 전체 Document 교체됨!\n올바른 예: db.users.updateOne({_id}, { $set: { name: "홍길동" } })',
    relatedProblems: ['db-q-007', 'db-q-012'],
  },

  // ─── Mongoose ODM ────────────────────────────────────────────────────────────

  {
    id: 'db-q-007',
    category: 'database',
    subcategory: 'mongoose',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'Mongoose: Schema vs Model vs Document',
    description: 'Mongoose의 세 가지 핵심 개념(Schema, Model, Document)의 역할이 올바르게 설명된 것은?',
    options: [
      'Schema = 데이터베이스 연결, Model = 쿼리 실행기, Document = 스키마 정의',
      'Schema = 데이터 구조 정의(설계도), Model = Collection과 연결된 클래스(공장), Document = Model로 만든 실제 인스턴스(개별 레코드)',
      'Schema = 실제 저장 데이터, Model = 구조 정의, Document = 쿼리 메서드',
      'Schema와 Model은 같은 개념이며 Document만 실제 데이터다',
    ],
    correctAnswer: 1,
    explanation:
      'Mongoose 삼각 구조: Schema(설계도) → Model(공장) → Document(제품). Schema는 필드 타입·검증·기본값을 정의합니다. Model은 Schema를 기반으로 생성되며 Collection과 연결되어 find/save 등의 정적 메서드를 제공합니다. Document는 Model로 생성한 인스턴스이며 실제 MongoDB Document와 1:1 대응됩니다.',
    hints: ['설계도 → 공장 → 제품 관계로 생각해보세요'],
    deepDive:
      '```javascript\n// 1. Schema — 설계도 (구조 + 검증)\nconst userSchema = new mongoose.Schema({\n  name: { type: String, required: true },\n  email: { type: String, unique: true },\n  age: { type: Number, min: 0 },\n  createdAt: { type: Date, default: Date.now },\n})\n\n// 2. Model — Collection과 연결된 클래스\n// "User" → MongoDB Collection명: "users" (자동 복수형 소문자)\nconst User = mongoose.model("User", userSchema)\n\n// 3. Document — 실제 데이터 인스턴스\nconst user = new User({ name: "김철수", email: "cs@example.com" })\nawait user.save()  // DB에 저장\n\n// Model 정적 메서드\nconst users = await User.find({ age: { $gte: 20 } })\nconst found = await User.findById("507f...")\nawait User.updateOne({ _id }, { $set: { name: "홍길동" } })\nawait User.deleteOne({ _id })\n```',
    relatedProblems: ['db-q-009', 'db-q-010'],
  },
  {
    id: 'db-q-008',
    category: 'database',
    subcategory: 'mongoose',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'populate vs $lookup — 차이점',
    description: 'Mongoose의 populate()와 MongoDB의 $lookup의 차이점으로 올바른 것은?',
    options: [
      'populate는 서버에서 두 번 쿼리를 날리고, $lookup은 DB 내부에서 한 번에 처리한다',
      '$lookup은 Mongoose 전용이고, populate는 순수 MongoDB 연산자다',
      'populate는 항상 $lookup보다 빠르다',
      '두 방식은 완전히 동일하게 동작하며 차이가 없다',
    ],
    correctAnswer: 0,
    explanation:
      'populate()는 애플리케이션 레벨에서 두 번의 쿼리를 실행합니다: ① 원본 Document 조회 → ② 참조된 _id로 관련 Collection 추가 조회. 반면 $lookup은 DB 내부 Aggregation Pipeline에서 단일 쿼리로 처리합니다. 일반적으로 데이터가 많을수록 $lookup이 성능상 유리합니다.',
    hints: ['populate는 두 번 쿼리가 발생합니다', '$lookup은 DB 내부 처리입니다'],
    deepDive:
      '```javascript\n// populate 방식 (두 번 쿼리)\nconst orders = await Order.find({ userId })\n  .populate("userId", "name email")  // 자동으로 Users Collection 추가 조회\n\n// $lookup 방식 (단일 Aggregation 쿼리)\nconst orders = await Order.aggregate([\n  { $match: { userId: new ObjectId(userId) } },\n  {\n    $lookup: {\n      from: "users",         // 조인할 Collection\n      localField: "userId",  // 현재 Collection의 필드\n      foreignField: "_id",   // 대상 Collection의 필드\n      as: "user",            // 결과 필드명\n    },\n  },\n  { $unwind: "$user" },    // 배열을 단일 객체로\n])\n```\n\n언제 무엇을:\n• populate: 코드 가독성 좋음, 간단한 관계 조회에 적합\n• $lookup: 복잡한 집계, 대용량 데이터, 성능 중요할 때\n• N+1 문제 주의: 반복문 안에서 populate 금지!',
    relatedProblems: ['db-q-005', 'db-q-013'],
  },
  {
    id: 'db-q-009',
    category: 'database',
    subcategory: 'mongoose',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'Mongoose Middleware (pre/post hooks)',
    description: '다음 Mongoose pre("save") 미들웨어가 실행되지 않는 경우는?',
    code: `userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10)
  }
  next()
})`,
    options: [
      'new User(data).save() 로 저장할 때',
      'User.create(data) 로 저장할 때',
      'User.updateOne({ _id }, { $set: { password: "newpw" } }) 로 업데이트할 때',
      'document.save() 로 기존 Document를 수정할 때',
    ],
    correctAnswer: 2,
    explanation:
      'User.updateOne()은 Document를 인스턴스화하지 않고 직접 DB를 수정하므로 pre("save") 훅이 실행되지 않습니다. pre("save")는 document.save()와 Model.create() 시에만 실행됩니다. updateOne/findByIdAndUpdate 등을 사용할 때 훅을 실행하려면 pre("findOneAndUpdate") 훅을 별도로 정의해야 합니다.',
    hints: ['updateOne은 Document 인스턴스를 만들지 않습니다'],
    deepDive:
      'Mongoose 미들웨어 종류:\n• pre("save") — save/create 전 실행\n• post("save") — save/create 후 실행\n• pre("findOneAndUpdate") — findByIdAndUpdate/findOneAndUpdate 전\n• pre("deleteOne") — deleteOne/deleteMany 전\n• pre("validate") — 검증 전\n\n실무 패턴:\n```javascript\n// updateOne에서도 훅 적용하려면\nuserSchema.pre("findOneAndUpdate", async function (next) {\n  const update = this.getUpdate() as any\n  if (update.$set?.password) {\n    update.$set.password = await bcrypt.hash(update.$set.password, 10)\n  }\n  next()\n})\n\n// findByIdAndUpdate 기본 옵션 설정\nUser.findByIdAndUpdate(id, data, { new: true, runValidators: true })\n```',
    relatedProblems: ['db-q-007', 'db-q-010'],
  },
  {
    id: 'db-q-010',
    category: 'database',
    subcategory: 'mongoose',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'Mongoose Virtual 필드',
    description: 'Mongoose Virtual 필드의 특징으로 올바른 것은?',
    code: `userSchema.virtual("fullName").get(function () {
  return \`\${this.firstName} \${this.lastName}\`
})`,
    options: [
      'Virtual 필드는 MongoDB에 실제로 저장된다',
      'Virtual 필드는 DB에 저장되지 않고 가져온 Document에서 동적으로 계산된다',
      'Virtual 필드는 find() 쿼리의 필터 조건으로 사용할 수 있다',
      'Virtual 필드는 required: true를 설정해야 한다',
    ],
    correctAnswer: 1,
    explanation:
      'Virtual 필드는 MongoDB에 저장되지 않으며, Document 인스턴스에서 동적으로 계산됩니다. firstName과 lastName은 DB에 저장되지만 fullName은 저장되지 않고 접근 시 자동 계산됩니다. DB 조회 조건으로 사용 불가능합니다. API 응답에 포함하려면 toJSON({ virtuals: true }) 옵션이 필요합니다.',
    hints: ['DB에 저장 안 됨', '계산된 값'],
    deepDive:
      '```javascript\nconst userSchema = new Schema(\n  {\n    firstName: String,\n    lastName: String,\n  },\n  { toJSON: { virtuals: true } }  // JSON 직렬화 시 virtuals 포함\n)\n\nuserSchema.virtual("fullName").get(function () {\n  return `${this.firstName} ${this.lastName}`\n})\n\n// setter도 정의 가능\nuserSchema.virtual("fullName")\n  .get(function () { return `${this.firstName} ${this.lastName}` })\n  .set(function (v: string) {\n    const [first, ...rest] = v.split(" ")\n    this.firstName = first\n    this.lastName = rest.join(" ")\n  })\n\n// 주의: API 응답에서 _id가 id로도 노출되는 이유가 바로 virtual!\n// Mongoose는 기본으로 _id의 virtual id를 제공함\n```',
    relatedProblems: ['db-q-007', 'db-q-009'],
  },
  {
    id: 'db-q-011',
    category: 'database',
    subcategory: 'mongoose',
    type: 'multiple-choice',
    difficulty: 'hard',
    title: 'lean() — 성능 최적화',
    description: 'Mongoose의 .lean() 옵션 사용 시 나타나는 결과는?',
    code: `// A: 일반 쿼리
const user = await User.findById(id)
user.save()  // 가능

// B: lean 쿼리
const user = await User.findById(id).lean()
user.save()  // ?`,
    options: [
      'lean()은 결과를 자동으로 캐싱하여 두 번째 접근이 빠르다',
      'lean()은 Mongoose Document 인스턴스 대신 순수 JS 객체를 반환하여 빠르지만, save/virtuals/middleware를 사용할 수 없다',
      'lean()은 populate()와 함께 사용할 수 없다',
      'lean()은 쿼리 결과를 배열로 강제 변환한다',
    ],
    correctAnswer: 1,
    explanation:
      'lean()은 Mongoose가 결과를 Document 인스턴스로 래핑하는 과정을 생략하고 순수 JavaScript 객체를 반환합니다. 이로 인해 메모리와 속도가 크게 개선되지만(읽기 전용 API에서 ~3x 빠름), Mongoose Document 기능(save, virtuals, middleware, toJSON 변환)을 사용할 수 없습니다.',
    hints: ['Mongoose Document vs 순수 JS 객체', '읽기 전용일 때 유용합니다'],
    deepDive:
      '```javascript\n// lean() 적합한 경우: GET API, 읽기 전용\nconst users = await User.find({}).lean()  // 순수 객체 배열, 빠름\nusers[0].save  // undefined — Mongoose 메서드 없음\n\n// lean() 사용 시 주의\n// 1. virtuals 미포함 (toJSON 옵션 무시)\n// 2. Mongoose 타입 변환 미적용 (Date 객체가 string으로 올 수도 있음)\n// 3. populate와는 사용 가능하나 populate 결과도 plain object\n\n// TypeScript에서 lean() 타입 처리\nconst user = await User.findById(id).lean<IUser>()\n// user는 IUser & { _id: ObjectId } 타입\n\n// 언제 lean() 쓸까?\n// ✅ GET API 응답, 대량 데이터 목록 조회\n// ❌ 조회 후 수정하고 save()할 때\n// ❌ virtuals, toJSON transform 필요할 때\n```',
    relatedProblems: ['db-q-007', 'db-q-012'],
  },

  // ─── MongoDB 고급 ─────────────────────────────────────────────────────────────

  {
    id: 'db-q-012',
    category: 'database',
    subcategory: 'mongodb-aggregation',
    type: 'multiple-choice',
    difficulty: 'hard',
    title: 'Aggregation Pipeline — 실행 순서',
    description: '다음 Aggregation Pipeline의 실행 결과로 올바른 것은?',
    code: `db.orders.aggregate([
  { $match: { status: "completed" } },  // 1단계
  { $group: {                            // 2단계
    _id: "$userId",
    totalAmount: { $sum: "$amount" },
    count: { $sum: 1 }
  }},
  { $sort: { totalAmount: -1 } },       // 3단계
  { $limit: 5 }                          // 4단계
])`,
    options: [
      '전체 orders를 합산한 뒤, completed를 필터링한 상위 5명',
      'completed 주문만 필터링 → 사용자별 합산 → 금액 내림차순 → 상위 5명',
      '$group 먼저 실행 후 $match로 필터링',
      'Pipeline 단계는 병렬로 실행된다',
    ],
    correctAnswer: 1,
    explanation:
      'Aggregation Pipeline은 위에서 아래로 순서대로 실행됩니다. ① $match로 completed 주문만 필터 → ② $group으로 userId별 합산 → ③ $sort로 내림차순 정렬 → ④ $limit으로 5개만 반환. $match를 앞에 두면 처리할 Document 수가 줄어 성능이 좋습니다.',
    hints: ['Pipeline은 순서대로 실행됩니다', '$match를 앞에 두면 성능이 좋아지는 이유는?'],
    deepDive:
      '자주 사용하는 Aggregation 단계:\n• $match — 필터링 (WHERE 절)\n• $group — 그룹별 집계 (GROUP BY)\n• $project — 출력 필드 선택/변환 (SELECT 절)\n• $sort — 정렬 (ORDER BY)\n• $limit — 개수 제한 (LIMIT)\n• $skip — 건너뛰기 (OFFSET)\n• $lookup — 다른 Collection 조인\n• $unwind — 배열을 개별 Document로 펼치기\n• $addFields — 새 필드 추가\n• $count — Document 수 카운트\n\n성능 팁:\n• $match, $sort는 인덱스 활용 가능 → Pipeline 앞에 배치\n• $project로 불필요한 필드 제거 → 후속 단계 처리량 감소\n• allowDiskUse: true — 메모리 100MB 초과 시 필요',
    relatedProblems: ['db-q-013', 'db-q-014'],
  },
  {
    id: 'db-q-013',
    category: 'database',
    subcategory: 'mongodb-aggregation',
    type: 'multiple-choice',
    difficulty: 'hard',
    title: '$lookup — MongoDB JOIN',
    description: '다음 $lookup에서 as: "author"의 결과 타입은?',
    code: `db.posts.aggregate([
  {
    $lookup: {
      from: "users",
      localField: "authorId",
      foreignField: "_id",
      as: "author"
    }
  }
])`,
    options: [
      'author는 단일 User 객체이다',
      'author는 항상 빈 배열이다',
      'author는 배열이며, 매칭된 User가 없으면 빈 배열이다',
      'author는 authorId와 동일한 값이다',
    ],
    correctAnswer: 2,
    explanation:
      '$lookup의 as 필드는 항상 배열(Array)로 반환됩니다. 매칭 결과가 없으면 빈 배열 [], 하나면 [user], 여러 개면 [user1, user2, ...]입니다. 단일 객체로 사용하려면 $unwind 스테이지를 뒤에 추가해야 합니다: { $unwind: "$author" }.',
    hints: ['$lookup 결과는 항상 배열입니다', '$unwind로 배열을 펼칩니다'],
    deepDive:
      '```javascript\n// 단일 author 객체로 만들기\ndb.posts.aggregate([\n  {\n    $lookup: {\n      from: "users",\n      localField: "authorId",\n      foreignField: "_id",\n      as: "author",\n    },\n  },\n  { $unwind: "$author" },  // 배열 → 단일 객체\n  // $unwind는 author가 없으면 해당 Document를 제거함\n  // 유지하려면: { $unwind: { path: "$author", preserveNullAndEmptyArrays: true } }\n])\n\n// 서브파이프라인을 사용한 조건부 $lookup (MongoDB 3.6+)\n{\n  $lookup: {\n    from: "comments",\n    let: { postId: "$_id" },\n    pipeline: [\n      { $match: { $expr: { $eq: ["$postId", "$$postId"] } } },\n      { $limit: 5 },\n    ],\n    as: "recentComments",\n  }\n}\n```',
    relatedProblems: ['db-q-008', 'db-q-012'],
  },
  {
    id: 'db-q-014',
    category: 'database',
    subcategory: 'mongodb-terms',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'MongoDB Index 종류',
    description: '전화번호와 이름으로 자주 함께 검색할 때 가장 적합한 인덱스는?',
    options: [
      'Single Field Index — phone에만 인덱스',
      'Compound Index — (phone, name) 복합 인덱스',
      'Text Index — 텍스트 검색 최적화',
      'TTL Index — 일정 시간 후 자동 삭제',
    ],
    correctAnswer: 1,
    explanation:
      'Compound Index(복합 인덱스)는 두 개 이상의 필드를 묶어 인덱싱합니다. { phone: 1, name: 1 }로 설정하면 phone으로만 검색하거나 phone + name으로 함께 검색할 때 모두 인덱스를 사용할 수 있습니다. 단, name으로만 검색하면 이 인덱스를 사용할 수 없습니다(인덱스 Prefix 규칙).',
    hints: ['두 필드를 함께 사용하는 인덱스', '인덱스 Prefix 규칙을 기억하세요'],
    deepDive:
      'MongoDB Index 종류:\n• Single Field: { field: 1 } — 단일 필드, 1=오름차순, -1=내림차순\n• Compound: { field1: 1, field2: -1 } — 여러 필드 복합\n• Text: { content: "text" } — 전문 텍스트 검색, $text 쿼리에 사용\n• TTL: { createdAt: 1 }, expireAfterSeconds: 3600 — 자동 만료 (세션, 로그)\n• Unique: { email: 1 }, unique: true — 중복 방지\n• Sparse: 필드가 없는 Document는 인덱스에서 제외\n• Partial: 조건을 만족하는 Document만 인덱스\n• 2dsphere: 지리 데이터 인덱스 (위도/경도)\n\n인덱스 확인:\ndb.collection.explain("executionStats").find(...)\nBSON Equality → Sort → Range 순서로 Compound Index 설계',
    relatedProblems: ['db-q-015', 'db-q-012'],
  },
  {
    id: 'db-q-015',
    category: 'database',
    subcategory: 'mongodb-terms',
    type: 'multiple-choice',
    difficulty: 'hard',
    title: 'Replica Set vs Sharding',
    description: 'MongoDB Replica Set과 Sharding에 대한 설명으로 올바른 것은?',
    options: [
      'Replica Set은 데이터를 여러 서버에 분산 저장하고, Sharding은 데이터를 복제하여 가용성을 높인다',
      'Replica Set은 동일한 데이터를 여러 서버에 복제하여 가용성과 읽기 성능을 높이고, Sharding은 데이터를 여러 서버에 분산하여 수평 확장한다',
      'Replica Set과 Sharding은 동일한 개념이다',
      'Sharding은 단일 서버에서만 작동한다',
    ],
    correctAnswer: 1,
    explanation:
      'Replica Set은 동일한 데이터를 Primary + Secondary 서버들에 복제(Replication)합니다. Primary 장애 시 Secondary가 자동으로 Primary로 승격(Failover)됩니다. Sharding은 데이터를 Shard Key 기준으로 여러 서버에 분산 저장하여 단일 서버 용량/처리량 한계를 넘습니다. 실무에서는 각 Shard 자체가 Replica Set으로 구성됩니다.',
    hints: ['복제 vs 분산', '가용성 vs 수평 확장'],
    deepDive:
      'Replica Set:\n• Primary(쓰기) + Secondary(읽기/백업) 구조\n• 최소 3대 권장 (과반수 투표로 Primary 선출)\n• 자동 Failover: Primary 장애 시 Secondary 중 하나가 Primary로\n• 읽기 성능: Secondary에서 읽기 분산 가능 (readPreference: secondary)\n• Atlas M10 이상에서 기본 제공\n\nSharding:\n• Shard Key 선택이 중요 (카디널리티, 쓰기 분산, 쿼리 패턴 고려)\n• Mongos: 라우터 역할 (클라이언트 요청을 적절한 Shard로 라우팅)\n• Config Server: 샤드 메타데이터 저장\n• 잘못된 Shard Key 선택 → Hot Spot 문제 (특정 Shard에 부하 집중)',
    relatedProblems: ['db-q-014'],
  },

  // ─── RDBMS 기초 ───────────────────────────────────────────────────────────────

  {
    id: 'db-q-016',
    category: 'database',
    subcategory: 'rdbms-terms',
    type: 'multiple-choice',
    difficulty: 'easy',
    title: 'SQL 분류 — DDL vs DML vs DCL vs TCL',
    description: '다음 SQL 명령어들의 분류로 올바른 것은?\n\nCREATE TABLE / SELECT / GRANT / COMMIT',
    options: [
      'CREATE=DML, SELECT=DDL, GRANT=TCL, COMMIT=DCL',
      'CREATE=DDL, SELECT=DML, GRANT=DCL, COMMIT=TCL',
      'CREATE=DCL, SELECT=TCL, GRANT=DDL, COMMIT=DML',
      '모두 DML에 속한다',
    ],
    correctAnswer: 1,
    explanation:
      'SQL 분류: DDL(Data Definition Language) = CREATE, ALTER, DROP, TRUNCATE — 구조 정의. DML(Data Manipulation Language) = SELECT, INSERT, UPDATE, DELETE — 데이터 조작. DCL(Data Control Language) = GRANT, REVOKE — 권한 제어. TCL(Transaction Control Language) = COMMIT, ROLLBACK, SAVEPOINT — 트랜잭션 제어.',
    hints: ['D = Definition(정의), M = Manipulation(조작), C = Control(제어)'],
    deepDive:
      '실무 활용:\n• DDL: 테이블 생성/변경 (마이그레이션 파일로 관리)\n• DML: 일반적인 CRUD 쿼리\n• DCL: DB 사용자 권한 관리 (DBA 영역)\n• TCL: 여러 쿼리를 묶어 원자적으로 처리\n\nTRUNCATE vs DELETE:\n• TRUNCATE(DDL): 테이블 전체 삭제, 롤백 불가, 빠름\n• DELETE(DML): 조건부 삭제, 트랜잭션 내 롤백 가능\n\nNode.js ORM(Prisma, TypeORM)에서 마이그레이션 파일은 DDL을 자동 생성합니다.',
    relatedProblems: ['db-q-017', 'db-q-018'],
  },
  {
    id: 'db-q-017',
    category: 'database',
    subcategory: 'rdbms-terms',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'JOIN 종류 — INNER vs LEFT vs RIGHT vs FULL',
    description: 'User 테이블과 Order 테이블을 JOIN할 때, "주문이 없는 사용자도 포함해서 모든 사용자 목록을 조회"하려면?',
    options: [
      'INNER JOIN — 두 테이블 모두에 일치하는 행만',
      'LEFT JOIN — 왼쪽(User) 기준, 오른쪽(Order)에 없어도 NULL로 포함',
      'RIGHT JOIN — 오른쪽(Order) 기준, 왼쪽에 없어도 포함',
      'CROSS JOIN — 두 테이블의 모든 조합',
    ],
    correctAnswer: 1,
    explanation:
      'LEFT JOIN(= LEFT OUTER JOIN)은 왼쪽 테이블의 모든 행을 포함하고, 오른쪽에 일치하는 행이 없으면 NULL로 채웁니다. 주문이 없는 사용자도 조회되며 Order 관련 컬럼은 NULL로 나타납니다. INNER JOIN은 양쪽 모두에 있는 행만 반환하므로 주문이 없는 사용자는 제외됩니다.',
    hints: ['User가 왼쪽 테이블이라면?', 'NULL로 채운다는 것이 포인트'],
    deepDive:
      '```sql\n-- INNER JOIN: 주문이 있는 사용자만\nSELECT u.name, o.amount\nFROM users u\nINNER JOIN orders o ON u.id = o.user_id\n\n-- LEFT JOIN: 모든 사용자 (주문 없으면 NULL)\nSELECT u.name, o.amount\nFROM users u\nLEFT JOIN orders o ON u.id = o.user_id\n\n-- 주문 없는 사용자만 필터링\nSELECT u.name\nFROM users u\nLEFT JOIN orders o ON u.id = o.user_id\nWHERE o.id IS NULL\n```\n\nMongoDB로 비교:\n• INNER JOIN ≈ $lookup + $match (빈 배열 제거)\n• LEFT JOIN ≈ $lookup (preserveNullAndEmptyArrays: true)\n\n면접에서 자주 묻는 차이: INNER JOIN은 교집합, LEFT JOIN은 왼쪽 전체',
    relatedProblems: ['db-q-013', 'db-q-018'],
  },
  {
    id: 'db-q-018',
    category: 'database',
    subcategory: 'rdbms-terms',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'ACID 트랜잭션',
    description: '은행 이체 시스템에서 "A 계좌에서 출금 성공, B 계좌에 입금 실패" 상황이 발생했을 때 출금을 자동으로 취소해주는 ACID 속성은?',
    options: [
      'Consistency(일관성) — 데이터는 항상 유효한 상태여야 한다',
      'Isolation(격리성) — 트랜잭션은 서로 독립적으로 실행된다',
      'Atomicity(원자성) — 트랜잭션 내 모든 작업은 전부 성공하거나 전부 실패한다',
      'Durability(지속성) — 커밋된 트랜잭션은 영구적으로 저장된다',
    ],
    correctAnswer: 2,
    explanation:
      'Atomicity(원자성)은 트랜잭션 내의 모든 작업이 "All or Nothing"으로 처리되어야 한다는 속성입니다. 출금과 입금 중 하나라도 실패하면 전체 트랜잭션이 ROLLBACK되어 출금도 취소됩니다. 이것이 이체 시스템의 데이터 무결성을 보장합니다.',
    hints: ['All or Nothing', '원자 = 더 이상 쪼갤 수 없는 최소 단위'],
    deepDive:
      'ACID 전체 설명:\n• Atomicity(원자성): All or Nothing — 부분 성공 없음\n• Consistency(일관성): 트랜잭션 전후로 DB 제약조건 항상 유효 (잔액 ≥ 0)\n• Isolation(격리성): 동시에 실행되는 트랜잭션이 서로 영향 안 줌\n• Durability(지속성): COMMIT된 데이터는 시스템 장애 후에도 유지\n\nMongoDB와 트랜잭션:\n• MongoDB 4.0+: Replica Set 내 Multi-Document Transaction 지원\n• MongoDB 4.2+: Sharded Cluster에서도 Transaction 지원\n• Mongoose 트랜잭션:\n```javascript\nconst session = await mongoose.startSession()\nsession.startTransaction()\ntry {\n  await Account.updateOne({ _id: from }, { $inc: { balance: -amount } }, { session })\n  await Account.updateOne({ _id: to }, { $inc: { balance: amount } }, { session })\n  await session.commitTransaction()\n} catch (err) {\n  await session.abortTransaction()\n}\n```',
    relatedProblems: ['db-q-016', 'db-q-017'],
  },
]
