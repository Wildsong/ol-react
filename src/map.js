import React, {useContext, useEffect, useLayoutEffect} from 'react'
import PropTypes from 'prop-types'
import {MapContext} from './map-context'

// The OL map object has to live up one level in a context object so that I can set up
// components like overview maps that live outside the map component.
// Else I'd create the map here.
// The map can't live in Redux state because then I'd have just one map for the entire app.

const Map = (props) => {
    const map = useContext(MapContext);
    const mapTarget = element => {
        map.setTarget(element)

        // There are about 20 different events we could watch here
        // see https://github.com/openlayers/openlayers/blob/v5.3.0/src/ol/events/EventType.js

        if (typeof props.onPointerMove === 'function') map.on('pointermove', props.onPointerMove);
        if (typeof props.onPointerDrag === 'function') map.on('pointerdrag', props.onPointerMove);
        if (typeof props.onMoveEnd === 'function') map.on('moveend', props.onMoveEnd);
        if (typeof props.onChangeSize === 'function') map.on('change:size', props.onChangeSize);

        if (typeof props.onClick === 'function') map.on('click', props.onClick);
        if (typeof props.onSingleClick === 'function') map.on('singleclick', props.onSingleClick);
        if (typeof props.onDoubleClick === 'function') map.on('doubleclick', props.onDoubleClick);
    }

    return (
        <div ref={mapTarget} className="ore-map" style={{position:"relative", top:0, width:600,height:400}}>
        {props.children}
        </div>
    )
}
Map.propTypes = {
    onPointerMove: PropTypes.func,
    onPointerDrag: PropTypes.func,
    onMoveEnd: PropTypes.func,
    onChangeSize: PropTypes.func,

    onClick: PropTypes.func,
    onSingleClick: PropTypes.func,
    onDoubleClick: PropTypes.func,
    //children: ,
};
export default Map
