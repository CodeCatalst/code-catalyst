import React, { useRef, useEffect, useState } from 'react';
import { Bold, Italic, Underline, ListOrdered, List, Link, Image, Code, AlignLeft, AlignCenter, AlignRight, Palette, Type, Undo, Redo, Heading1, Heading2, Quote } from 'lucide-react';

const RichTextEditor = ({ value, onChange }) => {
  const editorRef = useRef(null);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    if (editorRef.current) {
      try {
        const content = value || '';
        if (editorRef.current.innerHTML !== content) {
          editorRef.current.innerHTML = content;
          // only notify parent if there's actual content
          if (content.trim()) {
            handleInput();
          }
        }
      } catch (error) {
        console.error('Error setting editor content:', error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const execCommand = (command, value = null) => {
    try {
      if (command === 'createLink') {
        const url = prompt('Enter URL:', 'http://');
        if (url) document.execCommand(command, false, url);
      } else if (command === 'insertImage') {
        const url = prompt('Enter image URL:', 'http://');
        if (url) document.execCommand(command, false, url);
      } else {
        document.execCommand(command, false, value);
      }
      handleInput(); // update parent after formatting
    } catch (error) {
      console.error('Error executing command:', error);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      const textContent = editorRef.current.textContent || '';

      // Calculate word and character counts
      const words = textContent.trim().split(/\s+/).filter(word => word.length > 0);
      setWordCount(words.length);
      setCharCount(textContent.length);

      onChange(content);
    }
  };

  const ToolbarButton = ({ icon: Icon, command, title, value }) => (
    <button
      type="button"
      onClick={() => execCommand(command, value)}
      className="p-2 text-gray-700 hover:bg-gray-200 rounded transition-colors"
      title={title}
    >
      <Icon size={18} />
    </button>
  );

  const FontSizeSelect = () => (
    <select
      onChange={(e) => execCommand('fontSize', e.target.value)}
      className="px-2 py-1 text-sm border border-gray-300 rounded bg-white text-gray-700"
      title="Font Size"
    >
      <option value="">Size</option>
      <option value="1">Small</option>
      <option value="3">Normal</option>
      <option value="5">Large</option>
      <option value="7">Extra Large</option>
    </select>
  );

  const ColorPicker = () => (
    <div className="flex items-center gap-1">
      <input
        type="color"
        onChange={(e) => execCommand('foreColor', e.target.value)}
        className="w-6 h-6 border border-gray-300 rounded cursor-pointer"
        title="Text Color"
        defaultValue="#000000"
      />
      <input
        type="color"
        onChange={(e) => execCommand('backColor', e.target.value)}
        className="w-6 h-6 border border-gray-300 rounded cursor-pointer bg-gray-200"
        title="Background Color"
        defaultValue="#ffffff"
      />
    </div>
  );

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm">
      <style dangerouslySetInnerHTML={{
        __html: `
          .rich-text-editor-content {
            color: #111827 !important;
          }
          .rich-text-editor-content * {
            color: #111827 !important;
          }
          .rich-text-editor-content p,
          .rich-text-editor-content h1,
          .rich-text-editor-content h2,
          .rich-text-editor-content h3,
          .rich-text-editor-content h4,
          .rich-text-editor-content h5,
          .rich-text-editor-content h6,
          .rich-text-editor-content span,
          .rich-text-editor-content div,
          .rich-text-editor-content strong,
          .rich-text-editor-content b,
          .rich-text-editor-content em,
          .rich-text-editor-content i,
          .rich-text-editor-content u,
          .rich-text-editor-content blockquote {
            color: #111827 !important;
          }
        `
      }} />
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-3 border-b border-gray-300 bg-gradient-to-r from-gray-50 to-gray-100">
        {/* Text Formatting */}
        <div className="flex items-center gap-1">
          <ToolbarButton icon={Undo} command="undo" title="Undo" />
          <ToolbarButton icon={Redo} command="redo" title="Redo" />
          <div className="w-px h-6 bg-gray-300 mx-1" />
        </div>

        {/* Headings */}
        <div className="flex items-center gap-1">
          <ToolbarButton icon={Heading1} command="formatBlock" value="h1" title="Heading 1" />
          <ToolbarButton icon={Heading2} command="formatBlock" value="h2" title="Heading 2" />
          <div className="w-px h-6 bg-gray-300 mx-1" />
        </div>

        {/* Text Formatting */}
        <div className="flex items-center gap-1">
          <FontSizeSelect />
          <ColorPicker />
          <ToolbarButton icon={Bold} command="bold" title="Bold" />
          <ToolbarButton icon={Italic} command="italic" title="Italic" />
          <ToolbarButton icon={Underline} command="underline" title="Underline" />
          <div className="w-px h-6 bg-gray-300 mx-1" />
        </div>

        {/* Alignment */}
        <div className="flex items-center gap-1">
          <ToolbarButton icon={AlignLeft} command="justifyLeft" title="Align Left" />
          <ToolbarButton icon={AlignCenter} command="justifyCenter" title="Align Center" />
          <ToolbarButton icon={AlignRight} command="justifyRight" title="Align Right" />
          <div className="w-px h-6 bg-gray-300 mx-1" />
        </div>

        {/* Lists */}
        <div className="flex items-center gap-1">
          <ToolbarButton icon={ListOrdered} command="insertOrderedList" title="Numbered List" />
          <ToolbarButton icon={List} command="insertUnorderedList" title="Bullet List" />
          <ToolbarButton icon={Quote} command="formatBlock" value="blockquote" title="Quote" />
          <div className="w-px h-6 bg-gray-300 mx-1" />
        </div>

        {/* Media & Links */}
        <div className="flex items-center gap-1">
          <ToolbarButton icon={Link} command="createLink" title="Insert Link" />
          <ToolbarButton icon={Image} command="insertImage" title="Insert Image" />
          <ToolbarButton icon={Code} command="formatBlock" value="pre" title="Code Block" />
        </div>
      </div>

      {/* Editor Area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onBlur={handleInput}
        onKeyUp={handleInput}
        className="rich-text-editor-content min-h-[350px] p-4 prose prose-sm max-w-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset bg-white text-gray-900"
        style={{
          fontFamily: 'inherit',
          lineHeight: '1.6',
          color: '#111827' // Explicit dark text color
        }}
        onFocus={(e) => {
          // Ensure text color on focus
          e.target.style.color = '#111827';
        }}
        suppressContentEditableWarning={true}
        tabIndex={0}
        data-placeholder="Start writing your content here..."
      />

      {/* Status Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-100 border-t border-gray-300 text-sm text-gray-600">
        <div className="flex items-center space-x-4">
          <span className="font-medium">{wordCount} words</span>
          <span className="font-medium">{charCount} characters</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500 mr-2">Tip: Use Ctrl+B for bold, Ctrl+I for italic</span>
          <button
            type="button"
            onClick={() => {
              if (editorRef.current) {
                editorRef.current.innerHTML = '';
                handleInput();
              }
            }}
            className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors font-medium"
            title="Clear all content"
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
};

export default RichTextEditor;
