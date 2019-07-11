import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {DragPan} from 'ol/interaction'
import OLInteraction from './ol-interaction'

class OLDragPan extends OLInteraction {
    static propTypes = {
        ...OLInteraction.propTypes,
    };

    createInteraction() {
        return new DragPan()
    }
}
const mapStateToProps = (state) => ({
    map: state.map.theMap
})
export default connect(mapStateToProps)(OLDragPan);
