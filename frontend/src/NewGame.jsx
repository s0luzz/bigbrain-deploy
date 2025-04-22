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