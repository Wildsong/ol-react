import React, {useContext, useEffect} from 'react'
import PropTypes from 'prop-types'
import {VectorTile as olVectorTileSource} from 'ol/source'
import {GeoJSON as GeoJsonFormat, MVT as MVTformat, WKT as WKTformat} from 'ol/format'
import {LayerContext} from '../layer-context'

const VectorTile = (props) => {
    const layer = useContext(LayerContext);
    useEffect(() => {
        const options = {
            ...props,
            format: new MVTformat(), // All we do at the moment.
        };
        const source = new olVectorTileSource(options);
        layer.setSource(source);
        console.log("source.VectorTile mounted", options);
        return () => {
            console.log("source.VectorTile unmounted");
        };
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
