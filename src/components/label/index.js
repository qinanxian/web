import React from 'react';
import config from '../../lib/config';
import { compose } from '../compose';
import './style/index.less';

@compose
export default class RoLabel extends React.Component {
  /* eslint-disable */
  render() {
    const { prefix = 'ro',valuenullholder,isTable,value } = this.props;
    const valueHolder = valuenullholder ? valuenullholder : config.valueNullHolder;
    return (
      !isTable && !value ?
        <div className={`${prefix}-label-null`} className={`${prefix}-under-line-${config.readingInfoUnderLine}`}>
          {valueHolder}
        </div>
        :
        <div className={`${prefix}-label-value`} className={`${prefix}-under-line-${!isTable && config.readingInfoUnderLine}`}>
          {value}
        </div>
    );
  }
}
