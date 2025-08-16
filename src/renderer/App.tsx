import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';
import { Main } from './pages/Main';
import { Alarm } from './pages/Alarm';
import { AppContextProvider } from './contexts/AppContextProvider';
import { ModalsManager } from './components/ModalsManager';
import { ModalsContextProvider } from './contexts/ModalsContextProvider';
import { NotificationManager } from './components/NotificationManager';
import { NotificationManagerContextProvider } from './contexts/NotificationManagerContextProvider';

export default function App() {
  return (
    <AppContextProvider>
      <NotificationManagerContextProvider>
        <ModalsContextProvider>
          <NotificationManager />
          <ModalsManager />
          <Router>
            <Routes>
              <Route path="/" element={<Main />} />
              <Route path="/alarm" element={<Alarm />} />
            </Routes>
          </Router>
        </ModalsContextProvider>
      </NotificationManagerContextProvider>
    </AppContextProvider>
  );
}
