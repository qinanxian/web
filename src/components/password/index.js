/**
 * Created by dpcui on 01/03/2018.
 */

import React from 'react';
import { Input } from 'antd';
import { filterProps } from '../../lib/object';
import { compose } from '../compose';

@compose
class RoPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <Input
        {...filterProps(this.props, ['compPrefix', 'decimalDigits', 'dictCodeTreeLeafOnly','reading'])}
        type="password"
      />
    );
  }
}

export default RoPassword;
