import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Map as olMap, View as olView, Style as olStyle} from 'ol'
import {toLatLon} from 'ol/proj'
import {defaults as defaultInteractions} from 'ol/interaction'
import {defaults as defaultControls} from 'ol/control'
import OLComponent from './ol-component'
import {newMap, setMapCenter} from './actions'
import { DEFAULT_CENTER, XMIN,YMIN, XMAX,YMAX, MINZOOM,MAXZOOM } from './constants'

const OLMap = props => {
    /*
    props.map = new Map({
        loadTilesWhileAnimating: this.props.loadTilesWhileAnimating,
        loadTilesWhileInteracting: this.props.loadTilesWhileInteracting,
        interactions: this.props.useDefaultInteractions ? defaultInteractions() : [],
        controls: this.props.useDefaultControls ? defaultControls() : [],
        overlays: []
    });
    */
    const theMap = new olMap({
        view: new olView({
            extent: [[XMIN,YMIN],[XMAX,YMAX]],
            minZoom: MINZOOM,
            maxZoom: MAXZOOM
        }),
        controls: [],
        interactions:[],
    });
    props.newMap(theMap);
    props.setMapCenter(DEFAULT_CENTER, MINZOOM)
/*
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
*/
    const setMapTarget = element => {
        console.log("setMapTarget", element);
        theMap.setTarget(element)
    }

    return (
        <div style={props.style}>
            {props.children}
            <div className='ol-react-map'></div>
        </div>
    )
}
OLMap.propTypes = {
    map: PropTypes.instanceOf(olMap),
    style: PropTypes.instanceOf(olStyle),
    onPointerMove: PropTypes.func,
    onClick: PropTypes.func,
    onSingleClick: PropTypes.func,
    onChangeSize: PropTypes.func,
    onMoveEnd: PropTypes.func,
//    onPostrender: PropTypes.func,
//    loadTilesWhileAnimating: PropTypes.bool,
//    loadTilesWhileInteracting: PropTypes.bool,
//    focusOnMount: PropTypes.bool.isRequired,
/*
        children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.element),
        PropTypes.element,
    ])
*/
}
const mapStateToProps = (state) => ({
    map: state.map.theMap,
});
const mapDispatchToProps = {
    newMap, setMapCenter
};
export default connect(mapStateToProps, mapDispatchToProps)(OLMap)
