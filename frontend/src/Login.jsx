import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login(props) {
  const setToken = props.setfunction;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const login = async () => {
    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5005/admin/auth/login', {
        email,
        password,
      });
      const token = res.data.token;
      localStorage.setItem('token', token);
      setToken(token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Email or password is incorrect.');
    }
  };

  return (
    <>
      <h1>Login</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      Email: <input type="email" value={email} onChange={e => setEmail(e.target.value)} /><br />
      Password: <input type="password" value={password} onChange={e => setPassword(e.target.value)} /><br />
      <button onClick={login}>Login</button>
      <button onClick={()=>{navigate('/register')}}>register</button>
    </>
  );
}

export default Login;
