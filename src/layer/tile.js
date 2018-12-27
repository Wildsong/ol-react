import React from 'react'
import PropTypes from 'prop-types'
import {Style} from 'ol/style'
import {Tile as TileLayer} from 'ol/layer'
import {OSM, TileArcGISRest, TileWMS, XYZ} from 'ol/source'
import OLLayer from './ol-layer'

export default class OLTile extends OLLayer {
    constructor(props) {
        super(props);
        let layerProps = this.buildLayerProps();
        let sourceProps = this.buildSourceProps();
        let tileSource = null;
        switch (this.props.source) {
            case "OSM":
                tileSource = new OSM(sourceProps);
                break;
            case "WMS":
                    tileSource = new TileWMS(sourceProps);
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

    buildSourceProps() {
        console.log("layer.OLTile.buildSourceProps() FIXME")
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
