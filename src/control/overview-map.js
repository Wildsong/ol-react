import React, {useContext} from 'react'
import PropTypes from 'prop-types';
import {MapContext} from '../map-context'
import {Layer as olLayer} from 'ol/layer'
import {OverviewMap as olOverviewMap} from 'ol/control'

const OverviewMap = ({layers}) => {
    const map = useContext(MapContext);
    const overview = new olOverviewMap({
        layers,
        collapsed: false, collapsible: false
    });
    const setTarget = element => {
        overview.setTarget(element);
        map.addControl(overview);
    }
    return (
        <div ref={setTarget}></div>
    );
}
OverviewMap.propTypes = {
    layers: PropTypes.arrayOf(PropTypes.instanceOf(olLayer)),
}
export default OverviewMap;
