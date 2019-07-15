import React, {useContext} from 'react'
import PropTypes from 'prop-types';
import {Map as olMap} from 'ol'
import {Layer as olLayer} from 'ol/layer'
import {OverviewMap as olOverviewMap} from 'ol/control'
import {MapContext} from '../map-context'

const OverviewMap = ({layers}) => {
    const map = useContext(MapContext);
    const control = new olOverviewMap({
        layers,
        collapsed: false, collapsible: false
    });
    const setTarget = element => {
        control.setTarget(element);
        map.addControl(control);
    }
    return (
        <div ref={setTarget}></div>
    );
}
OverviewMap.propTypes = {
    layers: PropTypes.arrayOf(PropTypes.instanceOf(olLayer)),
}
export default OverviewMap;
