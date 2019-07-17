import React, {useContext} from 'react'
import PropTypes from 'prop-types'
import {VectorTile as olVectorTileSource} from 'ol/source'
import {GeoJSON as GeoJsonFormat, MVT as MVTformat, WKT as WKTformat} from 'ol/format'
import {LayerContext} from '../layer-context'

const VectorTile = (props) => {
    const layer = useContext(LayerContext);
    const options = {
        ...props,
        format: new MVTformat(), // All we do at the moment.
    };
    console.log("VectorTile", options);
    const source = new olVectorTileSource(options);
    layer.setSource(source);
    return null; // Nothing needs to be rendered here.
}
VectorTile.propTypes = {
    attributions: PropTypes.string,
    //source: PropTypes.oneOf(['geojson','JSON','MVT','WKT']),
    url: PropTypes.string,
    crossOrigin: PropTypes.string, // null | '' | "anonymous" |
    projection: PropTypes.string,
};
export default VectorTile;
