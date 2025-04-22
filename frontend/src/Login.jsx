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
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <form
        onSubmit={login}
        className="w-full max-w-md bg-white shadow-md rounded-2xl p-6"
      >
        <h1 className="text-2xl font-semibold text-center mb-4">Login</h1>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <input
          className="w-full p-2 mb-3 border border-gray-300 rounded-lg"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 mb-2"
        >
          Login
        </button>
        <button
          type="button"
          onClick={() => navigate('/register')}
          className="w-full text-sm text-gray-500 hover:underline"
        >
          Don't have an account? Register
        </button>
      </form>
    </div>
  );
}

export default Login;
