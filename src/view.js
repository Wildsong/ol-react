import React from 'react'
import PropTypes from 'prop-types'
import {MapContext} from './map-context'
import {Map, View} from 'ol'
import OLComponent from './ol-component'

const wm = "EPSG:3857";

export default class OLView extends OLComponent {
    static contextType = MapContext;
    static propTypes = {
        center: PropTypes.arrayOf(PropTypes.number),
        resolution: PropTypes.number,
        zoom: PropTypes.number,
        minZoom: PropTypes.number,
        maxZoom: PropTypes.number,
        rotation: PropTypes.number,
        projection: PropTypes.string,

        onResolutionChanged: PropTypes.func,
        onZoomChanged: PropTypes.func,
        onCenterChanged: PropTypes.func,
    }
    static defaultProps = {
        minzoom: 4,
        maxzoom: 19,
        center: [0, 0],
        //resolution: 10000,
        zoom: 0,
        rotation: 0
    }

    constructor(props) {
        super(props);
        let p = wm;
        if (typeof this.props.projection !== 'undefined') {
            p = this.props.projection;
        }
        var opts = {
            center: this.props.center,
            //resolution: this.props.resolution,
            rotation: this.props.rotation,
            zoom: this.props.zoom,
            minZoom: this.props.minZoom,
            maxZoom: this.props.maxZoom,
            projection: p
        };
        this.view = new View(opts);
        this.view.on("change:resolution", this.handleEvent);
    }

    handleEvent(event) {
        // FIXME Seems like the binding is wrong for 'this'
        const zoom = this.getZoom()
        console.log("View.onMoveEnd", event, zoom)
        /*
        if (this.props.onNavigation && this.props.initialCenter[0] !== this.view.getCenter()[0]) {
            // Don't fire an event unless we've actually moved from initial location
            this.props.onNavigation(
                this.view.getCenter(),
                this.view.getResolution(),
                this.view.getZoom(),
                this.view.getRotation()
            );
        }
        */
    }

    updateFromProps_() {
        // FIXME we're probably ignoring some useful props here!!

        // Set either Resolution OR zoom, but guard against 0 (will cause map to not render)
        if (typeof this.props.resolution !== 'undefined' && this.props.resolution !== 0) {
            //console.log("resolution set to", this.props.resolution);
            this.view.setResolution(this.props.resolution);
            return;
        }

        if (typeof this.props.zoom !== 'undefined'
        || typeof this.props.rotation !== 'undefined'
        || typeof this.props.rotation !== 'undefined') {
            this.view.animate(
                { zoom: this.props.zoom },
                { rotation: this.props.rotation, duration: 250 },
                { center: this.props.center },
            );
            // this.view.setZoom(this.props.zoom);
            // this.view.setCenter(this.props.center);
            // this.view.setRotation(this.props.rotation);
        }
    }

    componentDidMount() {
        //console.log("OLView.componentDidMount context", this.context)
        this.context.map.setView(this.view);
        this.updateFromProps_();
        this.context.map.on("movend", this.onMoveEnd, this);
    }

    componentDidUpdate(prevProps) {
        // If extent does not need updating, don't call.
        if (((prevProps.center.lat !== this.props.center.lat) ||
             (prevProps.center.lon !== this.props.center.lon)) ||
            (prevProps.zoom !== this.props.zoom) ||
            (prevProps.rotation !== this.props.rotation))

            this.updateFromProps_();
    }

    fit(geometry, size, options) {
        this.view.fit(geometry, size, options);
    }
}
