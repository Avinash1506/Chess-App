import "./Home.css";
import AOS from "aos";
import 'aos/dist/aos.css';
import {useEffect} from 'react';
import { faChessKing as ChessKingWhite} from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Home = () => {

    // document.querySelector(window).scroll().scroll(); //invoke scroll-handler on page-load

    // const scrollEvent = (e) => {
    //     console.log("Hello");
    //     console.log(e);
    //     // var windowBottom = e.currentTarget.scrollTop + e.currentTarget.innerHeight();
    //     // // document.querySelector(".fade").each(function() {
    //     // /* Check the location of each desired element */
    //     //     var objectBottom = e.currentTarget.offset().top + e.currentTarget.outerHeight();
            
    //     //     /* If the element is completely within bounds of the window, fade it in */
    //     //     if (objectBottom < windowBottom) { //object comes into view (scrolling down)
    //     //         if (e.currentTarget.css("opacity")==0) {e.currentTarget.fadeTo(500,1);}
    //     //     } else { //object goes out of view (scrolling up)
    //     //         if (e.currentTarget.css("opacity")==1) {e.currentTarget.fadeTo(500,0);}
    //     //     }
    //     // });
    // }

    useEffect(() => {
        AOS.init();
    }, []);
    return (
        <div className="mt-3 ms-3 me-3">
            <h1 className="text-center">
                This is a 2 Player Chess Application
            </h1>
            <div className="text-center">
                <video autoPlay muted loop style={{height: "512px"}}>
                    <source src={process.env.PUBLIC_URL+"home_video.mp4"} type="video/mp4" loading="lazy"/>
                </video>
            </div>
            
            <div className="mt-5">
                <div className="margbtm arrow_box_right" data-aos="fade-right" data-aos-duration="1200">
                    {/* <div className="col-sm-1"></div> */}
                    <h1 className="text-center"><strong>Play</strong></h1><br />
                    <div className="row">
                        <div className="col-sm-8 video d-flex flex-coulmn m-auto">                    
                            <video autoPlay muted loop className="ms-2">
                                <source src={process.env.PUBLIC_URL+"play_video.mp4"} type="video/mp4" loading="lazy"/>
                            </video>
                        </div>
                        <div className="col-sm-3 d-flex flex-coulmn m-auto">
                            <div className="video">Click on this tab to search for any user based on name and then simple play the game. The other person will be notified about the game.</div>
                        </div>
                        <div className="col-sm-1"></div>
                        {/* </div> */}
                    </div>
                </div>
                
                <div className="margbtm arrow_box_left" data-aos="fade-left" data-aos-duration="1200">
                    {/* data-mdb-animation-start="onHover"  */}
                    <h1 className="text-center"><strong>Notifications</strong></h1><br />
                    <div className="row">
                        <div className="col-sm-1"></div>
                        <div className="col-sm-3">
                            {/* <strong>Notifications:</strong><br /> */}
                            <div className="video">Here you can find all the games and there status. Sattus is displayed as active which means that the game is not finished else it displays the winner of the game</div>
                        </div>
                        <div className="col-sm-8 video">
                            <video autoPlay muted loop className="me-2">
                                <source src={process.env.PUBLIC_URL+"notifications_video.mp4"} type="video/mp4" loading="lazy"/>
                            </video>
                        </div>
                    </div>
                </div>

                <div className="margbtm arrow_box_right" data-aos="fade-right" data-aos-duration="1200">
                    <h1 className="text-center"><strong>History</strong></h1><br />
                    <div className="row">
                        <div className="col-sm-8 video">
                            <video autoPlay muted loop className="ms-2">
                                <source src={process.env.PUBLIC_URL+"history_video.mp4"} type="video/mp4" loading="lazy"/>
                            </video>
                        </div>
                        <div className="col-sm-3">
                            {/* <strong>History:</strong><br /> */}
                            <div className="video">Here You will find all the games that are finished. Select any particular game to analyze the all the moves made by you aswell as the opponent</div>
                        </div>
                        <div className="col-sm-1"></div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Home;