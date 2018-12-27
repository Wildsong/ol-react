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
        let layerProps = this.buildLayerProps();
        let sourceProps = this.buildSourceProps();
        let tileSource = null;
        /* let bingmapStyles = [
          'Road',
          'RoadOnDemand',
          'Aerial',
          'AerialWithLabels',
          'collinsBart',
          'ordnanceSurvey'
      ]; */

        switch (this.props.source) {
            case "BingMaps":
                Object.assign(layerProps, {
                    preload: Infinity  // this is from the examples, probably bad
                });
                Object.assign(sourceProps, {key: apiKeys.BingMaps, imagerySet: 'Aerial'});

                tileSource = new BingMaps(sourceProps);
                let is = tileSource.getImagerySet();
                break;
            case "OSM":
                tileSource = new OSM(sourceProps);
                break;
            case "WMS":
                let params = { 'TILED' : true }
                Object.assign(sourceProps, {params, transition: 0});
                tileSource = new TileWMS(sourceProps);
                console.log('WMS', sourceProps, tileSource);
                break;
            case "XYZ":
                tileSource = new XYZ(sourceProps);
                break;
            case "ArcGISRest":
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

    componentDidUpdate(prevProps) {
        console.log("OLTile.componentDidUpdate()", this.props);
        this.state.layer.setVisible(this.props.visible)
        this.state.layer.setZIndex(this.props.zIndex)
    }

    buildLayerProps() {
        console.log("layer.OLTile.buildLayerProps() FIXME; copy more of everything")
        // See http://openlayers.org/en/latest/apidoc/module-ol_source_TileImage-TileImage.html
        return super.buildLayerProps();
    }

    buildSourceProps() {
        console.log("layer.OLTile.buildSourceProps() FIXME; don't copy everything", this.props)
        // XYZ opaque boolean
        return Object.assign({}, this.props);
    }
}

OLTile.propTypes = {
    source: PropTypes.string.isRequired,
    url: PropTypes.string,
    opacity: PropTypes.number,
    attributions: PropTypes.arrayOf(PropTypes.string)
}

OLTile.defaultProps = {
    visible: true
}
