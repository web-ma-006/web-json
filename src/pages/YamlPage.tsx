import React, { useState } from 'react';
import { Box, Paper, Button, Typography, Alert, ToggleButtonGroup, ToggleButton } from '@mui/material';
import Editor from '@monaco-editor/react';
import yaml from 'js-yaml';

const YamlPage: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'yaml2json' | 'json2yaml'>('yaml2json');

  const handleConvert = () => {
    try {
      if (mode === 'yaml2json') {
        const jsonObj = yaml.load(input);
        setOutput(JSON.stringify(jsonObj, null, 2));
      } else {
        // 确保输入是有效的 JSON
        const jsonObj = JSON.parse(input);
        const result = yaml.dump(jsonObj, {
          indent: 2,
          lineWidth: -1,
          noRefs: true,
          sortKeys: true
        });
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
    newMode: 'yaml2json' | 'json2yaml' | null,
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
        YAML-JSON 转换
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
              <ToggleButton value="yaml2json" aria-label="YAML to JSON">
                YAML 转 JSON
              </ToggleButton>
              <ToggleButton value="json2yaml" aria-label="JSON to YAML">
                JSON 转 YAML
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
                {mode === 'yaml2json' ? '输入 YAML' : '输入 JSON'}
              </Typography>
              <Editor
                height="100%"
                defaultLanguage={mode === 'yaml2json' ? 'yaml' : 'json'}
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
                {mode === 'yaml2json' ? '转换后的 JSON' : '转换后的 YAML'}
              </Typography>
              <Editor
                height="100%"
                defaultLanguage={mode === 'yaml2json' ? 'json' : 'yaml'}
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

export default YamlPage; 