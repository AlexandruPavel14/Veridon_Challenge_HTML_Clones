import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import GroupList from './pages/GroupList';
import FileList from './pages/FileList';
import FileViewer from './pages/FileViewer';
import ExplorationPage from './pages/ExplorationPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/groups" element={<GroupList />} />
        <Route path="/group/:group" element={<FileList />} />
        <Route path="/group/:group/file/:filename" element={<FileViewer />} />
        <Route path="/exploration" element={<ExplorationPage />} />
      </Routes>
    </Router>
  );
}

export default App;
