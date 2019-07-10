import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux'
import ReactDOM from 'react-dom'
import {Map, Overlay} from 'ol';
import {Source} from 'ol/source';
import OLComponent from './ol-component';

class OLOverlay extends OLComponent {
    static propTypes = {
        map: PropTypes.instanceOf(Map).isRequired,
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

    /*
    static childContextTypes = {
      source: PropTypes.instanceOf(Source)
    }
    */

    constructor(props) {
        super(props);
        this.overlay = new Overlay({
            id: props.id,
            offset: props.offset,
            position: props.position,
            positioning: props.positioning,
            stopEvent: props.stopEvent,
            insertFirst: props.insertFirst
        });

        this.element = document.createElement("div")
    }

    componentWillUnmount() {
        ReactDOM.unmountComponentAtNode(this.element);
	//        this.element.parentNode.removeChild(this.element);
    }

    componentDidMount() {
        this.props.map.addOverlay(this.overlay);
        this.updateFromProps_();
    }

    componentDidUpdate() {
        //console.log("overlay.componentDidUpdate()", this.props);
        this.updateFromProps_();
    }

    updateFromProps_() {
        if (typeof this.props.element !== 'undefined') {
            ReactDOM.render(this.props.element, this.element);
            this.overlay.setElement(this.element);
            this.element.onclick = function () {
                console.log('ReactOverlay clicked');
            }
        }
        if (typeof this.props.offset !== 'undefined') {
            this.overlay.setOffset(this.props.offset);
        }
        if (this.props.animate) {
            if (typeof this.props.position !== 'undefined')
                this.animate(this.props.position, this.props.animationLength)
        } else {
            // undefined here means "hide"
            this.overlay.setPosition(this.props.position);
        }
        if (typeof this.props.positioning !== 'undefined') {
            this.overlay.setPositioning(this.props.positioning);
        }
    }

    animate(finishCoords, animationLength) {
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
}
const mapStateToProps = (state) => ({
    map: state.map.theMap,
})
export default connect(mapStateToProps)(OLOverlay);
