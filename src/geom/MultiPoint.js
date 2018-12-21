import React from 'react';
import PropTypes from 'prop-types';
import {Feature} from 'ol';
import MultiPoint from 'ol/geom/MultiPoint';
import OLGeometry from './ol-geometry';

class OLMultiPoint extends OLGeometry {
    constructor(props) {
        super(props);
        console.log("OLMultiPoint.new() props=", this.props)
        this.state.geometry = new MultiPoint(this.props.children, this.props.layout);
        this.updateFromProps(this.props);
    }

    shouldComponentUpdate(nextProps) {
        // I'd like to know why this is here, seems redundant to me.
        return this.props.children != nextProps.children
    }

    updateFromProps(props) {
        console.log("OLMultiPoint.updateFromProps() props=", props)
        if (props.animate) {
            this.animate(props.children, props.animationLength);
        } else {
            this.state.geometry.setCoordinates(this.props.children);
        }
    }

    animate(finishCoords, animationLength) {
        let frame = animationLength * 1000;
        let startCoords = this.state.geometry.getCoordinates()
        let delta = [finishCoords[0] - startCoords[0], finishCoords[1] - startCoords[1]];
        let finish = null;
        step = (timestamp) => {
            if (!finish) {
                finish = timestamp + frame;
            }
            if (timestamp < finish) {
                let progress = 1 - ((finish - timestamp) / frame);
                this.state.geometry.setCoordinates([startCoords[0] + (delta[0] * progress), startCoords[1] + (delta[1] * progress)]);
                window.requestAnimationFrame(step);
            } else {
                this.state.geometry.setCoordinates(finishCoords);
            }
        }
        window.requestAnimationFrame(step);
    }
}

OLMultiPoint.propTypes = {
    children: PropTypes.arrayOf(
                PropTypes.arrayOf(PropTypes.number)
            ).isRequired,
    animate: PropTypes.bool,
    animationLength: PropTypes.number
}

export default OLMultiPoint;
