import { useRef, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Card from "../Card/Card";
import Toast from "../Toast/Toast";
import "./Register.css";

const Register = () => {

    const navigate = useNavigate();

    const [showToast, setShowToast] = useState(false);

    const [toastData, setToastData] = useState('');

    useEffect(() => { 
        if(localStorage.getItem('userId')) {
            navigate('/');
        }
    }, []);

    const nameRef = useRef();
    const usernameRef = useRef();
    const passwordRef = useRef();
    const emailRef = useRef();

    const register = async (e) => {
        e.preventDefault();

        const registrationFormData = {
            name: nameRef.current.value, 
            username: usernameRef.current.value,
            password: passwordRef.current.value,
            email: emailRef.current.value
        };

        console.log(registrationFormData);

        const response = await fetch("/user/register", {
            method: "POST", 
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify(registrationFormData)
        });

        const res = await response.json();

        console.log(res);

        if(res.message === 'success') {
            navigate('/login');
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
                <Card height="450px">
                    <div className="row">
                        <div className="col-sm-1"></div>
                        <div className="col-sm-10">
                            <form onSubmit={register}>
                                <h1 className="text-center mt-3">Register</h1>
                                <div className="form-floating mt-5">
                                    <input type="text" className="form-control" id="floatingName" placeholder="name" ref={nameRef}/>
                                    <label htmlFor="floatingName">Name</label>
                                </div>
                                <div className="form-floating">
                                    <input type="text" className="form-control" id="floatingUsername" placeholder="username" ref={usernameRef}/>
                                    <label htmlFor="floatingUsername">Username</label>
                                </div>
                                <div className="form-floating">
                                    <input type="email" className="form-control" id="floatingEmail" placeholder="E-mail" ref={emailRef}/>
                                    <label htmlFor="floatingEmail">E-mail</label>
                                </div>
                                <div className="form-floating">
                                    <input type="password" className="form-control" id="floatingPassword" placeholder="Password" ref={passwordRef}/>
                                    <label htmlFor="floatingPassword">Password</label>
                                </div>
                                <div className="row mt-3">
                                    <div className="col-sm-6">
                                        <button className="btn btn-outline btn-outline-secondary float-end">Register</button>
                                    </div>
                                    <div className="col-sm-6">
                                        <button className="btn btn-outline btn-outline-secondary">Login</button>
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

export default Register;