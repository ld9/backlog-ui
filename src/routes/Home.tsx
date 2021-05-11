import { useContext } from "react";
import { Link } from "react-router-dom";

import '../styles/home.css'

export default function Home() {

    return (
        <div className='grid-container'>
            <div className='title-header'>
                <h1>Backlog</h1>
                {/* <h2>{ auth.user ? "false" : "true" }</h2> */}
            </div>
            <div className='link-box'>
                <span>
                    <Link to='/create-account'>Create Account</Link>
                </span>
                <span>
                    <Link to='/login'>Log In</Link>
                </span>
            </div>
        </div>
    );
}