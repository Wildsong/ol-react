import React, {useState, useContext, useEffect} from 'react';  // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import {MapContext} from './map-context'
import olOverlay from 'ol/Overlay'

/*
const animate(finishCoords, animationLength) {
    let frame = animationLength * 1000;
    let startCoords = this.overlay.getPosition();
    if (startCoords) {
        let delta = [finishCoords[0] - startCoords[0], finishCoords[1] - startCoords[1]];
        let finish = null;
        let step = (timestamp) => {
            if (!finish) {
                finish = timestamp + frame;
            }
            if (timestamp < finish) {
                let progress = 1 - ((finish - timestamp) / frame);
                this.overlay.setPosition([startCoords[0] + (delta[0] * progress), startCoords[1] + (delta[1] * progress)]);
                window.requestAnimationFrame(step);
            } else {
                this.overlay.setPosition(finishCoords);
            }
        }
        window.requestAnimationFrame(step);
    }
}
*/

const Overlay = (props) => {
    const map = useContext(MapContext);
    const [overlay] = useState(new olOverlay({
            id: props.id,
            offset: props.offset,
            position: props.position,
            positioning: props.positioning,
            stopEvent: props.stopEvent,
            insertFirst: props.insertFirst
        }));
    const [element] = useState(document.createElement("div"));
/*
    const olay = element => {
        overlay.setTarget(element)
    }
*/
    useEffect(() => {
        map.addOverlay(overlay);
        console.log("Overlay mounted.");
        ReactDOM.render(props.element, element);
        overlay.setElement(element);
        element.onclick = function () {
            console.log('ReactOverlay clicked');
        }
        return () => {
            ReactDOM.unmountComponentAtNode(element);
            //        this.element.parentNode.removeChild(this.element);
            console.log("Overlay unmounted.");
        };
    }, [element, map, map.title, overlay, props.element]);

    useEffect(() => {
        console.log("Offset set to ", props.offset);
        overlay.setOffset(props.offset);
    }, [overlay, props.offset]);

/*    if (props.animate) {
        if (typeof this.props.position !== 'undefined')
            this.animate(this.props.position, this.props.animationLength)
    } else
    {
        // undefined here means "hide"
        overlay.setPosition(props.position);
    }
    if (typeof props.positioning !== 'undefined') {
        overlay.setPositioning(props.positioning);
    }
    */
    return null;
    /*(
        <div ref={olay}>
        {props.children}
        </div>
    );*/
}
Overlay.propTypes = {
    id: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
    ]),
    element: PropTypes.element,
    offset: PropTypes.arrayOf(PropTypes.number),
    position: PropTypes.arrayOf(PropTypes.number),
    positioning: PropTypes.string,
    stopEvent: PropTypes.bool,
    insertFirst: PropTypes.bool,
    animate: PropTypes.bool,
    animationLength: PropTypes.number
}
export default Overlay;
