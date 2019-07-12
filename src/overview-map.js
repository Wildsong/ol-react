import React, {useState} from 'react'
import PropTypes from 'prop-types';
import {Map as olMap} from 'ol'
import {Layer as olLayer} from 'ol/layer'
import {OverviewMap as olOverviewMap} from 'ol/control'

const overviewMap = (layers) => {
    return new olOverviewMap({
        layers,
        collapsed: false, collapsible: false
    });
}

const OverviewMap = ({map, layers}) => {
    console.log("OverviewMap");
    const [oview, setOview] = useState(overviewMap(layers))
    const setTarget = element => {
        console.log("OverviewMap.setTarget");
        oview.setTarget(element);
        map.addControl(oview);
    }
    return (
        <div ref={setTarget}></div>
    );
}
OverviewMap.propTypes = {
    map: PropTypes.instanceOf(olMap),
    layers: PropTypes.arrayOf(PropTypes.instanceOf(olLayer)),
}
export default OverviewMap;
