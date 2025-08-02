export interface NodeData {
  label: string;
  nodeType: 'Document Loader' | 'Database Connector' | 'File Upload' | 'Text Splitter' | 'Embeddings' | 'Vector Store' | 'Retriever' | 'LLM' | 'Prompt Template';
  config: Record<string, any>;
}