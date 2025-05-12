import React, { useState, useEffect } from 'react';
import parse, { domToReact } from 'html-react-parser';

interface HTMLProps {
  str: string | undefined;
}

function HTMLStringToJSX({ str }: HTMLProps) {
  const [jsxContent, setJsxContent] = useState<ReturnType<typeof domToReact>>();
  useEffect(() => {
    const convertToJSX = (htmlString: string) => {
      const jsx = parse(htmlString);
      setJsxContent(jsx);
    };

    convertToJSX(str ?? '');
  }, [str]);

  //   const jsxContent = parse(str ?? '');
  return <>{jsxContent}</>;
}
export default HTMLStringToJSX;
