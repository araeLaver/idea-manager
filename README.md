# 아이디어 매니저 (Idea Manager)

사업 구상과 아이디어를 체계적으로 관리할 수 있는 웹 애플리케이션입니다.

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=flat&logo=vite&logoColor=white)

## 🚀 주요 기능

### ✨ 아이디어 관리
- **CRUD 기능**: 아이디어 생성, 조회, 수정, 삭제
- **상태 관리**: 초안, 진행중, 완료, 보관됨
- **우선순위**: 높음, 보통, 낮음
- **카테고리 분류**: 자유로운 카테고리 설정
- **태그 시스템**: 다중 태그로 아이디어 분류

### 🔍 검색 및 필터링
- **통합 검색**: 제목, 설명, 태그 검색
- **다중 필터**: 카테고리, 상태, 우선순위별 필터링
- **실시간 검색**: 입력과 동시에 결과 표시

### 📱 사용자 인터페이스
- **카드 뷰**: 시각적으로 보기 편한 카드 레이아웃
- **테이블 뷰**: 한눈에 정보를 파악할 수 있는 테이블 형태
- **반응형 디자인**: 데스크톱, 태블릿, 모바일 지원
- **한국어 UI**: 완전한 한국어 인터페이스

### 💾 데이터 관리
- **로컬 스토리지**: 브라우저에 데이터 자동 저장
- **샘플 데이터**: 5개의 다양한 예시 아이디어 포함

## 📋 아이디어 정보 구조

각 아이디어는 다음 정보를 포함합니다:

- **기본 정보**: 제목, 설명, 카테고리
- **분류**: 태그, 상태, 우선순위
- **비즈니스 정보**: 타겟 시장, 예상 수익, 필요 자원, 타임라인
- **메모**: 추가 아이디어나 노트
- **시간 정보**: 생성일시, 수정일시

## 🛠 기술 스택

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Styling**: Custom CSS (Tailwind 스타일 클래스)
- **Storage**: Browser Local Storage

## 🚀 시작하기

### 필수 조건
- Node.js 18+ 
- npm 또는 yarn

### 설치 및 실행

1. **저장소 클론**
   ```bash
   git clone https://github.com/araeLaver/idea-manager.git
   cd idea-manager
   ```

2. **의존성 설치**
   ```bash
   npm install
   ```

3. **개발 서버 실행**
   ```bash
   npm run dev
   ```

4. **브라우저에서 확인**
   ```
   http://localhost:5173
   ```

### 빌드

프로덕션 빌드를 생성하려면:

```bash
npm run build
```

빌드된 파일은 `dist/` 폴더에 생성됩니다.

## 📖 사용법

### 1. 아이디어 추가
- 우상단 "새 아이디어" 버튼 클릭
- 필수 정보(제목, 설명, 카테고리) 입력
- 선택 사항: 태그, 상태, 우선순위, 비즈니스 정보 등 입력
- "저장하기" 버튼으로 저장

### 2. 아이디어 관리
- **목록 보기**: 카드뷰/테이블뷰 전환 가능
- **상세 보기**: 아이디어 클릭으로 상세 정보 확인
- **수정**: 상세 페이지에서 "수정" 버튼 클릭
- **삭제**: 상세 페이지 또는 목록에서 삭제 가능

### 3. 검색 및 필터링
- **검색**: 우상단 검색 아이콘 클릭
- **필터**: 상태별 버튼으로 빠른 필터링
- **고급 검색**: 검색 페이지에서 다중 조건 검색

### 4. 뷰 모드 전환
- **카드뷰**: 시각적 레이아웃, 태그와 설명 중심
- **테이블뷰**: 정보 중심, 빠른 스캔 가능

## 📦 포함된 샘플 데이터

처음 실행 시 다음 예시 아이디어들이 포함됩니다:

1. **음식 배달 로봇 서비스** (로보틱스)
2. **VR 부동산 투어 플랫폼** (부동산테크)
3. **AI 기반 개인 영양사 앱** (헬스케어)
4. **스마트 화분 IoT 시스템** (IoT)
5. **중고 명품 진품 인증 플랫폼** (이커머스)

## 🔧 개발 정보

### 프로젝트 구조
```
src/
├── components/     # 재사용 가능한 컴포넌트
├── pages/         # 페이지 컴포넌트
├── types/         # TypeScript 타입 정의
├── utils/         # 유틸리티 함수
└── assets/        # 정적 자산
```

### 주요 파일
- `src/types/index.ts`: 데이터 타입 정의
- `src/utils/storage.ts`: 로컬 스토리지 관리
- `src/pages/IdeaList.tsx`: 메인 목록 페이지
- `src/pages/IdeaForm.tsx`: 아이디어 작성/수정 폼
- `src/pages/IdeaDetail.tsx`: 아이디어 상세 페이지
- `src/pages/SearchPage.tsx`: 검색 및 필터링 페이지

## 🎨 UI/UX 특징

- **직관적인 네비게이션**: 명확한 버튼과 아이콘
- **일관된 디자인**: 통일된 색상과 타이포그래피
- **반응형 레이아웃**: 다양한 화면 크기 지원
- **접근성**: 키보드 내비게이션 지원
- **시각적 피드백**: 호버 효과와 전환 애니메이션

## 🔄 데이터 저장

- **로컬 스토리지 사용**: 별도 서버 없이 브라우저에 저장
- **자동 저장**: 모든 변경사항 즉시 저장
- **데이터 지속성**: 브라우저 종료 후에도 데이터 유지

## 📱 브라우저 지원

- Chrome (권장)
- Firefox
- Safari
- Edge

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다.

## 📞 연락처

프로젝트 링크: [https://github.com/araeLaver/idea-manager](https://github.com/araeLaver/idea-manager)

---

💡 **팁**: 이 애플리케이션은 창업 아이디어, 프로젝트 기획, 개인 아이디어 정리 등 다양한 용도로 활용할 수 있습니다!