import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

export default function FileViewer() {
  const { group, filename } = useParams();
  const [content, setContent] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:3001/groups/${group}/file/${filename}`)
      .then(res => setContent(res.data));
  }, [group, filename]);

  return (
    <div>
      <h2>{filename}</h2>
      <h3>Rendered</h3>
<iframe
  title="preview"
  srcDoc={content}
  style={{ width: '100%', height: '90vh', border: '1px solid #ccc' }}
/>

      <h3>Raw HTML</h3>
      <SyntaxHighlighter language="html">{content}</SyntaxHighlighter>
    </div>
  );
}
