import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Dashboard from './Dashboard';
import EditGame from './EditGame';
import Login from './Login';
import Register from './Register';
import NewGame from './NewGame';
import EditQuestion from './EditQuestion';
function App() {
  const [token, setToken] = useState('');
  useEffect(() => {
    setToken(localStorage.getItem('token'))
  })

  return (
    <Router>
      <Routes>
        <Route path="/login" element={token ? <Navigate to="/dashboard" /> : <Login setfunction={setToken} />} />
        <Route path="/register" element={token ? <Navigate to="/dashboard" /> : <Register setfunction={setToken} />} />
        <Route path="/dashboard" element={token ? <Dashboard setfunction={setToken} /> : <Navigate to="/login" />} />
        <Route path="/game/:gameId" element={token ? <EditGame token={token} /> : <Navigate to="/login" />} />
        <Route path="/game/:gameId/question/:questionId" element={token ? <EditQuestion token={token} /> : <Navigate to="/login" />} />
        <Route path="/game/new" element={token ? <NewGame token={token} /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
