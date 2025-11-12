import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { Main } from './pages/Main';
import { Alarm } from './pages/Alarm';
import { AppContextProvider } from './contexts/AppContextProvider';
import { ModalsManager } from './components/ModalsManager';
import { ModalsContextProvider } from './contexts/ModalsContextProvider';
import { NotificationManager } from './components/NotificationManager';
import { NotificationManagerContextProvider } from './contexts/NotificationManagerContextProvider';
import { ImportantDates } from './pages/ImportantDates';
import { ImportantDatesContextProvider } from './contexts/ImportantDatesContextProvider';
import { DailySchedule } from './pages/DailySchedule';
import { LongTermAffairs } from './pages/LongTermAffairs';
import { LongTermAffairsContextProvider } from './contexts/LongTermAffairsContextProvider';

export default function App() {
  return (
    <AppContextProvider>
      <ImportantDatesContextProvider>
        <LongTermAffairsContextProvider>
          <NotificationManagerContextProvider>
            <ModalsContextProvider>
              <NotificationManager />
              <ModalsManager />
              <Router>
                <Routes>
                  <Route path="/" element={<Main />} />
                  <Route path="/alarm" element={<Alarm />} />
                  <Route path="/schedule" element={<DailySchedule />} />
                  <Route path="/importantDates" element={<ImportantDates />} />
                  <Route
                    path="/longTermAffairs"
                    element={<LongTermAffairs />}
                  />
                </Routes>
              </Router>
            </ModalsContextProvider>
          </NotificationManagerContextProvider>
        </LongTermAffairsContextProvider>
      </ImportantDatesContextProvider>
    </AppContextProvider>
  );
}
