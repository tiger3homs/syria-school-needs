
import React from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ 
  content, 
  className = "" 
}) => {
  // Simple markdown parser for basic formatting
  const parseMarkdown = (text: string): string => {
    let html = text;
    
    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold mb-4 mt-6">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mb-4 mt-8">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-6 mt-8">$1</h1>');
    
    // Bold and Italic
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
    
    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary hover:underline" target="_blank" rel="noopener noreferrer">$1</a>');
    
    // Images
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg my-4" />');
    
    // Line breaks
    html = html.replace(/\n/g, '<br />');
    
    // Lists
    html = html.replace(/^\- (.+)$/gm, '<li class="ml-4">• $1</li>');
    html = html.replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal">$1</li>');
    
    // Wrap lists
    html = html.replace(/(<li[^>]*>.*<\/li>)/gms, '<ul class="space-y-2 my-4">$1</ul>');
    
    // Paragraphs
    html = html.replace(/^(?!<[h|u|l])(.*?)$/gm, '<p class="mb-4">$1</p>');
    
    return html;
  };

  return (
    <div 
      className={`prose prose-sm max-w-none ${className}`}
      dangerouslySetInnerHTML={{ 
        __html: parseMarkdown(content) 
      }}
    />
  );
};
