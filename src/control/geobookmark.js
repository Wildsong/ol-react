// demo: http://viglino.github.io/ol-ext/examples/control/map.switcher.popup.html

import React from 'react'
import PropTypes from 'prop-types'
import OLControl from './ol-control'
import GeoBookmark from 'ol-ext/control/GeoBookmark'
import 'ol-ext/control/GeoBookmark.css'

export default class OLExtGeoBookmarkControl extends OLControl {
    static propTypes = Object.assign({}, OLControl.propTypes, {
    	marks: PropTypes.object,
    })
//    static defaultProps = {
//    }

    createControl(props) {
        this.geoBookmarkControl = new GeoBookmark(props)
        return this.geoBookmarkControl;
    }

    //render() {
    //    //console.log("OLZoom render ", this.props);
    //    return super.render();
    //}
}
