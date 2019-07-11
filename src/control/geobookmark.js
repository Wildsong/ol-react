import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import OLControl from './ol-control'
import GeoBookmark from 'ol-ext/control/GeoBookmark'
import 'ol-ext/control/GeoBookmark.css'

class OLExtGeoBookmarkControl extends OLControl {
    static propTypes = {
        ...OLControl.propTypes,
    	marks: PropTypes.object,
    }
    constructor(props) {
        super(props);
        this.control = new GeoBookmark(props)
    }
}
const mapStateToProps = (state) => ({
    map: state.map.theMap,
})
export default connect(mapStateToProps)(OLExtGeoBookmarkControl);
