import React from 'react'
import PropTypes from 'prop-types'
import {MapContext} from '../map-context'
import {FeatureContext} from '../feature-context'
import {Collection} from 'ol'
import {Modify} from 'ol/interaction'
import OLComponent from '../ol-component'

export default class OLGeometry extends OLComponent {
    static contextType = FeatureContext;
    static propTypes = {
    	modify: PropTypes.bool,
    	modifyStart: PropTypes.func,
    	modifyEnd: PropTypes.func,
    	insertVertexCondition: PropTypes.func,
    	transform: PropTypes.func
    }

    constructor(props) {
        super(props);
        this.geometry = null
    }

    componentDidMount() {
        //console.log("OLGeometry.componentDidMount() props=", this.props, this.context)
        this.context.feature.setGeometry(this.geometry);
        if (typeof this.props.transform === 'function') {
            this.geometry.applyTransform(this.props.transform);
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

            // FIXME I doubt this works in OL5, I think I need to do an this.interaction.addEventListener() call
            // See also the Unmount method below, fix there too.
            // Check the docs!

            if (this.props.modifyStart) {
                this.interaction.on('modifystart', this.props.modifyStart)
            }
            if (this.props.modifyEnd) {
                this.interaction.on('modifyend', this.props.modifyEnd);
            }

            // Isn't this just a list of interactions? Don't I have to
            // send it back to the map object??
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
            //console.log("OLGeometry Fix map context here")
            let interactions = this.context.map.getInteractions()
            //console.log("OLGeometry.componentWillUnmount() interactions = ", interactions);
            if (this.props.modifyStart) {
                this.interaction.on('modifystart', this.props.modifyStart)
            }
            if (this.props.modifyEnd) {
                this.interaction.on('modifyend', this.props.modifyEnd);
            }
            interactions.remove(this.interaction);
        }
        this.context.feature.setGeometry(undefined);
    }

    updateFromProps() {
        //console.log("OLGeometry.updateFromProps()", this.props)
        //throw("You need to override updateFromProps in your geometry class.")
    }
}
