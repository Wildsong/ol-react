import React, {useState, useContext, useEffect} from 'react';  // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types'
import {LayerContext} from '../layer-context'
import {SourceProvider} from '../source-context'  // eslint-disable-line no-unused-vars
import {Vector as olVectorSource} from 'ol/source'
import {Collection} from 'ol'

const Vector = (props) => {
    const layer = useContext(LayerContext);
    const [source] = useState(
        (typeof props.source === "object") ? props.source : new olVectorSource(props)
    );

    useEffect(() => {
        //console.log("source.Vector mounted");
        //  This is used for a DRAW Interaction, see example1
        if (props.addFeature !== undefined) {
            //console.log("vector: Add feature listener", props.addFeature, source)
            source.on("addfeature", props.addFeature);
        }
        layer.setSource(source);
    }, []);

    return (
        <SourceProvider source={source}>
        {props.children}
        </SourceProvider>
    );
}
Vector.propTypes = {
    attributions: PropTypes.oneOfType([PropTypes.string, PropTypes.func,
        PropTypes.arrayOf(PropTypes.string)]),
    overlap: PropTypes.bool,
    strategy: PropTypes.func,
    features: PropTypes.instanceOf(Collection),
    url: PropTypes.oneOfType([PropTypes.string, PropTypes.func]), // option 1: give me an URL as a string or function
    format: PropTypes.func, // feature format required when url is set.
    addFeature: PropTypes.func,

    source: PropTypes.instanceOf(olVectorSource), // option 2, give me a source object here
};
export default Vector;
