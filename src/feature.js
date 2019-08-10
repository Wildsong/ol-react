import React, {useState, useContext, useEffect} from 'react';  // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types'
import {SourceContext} from './source-context'
import {FeatureProvider} from './feature-context'  // eslint-disable-line no-unused-vars
import Style from 'ol/style/Style'
import olFeature from 'ol/Feature'
//import cuid from 'cuid'

const Feature = ({id, style, children}) => {
    const source = useContext(SourceContext);
    const [feature] = useState(() => {
        const f = new olFeature()
        f.setId(id);
//        f.setId((typeof props.id !== 'undefined')? props.id : cuid());
        return f;
    });

    useEffect(() => {
        // Using getSource does not work because source has not been set
        // when this function gets called. That's why I was forced to add
        // the SourceContext.
        //const source = layer.getSource();

        try {
            feature.setStyle(style)
        } catch(err) {
            console.error(err, feature.getId(), style);
        }
        source.addFeature(feature);

        return () => {
            source.removeFeature(feature);
        }
    }, [feature, style, source]);

    return (
        <FeatureProvider feature={feature}>
            {children}
        </FeatureProvider>
    );
}
Feature.propTypes = {
    children: PropTypes.oneOfType([PropTypes.array, PropTypes.element]),

    id: PropTypes.string.isRequired,
    style: PropTypes.oneOfType([PropTypes.func, PropTypes.instanceOf(Style)]),
};
export default Feature;
