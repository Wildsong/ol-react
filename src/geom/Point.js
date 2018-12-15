import React from 'react';
import PropTypes from 'prop-types';
import {Feature} from 'ol';
import Point from 'ol/geom/Point';
import Circle from 'ol/geom/Circle';
import OLGeometry from './ol-geometry';

// how should I style this?
// I should be able to show it as a circle,
// that's what my other demo did.

class OLPoint extends OLGeometry {
    constructor(props) {
        super(props);
        this.geometry = new Point(props);
        this.updateFromProps(props);
    }

    shouldComponentUpdate(nextProps) {
        return this.props.children != nextProps.children
    }

    updateFromProps(props) {
        if (props.animate) {
            this.animate(props.children, props.animationLength);
        } else {
            this.geometry.setCoordinates(this.props.children);
        }
    }

    animate(finishCoords, animationLength) {
        let frame = animationLength * 1000;
        let startCoords = this.geometry.getCoordinates()
        let delta = [finishCoords[0] - startCoords[0], finishCoords[1] - startCoords[1]];
        let finish = null;
        step = (timestamp) => {
            if (!finish) {
                finish = timestamp + frame;
            }
            if (timestamp < finish) {
                let progress = 1 - ((finish - timestamp) / frame);
                this.geometry.setCoordinates([startCoords[0] + (delta[0] * progress), startCoords[1] + (delta[1] * progress)]);
                window.requestAnimationFrame(step);
            } else {
                this.geometry.setCoordinates(finishCoords);
            }
        }
        window.requestAnimationFrame(step);
    }

    componentWillReceiveProps(newProps) {
        this.updateFromProps(newProps);
    }
}

OLPoint.propTypes = {
    children: PropTypes.arrayOf(PropTypes.number).isRequired,
    animate: PropTypes.bool,
    animationLength: PropTypes.number
}

OLPoint.contextTypes = {
    feature: PropTypes.instanceOf(Feature)
}

export default OLPoint;
