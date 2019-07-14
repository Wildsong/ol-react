import React, {useContext} from 'react'
import PropTypes from 'prop-types'
//import {connect} from 'react-redux'
//import {Map as olMap} from 'ol'
import {toLatLon} from 'ol/proj'
//import {setMapCenter} from './actions'
import {MapContext} from './map-context'

const Map = (props) => {
    const map = useContext(MapContext);
    const t = element => {
        try {
            map.setTarget(element)
        } catch {
            console.log("OLMap Problems map=", map);
        }
    }
    return (
        <div ref={t} style={{position:"relative", top:0, width:600,height:400}}>
        {props.children}
        </div>
    )
}
/*
const Map = ({map,setMapCenter}) => {
    setMapCenter(DEFAULT_CENTER, MINZOOM)
    if (this.props.onPointerMove) this.props.map.on('pointermove', this.props.onPointerMove, this);
    //if (this.props.onPointerDrag) this.props.map.on('pointerdrag', this.props.onPointeDrag, this);

    // There are about 20 different events we could watch here
    // see https://github.com/openlayers/openlayers/blob/v5.3.0/src/ol/events/EventType.js
    if (this.props.onChangeSize)  this.props.map.on('change:size', this.props.onChangeSize);
    if (this.props.onClick)       this.props.map.on('click', this.props.onClick);
    if (this.props.onSingleClick) this.props.map.on('singleclick', this.props.onSingleClick);
    //if (this.props.onDblClick)    this.props.map.on('doubleclick', this.props.onDblClick);
    if (this.props.onMoveEnd)     this.props.map.on('moveend', this.props.onMoveEnd);
    if (this.props.onPostrender)  this.props.map.on('postrender', this.props.onPostrender);
    const setMapTarget = element => {
        console.log("setMapTarget", element);
        theMap.setTarget(element)
    }
    return (
        <div style={props.style}>
            {props.children}
            <div ref={setMapTarget} className='ol-react-map'></div>
        </div>
    )
}
*/
export default Map
