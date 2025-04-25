import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from './util.js';
import axios from 'axios';

function Dashboard(props) {
  const navigate = useNavigate();
  const setToken = props.setfunction;
  const [games, setGames] = useState([]);
  // Fetch games on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:5005/admin/games', {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => {
      const userGames = res.data.games;
      setGames(userGames);
    });
  }, []);

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
      </nav>

      <div className="pt-20 px-6">
        <button
          onClick={() => navigate('/game/new')}
          className="mb-6 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          + New Game
        </button>

        {/* Games Container */}
        <div className="bg-gray-200 rounded-xl shadow-inner p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Your Games</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {games.map(game => (
              <div
              key={game.id}
              onClick={() => navigate(`/game/${game.id}`)}
              className="relative cursor-pointer bg-white rounded-lg shadow hover:shadow-md transition duration-200 overflow-hidden"
            >
              <img
                src={game.thumbnail}
                alt={game.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-lg text-gray-800 truncate">{game.name}</h3>
                  <p className="text-sm text-gray-500">{game.questions?.length || 0} Questions</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    alert('new session')
                  }}
                  className="bg-green-500 text-white px-2 py-1 text-sm rounded hover:bg-green-600"
                >
                  Start Session
                </button>
              </div>
            </div>
            
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
