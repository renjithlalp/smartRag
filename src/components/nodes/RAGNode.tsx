import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import {
  FileText,
  Database,
  Scissors,
  Zap,
  MessageSquare,
  Search,
  Bot,
  Upload,
  Settings,
} from 'lucide-react';
import { NodeData } from '../../types/nodes';

const iconMap = {
  'Document Loader': FileText,
  'Database Connector': Database,
  'File Upload': Upload,
  'Text Splitter': Scissors,
  'Embeddings': Zap,
  'Vector Store': Database,
  'Retriever': Search,
  'LLM': Bot,
  'Prompt Template': MessageSquare,
};

const colorMap = {
  'Document Loader': 'from-blue-400 to-blue-600',
  'Database Connector': 'from-green-400 to-green-600',
  'File Upload': 'from-purple-400 to-purple-600',
  'Text Splitter': 'from-orange-400 to-orange-600',
  'Embeddings': 'from-yellow-400 to-yellow-600',
  'Vector Store': 'from-indigo-400 to-indigo-600',
  'Retriever': 'from-teal-400 to-teal-600',
  'LLM': 'from-red-400 to-red-600',
  'Prompt Template': 'from-pink-400 to-pink-600',
};

function RAGNode({ data, selected }: NodeProps<NodeData>) {
  const Icon = iconMap[data.nodeType] || FileText;
  const gradient = colorMap[data.nodeType] || 'from-gray-400 to-gray-600';

  const shouldShowInputHandle = data.nodeType !== 'Document Loader' && data.nodeType !== 'File Upload';
  const shouldShowOutputHandle = data.nodeType !== 'LLM';

  return (
    <div
      className={`bg-white rounded-xl shadow-lg border-2 transition-all duration-200 min-w-[200px] ${
        selected ? 'border-blue-500 shadow-xl' : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      {shouldShowInputHandle && (
        <Handle
          type="target"
          position={Position.Left}
          className="w-3 h-3 bg-gray-400 border-2 border-white"
        />
      )}
      
      <div className={`bg-gradient-to-r ${gradient} p-4 rounded-t-xl`}>
        <div className="flex items-center space-x-3">
          <div className="bg-white bg-opacity-20 p-2 rounded-lg">
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm">{data.label}</h3>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="space-y-2">
          {Object.keys(data.config || {}).length > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Configured</span>
              <Settings className="w-3 h-3 text-green-500" />
            </div>
          )}
          
          {data.nodeType === 'Vector Store' && (
            <div className="text-xs text-gray-600">
              DB: {data.config?.vectorDB || 'Not set'}
            </div>
          )}
          
          {data.nodeType === 'LLM' && (
            <div className="text-xs text-gray-600">
              Model: {data.config?.model || 'Not set'}
            </div>
          )}
          
          {data.nodeType === 'Text Splitter' && (
            <div className="text-xs text-gray-600">
              Size: {data.config?.chunkSize || 1000}
            </div>
          )}
          
          {data.nodeType === 'Retriever' && (
            <div className="text-xs text-gray-600">
              Top K: {data.config?.topK || 5}
            </div>
          )}
        </div>
      </div>

      {shouldShowOutputHandle && (
        <Handle
          type="source"
          position={Position.Right}
          className="w-3 h-3 bg-gray-400 border-2 border-white"
        />
      )}
    </div>
  );
}

export default RAGNode;