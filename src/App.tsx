import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { IdeaList } from './pages/IdeaList';
import { IdeaDetail } from './pages/IdeaDetail';
import { IdeaForm } from './pages/IdeaForm';
import { SearchPage } from './pages/SearchPage';
import { MemoListPage } from './pages/MemoListPage';
import { DailyMemoPage } from './pages/DailyMemoPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<IdeaList />} />
          <Route path="/idea/:id" element={<IdeaDetail />} />
          <Route path="/new" element={<IdeaForm />} />
          <Route path="/edit/:id" element={<IdeaForm />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/memos" element={<MemoListPage />} />
          <Route path="/memos/new" element={<DailyMemoPage />} />
          <Route path="/memos/:date" element={<DailyMemoPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
