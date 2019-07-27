import React, {useState, useContext, useEffect} from 'react'
import PropTypes from 'prop-types';
import {MapContext} from '../map-context'
import {Layer as olLayer} from 'ol/layer'
import {OverviewMap as olOverviewMap} from 'ol/control'

const OverviewMap = ({layers}) => {
    const map = useContext(MapContext);
    const [control, setControl] = useState(new olOverviewMap({
        layers,
        collapsed: false, collapsible: false
    }));
    const setTarget = element => {
        control.setTarget(element);
    }
    useEffect(() => {
        map.addControl(control);
        return () => { map.removeControl(control); };
    }, []);
    return (
        <div ref={setTarget} className="ore-overviewmap"></div>
    );
}
OverviewMap.propTypes = {
    layers: PropTypes.arrayOf(PropTypes.instanceOf(olLayer)),
}
export default OverviewMap;
