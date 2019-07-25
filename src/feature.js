import React, {useState, useContext, useEffect} from 'react'
import PropTypes from 'prop-types'
import {SourceContext} from './source-context'
import {FeatureProvider} from './feature-context'
import {Source} from 'ol/source'
import {Style as olStyle} from 'ol/style'
import {Feature as olFeature} from 'ol'
//import cuid from 'cuid'

const Feature = (props) => {
    const source = useContext(SourceContext);
    const [feature, setFeature] = useState(() => {
        const f = new olFeature()
        f.setId(props.id);
//        f.setId((typeof props.id !== 'undefined')? props.id : cuid());
        return f;
    });

    useEffect(() => {
        // Using getSource does not work because source has not been set
        // when this function gets called. That's why I was forced to add
        // the SourceContext.
        //const source = layer.getSource();

        try {
            feature.setStyle(props.style)
        } catch {
            console.error("feature lacks style", feature.getId(), props.style)
        }
        source.addFeature(feature);
        //console.log("Feature mounted", props, source);
        return () => {
//            console.log("Feature unmounted", source, feature);
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
    children: PropTypes.oneOfType([PropTypes.array, PropTypes.element]),

    id: PropTypes.string.isRequired,
    style: PropTypes.oneOfType([PropTypes.func,
        PropTypes.instanceOf(olStyle),
    ]),
};
export default Feature;
