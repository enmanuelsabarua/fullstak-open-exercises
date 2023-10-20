import PropTypes from 'prop-types';

const LoginForm = ({ setUsername, setPassword, handleLogin }) => {
    return (
        <form onSubmit={handleLogin}>
            <div>
                <label htmlFor="username">
                    username
                    <input type="text" name="username" id="username" onChange={({ target }) => setUsername(target.value)}/>
                </label>
            </div>
            <div>
                <label htmlFor="password">
                    password
                    <input type="password" name="password" id="password" onChange={({ target }) => setPassword(target.value)}/>
                </label>
            </div>

            <button id='login-button' type="submit">log in</button>
        </form>
    );
}

LoginForm.prototype = {
    setUsername: PropTypes.func.isRequired,
    setPassword: PropTypes.func.isRequired,
    handleLogin: PropTypes.func.isRequired,
}

export default LoginForm;