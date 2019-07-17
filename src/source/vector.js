import React, {useContext, useEffect} from 'react'
import PropTypes from 'prop-types'
import {Vector as olVector} from 'ol/source'
import {Collection} from 'ol'
import {LayerContext} from '../layer-context'

const Vector = (props) => {
    const layer = useContext(LayerContext);
    console.log("source.Vector",props);
    const source = new olVector(props)
    layer.setSource(source);
    useEffect(() => {
        console.log("source.Vector mounted", props);
        return () => {
            console.log("source.Vector unmounted");
        };
    }, []);
    return (
        <>
        {props.children}
        </>
    );
}
Vector.propTypes = {
    overlap: PropTypes.bool,
    //strategy:
    url: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    features: PropTypes.instanceOf(Collection),
};
export default Vector;
