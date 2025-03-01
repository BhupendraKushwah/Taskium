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


function App() {

  return (
    <ProjectContextProvider>
      <TaskContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route path="" element={<DashboardContent />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path='*' element={<NotFound />} />
          </Route >
        </Routes>
      </BrowserRouter>
      </TaskContextProvider>
    </ProjectContextProvider>
  );
}

export default App;
