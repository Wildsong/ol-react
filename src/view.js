import React from 'react'
import PropTypes from 'prop-types'
import {MapContext} from './map-context'
import {Map, View} from 'ol'
import OLComponent from './ol-component'

const wgs84 = "EPSG:4326";
const wm = "EPSG:3857";

export default class OLView extends OLComponent {
    constructor(props) {
        super(props);
        let p = wm;
        if (typeof this.props.projection !== 'undefined') {
            p = this.props.projection;
            console.log("Overrdigin projection", p);
        }
        var opts = {
            center: props.initialCenter,
            resolution: props.initialResolution,
            rotation: props.initialRotation,
            zoom: props.initialZoom,
            projection: p
        };
        this.view = new View(opts);
        console.log("View projection", this.view.getProjection(), this.props);
    }

    onMoveEnd(event) {
        if (this.props.onNavigation && this.props.initialCenter[0] !== this.view.getCenter()[0]) {
            // Don't fire an event unless we've actually moved from initial location
            this.props.onNavigation(
                this.view.getCenter(),
                this.view.getResolution(),
                this.view.getZoom(),
                this.view.getRotation()
            );
        }
    }

    updateFromProps_() {
        // FIXME we're probably ignoring some useful props here!!

        if (typeof this.props.center !== 'undefined')
            this.view.setCenter(this.props.center);

        if (typeof this.props.rotation !== 'undefined')
            this.view.setRotation(this.props.rotation);

        // Set either Resolution OR zoom, but guard against 0 (will cause map to not render)
        if (typeof this.props.resolution !== 'undefined' && this.props.resolution !== 0)
            this.view.setResolution(this.props.resolution);
        else if (typeof this.props.zoom !== 'undefined')
            this.view.setZoom(this.props.zoom);
    }

    componentDidMount() {
        //console.log("OLView.componentDidMount context", this.context)
        this.context.map.setView(this.view);
        this.updateFromProps_();
        this.context.map.on("movend", this.onMoveEnd, this);
    }

    animate(options) {
        this.view.animate(options);
    }

    fit(geometry, size, options) {
        this.view.fit(geometry, size, options);
    }
}
OLView.contextType = MapContext;

OLView.propTypes = {
    center: PropTypes.arrayOf(PropTypes.number),
    resolution: PropTypes.number,
    zoom: PropTypes.number,
    rotation: PropTypes.number,
    initialCenter: PropTypes.arrayOf(PropTypes.number),
    initialResolution: PropTypes.number,
    initialZoom: PropTypes.number,
    initialRotation: PropTypes.number,
    onResolutionChanged: PropTypes.func,
    onZoomChanged: PropTypes.func,
    onCenterChanged: PropTypes.func,
    projection: PropTypes.string,
}

OLView.defaultProps = {
    initialCenter: [0, 0],
    initialResolution: 10000,
    initialZoom: 0,
    initialRotation: 0
}
