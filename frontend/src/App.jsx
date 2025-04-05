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
import UserProfile from './page/UserProfile';
import { Toaster } from 'react-hot-toast';
import UserProvider from './context/userContext/UserContextProvider';

function App() {

  return (
    <BrowserRouter>
      <UserProvider>
        <ProjectContextProvider>
          <TaskContextProvider>
            <ThemeContextProvider>
              <Toaster position="bottom-right" />
              <Routes>
                <Route path='/' element={<Layout />}>
                  <Route path="" element={<DashboardContent />} />
                  <Route path="/profile/:id" element={<UserProfile />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/tasks" element={<Tasks />} />
                  <Route path="/settings" element={<Setting />} />
                  <Route path='*' element={<NotFound />} />
                </Route >
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/forgot-password/:token?" element={<ForgotPassword />} />
              </Routes>
            </ThemeContextProvider>
          </TaskContextProvider>
        </ProjectContextProvider>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
