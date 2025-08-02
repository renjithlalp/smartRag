import React, { useState, useCallback } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import Sidebar from './Sidebar';
import RAGNode from './nodes/RAGNode';
import TopToolbar from './TopToolbar';
import { NodeData } from '../types/nodes';

const nodeTypes = {
  ragNode: RAGNode,
};

const initialNodes: Node<NodeData>[] = [];
const initialEdges: Edge[] = [];

function RAGWorkflowBuilder() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node<NodeData> | null>(null);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = {
        x: event.clientX - 300,
        y: event.clientY - 100,
      };

      const newNode: Node<NodeData> = {
        id: `${type}-${Date.now()}`,
        type: 'ragNode',
        position,
        data: {
          label: type,
          nodeType: type as NodeData['nodeType'],
          config: {},
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node<NodeData>) => {
      setSelectedNode(node);
    },
    []
  );

  const updateNodeConfig = useCallback(
    (nodeId: string, config: Record<string, any>) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === nodeId) {
            return {
              ...node,
              data: {
                ...node.data,
                config: { ...node.data.config, ...config },
              },
            };
          }
          return node;
        })
      );
    },
    [setNodes]
  );

  return (
    <div className="flex h-full bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopToolbar />
        <div className="flex-1">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            fitView
            className="bg-gray-50"
          >
            <Controls className="bg-white border border-gray-200 rounded-lg shadow-sm" />
            <Background color="#e5e7eb" gap={20} />
          </ReactFlow>
        </div>
      </div>
      {selectedNode && (
        <NodeConfigPanel
          node={selectedNode}
          onConfigUpdate={updateNodeConfig}
          onClose={() => setSelectedNode(null)}
        />
      )}
    </div>
  );
}

function NodeConfigPanel({
  node,
  onConfigUpdate,
  onClose,
}: {
  node: Node<NodeData>;
  onConfigUpdate: (nodeId: string, config: Record<string, any>) => void;
  onClose: () => void;
}) {
  const [config, setConfig] = useState(node.data.config || {});

  const handleConfigChange = (key: string, value: any) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    onConfigUpdate(node.id, newConfig);
  };

  const getConfigFields = () => {
    switch (node.data.nodeType) {
      case 'Document Loader':
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Source Type
              </label>
              <select
                value={config.sourceType || 'file'}
                onChange={(e) => handleConfigChange('sourceType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="file">File Upload</option>
                <option value="url">URL</option>
                <option value="database">Database</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                File Path/URL
              </label>
              <input
                type="text"
                value={config.source || ''}
                onChange={(e) => handleConfigChange('source', e.target.value)}
                placeholder="Enter file path or URL"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </>
        );
      case 'Text Splitter':
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chunk Size
              </label>
              <input
                type="number"
                value={config.chunkSize || 1000}
                onChange={(e) => handleConfigChange('chunkSize', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chunk Overlap
              </label>
              <input
                type="number"
                value={config.chunkOverlap || 200}
                onChange={(e) => handleConfigChange('chunkOverlap', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </>
        );
      case 'Vector Store':
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vector Database
              </label>
              <select
                value={config.vectorDB || 'pinecone'}
                onChange={(e) => handleConfigChange('vectorDB', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="pinecone">Pinecone</option>
                <option value="chroma">Chroma</option>
                <option value="faiss">FAISS</option>
                <option value="weaviate">Weaviate</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Index Name
              </label>
              <input
                type="text"
                value={config.indexName || ''}
                onChange={(e) => handleConfigChange('indexName', e.target.value)}
                placeholder="Enter index name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </>
        );
      case 'Embeddings':
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Embedding Model
              </label>
              <select
                value={config.model || 'openai'}
                onChange={(e) => handleConfigChange('model', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="openai">OpenAI</option>
                <option value="huggingface">HuggingFace</option>
                <option value="cohere">Cohere</option>
                <option value="sentence-transformers">Sentence Transformers</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Model Name
              </label>
              <input
                type="text"
                value={config.modelName || 'text-embedding-ada-002'}
                onChange={(e) => handleConfigChange('modelName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </>
        );
      case 'LLM':
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                LLM Provider
              </label>
              <select
                value={config.provider || 'openai'}
                onChange={(e) => handleConfigChange('provider', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="openai">OpenAI</option>
                <option value="anthropic">Anthropic</option>
                <option value="huggingface">HuggingFace</option>
                <option value="cohere">Cohere</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Model
              </label>
              <input
                type="text"
                value={config.model || 'gpt-3.5-turbo'}
                onChange={(e) => handleConfigChange('model', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Temperature
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={config.temperature || 0.7}
                onChange={(e) => handleConfigChange('temperature', parseFloat(e.target.value))}
                className="w-full"
              />
              <span className="text-sm text-gray-500">{config.temperature || 0.7}</span>
            </div>
          </>
        );
      case 'Retriever':
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Type
              </label>
              <select
                value={config.searchType || 'similarity'}
                onChange={(e) => handleConfigChange('searchType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="similarity">Similarity</option>
                <option value="mmr">MMR</option>
                <option value="similarity_score_threshold">Similarity Score Threshold</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Top K Results
              </label>
              <input
                type="number"
                value={config.topK || 5}
                onChange={(e) => handleConfigChange('topK', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </>
        );
      default:
        return (
          <div className="text-sm text-gray-500">
            No configuration options available for this node type.
          </div>
        );
    }
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 shadow-lg">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">{node.data.label}</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          ×
        </button>
      </div>
      <div className="p-4">
        {getConfigFields()}
      </div>
    </div>
  );
}

export default function RAGWorkflowBuilderWrapper() {
  return (
    <ReactFlowProvider>
      <RAGWorkflowBuilder />
    </ReactFlowProvider>
  );
}