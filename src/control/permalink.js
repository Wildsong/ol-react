import React, {useState, useContext, useEffect} from 'react';  // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types'
import {MapContext} from '../map-context'
import olExtPermalink from 'ol-ext/control/Permalink'

const Permalink = (props) => {
    const map = useContext(MapContext);
    const [control] = useState(new olExtPermalink(props));
    useEffect(() => {
        map.addControl(control);
        return () => {
            map.removeControl(control);
        }
    }, []);
    return null;
}
Permalink.propTypes = {
    active: PropTypes.bool,
    className: PropTypes.string,
    keys: PropTypes.bool,
    label: PropTypes.node,
    labelActive: PropTypes.node,
    tipLabel: PropTypes.string,
    onclick: PropTypes.func, // note the spelling! not camelCase
};

export default Permalink;
