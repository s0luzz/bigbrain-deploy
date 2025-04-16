import { useState } from 'react';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [name, setName] = useState('');

  function register () {
    
  }

  return (
    <>
      <h1>Register</h1>
      Name: <input type="text" value={name} onChange={e => (setName(e.target.value))}/>
      Email: <input type="email" value={email} onChange={e => (setEmail(e.target.value))}/>
      Password: <input type="password" value={password} onChange={e => (setPassword(e.target.value))}/>
      Confirm Password: <input type="password" value={passwordConfirm} onChange={e => (setPasswordConfirm(e.target.value))}/>
      <button onClick={register}>Register</button>
    </>
  );
}

export default Register;
