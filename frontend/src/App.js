import './App.css';
import Game from "./components/Game/Game";
// import Home from "./components/Home/Home";
import Navbar from "./components/Navbar/Navbar";
import Login from "./components/Login/Login";
import Home from "./components/Home/Home";
import Register from "./components/Register/Register";
import Search from "./components/Search/Search";
import Notifications from "./components/Notifications/Notifications";
import Matches from "./components/Matches/Matches";
import Match from "./components/Match/Match";
import Toast from "./components/Toast/Toast";
import Profile from "./components/Profile/Profile";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { useEffect, useState } from 'react';
import { io } from "socket.io-client";

var socket = io.connect("http://localhost:5000");;

function App() {

  const [showToast, setShowToast] = useState(false);
  const [toastData, setToastData] = useState('');
  let content = '';

  useEffect(() => {
    // socket = io.connect("http://localhost:5000");
    socket.emit('joinroomnotification', [localStorage.getItem('username')]);

    const eventHandler1 = (data) => {
      console.log("notification: ", data);
      setShowToast(true);
      let content = data.fromUsername + ' is challenging you for a chess game. Check Notifications tab'
      setToastData(content);

      setTimeout(() => { 
        setShowToast(false);
      }, 3000);
    }

    socket.on('shownotification', eventHandler1);

    return () => {
      socket.off('shownotification', eventHandler1);
    }
  }, []);

  return (  
    <div>
      <Router>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Home socket={socket} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/Search" element={<Search socket={socket}/>} />
          <Route path="/game" element={<Game socket={socket}/>} />
          <Route path="/notifications" element={<Notifications socket={socket}/>} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/matches/:username1/:username2/:roomId" element={<Match />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
      {/* <Game /> */}
      {console.log(toastData)}
      {showToast && <Toast content={toastData}/>}
      {/* <Toast /> */}
    </div>
  );
}

export default App;
