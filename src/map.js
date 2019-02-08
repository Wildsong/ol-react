import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {MapContext} from './map-context';
import {Map} from 'ol';
//import Map from 'ol/WebGLMap'; // generates cross-origin errors
import {toLatLon} from 'ol/proj';
import {defaults as defaultInteractions} from 'ol/interaction';
import {defaults as defaultControls} from 'ol/control';
import OLComponent from './ol-component';

export default class OLMap extends Component {
    static propTypes = {
        loadTilesWhileAnimating: PropTypes.bool,
        loadTilesWhileInteracting: PropTypes.bool,
        onPointerMove: PropTypes.func,
        onSingleClick: PropTypes.func,
        onChangeSize: PropTypes.func,
        onMoveEnd: PropTypes.func,
        view: PropTypes.element.isRequired,
        useDefaultInteractions: PropTypes.bool.isRequired,
        useDefaultControls: PropTypes.bool.isRequired,
        focusOnMount: PropTypes.bool.isRequired,

        children: PropTypes.oneOfType([
            PropTypes.arrayOf(PropTypes.element),
            PropTypes.element,
        ])
    }
    static defaultProps = {
        useDefaultInteractions: true,
        useDefaultControls: true,
        focusOnMount: false
    }

    constructor(props) {
        super(props);
        this.map = new Map({
            loadTilesWhileAnimating: this.props.loadTilesWhileAnimating,
            loadTilesWhileInteracting: this.props.loadTilesWhileInteracting,
            interactions: this.props.useDefaultInteractions ? defaultInteractions() : [],
            controls: this.props.useDefaultControls ? defaultControls() : [],
            overlays: []
        });

        if (this.props.onPointerMove) this.map.on('pointermove', this.props.onPointerMove, this);
        //if (this.props.onPointerDrag) this.map.on('pointerdrag', this.props.onPointeDrag, this);

        // There are about 20 different events we could watch here
        // see https://github.com/openlayers/openlayers/blob/v5.3.0/src/ol/events/EventType.js
        if (this.props.onChangeSize)  this.map.on('change:size', this.props.onChangeSize);
        if (this.props.onSingleClick) this.map.on('singleclick', this.props.onSingleClick);
        //if (this.props.onDblClick)    this.map.on('doubleclick', this.props.onDblClick);
        if (this.props.onMoveEnd)     this.map.on('moveend', this.props.onMoveEnd);
    }

    componentDidMount() {
//        console.log("OLMap.componentDidMount refs=", this.refs)
        this.map.setTarget(this.refs.target) // this comes from the div in render()
        if (this.props.focusOnMount) {
            this.focus()
        }
    }

    componentWillUnmount() {
        this.map.setTarget(undefined)
    }

    render() {
//        console.log("OLMap.render() props=", this.props)
        return (
            <div style={this.props.style}>
            <MapContext.Provider value={{map: this.map}}>
                <div>
                    {this.props.children}
                    {this.props.view}
                </div>
                <div ref="target" className='ol-react-map'>
                </div>
            </MapContext.Provider>
            </div>
        )
    }

    focus() {
        const viewport = this.map.getViewport()
        viewport.tabIndex = 0
        viewport.focus()
    }

    onFeatureHover(evt) {
        if (evt.dragging) return;
        let pixel = this.map.getEventPixel(evt.originalEvent);
        let feature = this.map.forEachFeatureAtPixel(pixel, function (x) {
            return x
        });
        this.props.onFeatureHover(feature);
    }

    onFeatureClick(evt) {
        let pixel = this.map.getEventPixel(evt.originalEvent);
        let feature = this.map.forEachFeatureAtPixel(pixel, function (x) {
            return x
        });
        let lonLat = toLonLat(evt.coordinate);
        this.props.onFeatureClick(feature, lonLat);
    }

    updateSize() {
        this.map.updateSize()
    }

    getSize() {
        return this.map.getSize();
    }
}
