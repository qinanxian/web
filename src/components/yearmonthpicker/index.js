/**
 * Created by dpcui on 21/12/2017.
 */


import React from 'react';
import moment from 'moment';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { DatePicker, Input, Icon, ConfigProvider } from 'antd';
import { compose } from '../compose';
import config from '../../lib/config';

const { MonthPicker } = DatePicker;

@compose
class RoYearMonthPicker extends React.Component {
  static defaultProps = {
    format: 'YYYY-MM',
  };

  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ value: nextProps.value });
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

  handleMonthChange = (e) => {
    const { locale, format } = this.props;
    const lo = locale || 'zh';
    const date = this.handleFormatDate(e);
    this.setState({ value: date && moment(date).locale(lo) });
    this.props.onChange && this.props.onChange(e && e.format(format));
    this.props.onValueChange && this.props.onValueChange(e && e.format(format));
  };
  /* eslint-disable */

  render() {
    const { reading, format, readOnly, placeholder, prefix = 'ro', style,isTable,valuenullholder } = this.props;
    const valueHolder = valuenullholder ? valuenullholder : config.valueNullHolder;
    const {value} = this.state;
    if (reading) {
      return (
        !isTable && !value ?
          <div style={{color:'rgba(150,150,150,0.4)'}} className={`${prefix}-under-line-${config.readingInfoUnderLine}`}>
            {valueHolder}
          </div>
          :
          value ? <div className={`${prefix}-under-line-${!isTable && config.readingInfoUnderLine}`}>{moment(new Date(value)).format(format)}</div> : ''
      );
    } else if (readOnly) {
      return (
        <Input
          readOnly={readOnly}
          placeholder={placeholder}
          style={style || null}
          className={readOnly ? `${prefix}-readonly-input` : null}
          suffix={<Icon type="calendar" style={{ color: 'rgba(0,0,0,.25)' }} />}
          value={this.state.value && moment(new Date(this.state.value)).format(format)}
        />
      );
    } else {
      return (
        <ConfigProvider locale={zhCN}>
          <MonthPicker
            placeholder="Select month"
            {...this.props}
            style={style}
            value={this.handleMillisecondValue(this.state.value)}
            onChange={this.handleMonthChange}
          />
        </ConfigProvider>
      );
    }
  }
}

export default RoYearMonthPicker;
