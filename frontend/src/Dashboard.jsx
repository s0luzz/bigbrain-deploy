import { useNavigate } from 'react-router-dom';

function Dashboard(props) {
  const navigate = useNavigate();
  const setToken = props.setfunction;

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    navigate('/login');
  };

  return (
    <>Dashboard
      <button onClick={logout}>Logout</button>
    </>
  )
}

export default Dashboard;