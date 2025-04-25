import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

function PlayGame() {
  const { playerId } = useParams();
  const [question, setQuestion] = useState(null);
  const [showingAnswer, setShowingAnswer] = useState(false);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    let interval;

    axios.get(`http://localhost:5005/play/${playerId}/question`)
      .then(res => {
        const q = res.data.question;
        setQuestion(q);

        interval = setInterval(() => {
          axios.get(`http://localhost:5005/play/${playerId}/answer`)
            .then(res => {
              setAnswers(res.data.answers || []);
              console.log(answers)
              setShowingAnswer(true);
              clearInterval(interval);
            })
            .catch(err => {
              if (err.response?.data?.error !== 'Answers are not available yet') {
                clearInterval(interval);
              }
            });
        }, 1000);
      })

    return () => clearInterval(interval);
  }, [playerId]);
  if (!question) return <div>Loading question...</div>;

  return (
    <div className="p-6 w-80% h-96 mx-auto">
      <div className="relative h-[100px] bg-gray-200 rounded-xl shadow-inner p-6">
        <h1 className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-2xl font-bold mb-4">
          {showingAnswer ? 'Answer time!' : `The question is ${question.question}`}
        </h1>
      </div>

      {showingAnswer && (
        <div className="m-4 relative bg-green-100 rounded-xl shadow-inner p-6">
          <h2 className="text-xl font-semibold text-green-700">Correct Answer:</h2>
          <ul className="list-disc ml-6 mt-2">
            {(answers)
              .map((ans, idx) => (
                <li key={idx} className="text-green-800 text-lg">{ans}</li>
              ))}
          </ul>
        </div>
      )}

      {!showingAnswer && (
        <div className="m-4 relative bg-blue-200 rounded-xl shadow-inner p-6 flex flex-col gap-4">
          {(question.answers || []).map((answer, idx) => (
            <button
              key={idx}
              className="px-4 py-2 rounded border transition bg-white hover:bg-blue-100"
            >
              {answer.text}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default PlayGame;