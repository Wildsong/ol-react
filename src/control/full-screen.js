import React, {useState, useContext, useEffect} from 'react'
import PropTypes from 'prop-types'
import {MapContext} from '../map-context'
import {FullScreen as olFullScreen} from 'ol/control'

const FullScreen = (props) => {
    const map = useContext(MapContext);
    const [fullscreen, setFullscreen] = useState(new olFullScreen(props));
    useEffect(() => {
        console.log("Fullscreen mounted");
        map.addControl(fullscreen);
        return () => {
            map.removeControl(fullscreen);
            console.log("Fullscreen UNMOUNTED");
        }
    }, []);
    return null;
}
FullScreen.propTypes = {
    active: PropTypes.bool,
    className: PropTypes.string,
    keys: PropTypes.bool,
    label: PropTypes.node,
    labelActive: PropTypes.node,
    tipLabel: PropTypes.string
};

export default FullScreen;
