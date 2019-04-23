import React from 'react'
import PropTypes from 'prop-types'
import { LayerContext } from '../layer-context'
import { Select } from 'ol/interaction'
import { Collection } from 'ol'
import OLInteraction from './ol-interaction'

export default class OLSelect extends OLInteraction {
    static contextType = LayerContext;
    static propTypes = Object.assign({},
         OLInteraction.propTypes, {
	         condition: PropTypes.func,
	         select: PropTypes.func,
             features: PropTypes.instanceOf(Collection)
         }
     )

    static olEvents = ["select"];

    createInteraction() {
        const source = this.context.layer.getSource()
    	const select = new Select({
            source: source,
    	    condition: this.props.condition
    	})
        select.on('select', this.props.select);
        return select;
    }
}
