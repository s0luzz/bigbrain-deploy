import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

function PlayGame() {
  const { playerId } = useParams();
  const [question, setQuestion] = useState(null);
  const [showingAnswer, setShowingAnswer] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [lastQuestionId, setLastQuestionId] = useState(null);

  useEffect(() => {
    let interval;

    const fetchQuestion = () => {
      axios.get(`http://localhost:5005/play/${playerId}/question`)
        .then(res => {
          const q = res.data.question;

          if (q.id !== lastQuestionId) {
            setQuestion(q);
            setLastQuestionId(q.id);
            setShowingAnswer(false);
            setAnswers([]);
            setSubmitted(false);
            setSelectedAnswer('');
            setIsCorrect(null);
          }

          axios.get(`http://localhost:5005/play/${playerId}/answer`)
            .then(res => {
              const correctAnswers = res.data.answers || [];
              setAnswers(correctAnswers);
              setShowingAnswer(true);
              if (selectedAnswer) {
                setIsCorrect(correctAnswers.includes(selectedAnswer));
              }
            })
            .catch(err => {
              if (err.response?.data?.error !== 'Answers are not available yet') {
                clearInterval(interval);
              }
            });
        });
    };

    fetchQuestion();
    interval = setInterval(fetchQuestion, 1000);

    return () => clearInterval(interval);
  }, [playerId, selectedAnswer, lastQuestionId]);

  const submitAnswer = (answerText) => {
    axios.put(`http://localhost:5005/play/${playerId}/answer`, {
      answers: [answerText]
    }).then(() => {
      setSelectedAnswer(answerText);
      setSubmitted(true);
    }).catch(err => {
      console.error('Failed to submit answer', err);
    });
  };

  if (!question) return <div>Loading question...</div>;

  return (
    <div className="p-6 w-80% h-96 mx-auto">
      <div className="relative h-[100px] bg-gray-200 rounded-xl shadow-inner p-6">
        <h1 className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-2xl font-bold mb-4">
          {showingAnswer ? 'Answer time!' : `The question is ${question.question}`}
        </h1>
      </div>

      {showingAnswer && (
        <>
          <div className="m-4 relative bg-green-100 rounded-xl shadow-inner p-6">
            <h2 className="text-xl font-semibold text-green-700">Correct Answer:</h2>
            <ul className="list-disc ml-6 mt-2">
              {answers.map((ans, idx) => (
                <li key={idx} className="text-green-800 text-lg">{ans}</li>
              ))}
            </ul>
          </div>
          <div className={`text-lg text-center font-medium mt-2 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
            You answered: {selectedAnswer} — {isCorrect ? 'Correct!' : 'Incorrect'}
          </div>
        </>
      )}

      {!showingAnswer && !submitted && (
        <div className="m-4 relative bg-blue-200 rounded-xl shadow-inner p-6 flex flex-col gap-4">
          {(question.answers || []).map((answer, idx) => (
            <button
              key={idx}
              onClick={() => submitAnswer(answer.text)}
              className="px-4 py-2 rounded border transition bg-white hover:bg-blue-100"
            >
              {answer.text}
            </button>
          ))}
        </div>
      )}

      {!showingAnswer && submitted && (
        <div className="m-4 relative bg-yellow-100 rounded-xl shadow-inner p-6 text-center text-lg font-medium text-yellow-800">
          Waiting for other players to answer...
        </div>
      )}
    </div>
  );
}

export default PlayGame;