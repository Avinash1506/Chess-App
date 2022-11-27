import Card from "../Card/Card";
import {useEffect, useState} from 'react';
import api_call from '../../utils/API_CALL';
import Chart from 'chart.js/auto';
import {Bar, Line} from 'react-chartjs-2';
import {displayYear} from '../../utils/displayDateAndTime';
import {currentYear} from '../../utils/displayDateAndTime';

const Profile = () => {

    const [userData, setUserData] = useState({});
    const [gameData, setGameData] = useState({});

    const [barChartData, setBarChartData] = useState({
        labels: [],
        datasets: [{
            label: '',
            data: [],
            backgroundColor: [],
            borderColor: [],
        }]
    });
    const [lineChartData, setLineChartData] = useState({
        labels: [currentYear],
        datasets: [{
            label: '',
            data: [],
            fill: false,
            borderColor: '',
            tension: 0.1
        }]
    })

    let myChart

    useEffect(() => {
        const getUser = async () => {
            const data = await api_call('/user/getUserProfile', 'GET');

            const gameDataBackend = await api_call('/game/userMatches', 'GET');

            console.log(gameDataBackend);

            console.log(data);

            const gameObj = {};

            for(let game of gameDataBackend['data']) {
                gameObj[game['roomId']] = game;
            }

            setGameData(gameObj);

            const sze = data['rating'].length;
            let rating = {};

            if(sze === 0) {
                rating['rating'] = 0;
            } else {
                rating = data['rating'][sze - 1];
            }

            console.log(data['rating']);
            console.log("rating: ", rating);
            setUserData({won: data['matchesWon'], lost: data['matchesLost'], played: data['matchesPlayed'], ratingArr: data['rating'], rating: Math.round(rating['rating'])});
        }

        getUser();
    }, []);

    useEffect(() => {
    
        if(userData != {}) {
            const labels = ['Won', 'Lost'];

            const data = {
                labels: labels,
                datasets: [{
                    label: 'Count of matches',
                    data: [userData['won'], userData['lost']],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgb(255, 99, 132)',
                        'rgb(255, 159, 64)'
                    ],
                    borderWidth: 1
                }]
            };
            
            setBarChartData(data);
        }
    }, [userData]);

    useEffect(() => {
        if(userData['ratingArr']) {
            const ratings = userData['ratingArr']
            console.log(ratings);

            const roundedRating = ratings.map((rating) => {
                return Math.round(rating.rating)
            })

            let labels = [];
            
            for(let rating of ratings) {
                labels.push(displayYear(gameData[rating['roomId']]['gameStartedAt']));
            }

            // const labels = roundedRating;

            if(labels.length === 0) {
                labels = [currentYear()];
            }

            console.log(labels);
            const data = {
                labels: labels,
                datasets: [{
                    label: 'Rating',
                    data: roundedRating,
                    fill: false,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }]
            };

            setLineChartData(data);
        }   

    }, [userData]);

    return (
        <div className="row mt-3">
            <div className="col-sm-3"></div>
            <div className="col-sm-6">
                <Card >
                    <div className="text-center">
                        {
                            console.log(userData)
                        }
                        <h1 style={{borderBottom: "1px solid black"}}>{localStorage.getItem('username')}</h1>
                        <table className="w-100 text-center">
                            <tr>
                                <td style={{width: "60%"}}>
                                    <h3>Games Played:</h3>
                                </td> 
                                <td className="text-start">
                                    <h3>{userData['played']}</h3>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <h3>Games Won:</h3>
                                </td> 
                                <td className="text-start">
                                    <h3>{userData['won']}</h3>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <h3>Games Lost:</h3>
                                </td> 
                                <td className="text-start">
                                    <h3>{userData['lost']}</h3>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <h3>Rating:</h3>
                                </td> 
                                <td className="text-start">
                                    <h3>{userData['rating']}</h3>
                                </td>
                            </tr>
                        </table>
                    </div>
                </Card>
                <Bar data={barChartData} />
                <Line data={lineChartData} />
            </div>
            <div className="col-sm-3"></div>
        </div>
    )
}

export default Profile;