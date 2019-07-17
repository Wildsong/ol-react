import React, {useContext, useEffect} from 'react'
import PropTypes from 'prop-types'
import {LayerContext} from './layer-context'
import {FeatureProvider} from './feature-context'
import {Source} from 'ol/source'
import {Feature as olFeature} from 'ol'
import {buildStyle} from './style'

const Feature = (props) => {
    const layer = useContext(LayerContext);
    const feature = new olFeature()
    feature.setId(props.id);
    feature.setStyle(buildStyle(props.style))

    useEffect(() => {
        console.log("Feature mounted", props, layer);
        layer.getSource().addFeature(feature)
        return () => {
            console.log("Feature unmounted");
            layer.getSource().removeFeature(feature);
        }
    }, [props.style]);

    return (
        <FeatureProvider feature={feature}>
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
