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
        //console.log("OLFeature new() props=", props)
        this.state = {
            feature: new Feature()
        }
        this.updateFromProps(props);
        this.state.feature.setId(props.id);
    }

    updateFromProps(props) {
        this.state.feature.setStyle(buildStyle(props.style));
    }

    componentDidMount() {
        //console.log("OLFeature.componentDidMount() source=", this.context.source)
        this.context.source.addFeature(this.state.feature)
    }

    componentWillReceiveProps(newProps) {
        //console.log("OLFeature.componentWillReceiveProps() newProps=", newProps)
        this.updateFromProps(newProps);
    }

    componentWillUnmount() {
        //console.log("OLFeature.componentWillUnmount() context=", this.context)
        this.context.source.removeFeature(this.state.feature);
    }

    getGeometry() {
        return this.state.feature.getGeometry();
    }

    render() {
        //console.log("OLFeature.render() state=", this.state)
        return (
            <div>
            <FeatureContext.Provider value={{
                feature: this.state.feature,
                map: this.context.map
            }}>
            {this.props.children}
            </FeatureContext.Provider>
            </div>
        );
    }
}
OLFeature.contextType = SourceContext;

OLFeature.propTypes = {
    style: PropTypes.object,
    children: PropTypes.element,
    id: PropTypes.any.isRequired
}

export default OLFeature
