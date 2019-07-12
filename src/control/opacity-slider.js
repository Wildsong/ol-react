import React, {useState} from 'react'
import PropTypes from 'prop-types'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'

const OpacitySlider = ({title,value,onChange}) => {
    const [opacity, setOpacity] = useState(value*100);
    const myChange = (e) => {
        setOpacity(e)
        onChange(e/100);
    }
    return (
        <div className="sliders">
        {title}: opacity {opacity}%
        <Slider onAfterChange={myChange} defaultValue={value*100}/>
        </div>
    );
}
OpacitySlider.propTypes = {
    title: PropTypes.string,
    value: PropTypes.number,
    onChange: PropTypes.func
};
export default OpacitySlider;
