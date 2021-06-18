import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { strings } from "../strings";

import '../styles/home.css'

export default function Home() {

    const [dummy, dummy_s] = useState(false);
    (window as any).strings = strings;

    return (
        <div className='grid-container'>
            <div className='title-header'>
                <h1>{strings.home_appName} {strings.home_appTitle}</h1>
                <button  onClick={() => { strings.setLanguage(dummy ? 'en_short' : 'en'); dummy_s(!dummy); }}>Test</button>
                {/* <h2>{ auth.user ? "false" : "true" }</h2> */}
            </div>
            <div className='link-box'>
                <span>
                    <Link to='/create-account'>{strings.home_signup}</Link>
                </span>
                <span>
                    <Link to='/login'>{strings.home_login}</Link>
                </span>
            </div>
        </div>
    );
}