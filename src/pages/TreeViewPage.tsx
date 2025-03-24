import React, { useState } from 'react';
import { Box, Paper, Typography, Button, Alert, Stack, IconButton } from '@mui/material';
import { ExpandMore, ChevronRight } from '@mui/icons-material';
import Editor from '@monaco-editor/react';

interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
  expanded?: boolean;
}

const TreeViewPage: React.FC = () => {
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [treeData, setTreeData] = useState<TreeNode | null>(null);

  const convertJsonToTree = (json: any, parentId: string = '0'): TreeNode => {
    if (Array.isArray(json)) {
      return {
        id: parentId,
        label: 'Array',
        children: json.map((item, index) => convertJsonToTree(item, `${parentId}-${index}`)),
        expanded: parentId === '0'
      };
    } else if (typeof json === 'object' && json !== null) {
      return {
        id: parentId,
        label: 'Object',
        children: Object.entries(json).map(([key, value], index) => ({
          id: `${parentId}-${index}`,
          label: key,
          children: typeof value === 'object' && value !== null ? [convertJsonToTree(value, `${parentId}-${index}-0`)] : undefined,
          expanded: parentId === '0'
        })),
        expanded: parentId === '0'
      };
    } else {
      return {
        id: parentId,
        label: String(json)
      };
    }
  };

  const handleUpdate = () => {
    try {
      const jsonData = JSON.parse(input);
      const tree = convertJsonToTree(jsonData);
      setTreeData(tree);
      setError(null);
    } catch (err) {
      setError('Invalid JSON format');
      setTreeData(null);
    }
  };

  const toggleNode = (node: TreeNode) => {
    node.expanded = !node.expanded;
    setTreeData({ ...treeData! });
  };

  const renderTreeNode = (node: TreeNode, level: number = 0) => {
    return (
      <Box key={node.id} sx={{ ml: level * 2 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          {node.children && (
            <IconButton size="small" onClick={() => toggleNode(node)}>
              {node.expanded ? <ExpandMore /> : <ChevronRight />}
            </IconButton>
          )}
          <Typography>{node.label}</Typography>
        </Stack>
        {node.children && node.expanded && (
          <Box>
            {node.children.map(child => renderTreeNode(child, level + 1))}
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        JSON 树形视图
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
        <Button 
          variant="contained" 
          onClick={handleUpdate}
          size="large"
        >
          更新树形结构
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
                wordWrap: 'on',
                folding: true
              }}
            />
          </Box>
        </Paper>

        <Paper sx={{ flex: 1, p: 2, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle1">
              树形结构
            </Typography>
          </Box>
          <Box sx={{ 
            flex: 1, 
            border: '1px solid #ccc', 
            borderRadius: 1, 
            overflow: 'auto',
            bgcolor: 'background.paper',
            p: 2
          }}>
            {treeData && renderTreeNode(treeData)}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default TreeViewPage; 