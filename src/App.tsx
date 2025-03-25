// @ts-nocheck
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
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