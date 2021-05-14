/**
 * Created by dpcui on 21/12/2017.
 */

import React from 'react';
import moment from 'moment';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { TimePicker, Input, Icon, ConfigProvider } from 'antd';
import { compose } from '../compose';
import config from '../../lib/config';

@compose
class RoTimePicker extends React.Component {
  static defaultProps = {
    format: 'HH:mm:ss',

  };
  constructor(props) {
    super(props);
    const valueTmp = moment(props.value);
    this.state = {
      value: valueTmp,
    };
  }

  componentWillReceiveProps(nextProps) {
    const valueTmp = moment(nextProps.value);
    this.setState({ value: valueTmp });
  }

  handleFormatDate = (value) => {
    return (value && value.toDate().getTime()) || null;
  };

  handleTimeChange = (e) => {
    this.setState({ value: e });
    const time = e.format('YYYY-MM-DD HH:mm:ss');
    this.props.onChange && this.props.onChange(time);
    this.props.onValueChange && this.props.onValueChange(time);
  };

/* eslint-disable */
  render() {
    const { reading, format, readOnly, placeholder, prefix = 'ro', style,isTable,valuenullholder } = this.props;
    const valueHolder = valuenullholder ? valuenullholder : config.valueNullHolder;
    const { value } = this.state;
    if (reading) {
      return (
        (!isTable && !value) ?
          <div className={`${prefix}-under-line-${config.readingInfoUnderLine}`} style={{ color: 'rgba(150,150,150,0.4)' }}>
            {valueHolder}
          </div>
          :
          value ? <div className={`${prefix}-under-line-${!isTable && config.readingInfoUnderLine}`}>value.format(format)}</div> : ''
      );
    } else if (readOnly) {
      return (
        <Input
          readOnly={readOnly}
          placeholder={placeholder}
          style={style || null}
          className={readOnly ? `${prefix}-readonly-input` : null}
          suffix={<Icon type="clock-circle-o" style={{ color: 'rgba(0,0,0,.25)' }} />}
          value={this.state.value && value.format(format)}
        />
      );
    }
    return (
      <ConfigProvider locale={zhCN}>
        <TimePicker
          placeholder="Select time"
          {...this.props}
          value={value}
          onChange={this.handleTimeChange}
        />
      </ConfigProvider>
    );
  }
}

export default RoTimePicker;
