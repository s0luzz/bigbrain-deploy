import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

function PlayGame() {
  const { playerId } = useParams();
  const [question, setQuestion] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let interval;

    axios.get(`http://localhost:5005/play/${playerId}/question`)
      .then(res => {
        setQuestion(res.data.question);
        setStartTime(res.data.isoTimeLastQuestionStarted);
      });

    return () => clearInterval(interval);
  }, [playerId]);

  if (error) return <div>{error}</div>;
  if (!question) return <div>Loading question...</div>;

  return (
    <div className="p-6 w-80% h-96 mx-auto">
      <div className="relative h-[100px] bg-gray-200 rounded-xl shadow-inner p-6">
        <h1 className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-2xl font-bold mb-4">
          {`The question is ${question.question}`}
        </h1>
      </div>

      <div className="m-4 relative bg-blue-200 rounded-xl shadow-inner p-6 flex flex-col gap-4">
        {question.answers?.map((answer, idx) => (
          <button
            key={idx}
            className="px-4 py-2 bg-white text-gray-800 rounded hover:bg-blue-100 transition border"
          >
            {answer.text}
          </button>
        ))}
      </div>
    </div>
  );
}

export default PlayGame;
