import React, {useState, useContext, useEffect} from 'react';  // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types'
import {LayerContext} from '../layer-context'
import {SourceProvider} from '../source-context' // eslint-disable-line no-unused-vars
import VectorTileSource from 'ol/source/VectorTile'
import {GeoJSON as GeoJsonFormat, MVT as MVTformat, WKT as WKTformat} from 'ol/format'  // eslint-disable-line no-unused-vars
import Feature from 'ol/Feature'

const VectorTile = (props) => {
    const layer = useContext(LayerContext);
//    console.log("vectortilesource props", props);
    const [source] = useState(new VectorTileSource({
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
            featureClass: Feature // slower but allows full edit and geometry
            // see https://stackoverflow.com/questions/42088348/ol-interaction-select-gives-an-error-on-ol-source-vectortile
        }),
    }));

    useEffect(() => {
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

    attributions: PropTypes.oneOfType([PropTypes.string, PropTypes.func,
        PropTypes.arrayOf(PropTypes.string)]),
    //format: PropTypes.oneOf(['geojson','JSON','MVT','WKT']),
    url: PropTypes.string,
    crossOrigin: PropTypes.string, // null | '' | "anonymous" |
    projection: PropTypes.string,
};
export default VectorTile;
