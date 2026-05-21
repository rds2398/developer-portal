import ReactMarkdown from "react-markdown";
import { useEffect, useState } from "react";

type Props = {
  file: string;
};

export function ApiMarkdown({ file }: Props) {
  const [content, setContent] = useState("");

  useEffect(() => {
    fetch(file)
      .then((res) => res.text())
      .then(setContent);
  }, [file]);

  return (
    <div className="prose max-w-none">
      <ReactMarkdown>
        {content}
      </ReactMarkdown>
    </div>
  );
}