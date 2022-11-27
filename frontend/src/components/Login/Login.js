import { useEffect, useRef, useState } from "react";
import {useNavigate} from 'react-router-dom';
import Card from "../Card/Card";
import Toast from "../Toast/Toast";
import "./Login.css";

const Login = () => {

    const navigate = useNavigate();

    const [showToast, setShowToast] = useState(false);

    const [toastData, setToastData] = useState('');

    // const [messageFromBackend, setMessageFromBackend] = useState('');

    useEffect(() => { 
        if(localStorage.getItem('userId')) {
            navigate('/');
        }
    }, []);

    const usernameRef = useRef();
    const passwordRef = useRef();

    const login = async (e) => {
        e.preventDefault();

        const loginFormData = {
            username: usernameRef.current.value, 
            password: passwordRef.current.value
        }

        const response = await fetch("/user/login", {
            method: "POST",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(loginFormData)
        })

        const res = await response.json();

        console.log(res.message);

        if(res.message === 'success') {
            localStorage.setItem("token", res['jwt']);
            localStorage.setItem("username", res['userdata']);
            navigate("/");
        } else {
            // setMessageFromBackend(res.message);
            setShowToast(true);
            console.log(res.message);
            setToastData(res.message);

            setTimeout(() => { 
                setShowToast(false);
            }, 3000);
        }
    }

    return (
        <div className="row mt-3">
            {showToast && <Toast content={toastData} />}
            <div className="col-sm-4"></div>
            <div className="col-sm-4">
                <Card height="350px">
                    <div className="row">
                        <div className="col-sm-1"></div>
                        <div className="col-sm-10">
                            <form onSubmit={login}>
                                <h1 className="text-center mt-3">Login</h1>
                                <div className="form-floating mt-5">
                                    <input type="text" className="form-control" id="floatingInput" placeholder="username" ref={usernameRef}/>
                                    <label htmlFor="floatingInput">Username</label>
                                </div>
                                <div className="form-floating">
                                    <input type="password" className="form-control" id="floatingPassword" placeholder="Password" ref={passwordRef}/>
                                    <label htmlFor="floatingPassword">Password</label>
                                </div>
                                <div className="row mt-3">
                                    <div className="col-sm-6">
                                        <button className="btn btn-outline btn-outline-secondary float-end">Login</button>
                                    </div>
                                    <div className="col-sm-6">
                                        <button className="btn btn-outline btn-outline-secondary">Register</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="col-sm-1"></div>
                    </div>
                </Card>
            </div>
            <div className="col-sm-4"></div>
        </div>
    );
}

export default Login;