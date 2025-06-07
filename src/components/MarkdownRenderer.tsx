
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
    
    // Images - improved regex and styling
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg my-4 shadow-sm" loading="lazy" />');
    
    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary hover:underline" target="_blank" rel="noopener noreferrer">$1</a>');
    
    // Line breaks - handle both \n and <br> tags
    html = html.replace(/\n/g, '<br />');
    
    // Lists - improved list handling
    html = html.replace(/^\- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>');
    html = html.replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal">$1</li>');
    
    // Wrap lists properly
    html = html.replace(/(<li[^>]*>.*?<\/li>)/gs, (match) => {
      return `<ul class="space-y-2 my-4 ml-4">${match}</ul>`;
    });
    
    // Paragraphs - only wrap text that isn't already in HTML tags
    html = html.replace(/^(?!<[h|u|l|i])(.*?)(?:<br \/>)?$/gm, (match, content) => {
      if (content.trim() && !content.match(/^<[a-zA-Z]/)) {
        return `<p class="mb-4">${content}</p>`;
      }
      return match;
    });
    
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
