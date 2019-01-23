import React from 'react'
import PropTypes from 'prop-types'
import {Attribution} from 'ol/control'
import OLControl from './ol-control'

export default class OLAttribution extends OLControl {
    static propTypes = Object.assign({}, OLControl.propTypes, {
	className: PropTypes.string,
	collapsed: PropTypes.bool,
	collapseLabel: PropTypes.string,
	collapsible: PropTypes.bool,
	label: PropTypes.node,
	tipLabel: PropTypes.string
    })

    createControl (props) {
	console.log("control.Attribution props=", props)
	return new Attribution({
	    className: props.className,
	    collapsed: props.collapsed,
	    collapseLabel: props.collapseLabel,
	    collapsible: props.collapsible,
	    label: props.label,
	    tipLabel: props.tipLabel
	})
    }
}

