import React, {useState, useContext, useEffect} from 'react'
import PropTypes from 'prop-types'
import {LayerContext} from '../layer-context'
import {SourceProvider} from '../source-context'
import {Vector as olVector} from 'ol/source'
import {Collection} from 'ol'

const Vector = (props) => {
    const layer = useContext(LayerContext);
    const [source, setSource] = useState(new olVector(props));

    useEffect(() => {
        console.log("source.Vector mounted");

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
    //strategy:
    features: PropTypes.instanceOf(Collection),
    url: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
};
export default Vector;
