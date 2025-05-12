import React, { useState, useEffect } from 'react';
import parse, { domToReact } from 'html-react-parser';

interface HTMLProps {
  str: string | undefined;
  num: number;
  startChar?: string;
}

function HTMLStringToJSXParts({ str, num, startChar }: HTMLProps) {
  const [jsxContent, setJsxContent] = useState<ReturnType<typeof domToReact>>();
  useEffect(() => {
    const convertToJSX = (htmlString: string) => {
      let jsx;
      //убираем символ после <p>
      if (!num) {
        let position = htmlString.indexOf(startChar ?? '');
        htmlString = htmlString.slice(0, position).concat(htmlString.slice(position + 1));
        jsx = parse(htmlString);
      } else jsx = parse(htmlString);

      setJsxContent(jsx);
    };
    // const re = RegExp(/<p>.*<\/p>/g);

    // const arr: RegExpMatchArray | null | undefined = str?.match(re);
    // console.log(arr ? arr[0] : '');

    if (!num) {
      convertToJSX(str ? str.slice(0) : '');
    }
    // if (num === 1) {
    //   convertToJSX(str ? str : '');
    // }
    if (num > 0) {
      convertToJSX(str ? str : '');
    }
    //  else {
    //   convertToJSX(str ?? '');
    // }
  }, [str, num, startChar]);

  //   const jsxContent = parse(str ?? '');
  return <>{jsxContent}</>;
}
export default HTMLStringToJSXParts;
