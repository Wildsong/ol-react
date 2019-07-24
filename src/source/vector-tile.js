import React, {useState, useContext, useEffect} from 'react'
import PropTypes from 'prop-types'
import {LayerContext} from '../layer-context'
import {SourceProvider} from '../source-context'
import {VectorTile as olVectorTileSource} from 'ol/source'
import {GeoJSON as GeoJsonFormat, MVT as MVTformat, WKT as WKTformat} from 'ol/format'
import olFeature from 'ol/feature'

const VectorTile = (props) => {
    const layer = useContext(LayerContext);
    const [source, setSource] = useState(new olVectorTileSource({
        ...props,
/*        attributions: props.attributions,
        extent: props.extent,
        projection: props.projection,
        maxZoom: props.maxZoom,
        minZoom: props.minZoom,
        url: props.url,
        transition: props.transition,
*/
        format: new MVTformat({
            featureClass: olFeature // slower but allows full edit and geometry
            // see https://stackoverflow.com/questions/42088348/ol-interaction-select-gives-an-error-on-ol-source-vectortile
        }),
    }));
    useEffect(() => {
        //console.log("source.VectorTile mounted");
        layer.setSource(source);
    }, []);
    return (
        <SourceProvider source={source}>
        {props.children}
        </SourceProvider>
    );
}
VectorTile.propTypes = {
    children: PropTypes.oneOfType([PropTypes.array, PropTypes.element]),

    attributions: PropTypes.string,
    //format: PropTypes.oneOf(['geojson','JSON','MVT','WKT']),
    url: PropTypes.string,
    crossOrigin: PropTypes.string, // null | '' | "anonymous" |
    projection: PropTypes.string,
};
export default VectorTile;
