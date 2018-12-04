import React from 'react';
import PropTypes from 'prop-types';
import {Map, Collection} from 'ol';
import Source from 'ol/source/Source';
import Vector from 'ol/source/Vector';
import BaseLayer from 'ol/layer/Base';
import OLComponent from '../ol-component';
import * as interaction from '../interaction';

class ReactVector extends OLComponent {
    constructor(props) {
        super(props);
        this.source = new Vector(
            Object.assign({
                features: new Collection()
            }, props)
        )
    }

    getChildContext() {
        return {
            source: this.source
        }
    }

    componentDidMount() {
        this.context.layer.setSource(this.source)
    }

    componentWillUnmount () {}
}

ReactVector.propTypes = {
}

ReactVector.defaultProps = {
}

ReactVector.contextTypes = {
    layer: PropTypes.instanceOf(BaseLayer),
    map: PropTypes.instanceOf(Map)
}

ReactVector.childContextTypes = {
    source: PropTypes.instanceOf(Source)
}

export default ReactVector;
