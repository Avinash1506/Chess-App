// import { useNavigate } from "react-router-dom";


const Toast = (props) => {
    // const navigate = useNavigate();

    // const navigateToGame = (fromUsername, toUsername, roomId) => {   
    //     console.log(roomId);
    //     navigate({
    //         pathname: '/game',
    //         search: `?username1=${fromUsername}&username2=${toUsername}&roomid=${roomId}`,
    //     });
    // }

    return (
        <div className="toast show" role="alert" aria-live="assertive" aria-atomic="true" data-bs-autohide="false" style={{position: "fixed", right: "0", bottom: "0"}}>
            <div className="toast-header">
                {/* <img src="..." className="rounded me-2" alt="..." /> */}
                <strong className="me-auto">Message</strong>
                <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div className="toast-body">
                <div>{props.content}</div>
                {/* <div>Check notifications tab</div> */}
            </div>
        </div>
    )
}

export default Toast;