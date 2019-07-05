import React from 'react';
import PropTypes from 'prop-types';
import {MapContext} from '../map-context';
import OLComponent from '../ol-component';

export default class OLControl extends OLComponent {
    static contextType = MapContext;
    static propTypes = {
	    //element: OLPropTypes.HTMLElement,
	    //render: PropTypes.func,
	    target: PropTypes.string // render to element outside the map
    }
    static defaultProps = {
    }

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        console.log("OLControl.componentDidMount");
        this.control = this.createControl(this.props)
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
