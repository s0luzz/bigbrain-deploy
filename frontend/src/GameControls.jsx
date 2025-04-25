import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from './util.js';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function GameControls(props) {
  const navigate = useNavigate();
  const token = props.token;  
  const setToken = props.setfunction;
  const { gameId } = useParams();
  const [games, setGames] = useState([]);
  const [game, setGame] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5005/admin/games', {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => {
      setGames(res.data.games);
      const selected = res.data.games.find(g => String(g.id) === gameId);
      if (selected) setGame(selected);
    });
  }, [token, gameId]);

  return (
    <div className="h-screen bg-gray-100">
      <nav className="fixed top-0 left-0 w-full bg-sky-600 text-white shadow-md z-50 h-16">
        <h1 className="pt-4 absolute left-1/2 transform -translate-x-1/2 text-xl font-semibold text-white">BigBrain</h1>
        <button
          onClick={() => logout(setToken, navigate)}
          className="absolute right-6 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
        >
          Logout
        </button>
        <button
          onClick={() => navigate('/dashboard')}
          className="absolute left-6 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
        >
          Back to Dashboard
        </button>
      </nav>
      <div className="pt-20 px-6">
        <div className="bg-gray-200 rounded-xl shadow-inner p-6">
        helo


        </div>
      </div>

    </div>
  )
}

export default GameControls;