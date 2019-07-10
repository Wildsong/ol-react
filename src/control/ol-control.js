import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux'
import {Map} from 'ol'
import OLComponent from '../ol-component'

class OLControl extends OLComponent {
    static propTypes = {
        map: PropTypes.instanceOf(Map),
    }

    componentDidMount() {
        this.props.map.addControl(this.control)
    }

    componentWillUnmount() {
        this.props.map.removeControl(this.control)
    }
}
const mapStateToProps = (state) => ({
    map: state.theMap.map,
})
export default OLControl;
