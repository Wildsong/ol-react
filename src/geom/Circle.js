import React from 'react';
import PropTypes from 'prop-types';

import {Feature} from 'ol';
import Circle from 'ol/geom/Circle';

import OLGeometry from './OLGeometry';

class ReactCircle extends OLGeometry {
    constructor(props) {
        super(props);
        console.log('debug circle', props);
        this.geometry = new Circle(props);
        this.updateFromProps(props);
    }

    updateFromProps(props) {
        console.log('debug circle update', props.children);
        this.geometry.setCoordinates(props.children);
    }

    componentDidMount() {
        this.context.feature.setGeometry(this.geometry);
    }

    componentWillReceiveProps(newProps) {
        this.updateFromProps(newProps);
    }
}

// Circle requires a center x,y point
//   optionally radius (default 0)
//   and layout (default XY, I hope!)

ReactCircle.propTypes = {
//    children:
//        PropTypes.arrayOf(PropTypes.number).isRequired, // center requirement
//        PropTypes.instanceOf(PropTypes.number),         // radius option
//                                                        // layout option
//    }
}

ReactCircle.contextTypes = {
    feature: PropTypes.instanceOf(Feature)
}

export default ReactCircle;
