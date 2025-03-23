// import './App.css';
import './assets/scss/custom/color_code.scss';
import DashboardContent from './page/Dashboard';
import { BrowserRouter, Route, Routes } from 'react-router';
import Layout from './Layout';
import Projects from './page/Projects';
import NotFound from './page/NotFound';
import ProjectContextProvider from './context/ProjectContext/ProjectContextProvider';
import Tasks from './page/Tasks';
import TaskContextProvider from './context/TaskContext/TaskContextProvider';
import Setting from './page/Setting';
import ThemeContextProvider from './context/ThemeContext/ThemeContextProvider';
import Login from './page/Login';
import SignUp from './page/SignUp';
import ForgotPassword from './page/ForgotPassword';


function App() {

  return (
    <ProjectContextProvider>
      <TaskContextProvider>
        <ThemeContextProvider>
          <BrowserRouter>
            <Routes>
              <Route path='/' element={<Layout />}>
                <Route path="" element={<DashboardContent />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/settings" element={<Setting />} />
                <Route path='*' element={<NotFound />} />
              </Route >
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/forgot-password/:token?" element={<ForgotPassword />} />
            </Routes>
          </BrowserRouter>
        </ThemeContextProvider>
      </TaskContextProvider>
    </ProjectContextProvider>
  );
}

export default App;
