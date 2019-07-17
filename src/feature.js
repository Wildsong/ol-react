import React, {useContext, useEffect} from 'react'
import PropTypes from 'prop-types'
import {LayerContext} from './layer-context'
import {FeatureContext, FeatureProvider} from './feature-context'
import {Source} from 'ol/source'
import {Feature as olFeature} from 'ol'
import {buildStyle} from './style'

const Feature = (props) => {
    const layer = useContext(LayerContext);
    let feature;

    useEffect(() => {
        console.log("Feature added", props);
        feature = new olFeature()
        feature.setId(props.id);
        layer.getSource().addFeature(feature)
        feature.setStyle(buildStyle(props.style))
        return () => {
            console.log("Feature removed");
            layer.getSource().removeFeature(feature);
        }
    }, [props.style]);

    return (
        <FeatureProvider value={feature}>
            {props.children}
        </FeatureProvider>
    );
}
Feature.propTypes = {
    style: PropTypes.object,
    children: PropTypes.element,
    id: PropTypes.any.isRequired
};
export default Feature;
