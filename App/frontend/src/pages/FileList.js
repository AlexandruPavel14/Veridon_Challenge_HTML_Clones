import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import './FileList.css'; // Import the CSS file

export default function FileList() {
  const { group } = useParams();
  const [files, setFiles] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:3001/groups/${group}/files`)
      .then(res => setFiles(res.data));
  }, [group]);

  return (
    <div className="file-list-container">
      <div className="file-list-card">
        <h2 className="file-list-title">Files in <span className="group-name">{group}</span></h2>
        <ul className="file-list-items">
          {files.map(file => (
            <li key={file}>
              <Link to={`/group/${group}/file/${file}`} className="file-link">
                {file}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
