// EditGame.jsx
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { logout } from './util.js';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function EditGame({ token }) {
  const navigate = useNavigate();
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGame({ ...game, [name]: value });
  };
  const newQuestion = () => {
    const newQ = {
      id: Date.now(),
      question: '',
      type: 'single',
      time: 30,
      points: 10,
      answers: []
    };
    
    const currentQuestions = Array.isArray(game?.questions) ? game.questions : [];
    const updatedQuestions = [...currentQuestions, newQ];
    const updatedGame = { ...game, questions: updatedQuestions };
    
    setGame(updatedGame)
    const updatedGames = games.map(g => String(g.id) === gameId ? updatedGame : g);
    setGames(updatedGames);
    
    axios.put('http://localhost:5005/admin/games', { games: updatedGames }, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(() => {
      navigate(`/dashboard`);
    });
    
  }
  const deleteQuestion = (questionId) => () => {
    if (!game || !Array.isArray(game.questions)) return;

    const updatedQuestions = game.questions.filter(q => q.id !== questionId);
    const updatedGame = { ...game, questions: updatedQuestions };
    setGame(updatedGame);

    const updatedGames = games.map(g => String(g.id) === gameId ? updatedGame : g);
    setGames(updatedGames);

    axios.put('http://localhost:5005/admin/games', { games: updatedGames }, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
  const editQuestion = (questionId) => () => {}
  const handleSave = () => {
    const updatedGames = games.map(g => String(g.id) === gameId ? game : g);
    setGames(updatedGames);
    axios.put('http://localhost:5005/admin/games', {
      games: updatedGames
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    navigate(`/dashboard`)
  };

  if (!game) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Game Details</h1>

      <div className="space-y-4">
        <div>
          <label className="block font-medium text-gray-700 mb-1">Name</label>
          <input
            name="name"
            value={game.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Enter game name"
          />
        </div>

        <button
          onClick={handleSave}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Game
        </button>

      </div>
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


        <div className="relative mt-10 bg-gray-200 rounded-xl shadow-inner p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Questions</h2>
          <button
            onClick={() => newQuestion()}
            className="absolute right-6 top-4 transform px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
          >
            New Question
          </button>
          {!game.questions ? (
            <p className="text-gray-500 italic">No questions added yet.</p>
          ) : (
            <ul className="space-y-3">
              {game.questions.map((q) => (
                <li
                  key={q.id}
                  className="bg-white border rounded shadow-sm p-4 flex justify-between items-center"
                >
                  <span className="text-gray-800">{q.question}</span>
                  <div className="space-x-2">
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => navigate(`/game/${gameId}/question/${q.id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-500 hover:underline"
                      onClick={deleteQuestion(q.id)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
  );
}

export default EditGame;
