import React, { useState } from 'react';
import { Box, Paper, Button, Typography, Alert, ToggleButtonGroup, ToggleButton } from '@mui/material';
import Editor from '@monaco-editor/react';
import { xml2json, json2xml } from 'xml-js';

const XmlPage: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'xml2json' | 'json2xml'>('xml2json');

  const handleConvert = () => {
    try {
      if (mode === 'xml2json') {
        const result = xml2json(input, { compact: true, spaces: 2 });
        setOutput(result);
      } else {
        // 确保输入是有效的 JSON
        const jsonObj = JSON.parse(input);
        const result = json2xml(jsonObj, { compact: true, spaces: 2 });
        setOutput(result);
      }
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Conversion failed');
      setOutput('');
    }
  };

  const handleModeChange = (
    event: React.MouseEvent<HTMLElement>,
    newMode: 'xml2json' | 'json2xml' | null,
  ) => {
    if (newMode !== null) {
      setMode(newMode);
      setInput('');
      setOutput('');
      setError(null);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h5" gutterBottom>
        XML-JSON 转换
      </Typography>
      
      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <ToggleButtonGroup
              value={mode}
              exclusive
              onChange={handleModeChange}
              aria-label="conversion mode"
            >
              <ToggleButton value="xml2json" aria-label="XML to JSON">
                XML 转 JSON
              </ToggleButton>
              <ToggleButton value="json2xml" aria-label="JSON to XML">
                JSON 转 XML
              </ToggleButton>
            </ToggleButtonGroup>

            <Button
              variant="contained"
              onClick={handleConvert}
              disabled={!input}
            >
              转换
            </Button>
          </Box>
          
          {error && (
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}
          
          <Box sx={{ display: 'flex', gap: 2, height: '500px' }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                {mode === 'xml2json' ? '输入 XML' : '输入 JSON'}
              </Typography>
              <Editor
                height="100%"
                defaultLanguage={mode === 'xml2json' ? 'xml' : 'json'}
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
              <Typography variant="subtitle2" gutterBottom>
                {mode === 'xml2json' ? '转换后的 JSON' : '转换后的 XML'}
              </Typography>
              <Editor
                height="100%"
                defaultLanguage={mode === 'xml2json' ? 'json' : 'xml'}
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
    </Box>
  );
};

export default XmlPage; 