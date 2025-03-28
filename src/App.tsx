// @ts-nocheck
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './theme';
import MainLayout from './layouts/MainLayout';
import FormatPage from './pages/FormatPage';
import CompressPage from './pages/CompressPage';
import XmlPage from './pages/XmlPage';
import YamlPage from './pages/YamlPage';
import EntityPage from './pages/EntityPage';
import ExcelPage from './pages/ExcelPage';
import EditorPage from './pages/EditorPage';
import { useEffect } from 'react';

// 添加路由变化追踪组件
function RouteTracker() {
  const location = useLocation();

  useEffect(() => {
    // 当路由变化时，发送页面访问事件
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'page_view', {
        page_path: location.pathname,
        page_title: document.title
      });
    }
  }, [location]);

  return null;
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <RouteTracker />
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<FormatPage />} />
            <Route path="format" element={<FormatPage />} />
            <Route path="compress" element={<CompressPage />} />
            <Route path="editor" element={<EditorPage />} />
            <Route path="entity" element={<EntityPage />} />
            <Route path="xml" element={<XmlPage />} />
            <Route path="yaml" element={<YamlPage />} />
            <Route path="excel" element={<ExcelPage />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App; 