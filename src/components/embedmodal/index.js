import React from 'react';
import { Input, Modal } from 'antd';
import { DataTable, Button } from '../index';
import config from '../../lib/config';
import './style/index.less';

class EmbedModal extends React.Component {
    constructor(props) {
        super(props);
        this.InputRef = null;
        this.state = {
            value: props.value,
            visible: false,
            selectedRows: [],
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
    showModal = () => {
        this.setState({ visible: true });
        this.InputRef && this.InputRef.blur();
    };
    handleOk = (e,value) => {
        const {selectedRows} = this.state;
        if(selectedRows.length > 0){
            this.setState({ visible: false});
        }
        const { modal,rowId } = this.props;
        modal && modal.onOk &&
        modal.onOk(e, value && [].concat(value) || this.state.selectedRows,rowId);
    };
    handleCancel = (e) => {
        this.setState({ visible: false });
        const { modal } = this.props;
        const { selectedRows } = this.state;
        modal && modal.onCancel && modal.onCancel(e, selectedRows);
    };
    handleChange = (e) => {
        const value = e.target.value || '';
        this.setState({ value });
        this.props.onChange && this.props.onChange(value);
    };
    dataTableOnSelectRow = (keys, rows) => {
        // const { dataTable } = this.props;
        this.setState({ selectedRows: rows});
        // dataTable && dataTable.onSelectRow && dataTable.onSelectRow(keys, rows);
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
        const { prefix = 'ro', reading, readOnly = false, style, item,isTable,valuenullholder,name } = this.props;
        const valueHolder = valuenullholder ? valuenullholder : config.valueNullHolder;
        const limitedLength = item && item.limitedLength > 0 ? item.limitedLength : '';
        const {value} = this.state;
        if (reading) {
            const retStyle = !isTable ? {paddingBottom: '10px',height: 'auto',lineHeight: '22px',paddingTop: '10px',whiteSpace: 'pre-wrap',wordWrap: 'break-word'} : {};
            return (
                !isTable && !value ?
                    <div className={`${prefix}-under-line-${config.readingInfoUnderLine}`} style={{color:'rgba(150,150,150,0.4)'}}>{valueHolder}</div>
                    :
                    <div
                        className={`${prefix}-under-line-${!isTable && config.readingInfoUnderLine}`}
                        style={retStyle}
                    >{value}</div>
            );
        }
        return (
            <div  className={`${prefix}-emebedModal-container`}>
                <div className={`${prefix}-emebedModal-container-input`}>
                    <Input
                        ref={this.getInputRef}
                        style={{
                            borderBottomRightRadius: 0,
                            borderTopRightRadius: 0,
                            ...style,
                        }}
                        className={readOnly ? `${prefix}-emebedModal-container-input-readonly-input` : null}
                        value={this.state.value}
                        addonBefore={this.props.compPrefix}
                        addonAfter={this.props.suffix}
                        onChange={this.handleChange}
                        maxLength={limitedLength}
                    />
                    <Button
                        onClick={this.showModal}
                        style={{ borderBottomLeftRadius: 0, borderTopLeftRadius: 0  }}
                    >{name || '内置按钮'}</Button>
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

export default EmbedModal;
