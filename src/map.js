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
        if (typeof onMoveEnd === 'function') map.on('moveend', onMoveEnd);
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
        <div ref={mapTarget} className="ol-react-map" style={{position:"relative", top:0, width:600,height:400}}>
        {children}
        </div>
    )
}
Map.propTypes = {
    center: PropTypes.arrayOf(PropTypes.number).isRequired,
    zoom: PropTypes.number.isRequired,
    rotation: PropTypes.number,
    animate: PropTypes.bool,

    onMoveEnd: PropTypes.func,
    //children: ,
};
/*
    if (this.props.onPointerMove) this.props.map.on('pointermove', this.props.onPointerMove, this);
    //if (this.props.onPointerDrag) this.props.map.on('pointerdrag', this.props.onPointeDrag, this);

    // There are about 20 different events we could watch here
    // see https://github.com/openlayers/openlayers/blob/v5.3.0/src/ol/events/EventType.js
    if (this.props.onChangeSize)  this.props.map.on('change:size', this.props.onChangeSize);
    if (this.props.onClick)       this.props.map.on('click', this.props.onClick);
    if (this.props.onSingleClick) this.props.map.on('singleclick', this.props.onSingleClick);
    //if (this.props.onDblClick)    this.props.map.on('doubleclick', this.props.onDblClick);
    if (this.props.onPostrender)  this.props.map.on('postrender', this.props.onPostrender);
    const setMapTarget = element => {
        console.log("setMapTarget", element);
        theMap.setTarget(element)
    }
*/
export default Map
