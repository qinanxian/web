/**
 * Created by dpcui on 08/01/2018.
 */

import React from 'react';
import moment from 'moment';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { DatePicker, ConfigProvider } from 'antd';
import {compose} from '../compose';

const { RangePicker } = DatePicker;
@compose
class RoDateRangePicker extends React.Component {
  static defaultProps = {
    format: 'YYYY-MM-DD',
  };

  constructor(props) {
    super(props);
    const valueArray = props.value && props.value.map(item => this.handleMillisecondValue(item));
    this.state = {
      value: valueArray,
    };
  }

  componentWillReceiveProps(nextProps) {
    const valueArray = nextProps.value &&
      nextProps.value.map(item => this.handleMillisecondValue(item));
    this.setState({ value: valueArray });
  }

  /* eslint-disable */
  handleMillisecondValue = (value) => {
    const { locale } = this.props;
    const lo = locale || 'zh';
    return (value && moment(value).locale(lo)) || null;
  };

  handleFormatDate = (value) => {
    return (value && value.toDate().getTime()) || null;
  };

  handleDateChange = (e) => {
    const { locale } = this.props;
    const lo = locale || 'zh';
    this.setState({ value: e });
    const valueArray = e && e.map((item, index) => {
      if (index === 0) {
          return `${item.format(this.props.format)} 00:00:00`;
      }
      return `${item.format(this.props.format)} 23:59:59`;
    });
    this.props.onChange && this.props.onChange(valueArray);
    this.props.onValueChange && this.props.onValueChange(valueArray);
  };
  /* eslint-disable */

  render() {
    return (
      <ConfigProvider locale={zhCN}>
        <RangePicker
          {...this.props}
          style={this.props.style || null}
          value={this.state.value}
          onChange={this.handleDateChange}
        />
      </ConfigProvider>
    );
  }
}

export default RoDateRangePicker;
