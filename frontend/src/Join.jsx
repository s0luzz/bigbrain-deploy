import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';


function Join(props) {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name is required.');
      return;
    }

    try {
      await axios.post(`http://localhost:5005/play/join/${sessionId}`, { name }).then(
        res => {
          navigate(`/lobby/${sessionId}/${res.data.playerId}`)
        }
    )} catch (err) {
      alert(err);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-blue-100">
      <form onSubmit={handleJoin} className="w-full max-w-md bg-white shadow-md rounded-2xl p-6">
        <h1 className="text-2xl font-semibold text-center mb-4">Join Game</h1>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <input
          className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
        >
          Join
        </button>
      </form>
    </div>
  );
}

export default Join;