/**
 * Created by dpcui on 30/01/2018.
 */

import React from 'react';
import { Input, Modal } from 'antd';
import { DataTable, Button, Icon } from '../index';
import config from '../../lib/config';
import './style/index.less';

const inputHeight = config.layoutLevel[config.layoutLevelDefault].inputHeightBase;

/* eslint-disable */
class ModalInput extends React.Component {
  constructor(props) {
    super(props);
    this.InputRef = null;
    this.state = {
      value: props.value,
      visible: false,
      selectedRows: [],
      ortherIds:props.defaultCodes || []
    };
  }
  componentWillReceiveProps(nextProps) {
    if (this.state.value !== nextProps.value) {
      this.setState({ value: nextProps.value });
    }
  }
  getInputRef = (instance) => {
    this.InputRef = instance;
  };

  getInputCta = (value,limitedLength,style,prefix,readOnly,blockEdit) => {
     const {selectedRows} =this.state;
     if (blockEdit) {
         return (
             <Input
                 ref={this.getInputRef}
                 style={{
                     borderBottomRightRadius: 0,
                     borderTopRightRadius: 0,
                     ...style,
                 }}
                 className={readOnly ? `${prefix}-modal-Input-container-readonly-input` : null}
                 value={this.state.value}
                 addonBefore={this.props.compPrefix}
                 addonAfter={this.props.suffix}
                 onChange={this.handleChange}
                 maxLength={limitedLength}
             />
         );
     }
     return (
         <div style={{...style,height:inputHeight}} className={`${prefix}-modalinput`}>
            <div className={`${prefix}-modalinput-input`}>
               <div className={`${prefix}-modalinput-input-outer`}>
                   <ul className={`${prefix}-modalinput-input-outer-cta`}>
                      {selectedRows.length > 0 ? selectedRows.map((item,index) =>
                         <li key={item[this.props.dataTable.majorKey]}>
                            {item[this.props.selectValue]}<Icon onClick={() => this.deleteInputItem(item[this.props.dataTable.majorKey],true)} type='close'/>
                         </li>)
                          :
                          value && value.split(',').map((item,index) =>
                              <li key={index}>
                                  {item}<Icon onClick={() => this.deleteInputItem(item,false)} type='close'/>
                              </li>
                          )
                      }
                   </ul>
               </div>
            </div>
         </div>
     );
  };
  deleteInputItem = (value,flag) => {
       if (flag) {
           let position = null;
           this.setState({
               selectedRows:this.state.selectedRows.filter((fit,index) => {
                   if (fit[this.props.dataTable.majorKey] !== value){
                       return fit
                   } else {
                       position = index;
                   }
               }),
               ortherIds:this.state.ortherIds.split(',').filter((fit,index) => index !== position).join(',')
           },() => {
               this.props.onChange && this.props.onChange(this.state.selectedRows.map(item => item[this.props.selectValue]).join(','));
               this.props.resetSomeValue && this.props.resetSomeValue(this.state.ortherIds);
           });
       } else {
           let num = null;
           this.setState({
               value:this.state.value.split(',').filter((fit,index) => {
                   if (fit !== value) {
                       return fit
                   } else {
                       num = index;
                   }
               }).join(','),
               ortherIds:this.state.ortherIds.split(',').filter((fit,index) => index !== num).join(',')
           },() => {
               this.props.resetSomeValue && this.props.resetSomeValue(this.state.ortherIds);
               this.props.onChange && this.props.onChange(this.state.value)
           });
       }
    };
    dataTableOnSelectRow = (keys, rows) => {
        const { dataTable,blockEdit,selectValue } = this.props;
        this.setState({
            selectedRows: rows,
        });
        dataTable && dataTable.onSelectRow && dataTable.onSelectRow(keys, rows);
        if (!blockEdit) {
            this.setState({
                value:rows.map(item => item[selectValue]).join(','),
                ortherIds:rows.map(fit => fit[this.props.dataTable.majorKey]).join(',')
            });
            this.props.onChange && this.props.onChange(rows.map(item => item[selectValue]).join(','));
        }
    };
    handleChange = (e) => {
        const value = e.target.value || '';
        this.setState({ value });
        this.props.onChange && this.props.onChange(value);
    };
    handleOk = (e,value) => {
        this.setState({ visible: false});
        const { modal,dataTable,blockEdit } = this.props;
        if (blockEdit) {
            modal && modal.onOk && modal.onOk(e, value && [].concat(value) || this.state.selectedRows);
        } else {
            modal && modal.onOk && modal.onOk(e, this.state.selectedRows);
        }
    };
    handleCancel = (e) => {
        this.setState({ visible: false });
        const { modal,dataTable,blockEdit } = this.props;
        const { selectedRows } = this.state;
        if (blockEdit) {
            modal && modal.onCancel && modal.onCancel(e, selectedRows);
        } else {
            modal && modal.onCancel && modal.onCancel(e, selectedRows);
        }
    };

    showModal = () => {
        this.setState({ visible: true });
        this.InputRef && this.InputRef.blur();
    };
  _handleDoubleClick = (e,value) => {
    this.handleOk(e,value);
  };
  renderChildContext = () => {
    const { dataTable,doubleClick } = this.props;
    if (!dataTable.dataFormId) {
      Modal.error({
        title: '错误',
        content: '请确认已传入模版参数',
      });
      return null;
    }
    return (
        doubleClick ?
          <DataTable
            {...dataTable}
            handleDoubleClick={this._handleDoubleClick}
            onSelectRow={this.dataTableOnSelectRow}
          />
          :
          <DataTable
            {...dataTable}
            onSelectRow={this.dataTableOnSelectRow}
          />
    );
  };
  render() {
    /* eslint-disable */
    const { prefix = 'ro', reading, readOnly = true, style, item,isTable,valuenullholder,blockEdit = true } = this.props;
    const valueHolder = valuenullholder ? valuenullholder : config.valueNullHolder;
    const limitedLength = item && item.limitedLength > 0 ? item.limitedLength : '';
    const {value} = this.state;
    if (reading) {
      return (
        !isTable && !value ?
          <div className={`${prefix}-under-line-${config.readingInfoUnderLine}`} style={{color:'rgba(150,150,150,0.4)'}}>{valueHolder}</div>
          :
          <div className={`${prefix}-under-line-${!isTable && config.readingInfoUnderLine}`}>{value}</div>
      );
    }
    return (
      <div>
        <div className={`${prefix}-modal-Input-container`}>
          {this.getInputCta(value,limitedLength,style,prefix,readOnly,blockEdit)}
          <Button
            icon="ellipsis"
            onClick={this.showModal}
            style={{ borderBottomLeftRadius: 0, borderTopLeftRadius: 0  }}
          />
        </div>
        <Modal
          title="对话选择框"
          okText="确认"
          cancelText="取消"
          {...this.props.modal}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width='61.8%'
        >
          {this.renderChildContext()}
        </Modal>
      </div>
    );
  }
}

export default ModalInput;
