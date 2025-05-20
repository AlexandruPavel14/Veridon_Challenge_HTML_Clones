import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './GroupList.css';

export default function GroupList() {
  const [groups, setGroups] = useState([]);
  const [outputs, setOutputs] = useState([]);
  const [current, setCurrent] = useState('');

  const fetchGroups = async () => {
    try {
      const res = await axios.get('http://localhost:3001/groups');
      setGroups(res.data);
    } catch (err) {
      console.error('Failed to fetch groups');
    }
  };

  const fetchOutputs = async () => {
    try {
      const res = await axios.get('http://localhost:3001/outputs');
      setOutputs(res.data.outputs);
      setCurrent(res.data.current);
    } catch (err) {
      console.error('Failed to fetch outputs');
    }
  };

  const handleSelect = async (output) => {
    try {
      await axios.post('http://localhost:3001/select-output', {
        selectedPath: output.fullPath
      });
      setCurrent(output.name);
      fetchGroups();
    } catch (err) {
      console.error('Failed to select output');
    }
  };

  useEffect(() => {
    fetchOutputs();
    fetchGroups();
  }, []);

  return (
    <div className="group-page-container">
      <div className="group-card">
        <h1 className="group-title">HTML Clustered Outputs</h1>
        <p className="group-subtext">Please select one of the clustered output folders below.</p>

        <div className="output-tab-bar">
          {outputs.map((output) => (
            <button
              key={output.fullPath}
              className={`output-tab ${output.name === current ? 'active' : ''}`}
              onClick={() => handleSelect(output)}
            >
              {output.name}
            </button>
          ))}
        </div>

        <h2 className="group-section-title">Groups inside <strong>{current}</strong></h2>
        <ul className="group-list">
          {groups.map(group => (
            <li key={group}>
              <Link to={`/group/${group}`} className="group-link">
                {group}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
