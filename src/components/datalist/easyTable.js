/**
 * Created by dpcui on 09/01/2018.
 */
import React from 'react';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { Table, ConfigProvider } from 'antd';
import * as components from '../index';
import classnames from '../../lib/classnames';

const Editable = ({editable, value, comp, onChange, options,
                    elementUIHint, column, record, help, item, param}) => {
  const Comp = components[comp];
  const elementUIHintTmp = {
    placeholder: elementUIHint && elementUIHint.placeholder,
    reading: elementUIHint.reading,
    readOnly: elementUIHint.readonly,
    compPrefix: elementUIHint.prefix,
    suffix: elementUIHint.suffix,
    style: elementUIHint.htmlStyle && JSON.parse(elementUIHint.htmlStyle) || {},
    dictCodeTreeLeafOnly: elementUIHint.dictCodeTreeLeafOnly,
    decimalDigits: elementUIHint.decimalDigits,
    multiplier: elementUIHint.multiplier,
  };
  const compProps = {
    ...elementUIHintTmp,
    reading:!editable,
    record:record,
    column:column,
    value:value,
    onChange:e => onChange(e),
    options:options,
    item:item,
    param:param,
    isTable:true,
  };
  const classes = classnames({
    'ro-data-table-td-required':elementUIHint.required && editable,
    'ro-data-table-td-com':editable,
  });
  return (
    <div>
      <div className={classes}>
        <Comp
          {...compProps}
        />
      </div>
      <div className="ro-data-table-td-help">
        {[...new Set((help || []).map(h => h.message))].map((mes) => {
          return (<span key={mes}>{mes}</span>);
        })}
      </div>
    </div>
  );
};

export class EditableCell extends React.Component{
  constructor(props){
    super(props);
    this.flag = true;
  }
  shouldComponentUpdate(nextProps){
    // editable, value, comp, onChange, options,elementUIHint, column, record, help, item, param
    // 判断条件1：可编辑是否发生变化
    // 判断条件2：value是否发生变化
    // 判断条件3：help是否发生变化
    const { editable, value, help, options } = this.props;
    return (nextProps.editable !== editable)
      || (nextProps.value !== value)
      || (nextProps.help !== help)
      || (nextProps.options !== options);
  }
  render() {
    const { elementUIHint: { tips }, item, value } = this.props;
    return (
      <components.Tooltip title={typeof tips === 'function' ? tips(item, value) : tips}>
        <div onClick={(e) => {
          if (this.props.editable){
            !this.flag && e.stopPropagation();
            // 如果0.5s内连续执行了点击，那么阻止第二次点击事件
            if(this.flag){
              this.flag = false;
              const id = setTimeout(() => {
                this.flag = true;
                clearTimeout(id);
              }, 500);
            }
          }
        }}>
          <Editable {...this.props}/>
        </div>
      </components.Tooltip>
    );
  }
}

export class RoEasyTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: props.columns,
      dataSource: props.dataSource,
    };
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      columns: nextProps.columns,
      dataSource: nextProps.dataSource,
    });
  }
  render() {
    return(
      <ConfigProvider locale={zhCN}>
        <Table
          bordered
          {...this.props}
          columns={this.state.columns}
          dataSource={this.state.dataSource}
        />
      </ConfigProvider>
    );
  }
}
