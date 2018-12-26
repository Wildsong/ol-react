// ol-geometry.js ol-react
//
import React from 'react';
import PropTypes from 'prop-types';
import {MapContext} from '../map-context';
import {FeatureContext} from '../feature-context';
import {Collection} from 'ol';
import {Modify} from 'ol/interaction';
import OLComponent from '../ol-component';

class OLGeometry extends OLComponent {
    constructor(props) {
        super(props);
        this.state = {
            geometry: null
        }
    }

    componentDidMount() {
        //console.log("OLGeometry.componentDidMount() props=", this.props, this.context)
        this.context.feature.setGeometry(this.state.geometry);
        if (typeof this.props.transform === 'function') {
            this.state.geometry.applyTransform(this.props.transform);
        }

// FIXME putting this here means that you can't turn on modify later.
// It needs to move to an updateFromProps() method
// and there needs to be a test to see if there is already a
// modify interaction or we need to throw away the modify
// when we turn the flag off.
        if (this.props.modify) {
            let interactions = this.context.map.getInteractions()

            this.interaction = new Modify({
                features: new Collection([this.context.feature]),
                insertVertexCondition: this.props.insertVertexCondition
                // Note; as of 27/06/2017, insertVertexCondition is in 4.2.0 of OpenLayers, we can't upgrade yet as the @types package hasn't been updated
            })
            if (this.props.modifyStart) {
                this.interaction.on('modifystart', this.props.modifyStart)
            }
            if (this.props.modifyEnd) {
                this.interaction.on('modifyend', this.props.modifyEnd);
            }
            interactions.push(this.interaction);
        }
    }

    componentDidUpdate() {
        //console.log("OLGeometry.componentDidUpdate() ", this.props)
        this.updateFromProps();
    }

    componentWillUnmount() {
        //console.log("OLGeometry.componentWillUnmount()")
        if (this.props.modify && this.interaction) {
            console.log("OLGeometry Fix map context here")
            let interactions = this.context.map.getInteractions()
            console.log("OLGeometry.componentWillUnmount() interactions = ", interactions);
            if (this.props.modifyStart) {
                this.interaction.un('modifystart', this.props.modifyStart)
            }
            if (this.props.modifyEnd) {
                this.interaction.un('modifyend', this.props.modifyEnd);
            }
            interactions.remove(this.interaction);
        }
        this.context.feature.setGeometry(undefined);
    }

    updateFromProps() {
        //console.log("OLGeometry.updateFromProps()", this.props)
        //throw("You need to override updateFromProps in your geometry class.")
    }

/*
    render() {
        //console.log("OLGeometry.render() props=", this.props)
        return (
            <div>
            {this.props.children}
            </div>
        );
    }
*/
}
OLGeometry.contextType = FeatureContext;

OLGeometry.propTypes = {
    modify: PropTypes.bool,
    modifyStart: PropTypes.func,
    modifyEnd: PropTypes.func,
    insertVertexCondition: PropTypes.func,
    transform: PropTypes.func
}

export default OLGeometry
