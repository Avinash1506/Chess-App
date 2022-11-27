import Square from "../Square/Square";
import {BoardArray, blackPieces, whitePieces} from '../../utils/BoardArray';
import "./Board.css";
import { useEffect, useState } from "react";
import Moves from "../../utils/Moves";
// import { io } from "socket.io-client";
import {useNavigate, useSearchParams} from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

let socket;

const Board = (props) => {
    // console.log(blackPieces);
    let arr1 = [];
    let arr2 = [];
    const navigate = useNavigate();
    let killedArr1 = [];
    let killedArr2 = [];

    const pieceNameToIdx = ['pawn', 'rook', 'knight', 'bishop', 'queen', 'king'];

    const rowNums = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const colNums = ['1', '2', '3', '4', '5', '6', '7', '8'];

    const highlightCell = "3px solid #00b3ff";

    let idx = -1;

    const [turn, setTurn] = useState('white');
    const [selected, setSelected] = useState(false);
    const [nextMove, setNextMove] = useState([]);
    const [board, setBoard] = useState(BoardArray);
    const [squareData, setSquareData] = useState({});
    const [prevRowAndCol, setPrevRowAndCol] = useState([]);
    const [gameEnd, setGameEnd] = useState(false);
    const [colorOfUser, setColorOfUser] = useState('');
    const [searchParams] = useSearchParams();
    const [winner, setWinner] = useState('');
    const [selectedSquareDivs1, setSelectedSquareDivs1] = useState([]);
    const [selectedSquareDivs2, setSelectedSquareDivs2] = useState([]);
    const [selectedSquareDivsOfOpponent, setSelectedSquareDivsOfOpponent] = useState([]);
    const blackObj = {
        'pawn': 0,
        'rook': 0,
        'knight': 0,
        'bishop': 0,
        'queen': 0,
        'king': 0,
    };
    const [killedBlacks, setKilledBlacks] = useState(blackObj);

    const whiteObj = {
        'pawn': 0,
        'rook': 0,
        'knight': 0,
        'bishop': 0,
        'queen': 0,
        'king': 0,
    };
    const [killedWhites, setKilledWhites] = useState(whiteObj);

    console.log(killedWhites);
    // console.log(killedBlacks);

    
    // console.log(searchParams.get('username1'));

    const username1 = searchParams.get('username1');
    const username2 = searchParams.get('username2');

    let opponentUsername, playerUsername;

    if(username1 === localStorage.getItem('username')) {
        opponentUsername = username2;
        playerUsername = username1;
    } else {
        opponentUsername = username1;
        playerUsername = username2;
    }
    const roomId = searchParams.get('roomid');

    useEffect(() => {
        // socket = io.connect("http://localhost:5000");
        socket = props.socket;

        // console.log(socket);

        socket.emit('joinroomgame', [roomId, localStorage.getItem('username')]);
        // socket.on("new-game", ()=> {
        //     setTurn('white');
        //     setSelected(false);
        //     setNextMove([]);
        //     setBoard(BoardArray);
        //     setSquareData({});
        //     setPrevRowAndCol([]);
        //     setGameEnd(false);

        //     console.log(BoardArray);
        // })

        const eventHandler1 = data => {
            // console.log("on");
            // console.log("moveee");
            // console.log("moveapiece");
            console.log(killedWhites);
            moveAPiece(data);
            console.log(killedWhites);

            const classPrev = 'row'+data['prevX']+' col'+data['prevY'];
            const classNext = 'row'+data['nextX']+' col'+data['nextY'];

            
            console.log(data['killedWhites']);
            console.log(data['killedBlacks']);

            setKilledBlacks(data['killedBlacks']);
            setKilledWhites(data['killedWhites']);

            const ele1 = document.getElementsByClassName(classPrev)[0];
            const ele2 = document.getElementsByClassName(classNext)[0];

            // console.log(ele1);
            // console.log(ele2);
            if(data['prevprevX'] !== undefined) {
                const classPrevPrev = data['prevprevX']+' '+data['prevprevY'];
                const classPrevNext = data['prevnextX']+' '+data['prevnextY'];

                // console.log(classPrevPrev);
                // console.log(classPrevNext);

                const elePrev1 = document.getElementsByClassName(classPrevPrev)[0];
                const eleNext1 = document.getElementsByClassName(classPrevNext)[0];

                elePrev1.style.border = '';
                eleNext1.style.border = '';
            }

            ele1.style.border = highlightCell;
            ele2.style.border = highlightCell;
            // console.log(selectedSquareDivs1);

            // if(selectedSquareDivs1.length === 2) {
            //     selectedSquareDivs1[0].style.border = '';
            //     selectedSquareDivs1[1].style.border = '';
            // }

            // console.log(data);
            
            setSelectedSquareDivs1([ele1, ele2]);
        }

        const eventHandler2 = (moves) => {
            // console.log(moves);
            let boardCopy = JSON.parse(JSON.stringify(board));
            let nextX, nextY, prevX, prevY;
            const whites = {'pawn': 0, 'rook': 0,'knight': 0, 'bishop': 0, 'queen': 0, 'king': 0};
            const blacks = {'pawn': 0, 'rook': 0,'knight': 0, 'bishop': 0, 'queen': 0, 'king': 0};
            for(let move of moves) {
                nextX = move['nextX'];
                nextY = move['nextY'];
                prevX = move['prevX'];
                prevY = move['prevY'];

                if(boardCopy[move["nextX"]][move["nextY"]].piece === 'king') {
                    // console.log("Hello king");
                    setGameEnd(true);
                    let wnr, loser;
                    if(move['color'] === 'white') {
                        setWinner(username1);
                        wnr = username1;
                        loser = username2;
                    }
                    else if(move['color'] === 'black') {
                        setWinner(username2);
                        wnr = username2;
                        loser = username1;
                    }
        
                    // socket.emit('game-end', {roomId: move['roomId'], winner: wnr, loser: loser});
                }

                const boardObj = {...boardCopy[move["prevX"]][move["prevY"]]};
                // console.log("boardObj: ", boardObj);
                
                if(boardCopy[move['nextX']][move['nextY']].piece !== '') {
                    const piece = boardCopy[move['nextX']][move['nextY']].piece;
                    // console.log(piece);
                    // console.log(killedWhites);
                    if(boardCopy[move['nextX']][move['nextY']].color === 'white') {
                        // console.log("Hello");
                        whites[piece]++;
                    } else {
                        blacks[piece]++;
                    }
                }

                boardCopy[move["nextX"]][move["nextY"]] = boardObj;
                boardCopy[move["prevX"]][move["prevY"]] = {icon: '', color: '', piece: ''};

                // console.log(boardCopy);
                if(move['color'] === 'white')
                    setTurn("black");
                else if(move['color'] === 'black') 
                    setTurn("white");
            }
            
            setKilledBlacks(blacks);
            setKilledWhites(whites);

            setSelected(false);
            setNextMove([]);
            setSquareData([]);
            setPrevRowAndCol([]);

            setBoard(boardCopy);

            // console.log(moves);

            if(moves.length !== 0) {

                const cls1 = 'row'+prevX+' col'+prevY;
                const cls2 = 'row'+nextX+' col'+nextY;

                const ele1 = document.getElementsByClassName(cls1)[0];
                const ele2 = document.getElementsByClassName(cls2)[0];

                // console.log(ele1);
                // console.log(ele2);
                
                ele1.style.border = highlightCell;
                ele2.style.border = highlightCell;

                setSelectedSquareDivs2([]);
                setSelectedSquareDivs1([ele1, ele2]);
            }

        }

        socket.on('move', eventHandler1);

        socket.on("completed-moves", eventHandler2);

        // socket.on('draw', () => {

        // });

        return () => {
            socket.off('move', eventHandler1);

            socket.off("completed-moves", eventHandler2);
        };

    }, []);

    if(localStorage.getItem('username') === username1 && colorOfUser === '') {
        setColorOfUser('white');
    } else if(localStorage.getItem('username') === username2 && colorOfUser === '') { 
        setColorOfUser('black');
    } 
    else if(colorOfUser === ''){
        navigate("/");
    }

    if(colorOfUser === 'black') {
        rowNums.reverse();
    }

    if(colorOfUser === 'white') {
        killedArr1 = blackPieces;
        killedArr2 = whitePieces;
    } else if(colorOfUser === 'black') {
        killedArr1 = whitePieces;
        killedArr2 = blackPieces;
    }
    // {prevX: prevRowAndCol[0], prevY: prevRowAndCol[1], nextX: row, nextY: col, squareData: squareData, oppositeColor: oppositeColor, board: board, roomId: roomId}
    const moveAPiece = (data, txt) => {
        console.log(killedWhites);
        // console.log(txt);
        // console.log("User in moveapiece is: ", localStorage.getItem('username'));
        // console.log("moveapiece");
        let boardCopy = JSON.parse(JSON.stringify(data["board"]));

        if(data["board"][data["nextX"]][data["nextY"]].piece === 'king') {
            setGameEnd(true);
            let wnr, loser;

            if(data['oppositeColor'] === 'black') {
                setWinner(username1);
                wnr = username1;
                loser = username2;
            }
            else if(data['oppositeColor'] === 'white') {
                setWinner(username2);
                wnr = username2;
                loser = username1;
            }

            socket.emit('game-end', {roomId: roomId, winner: wnr, loser: loser});
        }

        // console.log(data['prevX'], data['prevY'],data['nextX'], data['nextY'])
        
        const boardCopyObj = {...boardCopy[data["prevX"]][data["prevY"]]};
        
        // if(boardCopy[data['nextX']][data['nextY']].piece !== '') {
        //     const piece = boardCopy[data['nextX']][data['nextY']].piece;
        //     // console.log(killedWhites);
        //     if(boardCopy[data['nextX']][data['nextY']].color === 'white') {
        //         // console.log("in white");
        //         console.log(killedWhites);
        //         // const obj = {...killedWhites};
        //         // console.log(killedWhites);
        //         // obj[piece]++;
        //         setKilledWhites({...killedWhites, "bishop": 10});
        //         // console.log("Hello");
        //     } else {
        //         // console.log("in black");
        //         const obj = {...killedBlacks};
        //         obj[piece]++;
        //         setKilledBlacks({...killedBlacks, "bishop": 10});
        //     }
        // }

        boardCopy[data["nextX"]][data["nextY"]] = boardCopyObj;
        boardCopy[data["prevX"]][data["prevY"]] = {icon: '', color: '', piece: ''};

        setBoard(boardCopy);



        // console.log(boardCopy);

        setTurn(data["oppositeColor"]);
        
        setSelected(false);
        setNextMove([]);
        setSquareData([]);
        setPrevRowAndCol([]);
    }

    const isValid = (x, y, oppositeColor) => {
        return (x >= 0 && x < 8 && y >= 0 && y < 8 && ((board[x][y].icon !== '' && board[x][y].color === oppositeColor) || (board[x][y].icon === '')));
    }

    const returnMoves = (piece, Moves, row, col, oppositeColor) => {
        const moves = {};

        if(piece === 'pawn') { 
            let i = row;

            if(oppositeColor === 'white') {
                i++;
            } else {
                i--;
            }

            let j = col;
    
            if(isValid(i, j, oppositeColor) && board[i][j].color !== oppositeColor) {
                moves[i*8 + j] = true;
            }

            if(row === 1 || row === 6) {
                if(oppositeColor === 'white') {
                    i++;
                } else {
                    i--;
                }

                if(isValid(i, j, oppositeColor) && board[i][j].color !== oppositeColor) {
                    moves[i*8 + j] = true;
                }
            }

            if(oppositeColor === 'white') {
                i = row + 1;
            } else {
                i = row - 1;
            }

            if(isValid(i, col + 1, oppositeColor) && board[i][col + 1].color === oppositeColor) {
                moves[i*8 + col + 1] = true;
            }

            if(isValid(i, col - 1, oppositeColor) && board[i][col - 1].color === oppositeColor) {
                moves[i*8 + col - 1] = true;
            }

        } else if(piece === 'king' || piece === 'knight') {
            for(let r = 0; r < Moves[piece]['x'].length; r++) {
                const i = row + Moves[piece]['x'][r];
                const j = col + Moves[piece]['y'][r];
    
                if(isValid(i, j, oppositeColor)) {
                    moves[i*8 + j] = true;
                }
            }
        } else {
            for(let r = 0; r < Moves[piece]['x'].length; r++) {
                for(let c = 0; c < Moves[piece]['x'][r].length; c++) {
                    const i = row + Moves[piece]['x'][r][c];
                    const j = col + Moves[piece]['y'][r][c];
    
                    if(isValid(i, j, oppositeColor)) {
                        moves[i*8 + j] = true;
                    } else {
                        break;
                    }

                    if(board[i][j].color === oppositeColor) {
                        break;
                    }
                }
            }
        }

        return moves;
    }

    const checkSquareClass = (classesArray) => {
        for(let val of classesArray) {
            if(val === 'square') return true;
        }

        return false;
    }

    const getRowAndColumn = (classesArray) => {
        const rowAndCol = {};

        for(let val of classesArray) {
            if(val.startsWith("row")) {
                rowAndCol['row'] = (+val.slice(3));
            }

            if(val.startsWith("col")) {
                rowAndCol['col'] = (+val.slice(3));
            }
        }

        return rowAndCol;
    }

    const move = (e) => {
        console.log(killedWhites);
        if(colorOfUser !== turn) return;

        if(!gameEnd) {
            while(!checkSquareClass(e.target.classList)) {
                e.target = e.target.parentElement;
            }

            const {row, col} = getRowAndColumn(e.target.classList);

            const{piece, color} = board[row][col];

            let oppositeColor;

            if(turn === 'white') {
                oppositeColor = 'black';
            } else {
                oppositeColor = 'white';
            }

            // console.log("in root");

            if(!selected) { // if any piece is not selected
                // console.log(board);
                if(board[row][col].icon !== '' && color === turn) { // if the selected sqaure contains same color as that of the current turn
                    setNextMove(returnMoves(piece, Moves, row, col, oppositeColor));
                    setSelected(true);
                    setSquareData(board[row][col]);
                    setPrevRowAndCol([row, col]);
                    // for(let squareDivs of selectedSquareDivs) {
                    //     squareDivs.style.border = 'none';
                    // }

                    const arr = [];

                    arr.push(e.target);

                    e.target.style.border = highlightCell;

                    setSelectedSquareDivs2(arr);
                }
            } else { // if a piece is selected and that piece should be moved
                // console.log("already selected");
                if(board[row][col].icon === '' && nextMove[row*8 + col] === undefined) { // if instead of making a move the player cliked on an empty square which is not a requied destination
                    setSelected(false);
                    setNextMove([]);
                    setSquareData([]);
                    setPrevRowAndCol([]);
                    selectedSquareDivs2[0].style.border = '';

                    setSelectedSquareDivs2([]);

                    // console.log("already select-not-main-0");
                } else if(color === turn) { // if the player clicked on another piece, instead of making a move
                    setNextMove(returnMoves(piece, Moves, row, col, oppositeColor));
                    setSquareData(board[row][col]);
                    setPrevRowAndCol([row, col]);

                    selectedSquareDivs2[0].style.border = '';

                    const arr = [];

                    arr.push(e.target);

                    e.target.style.border = highlightCell

                    setSelectedSquareDivs2(arr);
                    // console.log("already select-not-main-1");
                }
                else if(nextMove[row*8 + col] !== undefined) { // if the player actually made a move
                    //move the icon
                    // call function locally 

                    for(let selectedDivs of selectedSquareDivs1) {
                        selectedDivs.style.border = '';
                        console.log(selectedDivs.classList);
                    } 

                    let prevprevX, prevprevY, prevnextX, prevnextY;

                    const arr = [...selectedSquareDivs2];
                    arr.push(e.target);
                    e.target.style.border = highlightCell

                    // console.log(arr);

                    let prevX = prevRowAndCol[0], prevY = prevRowAndCol[1], nextX = row, nextY = col;
                    let data = {oppositeColor: oppositeColor, board: board, roomId: roomId, username: localStorage.getItem('username'), };
                    data['prevX'] = prevX;
                    data['prevY'] = prevY;
                    data['nextX'] = nextX;
                    data['nextY'] = nextY;

                    if(selectedSquareDivs1.length === 2) {

                        data['prevprevX'] = selectedSquareDivs1[0].classList[1];
                        data['prevprevY'] = selectedSquareDivs1[0].classList[2];
                        data['prevnextX'] = selectedSquareDivs1[1].classList[1];
                        data['prevnextY'] = selectedSquareDivs1[1].classList[2];
                    }

                    
                    setSelectedSquareDivs2([]);
                    setSelectedSquareDivs1(arr);

                    let obj1 = {...killedWhites}, obj2 = {...killedBlacks};

                    if(board[data['nextX']][data['nextY']].piece !== '') {
                        const piece = board[data['nextX']][data['nextY']].piece;
                        // console.log(killedWhites);
                        if(board[data['nextX']][data['nextY']].color === 'white') {
                            // console.log("in white");
                            console.log(killedWhites);
                            // console.log(killedWhites);
                            obj1[piece]++;
                            setKilledWhites(obj1);
                            // console.log("Hello");
                        } else {
                            // console.log("in black");
                            // let obj = {...killedBlacks};
                            obj2[piece]++;
                            setKilledBlacks(obj2);
                            // data['killedBlacks'] = obj;
                            // obj = {...killedWhites};
                            // data['killedWhites'] = obj;
                        }
                    }

                    data['killedWhites'] = obj1;
                    data['killedBlacks'] = obj2;

                    console.log(killedWhites);
                    console.log("Hello");
                    console.log(data);
                    if(socket)
                        socket.emit("move", data);
                } else {
                    // console.log("already select-not-main-2");
                    setSelected(false);
                    setNextMove([]);
                    setSquareData([]);
                    setPrevRowAndCol([]);
                    selectedSquareDivs2[0].style.border = '';

                    setSelectedSquareDivs2([]);
                }
            }
        }
    }   

    const newGame = () => {
        // console.log("Hello new game");
        socket.emit('new-game', roomId);
    }

    const draw = () => {
        socket.emit("draw", {
            roomId: roomId, 
            opponentUsername: opponentUsername, 
            playerUsername: playerUsername
        });
    }

    return (
        <div className="row">
            {/* {console.log(killedWhites)} */}
            <div className="col-lg-7">
                {/* style={{transform: colorOfUser === 'black' ? "rotate(180deg)" : ''}} */}
                
                <div className="row">
                    <div className="col-sm-12 ps-0">
                        <div className="numberHeight">
                            <div className="squareRow"></div>
                            {
                                rowNums.map((val, idx) => {
                                    return (
                                        <div className="squareRow" key={idx}><strong>{val}</strong></div>
                                    )
                                })
                            }
                            <div className="squareRow"></div>
                        </div>
                        {console.log(killedWhites)}
                        <div className="board" onClick = {move} style={{transform: colorOfUser === 'black' ? "rotate(180deg)" : ''}}> 
                            {
                                board.map((row, i) => {
                                    return (
                                        <div className="rowDiv" key={idx}>
                                                 {/* <div className="col-sm-1">
                                                    {
                                                        colNums.map((num, idx)=> {
                                                            return (<div className="squareCol" key={idx}>
                                                                <div style={{padding: "16px 0px", height: "32px"}}>{num}</div>
                                                            </div>)
                                                        })
                                                    }
                                                </div> */}
                                                <div className="squareCol" key={idx} style={{transform: colorOfUser === 'black' ? "rotate(180deg)" : ''}}>
                                                    <div className={colorOfUser === 'black' ? "innerDivLeftAlign" : 'innerDivRightAlign'}>
                                                        <strong>{9 - (i + 1)}</strong>
                                                    </div>
                                                </div>
                                            {
                                                row.map((data, j) => {
                                                    idx++;

                                                    return <Square 
                                                        key = {idx}
                                                        row = {i} 
                                                        col = {j} 
                                                        colorOfUser = {colorOfUser}
                                                        squareColor = {((i+j)%2)?'#b07d62':'#f0ead2'}
                                                        piecePresent = {(data.icon !== "") ? (true) : (false)}
                                                        pieceType={data.icon}
                                                        pieceName={data.piece}
                                                        pieceColor={data.color}
                                                        highlight = {nextMove[idx] === true ? 'yes' : 'no'}
                                                    />
                                                })
                                            }
                                            <div className="squareCol" key={idx} style={{transform: colorOfUser === 'black' ? "rotate(180deg)" : ''}}>
                                                <div className={colorOfUser === 'black' ? "innerDivRightAlign" : 'innerDivLeftAlign'}>
                                                    <strong>{9 - (i + 1)}</strong>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div className="numebrHeight">
                            <div className="squareRow"></div>
                            {
                                rowNums.map((val, idx) => {
                                    return (
                                        <div className="squareRow" key={idx}><strong>{val}</strong></div>
                                    )
                                })
                            }
                            <div className="squareRow"></div>
                        </div>
                    </div>
                </div>
            </div>
            {/* { killedArr = colorOfUser === 'white' && {blackPieces, whitePieces}} */}
            {/* { killedArr = colorOfUser === 'black' && [whitePieces, blackPieces]} */}
            {/* {killedArr = killedArr()} */}
            
            <div className="col-lg-5 d-flex flex-column" style={{marginTop: "24px", marginBottom: "24px"}}>
                <div className="row">
                    {console.log(blackPieces)}
                    {console.log(whitePieces)}
                    {/* {console.log(killedArr)} */}
                    {/* {arr1 = killedArr[0]}
                    {arr2 = killedArr[1]}
                    {console.log(arr1)}
                    {console.log(arr2)} */}
                    {killedArr1.map((piece, idx) => {
                        console.log(piece);
                        return (
                            <div className="col-sm-2 p-0" key={idx}>
                                <div className="row">
                                    <div className="col-sm-6 p-0" style={{width: "30px"}}>
                                        <FontAwesomeIcon icon={piece} className="w-100"/>
                                    </div>
                                    <div className="col-sm-6 p-0" style={{width: "30px"}}>
                                        <span>X {colorOfUser === 'white' ? killedBlacks[pieceNameToIdx[idx]] : killedWhites[pieceNameToIdx[idx]]}</span>
                                    </div>
                                </div>
                            </div>
                        )
                    }) }
                </div>
                <div className="mt-auto mb-auto text-center">
                    {!gameEnd && <h2>{turn === 'white' ? username1 === localStorage.getItem('username') ? 'Your' : "Opponent's" : username2 === localStorage.getItem('username') ? 'Your' : "Opponent's"} Turn</h2>}
                    {/* {console.log(winner)} */}
                    {winner !== '' && <h2>{winner} Won</h2>}

                    <button className="btn btn-outline-dark" onClick={draw}>Request For Draw</button>
                </div>
                <div className="row">
                    {console.log(killedWhites)}
                    {killedArr2.map((piece, idx) => {
                        return (
                            <div className="col-sm-2 p-0" key={idx}>
                                <div className="row">
                                    <div className="col-sm-6 p-0" style={{width: "30px"}}>
                                        <FontAwesomeIcon icon={piece} className="w-100"/>
                                    </div>
                                    <div className="col-sm-6 p-0" style={{width: "30px"}}>
                                        {/* {console.log(pieceNameToIdx[idx])} */}
                                        <span>X {colorOfUser === 'white' ? killedWhites[pieceNameToIdx[idx]] : killedBlacks[pieceNameToIdx[idx]]}</span>
                                    </div>
                                </div>
                            </div>
                        )
                    }) }
                </div>
            </div>
        </div>
    )
}

export default Board;