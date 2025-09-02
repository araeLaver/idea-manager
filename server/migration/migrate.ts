import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// localStorage에서 가져올 샘플 데이터
const sampleIdeas = [
  {
    id: '1',
    title: '음식 배달 로봇 서비스',
    description: '자율주행 로봇을 이용한 음식 배달 서비스. 아파트 단지 내에서 음식점에서 고객의 집까지 무인으로 배달하는 시스템입니다. GPS와 AI 기반 경로 최적화를 통해 효율적인 배달을 제공합니다.',
    category: '로보틱스',
    tags: ['로봇', '배달', 'AI', '자율주행', '푸드테크'],
    status: 'draft',
    priority: 'high',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    targetMarket: '아파트 거주자, 음식점 사장, 배달업체',
    potentialRevenue: '월 구독료 모델: 개인 월 9,900원, 음식점 월 199,000원',
    resources: '로봇 하드웨어 개발팀 5명, 소프트웨어 개발팀 8명, 초기 자본 50억원',
    timeline: '프로토타입 6개월, 베타 테스트 3개월, 상용화 1년',
    notes: '규제 이슈와 안전성 확보가 핵심. 소형 아파트 단지부터 시작하여 점진적 확장 전략 필요.'
  },
  {
    id: '2',
    title: 'VR 부동산 투어 플랫폼',
    description: 'VR 기술을 활용하여 집에서도 실제와 같은 부동산 투어를 경험할 수 있는 플랫폼. 360도 촬영과 3D 모델링을 통해 생생한 가상 투어를 제공합니다.',
    category: '부동산테크',
    tags: ['VR', '부동산', '3D', '가상현실', '투어'],
    status: 'in-progress',
    priority: 'medium',
    createdAt: '2024-01-10T14:20:00Z',
    updatedAt: '2024-01-20T09:15:00Z',
    targetMarket: '부동산 중개업소, 건설사, 해외 거주 투자자',
    potentialRevenue: '월 SaaS 구독료 + 프리미엄 투어 건당 수수료',
    resources: 'VR 개발팀 6명, 3D 아티스트 4명, 영업팀 3명',
    timeline: 'MVP 4개월, 파트너십 구축 2개월, 정식 런칭 6개월',
    notes: '코로나19로 인한 비대면 수요 증가. 해외 투자자들에게 특히 유용할 것으로 예상.'
  },
  {
    id: '3',
    title: 'AI 기반 개인 영양사 앱',
    description: '사용자의 건강 상태, 운동량, 식습관을 분석하여 개인 맞춤형 식단과 영양 관리 솔루션을 제공하는 AI 앱. 사진만 찍으면 칼로리와 영양성분을 자동 분석합니다.',
    category: '헬스케어',
    tags: ['AI', '영양', '건강', '식단', '맞춤형'],
    status: 'completed',
    priority: 'high',
    createdAt: '2023-12-05T16:45:00Z',
    updatedAt: '2024-02-01T11:30:00Z',
    targetMarket: '건강 관심층, 다이어터, 운동인, 만성질환자',
    potentialRevenue: '프리미엄 구독료 월 12,900원, 영양사 상담 건당 30,000원',
    resources: 'AI 엔지니어 4명, 영양사 2명, 앱 개발자 5명',
    timeline: '이미 런칭 완료, 사용자 확대 단계',
    notes: '현재 DAU 15,000명, 월간 성장률 25%. 병원과의 B2B 파트너십 추진 중.'
  },
  {
    id: '4',
    title: '스마트 화분 IoT 시스템',
    description: '식물의 수분, 영양, 조도 상태를 실시간으로 모니터링하고 자동으로 관리해주는 스마트 화분. 앱을 통해 원격 모니터링 및 제어가 가능합니다.',
    category: 'IoT',
    tags: ['IoT', '스마트팜', '식물', '자동화', '센서'],
    status: 'draft',
    priority: 'low',
    createdAt: '2024-01-25T13:10:00Z',
    updatedAt: '2024-01-25T13:10:00Z',
    targetMarket: '식물 애호가, 바쁜 직장인, 카페/사무실',
    potentialRevenue: '하드웨어 판매 + 구독 서비스 (센서 데이터 분석)',
    resources: '하드웨어 엔지니어 3명, 앱 개발자 2명, 초기 투자 2억원',
    timeline: '프로토타입 4개월, 양산 준비 6개월',
    notes: '시장 규모가 제한적일 수 있음. B2B 시장(카페, 사무실) 중심으로 접근 고려.'
  },
  {
    id: '5',
    title: '중고 명품 진품 인증 플랫폼',
    description: 'AI와 블록체인 기술을 활용한 중고 명품의 진품 인증 서비스. 전문가 감정과 AI 분석을 결합하여 95% 이상의 정확도로 진품을 판별합니다.',
    category: '이커머스',
    tags: ['블록체인', 'AI', '명품', '진품인증', 'C2C'],
    status: 'in-progress',
    priority: 'high',
    createdAt: '2024-01-08T09:20:00Z',
    updatedAt: '2024-01-28T14:45:00Z',
    targetMarket: '명품 애호가, 중고 거래자, 리셀러',
    potentialRevenue: '인증 수수료 건당 50,000원, 거래 수수료 5%',
    resources: 'AI 개발자 5명, 블록체인 개발자 3명, 명품 감정사 10명',
    timeline: '베타 서비스 3개월, 정식 서비스 6개월',
    notes: '가짜 명품 시장 규모 확대로 수요 증가. 해외 진출 가능성도 높음.'
  }
];

const sampleMemos = [
  {
    date: '2024-03-01',
    content: '오늘은 새로운 프로젝트 아이디어를 구상해보았다. VR을 활용한 교육 플랫폼에 대해 생각해보니 많은 가능성이 있을 것 같다.',
    mood: 'good',
    weather: 'sunny',
    goals: ['새로운 아이디어 3개 생각해보기', '시장 조사 자료 수집'],
    achievements: ['VR 교육 플랫폼 아이디어 도출', '경쟁사 분석 완료'],
    reflections: '아이디어는 많지만 실행 가능성을 더 깊이 고민해봐야겠다.',
    tags: ['아이디어', '기획', 'VR'],
    isFavorite: true
  },
  {
    date: '2024-03-02',
    content: '어제 생각한 VR 교육 플랫폼에 대해 더 구체적으로 계획을 세워봤다. 특히 언어 학습 분야에 초점을 맞추면 좋을 것 같다.',
    mood: 'excellent',
    weather: 'cloudy',
    goals: ['VR 교육 플랫폼 상세 기획서 작성', '개발 예산 산출'],
    achievements: ['기획서 초안 완성', '개발 비용 대략적 산출'],
    reflections: '생각보다 할 일이 많다. 체계적으로 접근해야겠다.',
    tags: ['기획', '예산', '언어학습'],
    isFavorite: false
  }
];

async function migrateIdeas() {
  console.log('Starting ideas migration...');
  
  for (const idea of sampleIdeas) {
    try {
      await pool.query(`
        INSERT INTO idea_manager.ideas 
        (title, description, category, tags, status, priority, target_market, 
         potential_revenue, resources, timeline, notes, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      `, [
        idea.title,
        idea.description,
        idea.category,
        idea.tags,
        idea.status,
        idea.priority,
        idea.targetMarket,
        idea.potentialRevenue,
        idea.resources,
        idea.timeline,
        idea.notes,
        idea.createdAt,
        idea.updatedAt
      ]);
      
      console.log(`✓ Migrated idea: ${idea.title}`);
    } catch (error) {
      console.error(`✗ Failed to migrate idea ${idea.title}:`, error);
    }
  }
}

async function migrateMemos() {
  console.log('Starting memos migration...');
  
  for (const memo of sampleMemos) {
    try {
      await pool.query(`
        INSERT INTO idea_manager.daily_memos 
        (date, content, mood, weather, goals, achievements, reflections, tags, is_favorite)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `, [
        memo.date,
        memo.content,
        memo.mood,
        memo.weather,
        memo.goals,
        memo.achievements,
        memo.reflections,
        memo.tags,
        memo.isFavorite
      ]);
      
      console.log(`✓ Migrated memo for date: ${memo.date}`);
    } catch (error) {
      console.error(`✗ Failed to migrate memo for ${memo.date}:`, error);
    }
  }
}

async function main() {
  try {
    console.log('🚀 Starting data migration to PostgreSQL...\n');
    
    // Test connection
    const client = await pool.connect();
    console.log('✓ Connected to PostgreSQL database');
    client.release();
    
    // Migrate data
    await migrateIdeas();
    console.log('');
    await migrateMemos();
    
    console.log('\n🎉 Migration completed successfully!');
    
    // Show summary
    const ideasCount = await pool.query('SELECT COUNT(*) FROM idea_manager.ideas');
    const memosCount = await pool.query('SELECT COUNT(*) FROM idea_manager.daily_memos');
    
    console.log('\n📊 Database Summary:');
    console.log(`- Ideas: ${ideasCount.rows[0].count}`);
    console.log(`- Memos: ${memosCount.rows[0].count}`);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// ES 모듈에서 직접 실행되는지 확인
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { main as migrate };