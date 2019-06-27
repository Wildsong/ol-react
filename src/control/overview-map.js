import React from 'react';
import PropTypes from 'prop-types';
import {View, Collection} from 'ol';
import {OverviewMap} from 'ol/control';
import {Layer} from 'ol/layer';
import OLControl from './ol-control';
import { LayerContext } from '../layer-context'

// ol-ext experiments
import { Overview } from 'ol/control'

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
    	return new OverviewMap({
    	    className: props.className,
    	    collapsed: props.collapsed,
    	    collapseLabel: props.collapseLabel,
    	    collapsible: props.collapsible,
    	    label: props.label,
    	    layers: props.layers,
    	    tipLabel: props.tipLabel,
    	    view: props.view,

            // defaults
            //minZoom: 0, maxZoom: 18,
            //projection: wm,
            align: 'right',
            //style:
            //panAnimation: true
    	})
    }

    render() {
        console.log("This here is the overview map renderer.");
        return (
            <>
            <LayerContext.Provider value={{
                map  : this.context.map,
                layer: this.layer
            }}>
                {this.props.children}
            </LayerContext.Provider>
            </>
        );
    }

}
