import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import './LandingPage.css';

export default function LandingPage() {
  const navigate = useNavigate();
  const [path, setPath] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [outputs, setOutputs] = useState([]);

  const handleStart = async () => {
    setError('');
    setOutputs([]);
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:3001/set-path', { path });
      if (res.data.outputs) {
        setOutputs(res.data.outputs);
      } else {
        setError('No outputs returned.');
      }
    } catch (err) {
      const message = err.response?.data?.error || 'An unexpected error occurred';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = async (selectedPath) => {
    try {
      await axios.post('http://localhost:3001/select-output', { selectedPath });
      navigate('/groups');
    } catch (err) {
      setError('Failed to select output folder.');
    }
  };

  return (
    <div className="landing-page">
      <div className="landing-card">
        <h1 className="landing-title">HTML Cluster Viewer</h1>

        <p className="landing-subtext">
          Enter the full directory path containing all your tier folders (e.g. tier1, tier2...).
        </p>

        <div className="input-group">
          <label htmlFor="path">Parent Folder Path</label>
          <input
            id="path"
            type="text"
            placeholder="/Users/yourname/path/to/clones"
            value={path}
            onChange={e => setPath(e.target.value)}
          />
        </div>

        {error && <div className="error-message">{error}</div>}

      <div className="action-buttons">
        <button onClick={() => navigate('/exploration')} className="secondary-button">
          Data Exploration
        </button>
        <button onClick={handleStart} className="primary-button">
          Run Clustering
        </button>
      </div>



        {outputs.length > 0 && (
          <div className="output-selector">
            <h3>Select one of the clustered outputs:</h3>
            <ul>
              {outputs.map(out => (
                <li key={out.fullPath}>
                  <button className="output-button" onClick={() => handleSelect(out.fullPath)}>
                    {out.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
