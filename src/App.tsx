import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { App as AntApp } from 'antd';
import { ThemeProvider } from './context/ThemeContext';
import { LocaleProvider } from './context/LocaleContext';
import { EmployeesProvider } from './context/EmployeesContext';
import { WorkspaceProvider } from './context/WorkspaceContext';
import { ProfilesProvider } from './context/ProfilesContext';
import { AppLayout } from './components/AppLayout';
import { EmployeesPage } from './pages/EmployeesPage';
import { EmployeeDetailPage } from './pages/EmployeeDetailPage';
import { LeadNotesPage } from './pages/LeadNotesPage';
import { ProfileDetailPage } from './pages/ProfileDetailPage';
import { ProfilesPage } from './pages/ProfilesPage';

export default function App() {
  return (
    <LocaleProvider>
      <ThemeProvider>
        <AntApp>
          <EmployeesProvider>
            <WorkspaceProvider>
              <ProfilesProvider>
                <BrowserRouter basename={import.meta.env.BASE_URL}>
                  <Routes>
                    <Route element={<AppLayout />}>
                      <Route index element={<EmployeesPage />} />
                      <Route path="employee/:id" element={<EmployeeDetailPage />} />
                      <Route path="notes" element={<LeadNotesPage />} />
                      <Route path="profiles" element={<ProfilesPage />} />
                      <Route path="profiles/:id" element={<ProfileDetailPage />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Route>
                  </Routes>
                </BrowserRouter>
              </ProfilesProvider>
            </WorkspaceProvider>
          </EmployeesProvider>
        </AntApp>
      </ThemeProvider>
    </LocaleProvider>
  );
}
