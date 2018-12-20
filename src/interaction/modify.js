import React from 'react'
import PropTypes from 'prop-types'
import {Collection} from 'ol'
import {Modify as olModify} from 'ol/interaction'
import OLInteraction from './ol-interaction'

export default class Modify extends OLInteraction {
    createInteraction (props) {
        return new olModify({
            condition: props.condition,
            features: props.features
        })
    }
}

Modify.propTypes = Object.assign({}, OLInteraction.propTypes, {
    condition: PropTypes.func,
    modifyend: PropTypes.func,
    modifystart: PropTypes.func,
    features: PropTypes.instanceOf(Collection).isRequired
})

Modify.olEvents = ["modifyend", "modifystart"]
