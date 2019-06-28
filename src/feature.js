import React from 'react'
import PropTypes from 'prop-types'
import {LayerContext} from './layer-context'
import {FeatureContext} from './feature-context'
import {Source} from 'ol/source'
import {Feature} from 'ol'
import OLComponent from './ol-component'
import {buildStyle} from './style'

export default class OLFeature extends OLComponent {
    static contextType = LayerContext;
    static propTypes = {
        style: PropTypes.object,
        children: PropTypes.element,
        id: PropTypes.any.isRequired
    }
    constructor(props) {
        super(props);
        //console.log("OLFeature new() props=", this.props)
        this.feature = new Feature()
        this.updateFromProps();
        this.feature.setId(this.props.id);
    }

    componentDidMount() {
        //console.log("OLFeature.componentDidMount()", this.context);
        this.context.layer.getSource().addFeature(this.feature)
    }

    componentDidUpdate() {
        //console.log("OLFeature.componentDidUpdate() props=", this.props)
        this.updateFromProps();
    }

    updateFromProps(props) {
        this.feature.setStyle(buildStyle(this.props.style));
    }

    componentWillUnmount() {
        //console.log("OLFeature.componentWillUnmount() context=", this.context)
        this.context.layer.getSource().removeFeature(this.feature);
    }

    getGeometry() {
        return this.feature.getGeometry();
    }

    render() {
        // A Feature might have some Geometrird as children.
        // We use context to tell the geometry about the ol feature and the map
        // It's currently only using the map to find the list of "interactions".
        // Maybe I should pass down the interactions instead of the whole map.
        return (
            <>
                <FeatureContext.Provider value={{
                    feature: this.feature,
                    map: this.context.map
                }}>
                    {this.props.children}
                </FeatureContext.Provider>
            </>
        );
    }
}
