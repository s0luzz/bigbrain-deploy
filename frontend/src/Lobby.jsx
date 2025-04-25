import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';

function Lobby() {
  const navigate = useNavigate();
  const playerId = useParams().playerId;
  const sessionId = useParams().sessionId;
  useEffect(() => {
    let interval;
  
    interval = setInterval(() => {
      axios.get(`http://localhost:5005/play/${playerId}/status`, {
      }).then(res => {
        if(res.data.started) {navigate(`/play/${sessionId}/${playerId}`)}
      });
    }, 1000);
  
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <video
        autoPlay
        loop
        className="absolute w-full h-full object-cover"
      >
        <source src="/lobby.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay text */}
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
        <h1 className="text-4xl text-white font-bold text-center px-6">
          Please wait for the host to start the game...
        </h1>
      </div>
    </div>
  );
}

export default Lobby;
