// import './App.css';
import './assets/scss/custom/color_code.scss';
import DashboardContent from './page/Dashboard';
import { BrowserRouter, Route, Routes } from 'react-router';
import Layout from './Layout';
import Projects from './page/Projects';
import NotFound from './page/NotFound';
import ProjectContextProvider from './context/ProjectContextProvider';


function App() {

  return (
    <ProjectContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route path="" element={<DashboardContent />} />
            <Route path="/projects" element={<Projects />} />
            <Route path='*' element={<NotFound />} />
          </Route >
        </Routes>
      </BrowserRouter>

    </ProjectContextProvider>
  );
}

export default App;
