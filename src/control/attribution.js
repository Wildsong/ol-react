import React, {useState, useContext, useEffect} from 'react'
import PropTypes from 'prop-types'
import {MapContext} from '../map-context'
import {Attribution as olAttribution} from 'ol/control'

const Control = (props) => {
    const map = useContext(MapContext);
    const [control, setControl] = useState(new olAttribution(props));
    useEffect(() => {
        console.log("Attribution mounted");
        map.addControl(control);
        return () => {
            map.removeControl(control);
            console.log("Attribution UNMOUNTED");
        }
    }, []);
    return null;
}
Attribution.propTypes = {
    className: PropTypes.string,
    collapsed: PropTypes.bool,
    collapseLabel: PropTypes.string,
    collapsible: PropTypes.bool,
    label: PropTypes.node,
    tipLabel: PropTypes.string
}
export default Attribution;
