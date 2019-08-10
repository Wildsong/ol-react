import React, {useState, useContext, useEffect} from 'react';  // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types'
import {MapContext} from '../map-context'
import {Attribution as olAttribution} from 'ol/control'

const Attribution = (props) => {
    const map = useContext(MapContext);
    const [control] = useState(new olAttribution(props));

    useEffect(() => {
        map.addControl(control);
        return () => {
            map.removeControl(control);
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
