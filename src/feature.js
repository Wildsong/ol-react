import React from 'react'
import PropTypes from 'prop-types'
import {LayerContext} from './layer-context'
import {FeatureContext} from './feature-context'
import {Source} from 'ol/source'
import {Feature} from 'ol'
import OLComponent from './ol-component'
import {buildStyle} from './style'

class OLFeature extends OLComponent {
    constructor(props) {
        super(props);
        //console.log("OLFeature new() props=", this.props)
        this.state = {
            feature: new Feature()
        }
        this.updateFromProps();
        this.state.feature.setId(this.props.id);
    }

    componentDidMount() {
        //console.log("OLFeature.componentDidMount()", this.context);
        this.context.layer.getSource().addFeature(this.state.feature)
    }

    componentDidUpdate() {
        //console.log("OLFeature.componentDidUpdate() props=", this.props)
        this.updateFromProps();
    }

    updateFromProps(props) {
        this.state.feature.setStyle(buildStyle(this.props.style));
    }

    componentWillUnmount() {
        //console.log("OLFeature.componentWillUnmount() context=", this.context)
        this.context.layer.getSource().removeFeature(this.state.feature);
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

OLFeature.contextType = LayerContext;

OLFeature.propTypes = {
    style: PropTypes.object,
    children: PropTypes.element,
    id: PropTypes.any.isRequired
}

export default OLFeature
