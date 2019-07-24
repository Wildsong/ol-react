import React, {useState, useContext, useEffect} from 'react'
import PropTypes from 'prop-types'
import {LayerContext} from '../layer-context'
import {SourceProvider} from '../source-context'
import {Vector as olVectorSource} from 'ol/source'
import {Collection as olCollection} from 'ol'
import FeatureFormat from 'ol/format/Feature'
import {bbox, tile} from 'ol/loadingstrategy'
import {DataLoader} from './dataloaders'

const JSONSource = (props) => {
    const layer = useContext(LayerContext)
    const [source, setSource] = useState(new olVectorSource({
        strategy: bbox // bbox or tile
    }));
    useEffect(() => {
        console.log("source.JSON mounted");
        source.setLoader(DataLoader(props.loader, props.url, source));
        layer.setSource(source);
    }, []);
    return (
        <SourceProvider source={source}>
        {props.children}
        </SourceProvider>
    );
}
JSONSource.propTypes = {
    children: PropTypes.oneOfType([PropTypes.array, PropTypes.element]),

    url: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.func
    ]).isRequired,
    loader: PropTypes.string, // "geojson" || "esrijson" required when url is not a function
    attributions: PropTypes.func,
    features: PropTypes.instanceOf(olCollection),
    format: PropTypes.instanceOf(FeatureFormat)
};
export default JSONSource;
