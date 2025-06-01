import JoinChatForm from './components/JoinChatForm/JoinChatForm';
import ChatWindow from './components/ChatWindow/ChatWindow';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

//Initializing the connection
const socket = io("http://localhost:3001");

function App() {

  const [isInRoom, setIsInRoom] = useState(false);
  const [username, setUsername] = useState('');
  const [roomId, setRoomId] = useState('');


  // this effect is used to establish the connection with the server exists or not
  useEffect(() => {

    socket.on("connect", () => {
      console.log("Socket connection has been established")
    });

    return () => {
      socket.off("connect")
    }


  }, []);



  // join function in joinchatform triggers this function
  const handleJoinRoom = (info) => {
    // adding user to the room 
    socket.emit("user_join_room", info);
    console.log("User joined the room", info);
    // toggling the s user state to show the chat window
    setIsInRoom(true);
  };

  return (
    <div>
      {isInRoom ? <ChatWindow username={username} roomId={roomId} socket={socket} /> : <JoinChatForm onJoin={handleJoinRoom} setUsername={setUsername} setRoomId={setRoomId} username={username} roomId={roomId} />}
    </div>
  );
}

export default App;