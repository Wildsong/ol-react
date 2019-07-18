import React, {useContext, useEffect} from 'react'
import PropTypes from 'prop-types'
import {FeatureContext} from '../feature-context'
import Geometry from 'ol/geom/Geometry'

/*
 * Allows combining a ol.geom.Geometry class with ol- Useful if you have
 * retrieved the object from somewhere else, and don't want to convert back
 * into an ol-react component.
 */

const RawGeometry  = (props) => {
    const feature = useContext(FeatureContext);

    useEffect(() => {
        if (props.transform)
            props.geometry.applyTransform(props.transform);
        feature.setGeometry(props.geometry);
        console.log("geometry mounted");
        return () => {
            feature.setGeometry(undefined);
            console.log("geometry unmounted")};
    },[]);
    return null; // nothing to render here
}
RawGeometry.propTypes = {
    geometry: PropTypes.instanceOf(Geometry).isRequired,
    transform: PropTypes.func
}
export default RawGeometry;
