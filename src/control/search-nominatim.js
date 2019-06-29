// demo: http://viglino.github.io/ol-ext/examples/search/map.control.searchnominatim.html
// api:  http://viglino.github.io/ol-ext/doc/doc-pages/ol.control.SearchNominatim.html

import React from 'react'
import PropTypes from 'prop-types'
import OLControl from './ol-control'
import SearchNominatim from 'ol-ext/control/SearchNominatim'
import 'ol-ext/control/LayerPopup.css'

export default class OLExtSearchNominatim extends OLControl {
    static propTypes = Object.assign({}, OLControl.propTypes, {
    	onSelect: PropTypes.func,
    })
//    static defaultProps = {
//    }

    createControl(props) {
        this.search = new SearchNominatim({target: props.target});
        this.search.on('select', props.onSelect);
        return this.search;
    }

    //render() {
    //    //console.log("OLZoom render ", this.props);
    //    return super.render();
    //}
}
