import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Style} from 'ol/style'
import {VectorTile as VectorTileLayer} from 'ol/layer'
import {VectorTile as VectorTileSource} from 'ol/source'
import {GeoJSON as GeoJsonFormat, MVT as MVTformat, WKT as WKTformat} from 'ol/format'
import OLLayer from './ol-layer'

class OLVectorTile extends OLLayer {
    static propTypes = {
        ...OLLayer.propTypes,
        source: PropTypes.oneOf(['geojson','JSON','MVT','WKT']),
    	url: PropTypes.string,
    	attributions: PropTypes.arrayOf(PropTypes.string),
    	layer: PropTypes.string,
    };
    static defaultProps = {
    	visible: true,
    	opaque: true
    };

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
//            'apikey', not using this here
        ]
        let layerProps = this.buildProps(this.dictLayer);
        let tileSource = null;
        let options = {};
        switch (this.props.source) {
            case 'geojson':
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
            case 'WKT': // This is a ol/format/TextFeature
                options = {
                    format: new WKTformat()
                }
                break;
            default:
                // There are a bunch of formats I have not implemented, KML and so on see
                // https://openlayers.org/en/latest/apidoc/module-ol_format_XMLFeature-XMLFeature.html
                throw ('Unknown vector tile format');
                break;
        }
        Object.assign(options, this.buildProps(this.dictSource));
        tileSource = new VectorTileSource(options);
        this.layer = new VectorTileLayer({
            ...layerProps,
            source: tileSource
        })
    }
}
const mapStateToProps = (state) => ({
    map: state.map.theMap,
})
export default connect(mapStateToProps)(OLVectorTile);
