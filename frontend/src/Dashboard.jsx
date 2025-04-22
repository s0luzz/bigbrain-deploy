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
    <div className="h-screen bg-gray-100">
      <nav className="fixed top-0 left-0 w-full bg-sky-600 text-white shadow-md z-50 h-16">
        <h1 className="pt-4 absolute left-1/2 transform -translate-x-1/2 text-xl font-semibold text-white">BigBrain</h1>
        <button
          onClick={logout}
          className="absolute right-6 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
        >
          Logout
        </button>
      </nav>


      <div className="flex items-center justify-center h-[calc(100vh-80px)]">
        <p className="text-lg text-gray-700">Filler</p>
      </div>
    </div>
  );
}

export default Dashboard;
