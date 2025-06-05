
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import 'react-quill/dist/quill.snow.css';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const RichTextEditor = ({ content, onChange, placeholder }: RichTextEditorProps) => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const quillRef = useRef<any>(null);
  const ReactQuill = useRef<any>(null);

  useEffect(() => {
    // Dynamically import ReactQuill to avoid SSR issues
    const loadQuill = async () => {
      if (typeof window !== 'undefined') {
        const { default: QuillComponent } = await import('react-quill');
        ReactQuill.current = QuillComponent;
        
        // Force re-render after import
        if (quillRef.current) {
          quillRef.current.forceUpdate();
        }
      }
    };

    loadQuill();
  }, []);

  // Add dynamic styles to document head
  useEffect(() => {
    const styleId = 'quill-rtl-styles';
    let existingStyle = document.getElementById(styleId);
    
    if (!existingStyle) {
      existingStyle = document.createElement('style');
      existingStyle.id = styleId;
      document.head.appendChild(existingStyle);
    }

    existingStyle.textContent = `
      .ql-editor {
        direction: ${isRTL ? 'rtl' : 'ltr'};
        text-align: ${isRTL ? 'right' : 'left'};
        min-height: 200px;
      }
      .ql-editor p {
        direction: ${isRTL ? 'rtl' : 'ltr'};
        text-align: ${isRTL ? 'right' : 'left'};
      }
      .ql-toolbar {
        direction: ${isRTL ? 'rtl' : 'ltr'};
      }
      .ql-container {
        font-family: inherit;
      }
    `;

    return () => {
      if (existingStyle && existingStyle.parentNode) {
        existingStyle.parentNode.removeChild(existingStyle);
      }
    };
  }, [isRTL]);

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'align': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      ['link', 'image'],
      [{ 'color': [] }, { 'background': [] }],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'align',
    'list', 'bullet', 'indent',
    'link', 'image',
    'color', 'background'
  ];

  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (file) {
        try {
          // Convert to base64 for now - in production, you'd upload to Supabase storage
          const reader = new FileReader();
          reader.onload = (e) => {
            const dataURL = e.target?.result as string;
            const quill = quillRef.current?.getEditor();
            if (quill) {
              const range = quill.getSelection();
              quill.insertEmbed(range?.index || 0, 'image', dataURL);
            }
          };
          reader.readAsDataURL(file);
        } catch (error) {
          console.error('Error uploading image:', error);
        }
      }
    };
  };

  if (!ReactQuill.current) {
    return (
      <div className="border border-gray-300 rounded-md p-4 h-64 bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading editor...</div>
      </div>
    );
  }

  return (
    <div className={`${isRTL ? 'rtl' : 'ltr'}`}>
      <ReactQuill.current
        ref={quillRef}
        theme="snow"
        value={content}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        style={{
          direction: isRTL ? 'rtl' : 'ltr',
        }}
      />
    </div>
  );
};

export default RichTextEditor;
