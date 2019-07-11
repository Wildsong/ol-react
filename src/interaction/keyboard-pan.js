import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {KeyboardPan} from 'ol/interaction'
import OLInteraction from './ol-interaction'

class OLKeyboardPan extends OLInteraction {
    static propTypes = {
        ...OLInteraction.propTypes,
    	condition: PropTypes.func,
    	duration: PropTypes.number,
    	pixelDelta: PropTypes.number
    };

    createInteraction() {
        return new KeyboardPan({
            condition: this.props.condition,
            duration: this.props.duration,
            pixelDelta: this.props.pixelDelta
        })
    }
}
const mapStateToProps = (state) => ({
    map: state.map.theMap
})
export default connect(mapStateToProps)(OLKeyboardPan);
