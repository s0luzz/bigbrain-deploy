// EditQuestion.jsx
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { logout } from './util.js';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function EditQuestion(props) {
  const token = props.token;
  const setToken = props.setfunction;
  const navigate = useNavigate();
  const { gameId, questionId } = useParams();
  const [games, setGames] = useState([]);
  const [game, setGame] = useState(null);
  const [question, setQuestion] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5005/admin/games', {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => {
      const gameList = res.data.games;
      setGames(gameList);
      const selectedGame = gameList.find(g => String(g.id) === gameId);
      if (selectedGame) {
        setGame(selectedGame);
        const selectedQuestion = selectedGame.questions.find(q => String(q.id) === questionId);
        if (selectedQuestion) setQuestion(selectedQuestion);
      }
    });
  }, [token, gameId, questionId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuestion(prev => ({ ...prev, [name]: value }));
  };

  const handleAnswerChange = (index, field, value) => {
    const updatedAnswers = [...question.answers];
    updatedAnswers[index] = { ...updatedAnswers[index], [field]: field === 'isCorrect' ? value : value };
    setQuestion({ ...question, answers: updatedAnswers });
  };

  const addAnswer = () => {
    if (question.answers.length < 6) {
      setQuestion({
        ...question,
        answers: [...question.answers, { text: '', isCorrect: false }]
      });
    }
  };

  const removeAnswer = (index) => {
    const updatedAnswers = [...question.answers];
    updatedAnswers.splice(index, 1);
    setQuestion({ ...question, answers: updatedAnswers });
  };

  const handleSave = () => {
    if (!question.question.trim()) {
      alert('Question text cannot be empty.');
      return;
    }

    const filledAnswers = question.answers.filter(ans => ans.text.trim() !== '');

    if (question.type === 'single' && filledAnswers.filter(a => a.isCorrect).length !== 1) {
      alert('Single choice must have exactly one correct answer.');
      return;
    } else if (question.type === 'multiple' && filledAnswers.filter(a => a.isCorrect).length < 1) {
      alert('Multiple choice must have at least one correct answer.');
      return;
    } else if (question.type === 'judgement') {
      question.answers = [question.answers[0]];
      if (!filledAnswers[0] || filledAnswers[0].text.trim() === '') {
        alert('Judgement answer text cannot be empty.');
        return;
      }
    }

    if ((question.type === 'single' || question.type === 'multiple') && filledAnswers.length < 2) {
      alert('Must provide at least two answers.');
      return;
    }

    const updatedQuestions = game.questions.map(q => String(q.id) === questionId ? question : q);
    const updatedGame = { ...game, questions: updatedQuestions };
    const updatedGames = games.map(g => String(g.id) === gameId ? updatedGame : g);

    axios.put('http://localhost:5005/admin/games', { games: updatedGames }, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(() => {
      navigate(`/game/${gameId}`);
    });
  };

  if (!game || !question) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <nav className="fixed top-0 left-0 w-full bg-sky-600 text-white shadow-md z-50 h-16">
        <h1 className="pt-4 absolute left-1/2 transform -translate-x-1/2 text-xl font-semibold text-white">BigBrain</h1>
        <button className="absolute right-6 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600" onClick={() => logout(setToken, navigate)}>
          Logout
        </button>
        <button className="absolute left-6 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600" onClick={() => navigate(`/game/${gameId}`)}>
          Back to Game
        </button>
      </nav>

      <h2 className="text-xl font-semibold mt-20 mb-4">Edit Question</h2>

      <div className="space-y-4">
        <input
          name="question"
          value={question.question}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="Question text"
        />

        <select className="w-full p-2 border rounded"
          name="type"
          value={question.type}
          onChange={handleChange}
        >
          <option value="single">Single Choice</option>
          <option value="multiple">Multiple Choice</option>
          <option value="judgement">Judgement</option>
        </select>

        <input className="w-full p-2 border rounded"
          type="number"
          name="time"
          value={question.time}
          onChange={handleChange}
          placeholder="Time limit (seconds)"
        />

        <input className="w-full p-2 border rounded"
          type="number"
          name="points"
          value={question.points}
          onChange={handleChange}
          placeholder="Points"
        />

        <input className="w-full p-2 border rounded"
          type="text"
          name="media"
          value={question.media || ''}
          onChange={(e) => setQuestion({ ...question, media: e.target.value })}
          placeholder="Media URL (YouTube or image)"
        />

        <div className="mt-4">
          <h3 className="font-medium mb-2">Answers</h3>
          {question.type === 'judgement' ? (
            <div className="flex items-center gap-2 mb-2">
              <input className="flex-1 p-2 border rounded"
                type="text"
                value={question.answers[0]?.text || ''}
                onChange={(e) => handleAnswerChange(0, 'text', e.target.value)}
                placeholder="Judgement Answer"
              />
              <input
                type="checkbox"
                checked={question.answers[0]?.isCorrect || false}
                onChange={(e) => handleAnswerChange(0, 'isCorrect', e.target.checked)}
              />
            </div>
          ) : (
            <>
              {question.answers.map((ans, idx) => (
                <div key={idx} className="flex items-center gap-2 mb-2">
                  <input className="flex-1 p-2 border rounded"
                    type="text"
                    value={ans.text}
                    onChange={(e) => handleAnswerChange(idx, 'text', e.target.value)}
                    placeholder={`Answer ${idx + 1}`}
                  />
                  <input
                    type="checkbox"
                    checked={ans.isCorrect}
                    onChange={(e) => handleAnswerChange(idx, 'isCorrect', e.target.checked)}
                  />
                  <button className="text-red-600 hover:underline" type="button" onClick={() => removeAnswer(idx)}>
                    Remove
                  </button>
                </div>
              ))}
              {question.answers.length < 6 && (
                <button className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600" type="button" onClick={addAnswer}>
                  + Add Answer
                </button>
              )}
            </>
          )}
        </div>
      </div>

      <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={handleSave}>
        Save Question
      </button>
    </div>
  );
}

export default EditQuestion;
