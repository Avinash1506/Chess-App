import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api_call from '../../utils/API_CALL';
import Card from "../Card/Card";
import Square from "../Square/Square";
import {BoardArray, blackPieces, whitePieces} from '../../utils/BoardArray';
import { faForwardFast as endIcon} from '@fortawesome/free-solid-svg-icons';
import { faForwardStep as nextIcon} from '@fortawesome/free-solid-svg-icons';
import { faBackwardFast as startIcon} from '@fortawesome/free-solid-svg-icons';
import { faBackwardStep as prevIcon} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Match = (props) => {

    const navigate = useNavigate();
    const [match, setMatch] = useState([]);
    const [board, setBoard] = useState(BoardArray);
    const { username1, username2, roomId } = useParams();
    const rowNums = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const [colorOfUser, setColorOfUser] = useState('');
    const [moveIdx, setMoveIdx] = useState(-1);
    const [startMove, setStartMove] = useState(true);
    const [endMove, setEndMove] = useState(false);
    const [prevMove, setPrevMove] = useState(false);
    const [nextMove, setNextMove] = useState(false);
    const [dehighlightCell1, setDehighlightCell1] = useState([]);
    const [dehighlightCell2, setDehighlightCell2] = useState([]);

    const highlightCell = "3px solid #00b3ff";
    
    useEffect(() => {
        const make_call = async () => {
            const data = await api_call(`/game/matches/${roomId}`, 'GET');
            console.log(data['moves']);
            setMatch(data['moves']);

            // const gameObj = await api_call(`/game/gameDetails/${roomId}`, 'GET');
            // console.log(gameObj);
        }

        make_call();
        
    }, []);

    const highlightAndDehighlight = (idxArray, match, op) => {
        for(let i = 0; i < idxArray.length; i++) {
            let idx = idxArray[i];
            let prevX = match[idx]['prevX'];
            let prevY = match[idx]['prevY'];
            let nextX = match[idx]['nextX'];
            let nextY = match[idx]['nextY'];

            let prevCellClass = 'row' + prevX + ' col' + prevY;
            let nextCellClass = 'row' + nextX + ' col' + nextY;

            let ele1 = document.getElementsByClassName(prevCellClass)[0];
            let ele2 = document.getElementsByClassName(nextCellClass)[0];

            ele1.style.border = (((idxArray.length === 1 && op === 'next') || i%2 === 1) ? highlightCell : '');

            ele2.style.border = (((idxArray.length === 1 && op === 'next') || i%2 === 1) ? highlightCell : '');

            // setDehighlightCell1((((idxArray.length === 1 && op === 'next') || i%2 === 1) ? idxArray[i] : []));
        }
    }

    const makeAMoveNext = (idx) => {

        let boardCopy = JSON.parse(JSON.stringify(board));

        if(boardCopy[match[idx]["nextX"]][match[idx]["nextY"]].piece === 'king') {
            // setGameEnd(true);
            // setEndMove(true);
            // let wnr;
            // if(data['oppositeColor'] === 'black') {
            //     setWinner(username1);
            //     wnr = username1;
            // }
            // else if(data['oppositeColor'] === 'white') {
            //     setWinner(username2);
            //     wnr = username2;
            // }

            // socket.emit('game-end', {roomId: roomId, winner: wnr});
        }

        // console.log(data['prevX'], data['prevY'],data['nextX'], data['nextY'])
        
        // if(boardCopy[data['nextX']][data['nextY']].piece !== '') {
        //     const piece = boardCopy[data['nextX']][data['nextY']].piece;
        //     // console.log(killedWhites);
        //     if(boardCopy[data['nextX']][data['nextY']].color === 'white') {
        //         // console.log("in white");
        //         console.log(killedWhites);
        //         // const obj = {...killedWhites};
        //         // console.log(killedWhites);
        //         // obj[piece]++;
        //         setKilledWhites({...killedWhites, piece: 10});
        //         // console.log("Hello");
        //     } else {
        //         // console.log("in black");
        //         const obj = {...killedBlacks};
        //         obj[piece]++;
        //         setKilledBlacks({...killedBlacks, piece: 10});
        //     }
        // }

        const boardCopyObj = {...boardCopy[match[idx]["prevX"]][match[idx]["prevY"]]};

        boardCopy[match[idx]["nextX"]][match[idx]["nextY"]] = boardCopyObj;
        boardCopy[match[idx]["prevX"]][match[idx]["prevY"]] = {icon: '', color: '', piece: ''};
        
        let idxArray = [];

        if(idx !== 0) {
            idxArray.push(idx - 1);
        }

        idxArray.push(idx);

        console.log(idxArray);

        highlightAndDehighlight(idxArray, match, 'next');

        setBoard(boardCopy);
        // console.log(boardCopy);

    }

    const makeAMovePrev = (idx) => {
        console.log(idx);
        let boardCopy = JSON.parse(JSON.stringify(board));

        if(boardCopy[match[idx+1]["prevX"]][match[idx+1]["prevY"]].piece === 'king') {
        }
        const boardCopyObj = {...boardCopy[match[idx+1]["nextX"]][match[idx+1]["nextY"]]};

        console.log(idx+1);
        console.log(boardCopy[match[idx+1]["prevX"]][match[idx+1]["prevY"]]);
        console.log(boardCopy[match[idx+1]["nextX"]][match[idx+1]["nextY"]]);

        let idxArray = [];

        idxArray.push(idx + 1);

        if(idx !== -1)
            idxArray.push(idx);

        highlightAndDehighlight(idxArray, match, 'prev');

        boardCopy[match[idx+1]["prevX"]][match[idx+1]["prevY"]] = boardCopyObj;
        boardCopy[match[idx+1]["nextX"]][match[idx+1]["nextY"]] = match[idx+1]['killed'];

        setBoard(boardCopy);
        // console.log(boardCopy);

    }

    const makeAMoveStart = () => {
        setBoard(BoardArray);
    }

    const makeAMoveEnd = (indx) => {

        let boardCopy = JSON.parse(JSON.stringify(BoardArray));

        for(let idx = 0; idx < match.length; idx++) {
            const boardCopyObj = {...boardCopy[match[idx]["prevX"]][match[idx]["prevY"]]};
            if(boardCopy[match[idx]["nextX"]][match[idx]["nextY"]].piece !== '') {
                match[idx]['killed'] = boardCopy[match[idx]["nextX"]][match[idx]["nextY"]];
            }
            boardCopy[match[idx]["nextX"]][match[idx]["nextY"]] = boardCopyObj;
            boardCopy[match[idx]["prevX"]][match[idx]["prevY"]] = {icon: '', color: '', piece: ''};
        }

        highlightAndDehighlight([match.length - 1], match, 'next');

        setBoard(boardCopy);
    }  


    useEffect(() => {
        if(startMove) {
            makeAMoveStart();
        } else if(endMove) {
            makeAMoveEnd(moveIdx);
        } else if(prevMove) {
            makeAMovePrev(moveIdx);
        } else if(nextMove) {
            console.log("next move");
            makeAMoveNext(moveIdx);
        }
    }, [moveIdx, startMove, endMove, prevMove, nextMove]);

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

    let idx = -1;

    const start = () => {
        // setMoveIdx(0);
        // console.log(match);
        if(moveIdx === -1) return;

        highlightAndDehighlight([moveIdx], match, "start");
        
        setMoveIdx(-1);
        setStartMove(true);
        setPrevMove(false);
        setNextMove(false);
        setEndMove(false);
    }

    const end = () => {
        // setMoveIdx(0);
        // console.log(match);
        if(moveIdx === match.length - 1) return;

        if(moveIdx !== -1) {
            highlightAndDehighlight([moveIdx], match, "end");
        }

        setMoveIdx(match.length-1);
        setStartMove(false);
        setPrevMove(false);
        setNextMove(false);
        setEndMove(true);
    }

    const prev = () => {
        // setMoveIdx(0);
        // console.log(match);
        if(moveIdx === -1) return;

        setMoveIdx((idx) => {return idx-1});
        setStartMove(false);
        setPrevMove(true);
        setNextMove(false);
        setEndMove(false);
    }

    const next = () => {
        // setMoveIdx(0);
        // console.log(match);
        if(moveIdx === match.length - 1) return;

        setMoveIdx((idx) => {return idx+1});
        setStartMove(false);
        setPrevMove(false);
        setNextMove(true);
        setEndMove(false);
    }

    return (
        // <div className="row mt-3">  
        //     <div className="col-sm-2"></div>
        //     <div className="col-sm-8">
        //         <div className="row">
        //             <div className="col-sm-4"></div>
        //             <div className="col-sm-4">
        //                 {
        //                     match.length !== 0 
        //                     && 
        //                     match.map((move, idx) => {
        //                         return (
        //                             <div className="text-center" key={idx}>
        //                                 <Card margin="10px">
        //                                     <div>Username: {move.username}</div>
        //                                     <div>Color: {move.color}</div>
        //                                     <div>From: {String.fromCharCode(65+move.prevY)}{8-move.prevX}</div>
        //                                     <div>To: {String.fromCharCode(65+move.nextY)}{8-move.nextX}</div>
        //                                 </Card>
        //                             </div>
        //                         )
        //                     })
        //                 }
        //             </div>
        //             <div className="col-sm-4"></div>
        //         </div>
        //     </div>
        //     <div className="col-sm-2"></div>
        // </div>
        <div className="row mt-2">
            <h1 className="text-center">Analyze your game</h1>
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
                        <div className="board" style={{transform: colorOfUser === 'black' ? "rotate(180deg)" : ''}}> 
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
                                                        // highlight = {nextMove[idx] === true ? 'yes' : 'no'}
                                                        hightlight = "no"
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
            <div className="col-sm-5 d-flex flex-column" style={{marginTop: "24px"}}>
                <div>
                    <div>
                        <button onClick={start} className="ms-2 me-2 btn btn-outline btn-outline-secondary text-dark" title="Start">
                            <FontAwesomeIcon icon={startIcon} size="2x" className="w-100"/>
                        </button>
                        <button onClick={prev} className="ms-2 me-2 btn btn-outline btn-outline-secondary text-dark" title="Prev">
                            <FontAwesomeIcon icon={prevIcon} size="2x" className="w-100"/> 
                        </button>
                        <button onClick={next} className="ms-2 me-2 btn btn-outline btn-outline-secondary text-dark" title="Next">
                            <FontAwesomeIcon icon={nextIcon} size="2x" className="w-100"/>
                        </button>
                        <button onClick={end} className="ms-2 me-2 btn btn-outline btn-outline-secondary text-dark" title="End">
                            <FontAwesomeIcon icon={endIcon} size="2x" className="w-100"/>
                        </button>
                    </div>
                    <div className="mt-3">
                        <h5>Use the navigation buttons above to move forward and backward in the game</h5>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Match;