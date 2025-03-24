import React, { useState } from 'react';
import { Box, Paper, Typography, Stack, Alert } from '@mui/material';
import Editor from '@monaco-editor/react';

const EditorPage: React.FC = () => {
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (value: string | undefined) => {
    const jsonStr = value || '';
    setInput(jsonStr);

    if (!jsonStr.trim()) {
      setError(null);
      return;
    }

    try {
      JSON.parse(jsonStr);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'JSON 格式错误');
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', p: 2 }}>
      <Stack direction="row" spacing={2} alignItems="center" mb={2}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          JSON 编辑器
        </Typography>
        {error && (
          <Alert severity="error" sx={{ flex: 1 }}>
            {error}
          </Alert>
        )}
      </Stack>

      <Paper 
        elevation={3} 
        sx={{ 
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          bgcolor: '#1e1e1e'
        }}
      >
        <Box sx={{ 
          p: 1, 
          borderBottom: '1px solid #333',
          color: '#fff',
          fontSize: '0.875rem',
          bgcolor: '#2d2d2d'
        }}>
          编辑区域
        </Box>
        <Box sx={{ flex: 1 }}>
          <Editor
            height="100%"
            defaultLanguage="json"
            value={input}
            onChange={handleInputChange}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
              wordWrap: 'on',
              folding: true,
              renderLineHighlight: 'all',
              formatOnPaste: true,
              formatOnType: true,
              scrollbar: {
                vertical: 'visible',
                horizontal: 'visible'
              }
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default EditorPage; 