import React from 'react';
import { Box, Container, AppBar, Toolbar, Typography, Tabs, Tab } from '@mui/material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const tabs = [
  { label: '格式化校验', path: '/format' },
  { label: '压缩转义', path: '/compress' },
  { label: 'JSON编辑器', path: '/editor' },
  { label: '转实体类', path: '/entity' },
  { label: 'XML互转', path: '/xml' },
  { label: 'YAML互转', path: '/yaml' },
  { label: 'Excel互转', path: '/excel' }
];

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentTab = tabs.findIndex(tab => tab.path === location.pathname) || 0;

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    navigate(tabs[newValue].path);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            JSON 工具箱
          </Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', overflowX: 'auto' }}>
        <Tabs
          value={currentTab}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          {tabs.map((tab) => (
            <Tab key={tab.path} label={tab.label} />
          ))}
        </Tabs>
      </Box>
      <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Outlet />
      </Container>
    </Box>
  );
};

export default MainLayout; 