import React, {useState, useContext, useEffect} from 'react';  // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types';
import {MapContext} from '../map-context'
import {Layer as olLayer} from 'ol/layer'
import {OverviewMap as olOverviewMap} from 'ol/control'

// I have a hard time getting the overview map to show up
// the way I want when it's on top of the map, so for now
// I am only using them in a separate target.

// If you want the control embedded in the map set "target" to null.
// Default is to put it in the separate element returned here.

const OverviewMap = (props) => {
    const map = useContext(MapContext);
    const [control] = useState(new olOverviewMap(props));
    const setTarget = element => {control.setTarget(element);}
    useEffect(() => {
        map.addControl(control);
        return () => { map.removeControl(control); };
    }, []);
    return props.target !== undefined ? props.target : (
        <div ref={setTarget} className="ore-overviewmap"></div>
    );
}
OverviewMap.propTypes = {
    layers: PropTypes.arrayOf(PropTypes.instanceOf(olLayer)),
    collapsible: PropTypes.bool,
    collapsed: PropTypes.bool,
    target: PropTypes.element
}
export default OverviewMap;
