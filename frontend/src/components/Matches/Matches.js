import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api_call from '../../utils/API_CALL';
import Card from "../Card/Card";
import displayDateAndTime from '../../utils/displayDateAndTime';
import "./Matches.css";

const Matches = (props) => {

    const [games, setGames] = useState([]);
    const [winner, setWinner] = useState('both');
    const [order, setOrder] = useState('-startedAt');
    const [pageNo, setPageNo] = useState(1);
    const [maxPageNo, setMaxPageNo] = useState(0);
    const [fetchedData, setFetchedData] = useState(false);

    // useEffect(() => {
    //     const make_call = async () => {
    //         const data = await api_call('/game/matches', 'GET');

    //         console.log(data);

    //         setGames(data['completedGames']);
    //     }

    //     make_call();
        
    // }, []);

    useEffect(() => {
        const getGames = async () => {
            const data = await api_call('/game/matches', 'POST', {
                limit: 5,
                filterBasedOn: order,
                page: pageNo,
                winner: winner
            });

            console.log(data);

            setMaxPageNo(data['pagesCnt']);

            setGames(data['completedGames']);

            setFetchedData(true);
        }

        getGames();

    }, [winner, order, pageNo]);

    
    const updateWinner = (e) => {
        setWinner(e.target.value);
        // setStatus();
    }

    const updateOrderOfMatches = (e) => {
        setOrder(e.target.value);
    }

    const next = () => {
        if(pageNo === maxPageNo) return;
        setPageNo(() => pageNo + 1);
    }

    const previous = () => {
        if(pageNo === 1) return;
        setPageNo(() => pageNo - 1);
    }

    return (
        <div className="mt-3">
            <h2 className="text-center">Past Matches</h2>
            <div className="row mt-3">  
                <div className="col-sm-4"></div>
                <div className="col-sm-4 text-center">
                <div className="row">
                    <div className="col-sm-6">
                        <select className="form-select" defaultValue="both" aria-label="Default select example" onChange={updateWinner}>
                            <option value="both">Winner</option>
                            <option value="self">Self</option>
                            <option value="opponent">Opponent</option>
                        </select>
                    </div>

                    <div className="col-sm-6">
                        <select className="form-select" defaultValue="-startedAt" aria-label="Default select example" onChange={updateOrderOfMatches}>
                            <option value="-startedAt">Newest First</option>
                            <option value="+startedAt">Oldest First</option>
                        </select>
                    </div>
                </div>
                {
                    !fetchedData 
                    &&
                    <div class="text-center mt-3">
                        <div class="spinner-border" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                    </div>
                }
                    {
                        games.length !== 0 
                        && 
                        fetchedData
                        &&
                        games.map((game, idx) => {
                            return (
                                <Card key={idx} margin="10px" padding="10px" hover={true}>
                                    <div style={{borderBottom: "1px solid black"}}>
                                        <div><strong>Match: </strong>{game.user1.username} vs {game.user2.username}</div>
                                        <div><strong>Winner:</strong> {game.winner}</div>
                                        <Link to={`${game.user1.username}/${game.user2.username}/${game.roomId}`} style={{color: "#00509d"}}>More Details</Link>
                                    </div>
                                    <div>{displayDateAndTime(game.gameStartedAt)}</div>
                                </Card>
                            )
                        })
                    }
                    {
                        games.length === 0
                        && 
                        fetchedData
                        &&
                        <div className="text-center mt-3">No Matches to show</div>
                    }
                     {
                        games.length !== 0 
                        && 
                        fetchedData
                        &&
                        <div className="text-center mb-3">
                            <button className="btn btn-outline btn-outline-secondary me-3" onClick={previous}>Previous</button>
                            <span>{pageNo} of {maxPageNo}</span>
                            <button className="btn btn-outline btn-outline-secondary ms-3" onClick={next}>Next</button>
                        </div>
                    }
                </div>
                <div className="col-sm-4"></div>
            </div>
        </div>
    )
}

export default Matches;