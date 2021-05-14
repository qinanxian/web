import React from 'react';

import * as components from '../../../src/components';

export default class DefaultValue extends React.Component{
  _getCom = () => {
    if ('options' in this.props) {
      return components.Select;
    }
    return components.Text
  };
  render() {
    const Com = this._getCom();
    return <Com
      value={this.props.value}
      onChange={this.props.onChange}
      item={{}}
      options={this.props.options}
    />
  }
}