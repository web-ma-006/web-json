import React, { useState } from 'react';
import { Box, Paper, Typography, Button, Alert, Stack, Select, MenuItem, FormControl, InputLabel, IconButton, Tooltip, Snackbar } from '@mui/material';
import { ContentCopy as CopyIcon } from '@mui/icons-material';
import Editor from '@monaco-editor/react';

type Language = 'java' | 'csharp' | 'typescript' | 'python' | 'go' | 'kotlin';

const languageOptions: { value: Language; label: string }[] = [
  { value: 'java', label: 'Java' },
  { value: 'csharp', label: 'C#' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'go', label: 'Go' },
  { value: 'kotlin', label: 'Kotlin' }
];

const EntityPage: React.FC = () => {
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('java');
  const [entityCode, setEntityCode] = useState<string>('');
  const [showCopySuccess, setShowCopySuccess] = useState(false);

  const handleInputChange = (value: string | undefined) => {
    setInput(value || '');
    setError(null);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(entityCode);
      setShowCopySuccess(true);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const generateTypeScriptInterface = (data: any, className: string = 'Root'): string => {
    const lines: string[] = [`interface ${className} {`];
    
    Object.entries(data).forEach(([key, value]) => {
      let type = 'any';
      if (typeof value === 'string') type = 'string';
      else if (typeof value === 'number') type = 'number';
      else if (typeof value === 'boolean') type = 'boolean';
      else if (Array.isArray(value)) {
        if (value.length > 0 && typeof value[0] === 'object') {
          const itemClassName = `${className}${key.charAt(0).toUpperCase() + key.slice(1)}Item`;
          lines.push(generateTypeScriptInterface(value[0], itemClassName));
          type = `${itemClassName}[]`;
        } else {
          type = `${typeof value[0]}[]`;
        }
      }
      else if (typeof value === 'object' && value !== null) {
        const nestedClassName = `${className}${key.charAt(0).toUpperCase() + key.slice(1)}`;
        lines.push(generateTypeScriptInterface(value, nestedClassName));
        type = nestedClassName;
      }
      
      lines.push(`  ${key}: ${type};`);
    });
    
    lines.push('}');
    return lines.join('\n');
  };

  const generateJavaClass = (data: any, className: string = 'Root'): string => {
    const lines: string[] = [
      'import java.util.List;',
      'import java.util.Date;',
      '',
      `public class ${className} {`
    ];
    
    Object.entries(data).forEach(([key, value]) => {
      let type = 'Object';
      if (typeof value === 'string') type = 'String';
      else if (typeof value === 'number') type = value % 1 === 0 ? 'Integer' : 'Double';
      else if (typeof value === 'boolean') type = 'Boolean';
      else if (Array.isArray(value)) {
        if (value.length > 0 && typeof value[0] === 'object') {
          const itemClassName = `${className}${key.charAt(0).toUpperCase() + key.slice(1)}Item`;
          lines.push(generateJavaClass(value[0], itemClassName));
          type = `List<${itemClassName}>`;
        } else {
          type = `List<${typeof value[0] === 'string' ? 'String' : 'Object'}>`;
        }
      }
      else if (typeof value === 'object' && value !== null) {
        const nestedClassName = `${className}${key.charAt(0).toUpperCase() + key.slice(1)}`;
        lines.push(generateJavaClass(value, nestedClassName));
        type = nestedClassName;
      }
      
      lines.push(`  private ${type} ${key};`);
      // Generate getter and setter
      lines.push(`  public ${type} get${key.charAt(0).toUpperCase() + key.slice(1)}() { return ${key}; }`);
      lines.push(`  public void set${key.charAt(0).toUpperCase() + key.slice(1)}(${type} ${key}) { this.${key} = ${key}; }`);
    });
    
    lines.push('}');
    return lines.join('\n');
  };

  const generateCSharpClass = (data: any, className: string = 'Root'): string => {
    const lines: string[] = [
      'using System;',
      'using System.Collections.Generic;',
      '',
      `public class ${className}`,
      '{'
    ];
    
    Object.entries(data).forEach(([key, value]) => {
      let type = 'object';
      if (typeof value === 'string') type = 'string';
      else if (typeof value === 'number') type = value % 1 === 0 ? 'int' : 'double';
      else if (typeof value === 'boolean') type = 'bool';
      else if (Array.isArray(value)) {
        if (value.length > 0 && typeof value[0] === 'object') {
          const itemClassName = `${className}${key.charAt(0).toUpperCase() + key.slice(1)}Item`;
          lines.push(generateCSharpClass(value[0], itemClassName));
          type = `List<${itemClassName}>`;
        } else {
          type = `List<${typeof value[0] === 'string' ? 'string' : 'object'}>`;
        }
      }
      else if (typeof value === 'object' && value !== null) {
        const nestedClassName = `${className}${key.charAt(0).toUpperCase() + key.slice(1)}`;
        lines.push(generateCSharpClass(value, nestedClassName));
        type = nestedClassName;
      }
      
      lines.push(`    public ${type} ${key.charAt(0).toUpperCase() + key.slice(1)} { get; set; }`);
    });
    
    lines.push('}');
    return lines.join('\n');
  };

  const generatePythonClass = (data: any, className: string = 'Root'): string => {
    const lines: string[] = [
      'from typing import List, Optional, Any',
      'from dataclasses import dataclass',
      '',
      '@dataclass',
      `class ${className}:`
    ];
    
    Object.entries(data).forEach(([key, value]) => {
      let type = 'Any';
      if (typeof value === 'string') type = 'str';
      else if (typeof value === 'number') type = value % 1 === 0 ? 'int' : 'float';
      else if (typeof value === 'boolean') type = 'bool';
      else if (Array.isArray(value)) {
        if (value.length > 0 && typeof value[0] === 'object') {
          const itemClassName = `${className}${key.charAt(0).toUpperCase() + key.slice(1)}Item`;
          lines.push('');
          lines.push(...generatePythonClass(value[0], itemClassName).split('\n'));
          type = `List[${itemClassName}]`;
        } else {
          type = `List[${typeof value[0] === 'string' ? 'str' : 'Any'}]`;
        }
      }
      else if (typeof value === 'object' && value !== null) {
        const nestedClassName = `${className}${key.charAt(0).toUpperCase() + key.slice(1)}`;
        lines.push('');
        lines.push(...generatePythonClass(value, nestedClassName).split('\n'));
        type = nestedClassName;
      }
      
      lines.push(`    ${key}: ${type}`);
    });
    
    return lines.join('\n');
  };

  const generateGoStruct = (data: any, className: string = 'Root'): string => {
    const lines: string[] = ['package main', ''];
    
    Object.entries(data).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        if (Array.isArray(value)) {
          if (value.length > 0 && typeof value[0] === 'object') {
            const itemClassName = `${className}${key.charAt(0).toUpperCase() + key.slice(1)}Item`;
            lines.push(generateGoStruct(value[0], itemClassName));
          }
        } else {
          const nestedClassName = `${className}${key.charAt(0).toUpperCase() + key.slice(1)}`;
          lines.push(generateGoStruct(value, nestedClassName));
        }
      }
    });
    
    lines.push(`type ${className} struct {`);
    Object.entries(data).forEach(([key, value]) => {
      let type = 'interface{}';
      if (typeof value === 'string') type = 'string';
      else if (typeof value === 'number') type = value % 1 === 0 ? 'int' : 'float64';
      else if (typeof value === 'boolean') type = 'bool';
      else if (Array.isArray(value)) {
        if (value.length > 0 && typeof value[0] === 'object') {
          const itemClassName = `${className}${key.charAt(0).toUpperCase() + key.slice(1)}Item`;
          type = `[]${itemClassName}`;
        } else {
          type = `[]${typeof value[0] === 'string' ? 'string' : 'interface{}'}`;
        }
      }
      else if (typeof value === 'object' && value !== null) {
        const nestedClassName = `${className}${key.charAt(0).toUpperCase() + key.slice(1)}`;
        type = `*${nestedClassName}`;
      }
      
      const jsonTag = `\`json:"${key}"\``;
      lines.push(`    ${key.charAt(0).toUpperCase() + key.slice(1)} ${type} ${jsonTag}`);
    });
    lines.push('}');
    lines.push('');
    return lines.join('\n');
  };

  const generateKotlinClass = (data: any, className: string = 'Root'): string => {
    const lines: string[] = [''];
    
    Object.entries(data).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        if (Array.isArray(value)) {
          if (value.length > 0 && typeof value[0] === 'object') {
            const itemClassName = `${className}${key.charAt(0).toUpperCase() + key.slice(1)}Item`;
            lines.push(generateKotlinClass(value[0], itemClassName));
          }
        } else {
          const nestedClassName = `${className}${key.charAt(0).toUpperCase() + key.slice(1)}`;
          lines.push(generateKotlinClass(value, nestedClassName));
        }
      }
    });
    
    lines.push(`data class ${className}(`);
    const properties = Object.entries(data).map(([key, value]) => {
      let type = 'Any';
      if (typeof value === 'string') type = 'String';
      else if (typeof value === 'number') type = value % 1 === 0 ? 'Int' : 'Double';
      else if (typeof value === 'boolean') type = 'Boolean';
      else if (Array.isArray(value)) {
        if (value.length > 0 && typeof value[0] === 'object') {
          const itemClassName = `${className}${key.charAt(0).toUpperCase() + key.slice(1)}Item`;
          type = `List<${itemClassName}>`;
        } else {
          type = `List<${typeof value[0] === 'string' ? 'String' : 'Any'}>`;
        }
      }
      else if (typeof value === 'object' && value !== null) {
        const nestedClassName = `${className}${key.charAt(0).toUpperCase() + key.slice(1)}`;
        type = nestedClassName;
      }
      
      return `    val ${key}: ${type}`;
    });
    lines.push(properties.join(',\n'));
    lines.push(')');
    lines.push('');
    return lines.join('\n');
  };

  const generateEntityCode = (data: any, language: Language): string => {
    switch (language) {
      case 'typescript':
        return generateTypeScriptInterface(data);
      case 'java':
        return generateJavaClass(data);
      case 'csharp':
        return generateCSharpClass(data);
      case 'python':
        return generatePythonClass(data);
      case 'go':
        return generateGoStruct(data);
      case 'kotlin':
        return generateKotlinClass(data);
      default:
        return '// 该语言的转换功能正在开发中...';
    }
  };

  const handleGenerate = () => {
    try {
      if (!input.trim()) {
        setError('请输入 JSON 数据');
        setEntityCode('');
        return;
      }
      const data = JSON.parse(input);
      setEntityCode(generateEntityCode(data, selectedLanguage));
      setError(null);
    } catch (err) {
      console.error('Error generating entity:', err);
      setError(err instanceof Error ? err.message : 'Invalid JSON');
      setEntityCode('');
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', p: 2 }}>
      <Stack direction="row" spacing={2} alignItems="center" mb={2}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          JSON 转实体类
        </Typography>
        {error && (
          <Alert severity="error" sx={{ flex: 1 }}>
            {error}
          </Alert>
        )}
      </Stack>

      <Paper sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel id="language-select-label">选择目标语言</InputLabel>
            <Select
              labelId="language-select-label"
              value={selectedLanguage}
              label="选择目标语言"
              onChange={(e) => setSelectedLanguage(e.target.value as Language)}
            >
              {languageOptions.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained" onClick={handleGenerate}>
            生成实体类
          </Button>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, flex: 1, minHeight: 0 }}>
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
              <span>实体类代码</span>
              {entityCode && (
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
                    <CopyIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
            <Box sx={{ flex: 1 }}>
              <Editor
                height="100%"
                defaultLanguage={selectedLanguage}
                value={entityCode}
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

export default EntityPage; 