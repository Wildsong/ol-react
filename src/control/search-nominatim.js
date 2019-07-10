// demo: http://viglino.github.io/ol-ext/examples/search/map.control.searchnominatim.html
// api:  http://viglino.github.io/ol-ext/doc/doc-pages/ol.control.SearchNominatim.html

import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import OLControl from './ol-control'
import SearchNominatim from 'ol-ext/control/SearchNominatim'
import 'ol-ext/control/LayerPopup.css'

class OLExtSearchNominatim extends OLControl {
    static propTypes = {
    	onSelect: PropTypes.func,
    };
    constructor(props) {
        super(props);
        this.control = new SearchNominatim({
            className: this.props.className,
        });
        this.control.on('select', this.props.onSelect);
    }
}
const mapStateToProps = (state) => ({
    map: state.map.theMap,
})
export default connect(mapStateToProps)(OLExtSearchNominatim);
