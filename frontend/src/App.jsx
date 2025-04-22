import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './index.css'
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';

function App() {
  const [token, setToken] = useState('');
  useEffect(() => {
    setToken(localStorage.getItem('token'))
  })

  return (
    <Router>
      <Routes>
        <Route path="/login" element={token ? <Navigate to="/dashboard" /> : <Login setfunction={setToken}/>} />
        <Route path="/register" element={token ? <Navigate to="/dashboard" /> : <Register setfunction={setToken}/>} />
        <Route path="/dashboard" element={token ? <Dashboard setfunction={setToken} /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
