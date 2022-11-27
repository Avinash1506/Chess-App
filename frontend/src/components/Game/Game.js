import Board from '../Board/Board';
import {useNavigate} from 'react-router-dom';
import {useEffect} from 'react';
import "./Game.css";

const Game = (props) => {
    const navigate = useNavigate();

    useEffect(()=>{ 
        if(!localStorage.getItem('token')) {
            console.log("Hello in search if");
            navigate('/');
        }
    }, []);

    return (
        <div className="container">
            <Board socket={props.socket}/>
        </div>
    )
}

export default Game;