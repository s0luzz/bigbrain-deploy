import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Dashboard from './Dashboard';
import EditGame from './EditGame';
import Login from './Login';
import Register from './Register';
import NewGame from './NewGame';
import EditQuestion from './EditQuestion';
import GameControls from './GameControls'; 

function App() {
  const [token, setToken] = useState('');
  const [sessions, setSessions] = useState([]);
  useEffect(() => {
    setToken(localStorage.getItem('token'))
  })

  return (
    <Router>
      <Routes>
        <Route path="/login" element={token ? <Navigate to="/dashboard" /> : <Login setfunction={setToken} />} />
        <Route path="/register" element={token ? <Navigate to="/dashboard" /> : <Register setfunction={setToken} />} />
        <Route path="/dashboard" element={token ? <Dashboard sessions={sessions} setsessions={setSessions} setfunction={setToken} token={token}/> : <Navigate to="/login" />} />
        <Route path="/game/:gameId" element={token ? <EditGame setfunction={setToken} token={token} /> : <Navigate to="/login" />} />
        <Route path="/game/:gameId/question/:questionId" element={token ? <EditQuestion setfunction={setToken} token={token} /> : <Navigate to="/login" />} />
        <Route path="/game/new" element={token ? <NewGame setfunction={setToken} token={token} /> : <Navigate to="/login" />} />
        <Route path="/game/controls/:sessionId" element={token ? <GameControls setfunction={setToken} token={token} /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
