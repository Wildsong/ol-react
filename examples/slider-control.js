import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'

export default class SliderControl extends Component {
    render() {
        return (
            <div className="sliders">
            {this.props.title}: opacity {this.props.value}%
            <Slider onAfterChange={this.props.onChange} defaultValue={this.props.value}/>
            </div>
        );
    }
}

SliderControl.propTypes = {
    title: PropTypes.string,
    onChange: PropTypes.func,
    value: PropTypes.number
};
