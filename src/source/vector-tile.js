import React, {useState, useContext, useEffect} from 'react'
import PropTypes from 'prop-types'
import {LayerContext} from '../layer-context'
import {VectorTile as olVectorTileSource} from 'ol/source'
import {GeoJSON as GeoJsonFormat, MVT as MVTformat, WKT as WKTformat} from 'ol/format'

const VectorTile = (props) => {
    const layer = useContext(LayerContext);
    const [source, setSource] = useState(new olVectorTileSource({
        ...props,
        format: new MVTformat(), // All we support at the moment.
    }));
    useEffect(() => {
        console.log("source.VectorTile mounted");
        layer.setSource(source);
    }, []);
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
