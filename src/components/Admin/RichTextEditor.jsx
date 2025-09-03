import React, { useRef, useEffect } from 'react';
import { Bold, Italic, Underline, ListOrdered, List, Link, Image, Code } from 'lucide-react';

const RichTextEditor = ({ value, onChange }) => {
  const editorRef = useRef(null);

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
      onChange(content);
    }
  };

  const ToolbarButton = ({ icon: Icon, command, title, value }) => (
    <button
      type="button"
      onClick={() => execCommand(command, value)}
      className="p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
      title={title}
    >
      <Icon size={18} />
    </button>
  );

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b border-gray-300 bg-gray-50">
        <ToolbarButton icon={Bold} command="bold" title="Bold" />
        <ToolbarButton icon={Italic} command="italic" title="Italic" />
        <ToolbarButton icon={Underline} command="underline" title="Underline" />
        <div className="w-px h-6 bg-gray-300 mx-2" />
        <ToolbarButton icon={ListOrdered} command="insertOrderedList" title="Numbered List" />
        <ToolbarButton icon={List} command="insertUnorderedList" title="Bullet List" />
        <div className="w-px h-6 bg-gray-300 mx-2" />
        <ToolbarButton icon={Link} command="createLink" title="Insert Link" />
        <ToolbarButton icon={Image} command="insertImage" title="Insert Image" />
        <ToolbarButton icon={Code} command="formatBlock" value="pre" title="Code Block" />
      </div>

      {/* Editor Area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onBlur={handleInput}
        onKeyUp={handleInput}
        className="min-h-[300px] p-4 prose prose-sm max-w-none focus:outline-none"
        style={{ fontFamily: 'inherit' }}
        suppressContentEditableWarning={true}
        tabIndex={0}
      />
    </div>
  );
};

export default RichTextEditor;
