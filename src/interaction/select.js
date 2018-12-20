import React from 'react'
import PropTypes from 'prop-types'
import {Select} from 'ol/interaction'
import {Collection} from 'ol'
import OLInteraction from './ol-interaction'

export default class OLSelect extends OLInteraction {
  createInteraction (props) {
    return new Select({
      condition: props.condition
    })
  }
}

OLSelect.propTypes = Object.assign({}, OLInteraction.propTypes, {
  condition: PropTypes.func,
  select: PropTypes.func,
  features: PropTypes.instanceOf(Collection)
})

OLSelect.olEvents = ["select"]
