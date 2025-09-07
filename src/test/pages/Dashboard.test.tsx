import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Dashboard } from '../../pages/Dashboard';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { DataProvider } from '../../contexts/DataContext';
import type { Idea } from '../../types';

// Mock useData hook
const mockIdeas: Idea[] = [
  {
    id: '1',
    title: '테스트 아이디어 1',
    description: '첫 번째 테스트 아이디어',
    category: '기술',
    priority: 'high',
    status: 'in-progress',
    tags: ['테스트', '개발'],
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    targetMarket: '개발자',
    potentialRevenue: '100만원',
    resources: '개발자 2명',
    timeline: '3개월',
    notes: '테스트 노트'
  },
  {
    id: '2',
    title: '테스트 아이디어 2',
    description: '두 번째 테스트 아이디어',
    category: '비즈니스',
    priority: 'medium',
    status: 'completed',
    tags: ['비즈니스', '전략'],
    createdAt: '2024-01-02T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z',
    targetMarket: '기업',
    potentialRevenue: '1000만원',
    resources: '비즈니스 팀 3명',
    timeline: '6개월',
    notes: '비즈니스 노트',
    updatedAt: '2024-01-02T00:00:00.000Z'
  },
];

vi.mock('../../contexts/DataContext', async () => {
  const actual = await vi.importActual('../../contexts/DataContext');
  return {
    ...actual,
    useData: () => ({
      ideas: mockIdeas,
      loading: false,
      error: null,
      useFirebase: false,
      toggleDataSource: vi.fn(),
      createIdea: vi.fn(),
      updateIdea: vi.fn(),
      deleteIdea: vi.fn(),
      getIdea: vi.fn(),
      searchIdeas: vi.fn(),
      refreshIdeas: vi.fn(),
    }),
  };
});

vi.mock('../../config/firebase', () => ({
  auth: {},
  db: {},
  storage: {},
  analytics: null,
}));

const MockProviders = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <ThemeProvider>
      <DataProvider>
        {children}
      </DataProvider>
    </ThemeProvider>
  </BrowserRouter>
);

describe('Dashboard Component', () => {
  it('should render dashboard title and description', () => {
    render(
      <MockProviders>
        <Dashboard />
      </MockProviders>
    );

    expect(screen.getByText('대시보드')).toBeInTheDocument();
    expect(screen.getByText('아이디어 현황을 한눈에 확인해보세요')).toBeInTheDocument();
  });

  it('should display stats cards with correct data', () => {
    render(
      <MockProviders>
        <Dashboard />
      </MockProviders>
    );

    // 총 아이디어 수
    expect(screen.getByText('총 아이디어')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();

    // 완료율 (1/2 = 50%)
    expect(screen.getByText('완료율')).toBeInTheDocument();
    expect(screen.getByText('50%')).toBeInTheDocument();

    // 진행중 (0개)
    expect(screen.getByText('진행중')).toBeInTheDocument();

    // 높은 우선순위 (1개)
    expect(screen.getByText('높은 우선순위')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('should render chart sections', () => {
    render(
      <MockProviders>
        <Dashboard />
      </MockProviders>
    );

    expect(screen.getByText('상태별 분포')).toBeInTheDocument();
    expect(screen.getByText('우선순위별 분포')).toBeInTheDocument();
  });

  it('should display recent activity section', () => {
    render(
      <MockProviders>
        <Dashboard />
      </MockProviders>
    );

    expect(screen.getByText('최근 활동')).toBeInTheDocument();
    expect(screen.getByText('테스트 아이디어 1')).toBeInTheDocument();
    expect(screen.getByText('테스트 아이디어 2')).toBeInTheDocument();
  });

  it('should display category and tags sections', () => {
    render(
      <MockProviders>
        <Dashboard />
      </MockProviders>
    );

    expect(screen.getByText('인기 카테고리')).toBeInTheDocument();
    expect(screen.getByText('인기 태그')).toBeInTheDocument();
    expect(screen.getByText('기술')).toBeInTheDocument();
    expect(screen.getByText('비즈니스')).toBeInTheDocument();
  });

  it('should show data source toggle', () => {
    render(
      <MockProviders>
        <Dashboard />
      </MockProviders>
    );

    expect(screen.getByText('로컬')).toBeInTheDocument();
    expect(screen.getByText('Firebase')).toBeInTheDocument();
  });
});