import React, {useContext, useEffect} from 'react'
import PropTypes from 'prop-types'
//import {LayerContext} from './layer-context'
import {SourceContext} from './source-context'
import {FeatureProvider} from './feature-context'
import {Source} from 'ol/source'
import {Feature as olFeature} from 'ol'
import {buildStyle} from './style'
import cuid from 'cuid'

const Feature = (props) => {
//    const layer = useContext(LayerContext);
    const source = useContext(SourceContext);
    const feature = new olFeature()
    feature.setId((typeof props.id !== 'undefined')? props.id : cuid());
    feature.setStyle(buildStyle(props.style))

    useEffect(() => {

        // Using getSource does not work because source has not been set
        // when this function gets called. That's why I was forced to add
        // the SourceContext.

        //const source = layer.getSource();
        console.log("Feature mounted", props, source);
        source.addFeature(feature);
        return () => {
            //const source = layer.getSource().
            console.log("Feature unmounted", source, feature);
            source.removeFeature(feature);
        }
    }, []);

    return (
        <FeatureProvider feature={feature}>
            {props.children}
        </FeatureProvider>
    );
}
Feature.propTypes = {
    style: PropTypes.object,
    children: PropTypes.element
};
export default Feature;
