import React, { useState, useRef } from 'react';
import { Box, Paper, Button, Typography, Alert, ToggleButtonGroup, ToggleButton } from '@mui/material';
import Editor from '@monaco-editor/react';
import * as XLSX from 'xlsx';

const ExcelPage: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'excel2json' | 'json2excel'>('excel2json');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet);
        setInput(JSON.stringify(jsonData, null, 2));
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to read Excel file');
        setInput('');
      }
    };
    reader.onerror = () => {
      setError('Failed to read file');
      setInput('');
    };
    reader.readAsArrayBuffer(file);
  };

  const handleConvert = () => {
    try {
      if (mode === 'excel2json') {
        // Excel 已经在文件上传时转换为 JSON
        setOutput(input);
      } else {
        // JSON 转 Excel
        let data: any[];
        try {
          data = JSON.parse(input);
          if (!Array.isArray(data)) {
            data = [data];
          }
        } catch {
          throw new Error('Invalid JSON input');
        }

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        
        // 生成并下载 Excel 文件
        XLSX.writeFile(wb, 'output.xlsx');
        setOutput('Excel file has been generated and downloaded.');
      }
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Conversion failed');
      setOutput('');
    }
  };

  const handleModeChange = (
    event: React.MouseEvent<HTMLElement>,
    newMode: 'excel2json' | 'json2excel' | null,
  ) => {
    if (newMode !== null) {
      setMode(newMode);
      setInput('');
      setOutput('');
      setError(null);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h5" gutterBottom>
        Excel-JSON 转换
      </Typography>
      
      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <ToggleButtonGroup
              value={mode}
              exclusive
              onChange={handleModeChange}
              aria-label="operation mode"
            >
              <ToggleButton value="excel2json" aria-label="Excel to JSON">
                Excel 转 JSON
              </ToggleButton>
              <ToggleButton value="json2excel" aria-label="JSON to Excel">
                JSON 转 Excel
              </ToggleButton>
            </ToggleButtonGroup>

            {mode === 'excel2json' && (
              <>
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  style={{ display: 'none' }}
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
                <Button
                  variant="contained"
                  onClick={handleUploadClick}
                >
                  上传 Excel
                </Button>
              </>
            )}

            {mode === 'json2excel' && (
              <Button
                variant="contained"
                onClick={handleConvert}
                disabled={!input}
              >
                生成 Excel
              </Button>
            )}
          </Box>
          
          {error && (
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}
          
          <Box sx={{ display: 'flex', gap: 2, height: '500px' }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                {mode === 'excel2json' ? 'Excel 内容' : '输入 JSON'}
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
              <Typography variant="subtitle2" gutterBottom>
                {mode === 'excel2json' ? '生成的 JSON' : '转换结果'}
              </Typography>
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
    </Box>
  );
};

export default ExcelPage; 