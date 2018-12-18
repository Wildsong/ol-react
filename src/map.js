import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {MapContext} from './map-context';
//import {Map} from 'ol';
import Map from 'ol/WebGLMap'; // Maybe this works better with vector maps?
import {toLatLon} from 'ol/proj';
import {defaults as defaultInteractions} from 'ol/interaction';
import {defaults as defaultControls} from 'ol/control';
import OLComponent from './ol-component';

class OLMap extends Component {
    constructor(props) {
        super(props);
//        console.log("new OLMap props=", this.props)
        this.map = new Map({
            loadTilesWhileAnimating: props.loadTilesWhileAnimating,
            loadTilesWhileInteracting: props.loadTilesWhileInteracting,
            interactions: props.useDefaultInteractions ? defaultInteractions() : [],
            controls: props.useDefaultControls ? defaultControls() : [],
            overlays: []
        });

        if (props.onChangeSize) {
            this.map.on('change:size', this.props.onChangeSize);
        }
        if (this.props.onSingleClick) {
            this.map.on('singleclick', this.props.onSingleClick);
        }
        if (this.props.onFeatureHover) {
            this.map.on('pointermove', this.onFeatureHover, this);
        }
        if (this.props.onFeatureClick) {
            this.map.on('singleclick', this.onFeatureClick, this);
        }
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
                <div ref="target" style={{ width: '100%', height: '100%' }}>
                This is not a map.
                </div>
                <div>
                    {this.props.children}
                    {this.props.view}
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
        if (evt.dragging) {
            return;
        }
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

    updateSize () {
        this.map.updateSize()
    }

    getSize() {
        return this.map.getSize();
    }
}

OLMap.propTypes = {
    loadTilesWhileAnimating: PropTypes.bool,
    loadTilesWhileInteracting: PropTypes.bool,
    onSingleClick: PropTypes.func,
    onChangeSize: PropTypes.func,
    onFeatureHover: PropTypes.func,
    onFeatureClick: PropTypes.func,
    view: PropTypes.element.isRequired,
    useDefaultInteractions: PropTypes.bool.isRequired,
    useDefaultControls: PropTypes.bool.isRequired,
    focusOnMount: PropTypes.bool.isRequired,

    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.element),
        PropTypes.element,
    ])
}

OLMap.defaultProps = {
    useDefaultInteractions: true,
    useDefaultControls: true,
    focusOnMount: false
}

export default OLMap
