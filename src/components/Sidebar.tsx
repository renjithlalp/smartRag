import React from 'react';
import {
  FileText,
  Database,
  Scissors,
  Zap,
  MessageSquare,
  Search,
  Bot,
  Upload,
} from 'lucide-react';

const nodeCategories = [
  {
    title: 'Data Sources',
    items: [
      { type: 'Document Loader', icon: FileText, color: 'bg-blue-100 text-blue-600' },
      { type: 'Database Connector', icon: Database, color: 'bg-green-100 text-green-600' },
      { type: 'File Upload', icon: Upload, color: 'bg-purple-100 text-purple-600' },
    ],
  },
  {
    title: 'Processing',
    items: [
      { type: 'Text Splitter', icon: Scissors, color: 'bg-orange-100 text-orange-600' },
      { type: 'Embeddings', icon: Zap, color: 'bg-yellow-100 text-yellow-600' },
    ],
  },
  {
    title: 'Storage',
    items: [
      { type: 'Vector Store', icon: Database, color: 'bg-indigo-100 text-indigo-600' },
    ],
  },
  {
    title: 'Retrieval',
    items: [
      { type: 'Retriever', icon: Search, color: 'bg-teal-100 text-teal-600' },
    ],
  },
  {
    title: 'Generation',
    items: [
      { type: 'LLM', icon: Bot, color: 'bg-red-100 text-red-600' },
      { type: 'Prompt Template', icon: MessageSquare, color: 'bg-pink-100 text-pink-600' },
    ],
  },
];

function Sidebar() {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 shadow-sm flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-2">RAG Components</h2>
        <p className="text-sm text-gray-600">
          Drag and drop components to build your RAG workflow
        </p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {nodeCategories.map((category) => (
          <div key={category.title}>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
              {category.title}
            </h3>
            <div className="space-y-2">
              {category.items.map((item) => (
                <div
                  key={item.type}
                  draggable
                  onDragStart={(event) => onDragStart(event, item.type)}
                  className="flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-grab active:cursor-grabbing transition-colors group border border-gray-200 hover:border-gray-300"
                >
                  <div className={`p-2 rounded-md mr-3 ${item.color} group-hover:scale-105 transition-transform`}>
                    <item.icon size={20} />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 text-sm">{item.type}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;