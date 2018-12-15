import React from 'react';
import PropTypes from 'prop-types';
import MapContext from '../map-context';
import FeatureContext from '../feature-context';
import {Collection} from 'ol';
import {Modify} from 'ol/interaction';
import OLComponent from '../ol-component';

class OLGeometry extends OLComponent {
    componentDidMount() {
        console.log("OLGeometry componentDidMount")
        FeatureContext.feature.setGeometry(this.geometry);
        if (typeof this.props.transform === 'function') {
            this.geometry.applyTransform(this.props.transform);
        }

        if (this.props.modify) {
            let interactions = MapContext.map.getInteractions()
            this.interaction = new Modify({
                features: new Collection([FeatureContext.feature]),
                //insertVertexCondition: this.props.insertVertexCondition
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

    componentWillUnmount() {
        if (this.props.modify && this.interaction) {
            let interactions = MapContext.map.getInteractions()
            if (this.props.modifyStart) {
                this.interaction.un('modifystart', this.props.modifyStart)
            }
            if (this.props.modifyEnd) {
                this.interaction.un('modifyend', this.props.modifyEnd);
            }
            interactions.remove(this.interaction);
        }
        FeatureContext.feature.setGeometry(undefined);
    }
}

OLGeometry.propTypes = {
    modify: PropTypes.bool,
    modifyStart: PropTypes.func,
    modifyEnd: PropTypes.func,
    insertVertexCondition: PropTypes.func,
    transform: PropTypes.func
}

export default OLGeometry
