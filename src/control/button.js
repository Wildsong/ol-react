import React, {useState, useContext, useEffect} from 'react';  // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types'
import {MapContext} from '../map-context'
import olExtButton from 'ol-ext/control/Button'

const Button = (props) => {
    const map = useContext(MapContext);
    const [control] = useState(new olExtButton(props));
    useEffect(() => {
        map.addControl(control);
        return () => {
            map.removeControl(control);
        }
    }, []);
    return null;
}
Button.propTypes = {
    className: PropTypes.string,
    title: PropTypes.string,
    html: PropTypes.string,
    handleClick: PropTypes.func,
};

export default Button;
