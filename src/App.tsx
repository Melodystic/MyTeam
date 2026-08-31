import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { App as AntApp } from 'antd';
import { ThemeProvider } from './context/ThemeContext';
import { EmployeesProvider } from './context/EmployeesContext';
import { AppLayout } from './components/AppLayout';
import { EmployeesPage } from './pages/EmployeesPage';
import { EmployeeDetailPage } from './pages/EmployeeDetailPage';

export default function App() {
  return (
    <ThemeProvider>
      <AntApp>
        <EmployeesProvider>
          <BrowserRouter basename={import.meta.env.BASE_URL}>
            <Routes>
              <Route element={<AppLayout />}>
                <Route index element={<EmployeesPage />} />
                <Route path="employee/:id" element={<EmployeeDetailPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </EmployeesProvider>
      </AntApp>
    </ThemeProvider>
  );
}
