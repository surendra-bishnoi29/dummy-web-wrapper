import React, { useEffect, useState } from 'react';
import EmbeddedDisplay from './EmbeddedDisplay'


const App = () => {
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const params = new URLSearchParams(window.location.search);
  const session_id = params.get('session_id');

  // useEffect(() => {
  //   // Retrieve the session_id from the URL
   
  //   setSessionId(session_id);
  // }, []);


  const pollPort = async (port) => {
    try {
      const response = await fetch(`http://34.18.95.25/check-port/${port}`);
      const data = await response.json();
      return data.open;
    } catch (err) {
      console.log(`Port ${port} not ready yet. Retrying...`);
    }
    return false;
  };



  const createSession = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://34.18.95.25/get-session/${session_id}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }
      console.log('Session created:', data);
      const { port } = data?.session;

      const intervalId = setInterval(async () => {
        const isOpen = await pollPort(port);
        if (isOpen) {
          console.log("port is opened", port)
          setSession(data?.session);
          setIsLoading(false);
          clearInterval(intervalId);
        }
      }, 1000); // Check every second
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    createSession();
  }, []);

  return (
    <div className="relative h-screen w-screen">
      
      <img
        src="bg.jpg"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
    <div className="relative z-10 flex flex-col   justify-center h-full border-blue-700">
      {!session &&
      <div className="mt-8 p-6 min-w-[444px] mx-auto bg-white flex  border-2 border-blue-700 flex-col items-center bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg shadow-lg">
      <img className='w-[332px] h-[113px]' src='s+.png' />
      <div className="relative">
      <div className="rounded-full border-2  border-dashed  h-40 w-40 flex items-center justify-center">
      <img src='chromium.png' className=' w-40 h-40 animate-none' />
      
      </div>
      </div>
      {isLoading && <p className=' text-white text-nowrap'>Creating session and waiting for the port to be ready...</p>}
      {error && <p className=' text-white text-nowrap'>Error: {error}</p>}
      </div>
}
      {session && (
        // <iframe src={`http://localhost:${session.port}`} title="Docker Session" width="100%" height="500px"></iframe>
     <EmbeddedDisplay port={session?.port}  />
     )}
    </div>
    </div>
  );
};

export default App;
