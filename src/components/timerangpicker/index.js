import React, { Component } from 'react';
import moment from 'moment';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { TimePicker, ConfigProvider } from 'antd';

const { RangePicker } = TimePicker;

class TimeRangPicker extends Component {

  static defaultProps = {
    format: 'HH:mm:ss',
  };

  constructor(props) {
    super(props);
    let valueTmp = props.value;
    if (typeof valueTmp === 'string') valueTmp = props.value.split(',');
    const valueArray = valueTmp && valueTmp.map(item => moment(item));
    this.state = {
      value: valueArray,
    };
  }

  _onChange = (evt) => {
    const { onChange, onValueChange } = this.props;
    const start = evt[0].format('YYYY-MM-DD HH:mm:ss');
    const end = evt[1].format('YYYY-MM-DD HH:mm:ss');
    this.setState({ value: evt });
    onChange && onChange([start, end].toString());
    onValueChange && onValueChange([start, end].toString());
  }

  render() {
    const { className, format, use12Hours, placeholder } = this.props;
    const { value } = this.state;
    return (
      <ConfigProvider locale={zhCN}>
        <RangePicker
          className={className}
          format={format}
          placeholder={placeholder}
          use12Hours={use12Hours}
          onChange={this._onChange}
          value={value}
        />
      </ConfigProvider>
    );
  }
}

export default TimeRangPicker;
