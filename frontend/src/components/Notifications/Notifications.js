import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import displayDateAndTime from "../../utils/displayDateAndTime";
import api_call from '../../utils/API_CALL';
import Card from '../Card/Card';
import "./Notifications.css";

const Notifications = (props) => {
    const [notifications, setNotifications] = useState([]);
    const [status, setStatus] = useState('both');
    const [order, setOrder] = useState('-startedAt');
    const [pageNo, setPageNo] = useState(1);
    const [maxPageNo, setMaxPageNo] = useState(0);
    const [fetchedData, setFetchedData] = useState(false);

    let roomIdNot;
    const navigate = useNavigate();

    useEffect(() => {
        const getNotifications = async () => {
            const data = await api_call('/game/notifications', 'POST', {
                limit: 5,
                filterBasedOn: order,
                page: pageNo,
                status: status
            });

            console.log(data);

            setMaxPageNo(data['pagesCnt']);

            setNotifications(data['notifications']);

            setFetchedData(true);
        }

        getNotifications();

    }, [status, order, pageNo]);

    const navigateToGame = (fromUsername, toUsername, roomId) => {   
        console.log(roomId);
        navigate({
            pathname: '/game',
            search: `?username1=${fromUsername}&username2=${toUsername}&roomid=${roomId}`,
          });
    }

    const updateStatus = (e) => {
        setStatus(e.target.value);
        // setStatus();
    }

    const updateOrderOfNotifications = (e) => {
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
        <div className="row mt-3">
            <div className="col-sm-3"></div>
            <div className="col-sm-6">
                {/*  style={{border: "1px solid black"}} */}
                <div>
                    <h2 className="text-center">Notification</h2>
                    <div className="row mt-3">
                        <div className="col-sm-2"></div>
                        <div className="col-sm-8">
                            <div className="row">
                                <div className="col-sm-6">
                                    <select className="form-select" defaultValue="both" aria-label="Default select example" onChange={updateStatus}>
                                        <option value="both">Status</option>
                                        <option value="active">Active</option>
                                        <option value="finished">Finished</option>
                                    </select>
                                </div>

                                <div className="col-sm-6">
                                    <select className="form-select" defaultValue="-startedAt" aria-label="Default select example" onChange={updateOrderOfNotifications}>
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
                                notifications.length !== 0 
                                && 
                                fetchedData
                                &&
                                notifications.map((notification, idx) => {
                                    return (<Card key = {idx} padding="10px" margin="10px" hover={true}>
                                        <div className="text-center">
                                            <div style={{borderBottom: "1px solid black"}}>
                                                {notification.toUsername === localStorage.getItem('username') ? <div>{notification.fromUsername} is challenging you for a chess game.</div> : <div>You have challenged {notification.toUsername} for a chess game.</div>}
                                                <div>Click <span style={{color: '#00509d'}} className="hightlight" onClick={(e) => {console.log(notifications[idx]['roomId']); navigateToGame(notification.fromUsername, notification.toUsername, notification?.roomId)}}>here</span> to join</div>
                                                <div><strong>Status:</strong> {notification.winner === '' ? "Active" : notification.winner === localStorage.getItem('username') ? 'You Won' : notification.winner + " won"}</div>
                                            </div>
                                            <div>{displayDateAndTime(notification.gameStartedAt)}</div>
                                        </div>
                                    </Card>);
                                })
                            }
                            {
                                notifications.length === 0 
                                &&
                                fetchedData
                                &&
                                <div className="text-center mt-3">No notifications to show</div>
                            }
                            {
                            notifications.length !== 0 
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
                        <div className="col-sm-2">
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-sm-3">
            </div>
        </div>
    )
}

export default Notifications;