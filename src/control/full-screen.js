import React, {useContext, useEffect} from 'react'
import PropTypes from 'prop-types'
import {FullScreen as olFullScreen} from 'ol/control'
import {MapContext} from '../map-context'

const FullScreen = (props) => {
    const map = useContext(MapContext);
    useEffect(() => {
        const control = new olFullScreen(props);
        map.addControl(control);
        return () => {
            map.removeControl(control);
            console.log("control.MousePosition unmounted", map.getControls().getLength());
        }
    }, []);
    return null;
}
FullScreen.propTypes = {
    className: PropTypes.string,
    keys: PropTypes.bool,
    label: PropTypes.node,
    labelActive: PropTypes.node,
    tipLabel: PropTypes.string
};

export default FullScreen;
