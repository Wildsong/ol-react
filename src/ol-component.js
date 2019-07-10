import React from 'react';
export default class OLComponent extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div style={{display: 'none'}}>
                {this.props.children}
            </div>
        );
    }
}
