import React, {useContext, useEffect} from 'react'
import PropTypes from 'prop-types'
import {MapContext} from './map-context'

// I want the OL map object to live up one level so that I can set up
// components like overview maps that live outside the map component.
// Else I'd create the map here.
// I don't want the map to live in Redux state because then I'd have
// just one map for the entire app.

const Map = ({center, rotation, zoom, animate, onMoveEnd, children}) => {
    const map = useContext(MapContext);
    const mapTarget = element => {
        map.setTarget(element)

        // There are about 20 different events we could watch here
        // see https://github.com/openlayers/openlayers/blob/v5.3.0/src/ol/events/EventType.js

        if (typeof onPointerMove === 'function') map.on('pointermove', onPointerMove);
        if (typeof onPointerDrag === 'function') map.on('pointerdrag', onPointerMove);
        if (typeof onMoveEnd === 'function') map.on('moveend', onMoveEnd);
        if (typeof onChangeSize === 'function') map.on('change:size', onChangeSize);

        if (typeof onClick === 'function') map.on('click', onClick);
        if (typeof onSingleClick === 'function') map.on('singleclick', onSingleClick);
        if (typeof onDoubleClick === 'function') map.on('doubleclick', onDoubleClick);
    }
/*
    useEffect(() => {
        const view = map.getView();
        console.log("AND NOW", center, zoom, rotation);
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
        {children}
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
