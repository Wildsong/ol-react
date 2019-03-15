import React from 'react'
import PropTypes from 'prop-types'
import { Style } from 'ol/style'
import { VectorTile as VectorTileLayer } from 'ol/layer'
import { VectorTile as VectorTileSource } from 'ol/source'
import { GeoJSON as GeoJsonFormat, MVT as MVTformat, WKT as WKTformat } from 'ol/format'
import OLLayer from './ol-layer'

export default class OLVectorTile extends OLLayer {
    static propTypes = {
    	url: PropTypes.string,
    	opacity: PropTypes.number,
    	attributions: PropTypes.arrayOf(PropTypes.string),
    	layer: PropTypes.string,
        format: PropTypes.string.isRequired,
    }
    static defaultProps = {
    	visible: true,
    	opaque: true
    }

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
            'style'
        ];

        this.dictSource = [
            'attributions',
            'cacheSize',
            'projection',
            'state',
            'url',
            'urls',
            'wrapX',
            'transition',
            'key',
        ]
        let layerProps = this.buildProps(this.dictLayer);
        let tileSource = null;
        let options = {};
        switch (this.props.format) {
            case 'JSON':
                options = {
                    format: new GeoJsonFormat()
                }
                break;
            case 'MVT':
                options = {
                    format: new MVTformat()
                }
                break;
            case 'WKT':
                options = {
                    format: new WKTformat()
                }
                break;
            default:
                // There are a bunch of formats I have not implemented, KML and so on see
                // https://openlayers.org/en/latest/apidoc/module-ol_format_XMLFeature-XMLFeature.html
                throw ('unknown vector tile format: ' + this.props.format.toString());
                break;
        }
        Object.assign(options, this.buildProps(this.dictSource));
        tileSource = new VectorTileSource(options);
        this.state.layer = new VectorTileLayer({
            ...layerProps,
            source: tileSource
        })
    }
}
