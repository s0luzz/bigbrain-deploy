import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from './util.js';
import axios from 'axios';


function Dashboard(props) {
  const sessions = props.sessions;
  const navigate = useNavigate();
  const setToken = props.setfunction;
  const setSessions = props.setsessions;
  const [games, setGames] = useState([]);
  const [showLinkModal, setShowModal] = useState(false);
  const [showResultsModal, setshowResultsModal] = useState(false);
  const [sessionUrl, setSessionUrl] = useState('');
  const token = props.token
  // Fetch games on mount
  useEffect(() => {
    const sessions = props.sessions
    axios.get('http://localhost:5005/admin/games', {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => {
      const userGames = res.data.games;
      setGames(userGames);
    });
  }, []);
  
  const startGame = (gameId) => {
    axios.post(`http://localhost:5005/admin/game/${gameId}/mutate`, {
      mutationType: 'START'
    }, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => {
      const sessionId = res.data.data.sessionId;
      setSessions(prev => ({ ...prev, [gameId]: sessionId }));
      const url = `http://localhost:5005/play/${sessionId}`;
      setSessionUrl(url);
      setShowModal(true);
      axios.get('http://localhost:5005/admin/games', {
        headers: { Authorization: `Bearer ${token}` },
      }).then(res => {
        const userGames = res.data.games;
        setGames(userGames);
      });
    });
  }

  const stopGame = (gameId) => {
    axios.post(`http://localhost:5005/admin/game/${gameId}/mutate`, {
      mutationType: 'END'
    }, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(() => {
      setshowResultsModal(true);

      axios.get('http://localhost:5005/admin/games', {
        headers: { Authorization: `Bearer ${token}` },
      }).then(res => {
        console.log(res.data.games)
        const userGames = res.data.games;
        setGames(userGames);
      });
    });
  }

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
                <>
                  {!game.active ? (
                    <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startGame(game.id);
                    }}
                    className="bg-green-500 text-white px-2 py-1 text-sm rounded hover:bg-green-600"
                  >
                    Start Session
                  </button>) : (
                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/game/controls/${game.id}`);
                      }}
                      className="bg-yellow-500 text-white px-1 py-1 text-sm rounded hover:bg-yellow-600"
                    >
                      Show Controls
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        stopGame(game.id);
                      }}
                      className="bg-red-500 text-white px-1 py-1 text-sm rounded hover:bg-red-600"
                    >
                      Stop Game
                    </button>
                    
                  </div>
                  )}
                </>
              </div>
            </div>
            
            ))}
          </div>
        </div>
      </div>


      {showResultsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md text-center shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Would you like to view the results?</h3>
            <button
              onClick={() => navigator.clipboard.writeText(sessionUrl)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 m-2"
            >
              YES PLEASE 
            </button>
            <button
              onClick={() => setshowResultsModal(false)}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      )}


      {showLinkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md text-center shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Game Session Started</h3>
            <p className="mb-4 text-gray-700">Session Link:</p>
            <input
              type="text"
              readOnly
              value={sessionUrl}
              className="w-full mb-4 px-3 py-2 border rounded text-center text-blue-600 font-mono"
            />
              <button
              onClick={() => navigator.clipboard.writeText(sessionUrl)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 m-2"
            >
              Copy Link
            </button>
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
