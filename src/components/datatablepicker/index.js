/**
 * Created by dpcui on 30/01/2018.
 */

import React from 'react';
import { Modal } from 'antd';
import { DataTable, Icon } from '../index';
import { filterProps } from '../../../src/lib/object';

class DataTablePicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      selectedRows: [],
    };
  }
  getParams = () => {
    const { params = {} } = this.props;
    if (typeof params === 'function') {
        return params();
    }
    return params;
  };
  showModal = () => {
    const { iconClick } = this.props;
    if ((!iconClick) || (iconClick && iconClick())) {
      this.setState({ visible: true });
    }
  };
  handleOk = (e) => {
    this.setState({ visible: false });
    const { onOk } = this.props;
    const { selectedRows } = this.state;
    if (this.props.selectionType !== 'multiple') {
      onOk && onOk(e, selectedRows[0]);
    } else {
      onOk && onOk(e, selectedRows);
    }
  };
  handleCancel = (e) => {
    this.setState({ visible: false });
    const { onCancel } = this.props;
    const { selectedRows } = this.state;
    if (this.props.selectionType !== 'multiple') {
      onCancel && onCancel(e, selectedRows[0]);
    } else {
      onCancel && onCancel(e, selectedRows);
    }
  };

  dataTableOnSelectRow = (keys, rows) => {
    const { onSelectRow } = this.props;
    this.setState({ selectedRows: rows });
    onSelectRow && onSelectRow(keys, rows);
  };
  renderChildContext = () => {
    if (!this.props.dataFormId) {
      Modal.error({
        title: '错误',
        content: '请确认已传入模版参数',
      });
      return <div />;
    }
    return (
      <DataTable
        {...filterProps(this.props, ['title', 'okText', 'cancelText', 'visible', 'onOk', 'onCancel',
        'width','reading'])}
        params={this.getParams()}
        onSelectRow={this.dataTableOnSelectRow}
      />
    );
  };
  render() {
    return (
      <div>
        <Icon
          type="ellipsis"
          onClick={this.showModal}
          style={{ height: 20, ...this.props.style, cursor: 'pointer' }}
        />
        <Modal
          title={this.props.title || '对话选择框'}
          okText={this.props.okText || '确认'}
          cancelText={this.props.cancelText || '取消'}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width='61.8%'
        >
          {this.state.visible ? this.renderChildContext() : null}
        </Modal>
      </div>
    );
  }
}

export default DataTablePicker;
