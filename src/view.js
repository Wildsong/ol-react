import React from 'react'
import PropTypes from 'prop-types'
import {MapContext} from './map-context'
import {Map, View} from 'ol'
import OLComponent from './ol-component'

const defaultProjection = "EPSG:3857";

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
        animate: PropTypes.bool,
//        onResolutionChanged: PropTypes.func,
//        onZoomChanged: PropTypes.func,
//        onCenterChanged: PropTypes.func,
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
        let p = defaultProjection;
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
//        this.view.on("change:resolution", this.onChangeResolution);
    }

/*
    onChangeResolution = (e) => {
        // FIXME Seems like the binding is wrong for 'this'
        const zoom = this.view.getZoom()
        console.log("View.onChangeResolution", e, zoom)

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
*/

    componentDidMount() {
        //console.log("OLView.componentDidMount context", this.context)
        this.context.map.setView(this.view);
        //this.updateFromProps_();
        //this.context.map.on("movend", this.onMoveEnd);???????
    }

    componentDidUpdate(prevProps) {

//      console.log('view.componentDidUpdate before', prevProps.center, prevProps.zoom,
//                'after', this.props.center, this.props.zoom)
        if (typeof this.props.center !== 'undefined'
        && (prevProps.center[0] !== this.props.center[0] ||
            prevProps.center[1] !== this.props.center[1])) {
                if (this.props.animate)
                    this.view.animate({ center: this.props.center });
                else
                    this.view.setCenter(this.props.center);
//            this.props.onCenterChanged(this.props);
        }
        if (typeof this.props.rotation !== 'undefined'
        && (prevProps.rotation !== this.props.rotation)) {
            if (this.props.animate)
                this.view.animate({ rotation: this.props.rotation, duration: 250 });
            else
                this.view.setRotation(this.props.rotation);
        }
        // Set either Resolution OR zoom, but guard against 0 (will cause map to not render)
        if (typeof this.props.resolution !== 'undefined'
        && (this.props.resolution !== 0)) {
            //console.log("resolution set to", this.props.resolution);
            this.view.setResolution(this.props.resolution);
//            this.props.onResolutionChanged(this.props);
        } else if (typeof this.props.zoom !== 'undefined'
        && (prevProps.zoom !== this.props.zoom)) {
            if (this.props.animate)
                this.view.animate({ zoom: this.props.zoom })
            else
                this.view.setZoom(this.props.zoom);
//          this.props.onZoomChanged(this.props);
        }
    }

    fit(geometry, size, options) {
        this.view.fit(geometry, size, options);
    }
}
