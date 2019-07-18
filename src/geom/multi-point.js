import React, {useContext, useEffect} from 'react'
import PropTypes from 'prop-types'
import {FeatureContext} from '../feature-context'
import {Point as olPoint} from 'ol/geom'
import {MultiPoint as olMultiPoint} from 'ol/geom'

const MultiPoint = (props) => {
    const feature = useContext(FeatureContext);
    const geometry = new olMultiPoint(props.children);
    /*
    // This is here for later so I commented it out.
    // I think this might have something to do with animation, I've never tested it. :-)
    // I am guessing the window class references will break React's render model.

    updateFromProps() {
        //console.log("OLMultiPoint.updateFromProps()", this.props)
        if (this.props.animate) {
            animate(props.children, props.animationLength);
        } else {
            geometry.setCoordinates(props.children);
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
*/

    useEffect(() => {
        if (props.transform)
            geometry.applyTransform(props.transform);
        feature.setGeometry(geometry);
        //console.log("multipoint mounted");
        //return () => {console.log("multipoint unmounted")};
    },[]);
    return null; // nothing to render here
}
MultiPoint.propTypes = {
    children: PropTypes.arrayOf(PropTypes.number).isRequired,
    animate: PropTypes.bool,
    animationLength: PropTypes.number
}
export default MultiPoint
