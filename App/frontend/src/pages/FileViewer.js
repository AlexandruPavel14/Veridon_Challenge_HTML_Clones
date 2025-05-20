import { useParams } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import './FileViewer.css';

export default function FileViewer() {
  const { group, filename } = useParams();
  const [content, setContent] = useState('');
  const [viewMode, setViewMode] = useState('split'); // split or stacked

  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const dividerRef = useRef(null);

  useEffect(() => {
    axios.get(`http://localhost:3001/groups/${group}/file/${filename}`).then((res) => {
      setContent(res.data);
    });
  }, [group, filename]);

  useEffect(() => {
    if (viewMode !== 'split') return;

    const divider = dividerRef.current;
    const left = leftRef.current;
    const right = rightRef.current;

    let isDragging = false;

    const onMouseDown = () => {
      isDragging = true;
      document.body.style.cursor = 'col-resize';
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;

      const containerWidth = divider.parentElement.offsetWidth;
      const leftWidth = e.clientX - divider.parentElement.getBoundingClientRect().left;
      const rightWidth = containerWidth - leftWidth;

      if (left && right && leftWidth > 100 && rightWidth > 100) {
        left.style.width = `${leftWidth}px`;
        right.style.width = `${rightWidth}px`;
      }
    };

    const onMouseUp = () => {
      isDragging = false;
      document.body.style.cursor = 'default';
    };

    divider.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      divider.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [viewMode]);

  const wrappedContent = `
    <html>
      <head>
        <style>
          html, body { margin: 0; padding: 0; width: 100%; height: 100%; overflow: auto; }
        </style>
      </head>
      <body>${content}</body>
    </html>
  `;

  return (
    <div className="file-viewer-container">
      <div className="file-viewer-header">
        <h2>{filename}</h2>
        <div className="view-toggle">
          <label>
            <input
              type="radio"
              value="stacked"
              checked={viewMode === 'stacked'}
              onChange={() => setViewMode('stacked')}
            />
            Stacked View
          </label>
          <label>
            <input
              type="radio"
              value="split"
              checked={viewMode === 'split'}
              onChange={() => setViewMode('split')}
            />
            Split View
          </label>
        </div>
      </div>

      {viewMode === 'split' ? (
        <div className="split-layout">
          <div className="split-panel" ref={leftRef}>
            <h3>Rendered Output</h3>
            <iframe
              title="rendered"
              srcDoc={wrappedContent}
              className="rendered-iframe"
            />
          </div>
          <div className="split-divider" ref={dividerRef} />
          <div className="split-panel" ref={rightRef}>
            <h3>Raw HTML</h3>
            <div className="code-scroll">
              <SyntaxHighlighter language="html">{content}</SyntaxHighlighter>
            </div>
          </div>
        </div>
      ) : (
        <div className="stacked-layout">
          <div>
            <h3>Rendered Output</h3>
            <iframe
              title="rendered"
              srcDoc={wrappedContent}
              className="rendered-iframe"
            />
          </div>
          <div>
            <h3>Raw HTML</h3>
            <div className="code-scroll">
              <SyntaxHighlighter language="html">{content}</SyntaxHighlighter>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
