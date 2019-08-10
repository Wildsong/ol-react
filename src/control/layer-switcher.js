// demo: http://viglino.github.io/ol-ext/examples/control/map.switcher.switcher.html
import React, {useState, useContext, useEffect} from 'react';  // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types'
import {MapContext} from '../map-context'
import olextLayerSwitcher from 'ol-ext/control/LayerSwitcher'

const LayerSwitcher = (props) => {
    const map = useContext(MapContext)
    const [control] = useState(new olextLayerSwitcher(props));
    const setTarget = element => {
        control.setTarget(element);
    }
    useEffect(() => {
        map.addControl(control);
        return () => { map.removeControl(control); }
    }, []);
    return (
        <div ref={setTarget} className="ore-layerswitcher"></div>
    );
}
LayerSwitcher.propsTypes = {
    extent: PropTypes.bool,
    setHeader: PropTypes.func,
    show_progress: PropTypes.bool,
    collapsed: PropTypes.bool,
    collapsible: PropTypes.bool,
};
export default LayerSwitcher;
