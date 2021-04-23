import Modal from '../components/Modal';
import { useHistory } from 'react-router';

import '../styles/login.css';

export default function Login() {

    let history = useHistory();

    function doFakeLogin() {
        history.push('/user');
        // login(true);
    }

    return (
        <Modal title='Login'>
            <div className='login-modal-container'>
                <form>
                    <label>
                        <p>Username</p>
                        <input type="text" placeholder="user.name" />
                    </label>
                    <label>
                        <p>Password</p>
                        <input type="password" placeholder="•••••••••••••" />
                    </label>
                    <div>
                        <button type="button" onClick={() => { doFakeLogin() }}>Login</button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}