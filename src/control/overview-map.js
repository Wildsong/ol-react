import React from 'react'
import PropTypes from 'prop-types'
import {View, Collection} from 'ol'
import {Layer} from 'ol/layer'
import OLControl from './ol-control'

import {OverviewMap} from 'ol/control'
// This one not working for me 2019-06-28import OverviewMap from 'ol-ext/control/Overview'

export default class OLOverviewMap extends OLControl {
    static propTypes = Object.assign({}, OLControl.propTypes, {
    	className: PropTypes.string,
    	collapsed: PropTypes.bool,
    	collapseLabel: PropTypes.string,
    	collapsible: PropTypes.bool,
    	label: PropTypes.node,
    	layers: PropTypes.oneOfType([
    	    PropTypes.arrayOf(PropTypes.instanceOf(Layer)),
    	    PropTypes.instanceOf(Collection)
    	]),
    	tipLabel: PropTypes.string,
    	view: PropTypes.instanceOf(View)
    })

    createControl (props) {
        this.overviewmap = new OverviewMap({
    	    className: props.className,
    	    collapsed: props.collapsed,
    	    collapseLabel: props.collapseLabel,
    	    collapsible: props.collapsible,
    	    label: props.label,
    	    layers: props.layers,
    	    tipLabel: props.tipLabel,
    	    view: props.view,

            // defaults
            minZoom: 0, maxZoom: 18, rotation: 0,
            //projection: wm,
            align: 'right',
            //style:
            panAnimation: "elastic"
    	})
        return this.overviewmap;
    }

}
