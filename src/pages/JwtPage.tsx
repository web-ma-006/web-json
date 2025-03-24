import React, { useState } from 'react';
import { Box, Paper, Typography, Button, Alert, Stack } from '@mui/material';
import Editor from '@monaco-editor/react';

const JwtPage: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const decodeJwt = (token: string) => {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid JWT format');
      }

      const header = JSON.parse(atob(parts[0]));
      const payload = JSON.parse(atob(parts[1]));

      return {
        header,
        payload,
        signature: parts[2]
      };
    } catch (err) {
      throw new Error('Failed to decode JWT');
    }
  };

  const handleDecode = () => {
    try {
      if (!input.trim()) {
        setError('请输入 JWT token');
        setOutput('');
        return;
      }

      const decoded = decodeJwt(input.trim());
      setOutput(JSON.stringify(decoded, null, 2));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : '解码失败');
      setOutput('');
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        JWT 解码
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
        <Button 
          variant="contained" 
          onClick={handleDecode}
          size="large"
        >
          解码 JWT
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      )}
      
      <Box sx={{ display: 'flex', gap: 2, flex: 1, minHeight: 0 }}>
        <Paper sx={{ flex: 1, p: 2, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle1">
              输入 JWT Token
            </Typography>
          </Box>
          <Box sx={{ flex: 1, border: '1px solid #ccc', borderRadius: 1 }}>
            <Editor
              height="100%"
              defaultLanguage="text"
              value={input}
              onChange={(value) => setInput(value || '')}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                wordWrap: 'on'
              }}
            />
          </Box>
        </Paper>

        <Paper sx={{ flex: 1, p: 2, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle1">
              解码结果
            </Typography>
          </Box>
          <Box sx={{ flex: 1, border: '1px solid #ccc', borderRadius: 1 }}>
            <Editor
              height="100%"
              defaultLanguage="json"
              value={output}
              theme="vs-dark"
              options={{
                readOnly: true,
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                wordWrap: 'on'
              }}
            />
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default JwtPage; 