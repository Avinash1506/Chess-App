import "./Search.css";
import { useEffect, useRef, useState } from 'react';
import {useNavigate} from 'react-router-dom';
import Card from '../Card/Card';

var socket;

const Search = (props) => {
    const navigate = useNavigate();
    useEffect(() => {
        socket = props.socket;
    }, []);

    useEffect(()=>{ 
        if(!localStorage.getItem('token')) {
            console.log("Hello in search if");
            navigate('/');
        }
    }, []);

    const nameRef = useRef();

    const [uniqueNames, setUniqueNames] = useState([]);    
    const [uniqueNameAndUsernames, setUniqueNameAndUsernames] = useState({});
    const [searchName, setSearchName] = useState('');

    const getNames = async () => {
        console.log(nameRef.current.value);
        let searchValue = {searchValue: nameRef.current.value, username: localStorage.getItem('username')};
        if(searchValue.searchValue !== '') {
            //make api call 
            const response = await fetch("/user/search", { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }, 
                body: JSON.stringify(searchValue)
            });

            const res = await response.json();

            console.log(res);

            //extract array of unique names from response

            const uniqueNameAndUsernamesVar = {};
            const uniqueNamesVar = [];

            for(let val of res['userData']) {
                if(uniqueNameAndUsernamesVar[val['name']]) {
                    uniqueNameAndUsernamesVar[val['name']].push(val['username']);
                } else {
                    uniqueNameAndUsernamesVar[val['name']] = [val['username']];
                    uniqueNamesVar.push({id: val['_id'], name: val['name']});
                }
            }

            setUniqueNames(uniqueNamesVar);
            setUniqueNameAndUsernames(uniqueNameAndUsernamesVar);
        } else {
            setUniqueNames([]);
        }
    };

    const debounce = (fn, time) => {
        let timer;
        return function () {
            let context = this, args = arguments;

            clearTimeout(timer);

            timer = setTimeout(()=> {
                fn.apply(context, args);
            }, time);
        }
    }

    const getUsers = (name) => {
        setSearchName(name);
        setUniqueNames([]);
    }

    const play = async (e, data) => {
        const body = {users: [], time: ''};
        body['users'].push(localStorage.getItem('username'));
        body['users'].push(data);

        body['time'] = new Date();

        const response = await fetch('/game/newgame', { 
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }, 
            body: JSON.stringify(body)
        });
        const res = await response.json();
        console.log(res);

        socket.emit('notification', {fromUsername: res.user1.username, toUsername: res.user2.username, roomId: res.roomId});
        
        navigate({
            pathname: '/game',
            search: `?username1=${res.user1.username}&username2=${res.user2.username}&roomid=${res.roomId}`,
        });
    }

    const betterFunction = debounce(getNames, 300);

    return (
        <div className="row">
            <div className="col-sm-2"></div>
            <div className="col-sm-8">
                <h1 className="text-center mt-3">Search user's based on their names</h1>
                <div className="row">
                    <div className="col-sm-2"></div>
                    <div className="col-sm-8">
                        <div className="row">
                            <div className="col-sm-2"></div>
                            <div className="col-sm-8">
                                <div className="form-floating mt-5">
                                    <input type="text" ref={nameRef} id="floatingName" className="w-100 form-control" placeholder="search by name" onKeyUp={betterFunction} autoComplete="off" />
                                    <label htmlFor="floatingName">Name</label>
                                </div>
                                {
                                    uniqueNames.length !== 0 
                                    && 
                                    <div className="card noShadow p-2">
                                        {
                                            uniqueNames.map((data, idx) => {
                                                return (
                                                    <div className="searchedNames" key={data['id']} style={{borderBottom: idx !== uniqueNames.length - 1 ? '1px solid black' : '', cursor: 'pointer'}} onClick={(data)=>{console.log("data 114: ", data.target.innerHTML); getUsers(data.target.innerHTML)}}>
                                                        <h6 className="m-1">{data['name']}</h6>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                }
                            </div>
                            <div className="col-sm-4"></div>
                        </div>

                        {
                    searchName !== '' 
                    &&
                    uniqueNameAndUsernames[searchName] !== undefined
                    &&
                    uniqueNameAndUsernames[searchName].length !== 0
                    &&
                    <div className="mt-3">
                        {
                            uniqueNameAndUsernames[searchName].map((data, index) => {
                                console.log(data);
                                return (
                                    <Card key={index} padding="16px" margin="16px" hover={true}>
                                        <div className="row">
                                            <div className="col-sm-8">
                                                <div><strong>Username:</strong> {data}</div>
                                                <div><strong>Name:</strong> {searchName}</div>
                                            </div>
                                            {
                                                data !== localStorage.getItem('username')
                                                &&
                                                <button className="col-sm-4 btn btn-outline btn-outline-secondary w-25 h-25" onClick={(e) => {play(e, data)}}>
                                                    Play
                                                </button>
                                            }
                                        </div>
                                    </Card>
                                )
                            })
                        }  
                    </div>
                }
                    </div>
                    <div className="col-sm-2"></div>
                </div>
            </div>
            <div className="col-sm-2"></div>
        </div>
    )
}

export default Search;