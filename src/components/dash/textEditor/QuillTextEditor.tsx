import Quill, { ExpandedQuillOptions } from 'quill';
import 'quill/dist/quill.snow.css'; // Import the Quill snow theme
import { useEffect, useRef } from 'react';

interface EditorProps {
  setText: (txt: string) => void;
  text?: string;
}

const QuillTextEditor = ({ setText, text }: EditorProps) => {
  const editorRef = useRef(null); // Reference to the editor node in the DOM
  const quillInstance = useRef<Quill | ExpandedQuillOptions | null>(null); // Store the Quill instance to prevent multiple instances being initialized

  useEffect(() => {
    // Ensure Quill is only initialized once
    if (editorRef.current && !quillInstance.current) {
      // Initialize Quill with the "snow" theme
      quillInstance.current = new Quill(editorRef.current, { theme: 'snow', readOnly: false });
      quillInstance.current.insertText(1, text ?? '');
      // let text = quillInstance.current.getText();

      //   console.log(text);
      // Listen for text changes and log the HTML content to the console
      quillInstance.current.on('text-change', () => {
        // console.log('Editor Content:', quillInstance.current?.container.innerText);

        setText(quillInstance.current?.container.innerText as string);
      });
    }
  }, [quillInstance, setText, text]);

  return <div ref={editorRef} style={{ fontWeight: 300, height: '200px' }} />;
};

export default QuillTextEditor;
