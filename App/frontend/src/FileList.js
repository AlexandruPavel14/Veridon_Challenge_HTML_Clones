import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function FileList() {
  const { group } = useParams();
  const [files, setFiles] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:3001/groups/${group}/files`)
      .then(res => setFiles(res.data));
  }, [group]);

  return (
    <div>
      <h2>Files in {group}</h2>
      <ul>
        {files.map(file => (
          <li key={file}>
            <Link to={`/group/${group}/file/${file}`}>{file}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
