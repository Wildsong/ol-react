import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'

/*
    This control has to access properties both from its immediate parent ("source")
    and from a distant ancestor ("map")
    And maybe the ThemeContext too, just to make it more interesting.
*/

export default class SliderControl extends Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.state = {
            value: this.props.value
        }
    }

    onChange(newValue) {
        this.setState({value: newValue});
        this.props.onChange(newValue);
    }

    render() {
        return (
            <div className="sliders">
            {this.props.title}: opacity {this.state.value}%
            <Slider onAfterChange={this.onChange}/>
            </div>
        );
    }
}

SliderControl.propTypes = {
    title: PropTypes.string,
    onChange: PropTypes.func,
    value: PropTypes.number
};
