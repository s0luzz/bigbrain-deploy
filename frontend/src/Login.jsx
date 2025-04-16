import { useState } from 'react';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <>
      <h1>Login</h1>
      Email: <input type="email" value={email} onChange={e => (setEmail(e.target.value))}/>
      Password: <input type="password" value={password} onChange={e => (setPassword(e.target.value))}/>
      <button onClick={Login}>Login</button>
    </>
  );
}

export default Login;
