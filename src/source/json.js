import React, {useState, useContext, useEffect} from 'react';  // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types'
import {LayerContext} from '../layer-context'
import {SourceProvider} from '../source-context'  // eslint-disable-line no-unused-vars
import Vector from 'ol/source/Vector'
import Collection from 'ol/Collection'
import {bbox, tile} from 'ol/loadingstrategy'  // eslint-disable-line no-unused-vars
import Feature from 'ol/format/Feature'
import {DataLoader} from './dataloaders'

const JSONSource = ({loader, url, features, children}) => {
    const layer = useContext(LayerContext)
    const [source] = useState(new Vector({
        strategy: bbox, // bbox or tile
        features: features
    }));

    useEffect(() => {
        source.setLoader(DataLoader(loader, url, source));
        layer.setSource(source);
    }, []);

    return (
        <SourceProvider source={source}>
        {children}
        </SourceProvider>
    );
}
JSONSource.propTypes = {
    children: PropTypes.oneOfType([PropTypes.array, PropTypes.element]),

    url: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.func
    ]).isRequired,
//    attributions: PropTypes.oneOfType([PropTypes.string, PropTypes.function,
//        PropTypes.arrayOf(PropTypes.string)]),
    loader: PropTypes.string, // "geojson" || "esrijson" required when url is not a function
    features: PropTypes.instanceOf(Collection),
    format: PropTypes.instanceOf(Feature)
};
export default JSONSource;
