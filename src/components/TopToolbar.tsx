import React from 'react';
import { Play, Save, Download, Upload, Settings, Zap } from 'lucide-react';

function TopToolbar() {
  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">RAG Builder</span>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
          <Upload size={16} />
          <span className="text-sm font-medium">Import</span>
        </button>
        
        <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
          <Download size={16} />
          <span className="text-sm font-medium">Export</span>
        </button>
        
        <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
          <Save size={16} />
          <span className="text-sm font-medium">Save</span>
        </button>

        <div className="h-6 w-px bg-gray-300 mx-2"></div>
        
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm">
          <Play size={16} />
          <span className="text-sm font-medium">Run Workflow</span>
        </button>

        <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
          <Settings size={16} />
        </button>
      </div>
    </div>
  );
}

export default TopToolbar;