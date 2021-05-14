/**
 * Created by hjtu (hjtu@amarsoft.com) on 2018/1/3.
 */
import React from 'react';
import {Form, Input, Button} from 'antd';

const FormItem = Form.Item;
// const typeMap = {
//   text: 'input',
//   textarea: 'textarea',
//   select: 'select',
//   checkbox: 'multiselect',
//   radiobox: 'select',
//   number: 'number',
//   currency: 'currency',
//   multiSelect: 'checkbox',
//   datepicker: 'datepicker',
//   yearmonthpicker: 'yearmonthpicker',
//   yearpicker: 'yearpicker',
//   datetimepicker: 'datetimepicker',
//   timepicker: 'datetimepicker',
// };
//
// const filterList = [{
//   editType: 'text',
//   placeholder: '测试',
//   defaultValue: '123',
//   field: 'name',
//   name: '姓名',
// }, {
//   editType: 'select',
//   field: 'sex',
//   name: '性别',
// }, {
//   editType: 'select',
//   field: 'sex',
//   name: '生日',
// }]
class DetailFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { filterList: props.filterList || [], methods: props.methods };
    if(this.state.methods) {
      this.state.methods.addFilter = this.addFilter.bind(this);
    }
  }

  addFilter() {
    console.log(this.state.filterList);
  }

  render() {
    return (
      <div style={{display: 'flex', alignItems: 'center'}}>
        <Form onSubmit={this.handleSearch}>
          <FormItem label="姓名">
            <Input placeholder="搜索姓名" />
          </FormItem>

          <FormItem>
            <Button type="primary" icon="search">搜索</Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}
export default DetailFilter;
