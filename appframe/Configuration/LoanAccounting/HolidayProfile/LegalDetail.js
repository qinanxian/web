import React from 'react';
import { DatePicker } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';

import { Button, Text, Select, ConfigProvider } from 'roface';
import { Form } from '@ant-design/compatible';

const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;

class LegalDetail extends React.Component{
  save = (callback) => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        callback && callback(values);
      }
    });
  };
  render(){
    const { date } = this.props;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    return (
      <ConfigProvider locale={zhCN}>
        <Form>
          <FormItem
            {...formItemLayout}
            style={{marginBottom: '0px'}}
            label="假日名称"
          >
            {getFieldDecorator('holidayName', {
              rules: [{
                required: true, message: '假日名称不能为空!',
              }],
            })(
              <Text />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            style={{marginBottom: '0px'}}
            label="假日类型"
          >
            {getFieldDecorator('holidayType',{
              rules: [{
                required: true, message: '假日类型不能为空!',
              }],
            })(
              <Select options={[{code: 'weekend', name: '双休日'}, {code: 'legal', name: '法定假'}]} />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            style={{marginBottom: '0px'}}
            label="假日区间"
          >
            {getFieldDecorator('rangeDate',{
              rules: [{
                required: true, message: '假日区间不能为空!',
              }],
              initialValue: [date, date],
            })(
              <RangePicker/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            style={{marginBottom: '0px'}}
            label="假日说明"
          >
            {getFieldDecorator('note')(
              <Text />
            )}
          </FormItem>
        </Form>
      </ConfigProvider>

    );
  }
}

const TempLegalDetail = Form.create()(LegalDetail);

export default class LegalDetailWrapper extends React.Component{
  save = (cb) => {
    this.infoInstance.save(cb);
  };
  render() {
    return <TempLegalDetail
      date={this.props.date}
      wrappedComponentRef={form => {
        if (form) {
          this.infoInstance = form;
        }
      }}
    />;
  }
}
