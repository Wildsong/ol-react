import React from 'react';
import PropTypes from 'prop-types';
import MapContext from '../map-context';
import OLComponent from '../ol-component';

class OLControl extends OLComponent {

    constructor(props) {
        super(props);
        this.control = this.createControl(props)
    }

    componentDidMount() {
        MapContext.map.addControl(this.control)
    }

    componentWillUnmount() {
        MapContext.map.removeControl(this.control)
    }

    createControl(props) {
        throw new TypeError('You must override createControl() in classes derived ' +
                            'from OLControl')
    }
}

OLControl.propTypes = {
    //element: OLPropTypes.HTMLElement,
    //render: PropTypes.func,
    target: PropTypes.string
}

OLControl.defaultProps = {
}

export default OLControl;
