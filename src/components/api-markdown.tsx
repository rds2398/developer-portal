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
    <div className="prose prose-sm sm:prose-base max-w-none break-words overflow-x-auto [&_pre]:overflow-x-auto [&_table]:block [&_table]:overflow-x-auto">
      <ReactMarkdown>
        {content}
      </ReactMarkdown>
    </div>
  );
}