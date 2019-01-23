import React from 'react'
import PropTypes from 'prop-types'
import { Zoom } from 'ol/control'
import OLControl from './ol-control'

export default class OLZoom extends OLControl {
    static propTypes = Object.assign({}, OLControl.propTypes, {
    	className: PropTypes.string,
    	delta: PropTypes.number,
    	duration: PropTypes.number,
    	zoomInLabel: PropTypes.node,
    	zoomInTipLabel: PropTypes.string,
    	zoomOutLabel: PropTypes.node,
    	zoomOutTipLabel: PropTypes.string
    })
    static defaultProps = {
	    duration: 250
    }

    createControl(props) {
        this.zoomControl = new Zoom({
            className: props.className,
            delta: props.delta,
            duration: props.duration,
            zoomInLabel: props.zoomInLabel,
            zoomInTipLabel: props.zoomInTipLabel,
            zoomOutLabel: props.zoomOutLabel,
            zoomOutTipLabel: props.zoomOutTipLabel
        })
        return this.zoomControl;
    }

    //render() {
    //    //console.log("OLZoom render ", this.props);
    //    return super.render();
    //}
}
