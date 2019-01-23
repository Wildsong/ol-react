import React from 'react'
import PropTypes from 'prop-types'
import {Select} from 'ol/interaction'
import {Collection} from 'ol'
import OLInteraction from './ol-interaction'

export default class OLSelect extends OLInteraction {
    static olEvents = ["select"]
    static propTypes = Object.assign({}, OLInteraction.propTypes, {
	condition: PropTypes.func,
	select: PropTypes.func,
	features: PropTypes.instanceOf(Collection)
    })

    createInteraction(props) {
	return new Select({
	    condition: props.condition
	})
    }
}

