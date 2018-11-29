import OLComponent from './ol-component';

export default class OLContainer extends OLComponent {
  render() {
    return <div style={{ 'display': 'none' }}>{this.props.children}</div>
  }
}
