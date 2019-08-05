import React, {useContext, useEffect} from 'react'
import PropTypes from 'prop-types'
import {MapContext} from './map-context'

// I want the OL map object to live up one level so that I can set up
// components like overview maps that live outside the map component.
// Else I'd create the map here.
// I don't want the map to live in Redux state because then I'd have
// just one map for the entire app.

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
/*
    useEffect(() => {
        const view = map.getView();
        if (animate) {
            view.animate({center, zoom, rotation});
        } else {
            view.setCenter(center);
            view.setZoom(zoom);
            view.setRotation(rotation);
        }
    }, [center, rotation, zoom]);
*/
    return (
        <div ref={mapTarget} className="ore-map" style={{position:"relative", top:0, width:600,height:400}}>
        {props.children}
        </div>
    )
}
Map.propTypes = {
    center: PropTypes.arrayOf(PropTypes.number).isRequired,
    zoom: PropTypes.number.isRequired,
    rotation: PropTypes.number,
    animate: PropTypes.bool,

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
