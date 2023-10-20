import PropTypes from 'prop-types';

const Toggable = (props) => {

    const hideWhenVisible = { display: props.visible ? 'none' : '' }
    const showWhenVisible = { display: props.visible ? '' : 'none' }

    return (
        <div>
            <div style={hideWhenVisible}>
                <button onClick={props.toggleVisibility}>{props.buttonLabel}</button>
            </div>
            <div style={showWhenVisible}>
                <h2>{props.title}</h2>
                {props.children}
                <button onClick={props.toggleVisibility}>cancel</button>
            </div>
        </div>
    )
}

Toggable.prototype = {
    buttonLabel: PropTypes.string.isRequired
}

Toggable.displayName = 'Toggable';

export default Toggable;