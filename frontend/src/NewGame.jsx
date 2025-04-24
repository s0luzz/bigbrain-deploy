import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function NewGame({ token }) {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const createGame = async () => {
    if (!name) return;

    const res = await axios.get('http://localhost:5005/admin/games', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const currentGames = res.data.games || [];

    const newGameId = parseInt(Date.now());
    const newGame = {
      id: newGameId,
      name,
      owner: localStorage.getItem('email'),
      questions: [],
      thumbnail: '/public/thumbnail.webp',
    };

    const appendedGames = [...currentGames, newGame];

    await axios.put('http://localhost:5005/admin/games', {
      games: appendedGames
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });

    navigate(`/dashboard`);
  };

  return (
    <div className="p-6 max-w-md mx-auto">
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
      <h1 className="text-xl font-bold mb-4">Create New Game</h1>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Game Name"
        className="w-full p-2 border rounded mb-4"
      />
      <button
        onClick={createGame}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Create Game
      </button>
    </div>
  );
}

export default NewGame;