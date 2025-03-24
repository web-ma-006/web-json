import React, { useState } from 'react';
import { Box, Paper, Button, Typography, Alert, ToggleButton, ToggleButtonGroup, IconButton, Tooltip, Snackbar } from '@mui/material';
import Editor from '@monaco-editor/react';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const CompressPage: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'compress' | 'escape'>('compress');
  const [showCopySuccess, setShowCopySuccess] = useState(false);

  const handleCompress = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON');
      setOutput('');
    }
  };

  const handleEscape = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(JSON.stringify(parsed)));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON');
      setOutput('');
    }
  };

  const handleUnescape = () => {
    try {
      const unescaped = JSON.parse(input);
      setOutput(JSON.stringify(unescaped, null, 2));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid escaped JSON');
      setOutput('');
    }
  };

  const handleModeChange = (
    event: React.MouseEvent<HTMLElement>,
    newMode: 'compress' | 'escape' | null,
  ) => {
    if (newMode !== null) {
      setMode(newMode);
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
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h5" gutterBottom>
        JSON 压缩转义
      </Typography>
      
      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <ToggleButtonGroup
            value={mode}
            exclusive
            onChange={handleModeChange}
            aria-label="text alignment"
          >
            <ToggleButton value="compress" aria-label="compress">
              压缩
            </ToggleButton>
            <ToggleButton value="escape" aria-label="escape">
              转义
            </ToggleButton>
          </ToggleButtonGroup>

          <Box sx={{ display: 'flex', gap: 2 }}>
            {mode === 'compress' ? (
              <Button variant="contained" onClick={handleCompress}>
                压缩
              </Button>
            ) : (
              <>
                <Button variant="contained" onClick={handleEscape}>
                  转义
                </Button>
                <Button variant="contained" onClick={handleUnescape}>
                  解转义
                </Button>
              </>
            )}
          </Box>
          
          {error && (
            <Alert severity="error">
              {error}
            </Alert>
          )}
          
          <Box sx={{ display: 'flex', gap: 2, height: '500px' }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                输入 JSON
              </Typography>
              <Editor
                height="100%"
                defaultLanguage="json"
                value={input}
                onChange={(value) => setInput(value || '')}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  wordWrap: 'on',
                }}
              />
            </Box>
            
            <Box sx={{ flex: 1 }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                mb: 1
              }}>
                <Typography variant="subtitle2">
                  输出结果
                </Typography>
                {output && (
                  <Tooltip title="复制内容" placement="top">
                    <IconButton
                      size="small"
                      onClick={handleCopy}
                      sx={{ 
                        color: 'primary.main',
                        '&:hover': { 
                          backgroundColor: 'rgba(25, 118, 210, 0.04)' 
                        } 
                      }}
                    >
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
              <Editor
                height="100%"
                defaultLanguage="json"
                value={output}
                theme="vs-dark"
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  fontSize: 14,
                  wordWrap: 'on',
                }}
              />
            </Box>
          </Box>
        </Box>
      </Paper>

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

export default CompressPage; 