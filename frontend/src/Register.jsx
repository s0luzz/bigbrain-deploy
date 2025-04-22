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

  const register = async (e) => {
    e.preventDefault();
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
      localStorage.setItem('email', email);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed.');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <form
        onSubmit={register}
        className="w-full max-w-md bg-white shadow-md rounded-2xl p-6"
      >
        <h1 className="text-2xl font-semibold text-center mb-4">Register</h1>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <input
          className="w-full p-2 mb-3 border border-gray-300 rounded-lg"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="w-full p-2 mb-3 border border-gray-300 rounded-lg"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full p-2 mb-3 border border-gray-300 rounded-lg"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
          placeholder="Confirm Password"
          type="password"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 mb-2"
        >
          Register
        </button>
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="w-full text-sm text-gray-500 hover:underline"
        >
          Already have an account? Login
        </button>
      </form>
    </div>
  );
}

export default Register;
