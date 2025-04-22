import axios from 'axios';

export const logout = async (setToken, navigate) => {
  try {
    await axios.post('http://localhost:5005/admin/auth/logout', {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
  } catch (err) {
    console.error('Logout failed:');
  } finally {
    localStorage.removeItem('token');
    setToken(null);
    navigate('/login');
  }
};
