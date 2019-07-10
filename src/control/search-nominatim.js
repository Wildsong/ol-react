// demo: http://viglino.github.io/ol-ext/examples/search/map.control.searchnominatim.html
// api:  http://viglino.github.io/ol-ext/doc/doc-pages/ol.control.SearchNominatim.html

import React from 'react'
import PropTypes from 'prop-types'
import OLComponent from '../ol-component';
import SearchNominatim from 'ol-ext/control/SearchNominatim'
import 'ol-ext/control/LayerPopup.css'

class OLExtSearchNominatim extends OLComponent {
    static propTypes = {
    	onSelect: PropTypes.func,
    };
    constructor(props) {
        super(props);
        this.search = new SearchNominatim({
            className: props.className,
        });
        this.search.on('select', props.onSelect);
        return this.search;
    }
}
export default OLExtSearchNominatim;
