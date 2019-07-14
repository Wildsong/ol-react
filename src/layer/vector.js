import React, {useContext} from 'react'
import PropTypes from 'prop-types'
import {Vector as olVectorLayer} from 'ol/layer'
import {Style} from 'ol/style'
import {buildStyle} from '../style'
import {LayerProvider} from '../layer-context'

const Vector = (props) => {
    const style = buildStyle(props.style);
    const layer = new olVectorLayer({
        props,
        style: style,
    })
    return (
        <LayerProvider layer={layer}>
            {props.children}
        </LayerProvider>
    );
}
Vector.propTypes = {
    declutter: PropTypes.bool,
    cluster: PropTypes.bool,
    updateWhileAnimating: PropTypes.bool,
    updateWhileInteracting: PropTypes.bool,
    style:  PropTypes.oneOfType([
                PropTypes.instanceOf(Style),
                PropTypes.object,
                PropTypes.func,
                PropTypes.arrayOf(PropTypes.oneOfType([
                    PropTypes.instanceOf(Style),
                    PropTypes.object
                ]
            ))
    ]),
    editStyle:  PropTypes.oneOfType([
                PropTypes.instanceOf(Style),
                PropTypes.object,
                PropTypes.func,
                PropTypes.arrayOf(PropTypes.oneOfType([
                    PropTypes.instanceOf(Style),
                    PropTypes.object
                ]
            ))
    ])
};
export default Vector;
