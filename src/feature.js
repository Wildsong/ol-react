import React from 'react';
import PropTypes from 'prop-types';
import {SourceContext} from './source-context';
import {FeatureContext} from './feature-context';
import {Source} from 'ol/source';
import {Feature} from 'ol';
import OLComponent from './ol-component';
import {buildStyle} from './style';

class OLFeature extends OLComponent {
    constructor(props) {
        super(props);
        console.log("OLFeature new() props=", props)
        this.updateFromProps(props);
        this.state = {
            feature: new Feature()
        }
        this.state.feature.setId(props.id);
    }

    updateFromProps(props) {
        this.state.feature.setStyle(buildStyle(props.style));
    }

    componentDidMount() {
        console.log("OLFeature.componentDidMount() source=", this.context.source)
    }

    componentWillReceiveProps(newProps) {
        console.log("OLFeature.componentWillReceiveProps() newProps=", newProps)
        this.updateFromProps(newProps);
    }

    componentWillUnmount() {
        console.log("OLFeature.componentWillUnmount()")
        this.state.source.removeFeature(this.feature);
    }

    getGeometry() {
        return this.feature.getGeometry();
    }

    render() {
        return (
            <div>
            <FeatureContext.Provider value={{feature: this.feature}}>
            {this.props.children}
            </FeatureContext.Provider>
            </div>
        );
    }
}

OLFeature.propTypes = {
    style: PropTypes.object,
    children: PropTypes.element,
    id: PropTypes.any.isRequired
}

export default OLFeature
