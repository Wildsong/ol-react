import React, {useState, useContext, useEffect} from 'react';  // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types'
import {MapContext} from '../map-context'
import olExtTextButton from 'ol-ext/control/TextButton'

const TextButton = (props) => {
    const map = useContext(MapContext);
    const [control] = useState(new olExtTextButton(props));
    useEffect(() => {
        map.addControl(control);
        return () => {
            map.removeControl(control);
        }
    }, []);
    return null;
}
TextButton.propTypes = {
    className: PropTypes.string,
    title: PropTypes.string,
    html: PropTypes.string,
    handleClick: PropTypes.func,
};

export default TextButton;
