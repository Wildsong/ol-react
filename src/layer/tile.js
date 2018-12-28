import React from 'react'
import PropTypes from 'prop-types'
import {Style} from 'ol/style'
import {Tile as TileLayer} from 'ol/layer'
import {BingMaps, OSM, TileArcGISRest, TileWMS, XYZ} from 'ol/source'
import OLLayer from './ol-layer'
import apiKeys from './apikeys';

export default class OLTile extends OLLayer {
    constructor(props) {
        super(props);

        this.dictLayer = [
            "opacity",
            "visible",
            "extent",
            "zIndex",
            "minResolution",
            "maxResolution",
            'preload',
            'map',
        ];

        this.dictSource = [
            'attributions',
            'attributionsCollapsible',
            'opaque',
            'projection',
            'state',
            'url',
            'urls',
            'wrapX',
            'transition',
            'key'
        ]
        let layerProps = this.buildProps(this.dictLayer);
        let sourceProps = {};
        let tileSource = null;

        /* let bingmapStyles = [
          'Road',
          'RoadOnDemand',
          'Aerial',
          'AerialWithLabels',
          'collinsBart',
          'ordnanceSurvey'
        ]; */

        // See http://openlayers.org/en/latest/apidoc/module-ol_source_TileImage-TileImage.html

        console.log("layer", layerProps, "source", sourceProps);
        switch (this.props.source) {
            case "BingMaps":
                Object.assign(layerProps, {
                    preload: Infinity  // this is from the examples, probably bad
                });
                sourceProps = this.buildProps(this.dictSource);
                Object.assign(sourceProps, {key: apiKeys.BingMaps, imagerySet: 'Aerial'});
                tileSource = new BingMaps(sourceProps);
                break;

            case "OSM":
                // http://openlayers.org/en/latest/apidoc/module-ol_source_OSM.html
                this.dictSource.push('maxZoom')
                sourceProps = this.buildProps(this.dictSource);
                tileSource = new OSM(sourceProps);
                break;

            case "WMS":
                // http://openlayers.org/en/latest/apidoc/module-ol_source_TileWMS.html
                this.dictSource.push('serverType')
                sourceProps = this.buildProps(this.dictSource);
                let params = {'TILED' : true}
                Object.assign(sourceProps, {params, transition: 0});
                tileSource = new TileWMS(sourceProps);
                //console.log('WMS', sourceProps, tileSource);
                break;

            case "XYZ":
                // http://openlayers.org/en/latest/apidoc/module-ol_source_XYZ.html
                this.dictSource.push('crossOrigin')
                this.dictSource.push('minZoom')
                this.dictSource.push('maxZoom')
                sourceProps = this.buildProps(this.dictSource);
                tileSource = new XYZ(sourceProps);
                break;

            case "ArcGISRest":
                sourceProps = this.buildProps(this.dictSource);
                tileSource = new TileArcGISRest(sourceProps);
                break;

            default:
                throw "Unknown source:" + this.props.source;
            break
        }

        this.state.layer = new TileLayer({
            ...layerProps,
            source: tileSource
        })
    }

/*
    componentDidUpdate(prevProps) {
        console.log("layer.OLTile.componentDidUpdate()", this.props);
        let layerProps = this.buildProps(this.dictLayer);
        this.state.layer.setProperties(layerProps);
        console.log("actual props=", this.state.layer.getProperties());
//        this.state.layer.setVisible(this.props.visible)
//        this.state.layer.setZIndex(this.props.zIndex)
//        if (this.props.opacity !== prevProps.opacity) {
//            this.state.layer.setOpacity(this.props.opacity)
            console.log(prevProps.opacity, " => ", this.props.opacity)
//        }
    }
*/
}

OLTile.propTypes = {
    source: PropTypes.string.isRequired,
    url: PropTypes.string,
    opacity: PropTypes.number,
    attributions: PropTypes.arrayOf(PropTypes.string)
}

OLTile.defaultProps = {
    visible: true,
    opaque: false
}
