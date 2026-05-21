import { HashRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ArchitecturePage from './pages/ArchitecturePage';
import OdiDbtWizardPage from './pages/OdiDbtWizardPage';
import AgentsPage from './pages/AgentsPage';
import ScenarioPage from './pages/ScenarioPage';
import BuildRoomPage from './pages/BuildRoomPage';
import OutcomePage from './pages/OutcomePage';
import PolicyPage from './pages/PolicyPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/architecture" element={<ArchitecturePage />} />
          <Route path="/odi-dbt" element={<OdiDbtWizardPage />} />
          <Route path="/agents" element={<AgentsPage />} />
          <Route path="/scenario" element={<ScenarioPage />} />
          <Route path="/build" element={<BuildRoomPage />} />
          <Route path="/outcome" element={<OutcomePage />} />
          <Route path="/policy" element={<PolicyPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
