import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function GroupList() {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/groups')
      .then(res => setGroups(res.data));
  }, []);

  return (
    <div>
      <h1>Groups</h1>
      <ul>
        {groups.map(g => (
          <li key={g}>
            <Link to={`/group/${g}`}>{g}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
