import { useState } from 'react';
import './ExplorationPage.css';

const vLabels = [
  "V1 – Number of HTML FILES in each folder",
  "V2 – Number of HTML TAGS in each file",
  "V3 – Maximum NUMBER OF LINES OF CODE in each folder",
  "V4 – Number of maximum HTML FILE SIZE STORAGE per tier",
  "V5 – Number of HTML files with STYLE tag per tier",
  "V6 – Number of HTML FILES with SCRIPT tag per tier",
  "V7 – Number of HTML FILES with DIV tag per tier",
  "V8 – Number of HTML FILES with A tag per tier",
  "V9 – Number of HTML FILES with SPAN tag per tier",
  "V10 – Number of HTML FILES with LI tag per tier",
  "V11 – Number of HTML FILES with IMG tag per tier",
  "V12 – Number of HTML FILES with P tag per tier",
  "V13 – Number of HTML FILES with BR tag per tier",
  "V14 – Number of HTML FILES with TD tag per tier",
  "V15 – Number of HTML FILES with META tag per tier",
  "V16 – Number of HTML FILES with SOURCE tag per tier",
  "V17 – Number of HTML FILES with PICTURE tag per tier",
  "V18 – Number of HTML FILES with LINK tag per tier",
  "V19 – Number of HTML FILES with UL tag per tier",
  "V20 – Number of HTML FILES with INPUT tag per tier",
  "V21 – Number of HTML FILES with HTTP per tier",
  "V22 – Number of HTML FILES with HTTPS per tier",
  "V23 – Number of duplicated files content per tier",
  "V24 – Number of HTML files with length of file name",
  "V25 – Number of most common domain extensions",
  "V26 – Number of websites that have request",
  "V27 – Number of HTML FILES with TITLE tag per tier",
  "V28 – Number of HTML FILES with BODY tag per tier",
  "V29 – Number of HTML FILES with correct format"
];

export default function ExplorationPage() {
  const [loading, setLoading] = useState(false);
  const [imgSrc, setImgSrc] = useState(null);

  const handleMetricClick = async (index) => {
    setLoading(true);
    try {
      if (index === 0) {
        const res = await fetch('http://localhost:3001/metrics/v1');
        const blob = await res.blob();
        const imgURL = URL.createObjectURL(blob);
        setImgSrc(imgURL);
      }
    } catch (err) {
      alert('Failed to fetch metric data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="exploration-container">
      <div className="exploration-card">
        <h2 className="exploration-title">Data Exploration</h2>

        <div className="metrics-grid">
          {vLabels.map((label, index) => (
            <button
              key={index}
              className="metric-button"
              onClick={() => handleMetricClick(index)}
              disabled={loading}
            >
              {label}
            </button>
          ))}
        </div>

        {imgSrc && (
          <div className="plot-preview">
            <h3>Metric Result</h3>
            <img src={imgSrc} alt="V1 Plot" style={{ maxWidth: '100%', marginTop: '1rem' }} />
          </div>
        )}
      </div>
    </div>
  );
}