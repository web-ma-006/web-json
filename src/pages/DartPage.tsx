import React, { useState } from 'react';
import { Box, Paper, Typography, Button, Alert, Stack } from '@mui/material';
import Editor from '@monaco-editor/react';

const DartPage: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const convertToDartClass = (className: string, json: any): string => {
    const getType = (value: any): string => {
      if (value === null) return 'dynamic';
      if (Array.isArray(value)) {
        if (value.length === 0) return 'List<dynamic>';
        const itemType = getType(value[0]);
        return `List<${itemType}>`;
      }
      if (typeof value === 'object') return className + pascalCase(Object.keys(value)[0]);
      if (typeof value === 'string') return 'String';
      if (typeof value === 'number') {
        return Number.isInteger(value) ? 'int' : 'double';
      }
      if (typeof value === 'boolean') return 'bool';
      return 'dynamic';
    };

    const pascalCase = (str: string): string => {
      return str.split(/[_\s]/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join('');
    };

    const camelCase = (str: string): string => {
      const pascal = pascalCase(str);
      return pascal.charAt(0).toLowerCase() + pascal.slice(1);
    };

    const generateClass = (name: string, obj: any): string => {
      let result = `class ${pascalCase(name)} {\n`;
      
      // Fields
      Object.entries(obj).forEach(([key, value]) => {
        const fieldType = getType(value);
        result += `  final ${fieldType} ${camelCase(key)};\n`;
      });
      
      result += '\n';
      
      // Constructor
      result += `  ${pascalCase(name)}({\n`;
      Object.keys(obj).forEach(key => {
        result += `    required this.${camelCase(key)},\n`;
      });
      result += '  });\n\n';
      
      // fromJson factory
      result += `  factory ${pascalCase(name)}.fromJson(Map<String, dynamic> json) => ${pascalCase(name)}(\n`;
      Object.entries(obj).forEach(([key, value]) => {
        const fieldName = camelCase(key);
        if (Array.isArray(value)) {
          if (typeof value[0] === 'object') {
            result += `    ${fieldName}: (json['${key}'] as List<dynamic>).map((e) => ${getType(value[0])}.fromJson(e as Map<String, dynamic>)).toList(),\n`;
          } else {
            result += `    ${fieldName}: List<${getType(value[0])}>.from(json['${key}'] as List),\n`;
          }
        } else if (typeof value === 'object' && value !== null) {
          result += `    ${fieldName}: ${getType(value)}.fromJson(json['${key}'] as Map<String, dynamic>),\n`;
        } else {
          result += `    ${fieldName}: json['${key}'] as ${getType(value)},\n`;
        }
      });
      result += '  );\n\n';
      
      // toJson method
      result += '  Map<String, dynamic> toJson() => {\n';
      Object.entries(obj).forEach(([key, value]) => {
        const fieldName = camelCase(key);
        if (Array.isArray(value) && typeof value[0] === 'object') {
          result += `    '${key}': ${fieldName}.map((e) => e.toJson()).toList(),\n`;
        } else if (typeof value === 'object' && value !== null) {
          result += `    '${key}': ${fieldName}.toJson(),\n`;
        } else {
          result += `    '${key}': ${fieldName},\n`;
        }
      });
      result += '  };\n';
      result += '}\n';
      
      // Generate nested classes
      Object.entries(obj).forEach(([key, value]) => {
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          result += '\n' + generateClass(name + pascalCase(key), value);
        } else if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
          result += '\n' + generateClass(name + pascalCase(key), value[0]);
        }
      });
      
      return result;
    };

    try {
      return generateClass(className, json);
    } catch (err) {
      throw new Error('Failed to convert to Dart class');
    }
  };

  const handleConvert = () => {
    try {
      if (!input.trim()) {
        setError('请输入 JSON 数据');
        setOutput('');
        return;
      }

      const jsonData = JSON.parse(input);
      const dartCode = convertToDartClass('Root', jsonData);
      setOutput(dartCode);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : '转换失败');
      setOutput('');
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        JSON 转 Dart 类
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
        <Button 
          variant="contained" 
          onClick={handleConvert}
          size="large"
        >
          转换为 Dart 类
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      )}
      
      <Box sx={{ display: 'flex', gap: 2, flex: 1, minHeight: 0 }}>
        <Paper sx={{ flex: 1, p: 2, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle1">
              输入 JSON
            </Typography>
          </Box>
          <Box sx={{ flex: 1, border: '1px solid #ccc', borderRadius: 1 }}>
            <Editor
              height="100%"
              defaultLanguage="json"
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
              Dart 类
            </Typography>
          </Box>
          <Box sx={{ flex: 1, border: '1px solid #ccc', borderRadius: 1 }}>
            <Editor
              height="100%"
              defaultLanguage="dart"
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

export default DartPage; 