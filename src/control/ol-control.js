import React from 'react';
import PropTypes from 'prop-types';
import {MapContext} from '../map-context';
import OLComponent from '../ol-component';

class OLControl extends OLComponent {
    constructor(props) {
        super(props);
        this.control = this.createControl(props)
    }

    componentDidMount() {
        this.context.map.addControl(this.control)
    }

    componentWillUnmount() {
        this.context.map.removeControl(this.control)
    }

    createControl(props) {
        throw new TypeError('You must override createControl() in classes derived ' +
                            'from OLControl')
    }
}
OLControl.contextType = MapContext;

OLControl.propTypes = {
    //element: OLPropTypes.HTMLElement,
    //render: PropTypes.func,
    target: PropTypes.string
}

OLControl.defaultProps = {
}

export default OLControl;
