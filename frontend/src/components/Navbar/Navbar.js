import { Link } from "react-router-dom";
import {BrowserRouter as Router, Route, Routes, useNavigate} from 'react-router-dom';
import "./Navbar.css";

const Navbar = (props) => {

    const navigate = useNavigate();


    const logout = async () => {
        await fetch("/user/logout", { 
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }, 
            data: localStorage.getItem('username')
          });
      
        localStorage.removeItem("username");
        localStorage.removeItem("token");
        navigate('/');
    }

    return (
        // <Router>
            <nav className="navbar navbar-expand-sm bg-light boxShadow">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/">Chess</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse d-flex justify-content-end" id="navbarNav">
                        <ul className="navbar-nav">
                            {/* <li className="nav-item">
                                <Link className="nav-link" aria-current="page" to="/">Home</Link>
                            </li> */}
                            <li className="nav-item">
                                {!localStorage.getItem('username') && <Link className="nav-link" to="/login">Login</Link>}
                            </li>
                            <li className="nav-item">
                                {!localStorage.getItem('username') && <Link className="nav-link" to="/register">Register</Link>}
                            </li>
                            <li className="nav-item">
                                {localStorage.getItem('username') && <Link className="nav-link" to="/search">Play</Link>}
                            </li>
                            <li className="nav-item">
                                {localStorage.getItem('username') && <Link className="nav-link" to="/notifications">Notifications</Link>}
                            </li>
                            <li className="nav-item">
                                {localStorage.getItem('username') && <Link className="nav-link" to="/matches">History</Link>}
                            </li>
                            {/* <li className="nav-item">
                                {localStorage.getItem('username') && <div className="nav-link logout" onClick={logout}>Logout</div>}
                            </li>
                            <li className="nav-item">
                                {localStorage.getItem('username') && <div className="nav-link">{localStorage.getItem('username')}</div>}
                            </li> */}
                            <li className="nav-item dropdown">
                                {
                                    localStorage.getItem('username')
                                    &&
                                    <div>
                                        <button className="dropdownBtn bg-light nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown" aria-expanded="false">
                                            {localStorage.getItem('username')}
                                        </button>
                                        <ul className="dropdown-menu dropdown-menu-end p-0 logout">
                                            <li className="nav-item">
                                                {localStorage.getItem('username') && <Link className="nav-link text-center" to="/profile">Profile</Link>}
                                            </li>
                                            <li className=""><div className="nav-link text-center" onClick={logout}>Logout</div></li>
                                        </ul>
                                    </div>
                                }
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            // <Routes>
            //     <Route path="/" element={<Home />}></Route>
            //     <Route path="/login" element={<Login />}></Route>
            //     <Route path="/register" element={<Register />}></Route>
            // </Routes>
        // </Router>
    )
}

export default Navbar;