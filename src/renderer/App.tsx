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
import { MainLayout } from './Layouts/MainLayout';

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
                  <Route
                    path="/"
                    element={
                      <MainLayout>
                        <Main />
                      </MainLayout>
                    }
                  />
                  <Route
                    path="/alarm"
                    element={
                      <MainLayout>
                        <Alarm />
                      </MainLayout>
                    }
                  />
                  <Route
                    path="/schedule"
                    element={
                      <MainLayout>
                        <DailySchedule />
                      </MainLayout>
                    }
                  />
                  <Route
                    path="/importantDates"
                    element={
                      <MainLayout>
                        <ImportantDates />
                      </MainLayout>
                    }
                  />
                  <Route
                    path="/longTermAffairs"
                    element={
                      <MainLayout>
                        <LongTermAffairs />
                      </MainLayout>
                    }
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
