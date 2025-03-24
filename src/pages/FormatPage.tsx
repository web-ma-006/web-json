import React, { useState } from 'react';
import { Box, Paper, Typography, Alert, Stack, IconButton, Tooltip, Snackbar } from '@mui/material';
import Editor from '@monaco-editor/react';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const FormatPage: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showCopySuccess, setShowCopySuccess] = useState(false);

  const handleInputChange = (value: string | undefined) => {
    const jsonStr = value || '';
    setInput(jsonStr);

    try {
      if (!jsonStr.trim()) {
        setOutput('');
        setError(null);
        return;
      }

      const parsed = JSON.parse(jsonStr);
      const formatted = JSON.stringify(parsed, null, 2);
      setOutput(formatted);
      setError(null);
    } catch (err: any) {
      // 获取详细的错误信息
      const errorMessage = err.message || 'JSON 格式错误';
      const position = errorMessage.match(/position (\d+)/);
      let detailedError = `错误类型: ${errorMessage}\n`;
      
      if (position && position[1]) {
        const pos = parseInt(position[1]);
        const line = jsonStr.substring(0, pos).split('\n').length;
        const column = pos - jsonStr.lastIndexOf('\n', pos - 1);
        detailedError += `位置: 第 ${line} 行, 第 ${column} 列\n`;
        
        // 添加错误位置的上下文
        const lines = jsonStr.split('\n');
        const errorLine = lines[line - 1];
        if (errorLine) {
          detailedError += '\n错误位置上下文:\n';
          if (line > 1) detailedError += `${line - 1}: ${lines[line - 2]}\n`;
          detailedError += `${line}: ${errorLine}\n`;
          detailedError += ' '.repeat(column + String(line).length + 1) + '^\n';
          if (line < lines.length) detailedError += `${line + 1}: ${lines[line]}\n`;
        }
      }

      setError('JSON 格式错误');
      setOutput(detailedError);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setShowCopySuccess(true);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', p: 2 }}>
      <Stack direction="row" spacing={2} alignItems="center" mb={2}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          JSON 在线解析
        </Typography>
        {error && (
          <Alert severity="error" sx={{ flex: 1 }}>
            {error}
          </Alert>
        )}
      </Stack>

      <Box sx={{ 
        display: 'flex', 
        gap: 2, 
        flex: 1,
        minHeight: 0,
        '& .monaco-editor': {
          paddingTop: '8px'
        }
      }}>
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
            输入 JSON
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
                scrollbar: {
                  vertical: 'visible',
                  horizontal: 'visible'
                }
              }}
            />
          </Box>
        </Paper>

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
            bgcolor: '#2d2d2d',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span>{error ? '错误信息' : '解析结果'}</span>
            {output && (
              <Tooltip title="复制内容" placement="top">
                <IconButton
                  size="small"
                  onClick={handleCopy}
                  sx={{ 
                    color: 'white',
                    '&:hover': { 
                      backgroundColor: 'rgba(255, 255, 255, 0.1)' 
                    } 
                  }}
                >
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Editor
              height="100%"
              defaultLanguage={error ? 'text' : 'json'}
              value={output}
              theme="vs-dark"
              options={{
                readOnly: true,
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                wordWrap: 'on',
                folding: true,
                renderLineHighlight: 'all',
                scrollbar: {
                  vertical: 'visible',
                  horizontal: 'visible'
                }
              }}
            />
          </Box>
        </Paper>
      </Box>

      <Snackbar
        open={showCopySuccess}
        autoHideDuration={2000}
        onClose={() => setShowCopySuccess(false)}
        message="已复制到剪贴板"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
};

export default FormatPage; 