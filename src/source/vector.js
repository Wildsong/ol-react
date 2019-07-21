import React, {useState, useContext, useEffect} from 'react'
import PropTypes from 'prop-types'
import {LayerContext} from '../layer-context'
import {SourceProvider} from '../source-context'
import {Vector as olVectorSource} from 'ol/source'
import {Collection} from 'ol'

const Vector = (props) => {
    const layer = useContext(LayerContext);
    const [source, setSource] = useState(
        (typeof props.source === "object") ? props.source : new olVectorSource(props)
    );
    useEffect(() => {
        //console.log("source.Vector mounted");
        //  This is used for a DRAW Interaction, see example1
        if (typeof props.addfeature !== 'undefined') {
            source.addEventListener("addfeature", (e) => {
                console.log("Vector.addfeature", e);
                props.addfeature(e);
            });
        }
        layer.setSource(source);
    }, [] );
    return (
        <SourceProvider source={source}>
        {props.children}
        </SourceProvider>
    );
}
Vector.propTypes = {
    overlap: PropTypes.bool,
    strategy: PropTypes.func,
    features: PropTypes.instanceOf(Collection),
    url: PropTypes.oneOfType([PropTypes.string, PropTypes.func]), // option 1: give me an URL as a string or function
    format: PropTypes.func, // feature format required when url is set.
    source: PropTypes.instanceOf(olVectorSource), // option 2, give me a source object here
};
export default Vector;
