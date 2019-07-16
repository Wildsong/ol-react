import React, {useContext} from 'react'
import PropTypes from 'prop-types'
import {VectorTile as olVectorTileSource} from 'ol/source'
import {GeoJSON as GeoJsonFormat, MVT as MVTformat, WKT as WKTformat} from 'ol/format'
import {LayerContext} from '../layer-context'

const MVT = (props) => {
    const layer = useContext(LayerContext);
    console.log("MVT", props);
    const source = new olVectorTileSource({
        format: new MVTformat(),
        ...props,
    });
    layer.setSource(source);
    return null; // Nothing needs to be rendered here.
}
MVT.propTypes = {
    source: PropTypes.oneOf(['geojson','JSON','MVT','WKT']),
    url: PropTypes.string,
    crossOrigin: PropTypes.string, // null | '' | "anonymous" |
    projection: PropTypes.string,
    /*
    attributions: PropTypes.arrayOf(PropTypes.string),
    layer: PropTypes.string,
        'cacheSize',
        'state',
        'transition',
    */
};
export default MVT;
