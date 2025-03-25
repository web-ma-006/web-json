import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Tabs, Tab, Container } from '@mui/material';
import { FC } from 'react';

const tabs = [
  { label: '格式化校验', path: '/format' },
  { label: '压缩转义', path: '/compress' },
  { label: 'JSON编辑器', path: '/editor' },
  { label: '转实体类', path: '/entity' },
  { label: 'XML互转', path: '/xml' },
  { label: 'YAML互转', path: '/yaml' },
  { label: 'Excel互转', path: '/excel' }
];

const MainLayout: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const currentTab = tabs.findIndex(tab => tab.path === location.pathname) || 0;

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    navigate(tabs[newValue].path);
  };

  return (
    <>
      <AppBar position="static" color="default">
        <Toolbar>
          <Tabs 
            value={currentTab} 
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            textColor="primary"
            indicatorColor="primary"
            sx={{
              '& .MuiTab-root': {
                color: 'text.primary',
                '&.Mui-selected': {
                  color: 'primary.main',
                  fontWeight: 'bold'
                }
              }
            }}
          >
            {tabs.map((tab, index) => (
              <Tab key={index} label={tab.label} />
            ))}
          </Tabs>
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl" sx={{ mt: 2 }}>
        <Outlet />
      </Container>
    </>
  );
};

export default MainLayout; 