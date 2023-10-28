import PropTypes from 'prop-types';
import './LoginForm.css';

const LoginForm = ({ setUsername, setPassword, handleLogin }) => {
    return (
        <form className='login-form' onSubmit={handleLogin}>
            <div>
                <label htmlFor="username">Username</label>
                <input type="text" name="username" id="username" onChange={({ target }) => setUsername(target.value)} />
            </div>
            <div>
                <label htmlFor="password">Password</label>
                <input type="password" name="password" id="password" onChange={({ target }) => setPassword(target.value)} />
            </div>

            <button id='login-button' type="submit">Log in</button>
        </form>
    );
}

LoginForm.prototype = {
    setUsername: PropTypes.func.isRequired,
    setPassword: PropTypes.func.isRequired,
    handleLogin: PropTypes.func.isRequired,
}

export default LoginForm;