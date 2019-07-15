import React, {useContext} from 'react'
import PropTypes from 'prop-types'
import {FullScreen as olFullScreen} from 'ol/control'
import {MapContext} from '../map-context'

const FullScreen = (props) => {
    const map = useContext(MapContext);
    control = new olFullScreen(props);
    const setTarget = element => {
        control.setTarget(element);
        map.addControl(control);
    }
    return (
        <div ref={setTarget}></div>
    );
}
FullScreen.propTypes = {
    className: PropTypes.string,
    keys: PropTypes.bool,
    label: PropTypes.node,
    labelActive: PropTypes.node,
    source: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.any
    ]),
    tipLabel: PropTypes.string
};

export default FullScreen;
