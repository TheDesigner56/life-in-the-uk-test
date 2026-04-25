import { lazy, Suspense } from 'react';
import { HashRouter, Routes, Route } from 'react-router';

const Home = lazy(() => import('@/pages/Home'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Practice = lazy(() => import('@/pages/Practice'));
const Test = lazy(() => import('@/pages/Test'));
const Study = lazy(() => import('@/pages/Study'));
const StudyChapter = lazy(() => import('@/pages/StudyChapter'));
const Leaderboard = lazy(() => import('@/pages/Leaderboard'));
const Profile = lazy(() => import('@/pages/Profile'));
const Pricing = lazy(() => import('@/pages/Pricing'));

function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/test/:mode/:id" element={<Test />} />
          <Route path="/study" element={<Study />} />
          <Route path="/study/:chapterId" element={<StudyChapter />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/pricing" element={<Pricing />} />
        </Routes>
      </Suspense>
    </HashRouter>
  );
}
