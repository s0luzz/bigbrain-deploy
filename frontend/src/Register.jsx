import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register(props) {
  const navigate = useNavigate();
  const setToken = props.setfunction;
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState('');

  const register = async () => {
    if (!email || !name || !password || !passwordConfirm) {
      setError('All fields are required.');
      return;
    }

    if (password !== passwordConfirm) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5005/admin/auth/register', {
        email,
        name,
        password,
      });
      setToken(res.data.token);
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed.');
    }
  };

  return (
    <>
      <h1>Register</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      Name: <input type="text" value={name} onChange={e => setName(e.target.value)} /><br />
      Email: <input type="email" value={email} onChange={e => setEmail(e.target.value)} /><br />
      Password: <input type="password" value={password} onChange={e => setPassword(e.target.value)} /><br />
      Confirm Password: <input type="password" value={passwordConfirm} onChange={e => setPasswordConfirm(e.target.value)} /><br />
      <button onClick={register}>Register</button>
      <button onClick={()=>{navigate('/login')}}>login</button>
    </>
  );
}

export default Register;
