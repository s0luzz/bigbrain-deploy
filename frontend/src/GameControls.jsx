import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from './util.js';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function GameControls(props) {
  const sessions = props.sessions;
  const setSessions = props.setSessions;
  const navigate = useNavigate();
  const token = props.token;  
  const setToken = props.setfunction;
  const { gameId } = useParams();
  const [games, setGames] = useState([]);
  const [game, setGame] = useState(null);
  const [finished, setFinished] = useState(false);
  const [position, setPosition] = useState('');
  const [sessionId, setSessionId] = useState('');


  const advanceGame = (gameId) => {
    axios.post(`http://localhost:5005/admin/game/${gameId}/mutate`, {
        mutationType: 'ADVANCE'
      }, {
        headers: { Authorization: `Bearer ${token}` },
      }).then(() => {
        axios.get(`http://localhost:5005/admin/session/${sessionId}/status`, {
          headers: { Authorization: `Bearer ${token}` },
        }).then(res => {
          const pos = res.data.results.position;
          if (!res.data.results.active) {
            setFinished(true);
            setPosition("Results");
          } else if (res.data.results.answerAvailable) {
            setPosition(`🟩 Showing Answer (Q${res.data.results.position + 1})`);
          } else if (pos === -1) {
            setPosition("Lobby");
          } else {
            setPosition(`Question ${pos + 1}`);
          }
        })

    });
  }
 
  const stopGame = (gameId) => {
    axios.post(`http://localhost:5005/admin/game/${gameId}/mutate`, {
        mutationType: 'END'
      }, {
        headers: { Authorization: `Bearer ${token}` },
      }).then(() => {
        setFinished(true);
    });
  }
  useEffect(() => {
    let interval;
  
    axios.get('http://localhost:5005/admin/games', {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => {
      const userGames = res.data.games;
      setGames(userGames);
      const currentGame = res.data.games.find(g => String(g.id) === gameId);
      setGame(currentGame);
  
      const sid = currentGame?.active;
      setSessionId(sid);
  
      interval = setInterval(() => {
        axios.get(`http://localhost:5005/admin/session/${sid}/status`, {
          headers: { Authorization: `Bearer ${token}` },
        }).then(res => {
          const pos = res.data.results.position;
          console.log(res.data.results)
          if (!res.data.results.active) {
            setFinished(true);
            setPosition("Results");
          } else if (res.data.results.answerAvailable) {
            setPosition(`🟩 Showing Answer (Q${res.data.results.position + 1})`);
          } else if (pos === -1) {
            setPosition("Lobby");
          } else {
            setPosition(`Question ${pos + 1}`);
          }
          
        });
      }, 1000);
    });
  
    return () => clearInterval(interval);
  }, [gameId, token]);
  
  
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
      <h1 className="text-center text-2xl font-semibold text-black my-6">Currently at {position}</h1>
        <div className="bg-gray-200 rounded-xl shadow-inner p-6">
        <>
          {!finished ? (
            <div className="flex flex-col space-y-4">
              <input
              type="text"
              readOnly
              value={`http://localhost:5005/play/${sessionId}`}
              className="w-full mb-4 px-3 py-2 border rounded text-center text-blue-600 font-mono"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  advanceGame(gameId)
                }}
                className="text-2xl py-4 px-8 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-200"
              >
                Next Question
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  stopGame(game.id);
                }}
                className="text-2xl py-4 px-8 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
              >
                Stop Game
              </button>
            </div>
          ) : (
            <div className="text-xl font-semibold text-center text-gray-700">Game has finished</div>
          )}
        </>
        
        

      

        </div>
      </div>

    </div>
  )
}

export default GameControls;