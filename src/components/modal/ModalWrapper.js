import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Modal, Button } from 'antd';
import DragM from './lib/DragM';
import { addOnResize } from '../../lib/listener';
import * as permission from '../../lib/permission';

class BuildTitle extends React.Component {
    componentDidMount() {
        this.modalDom = document.getElementsByClassName('ant-modal')[0];
    }
    updateTransform = (transformStr) => {
        this.modalDom.style.transform = transformStr;
    };
    render() {
        const { title } = this.props;
        return (
          <DragM updateTransform={this.updateTransform}>
            <div>{title}</div>
          </DragM>
        );
    }
}

const openModal = (component, params = {}, cb) => {
    let modal = null;
    let com = null;
    let modalDom = null;
    const maskDiv = document.createElement('div');
    document.body.appendChild(maskDiv);

    const _close = () => {
        const unmountResult = ReactDOM.unmountComponentAtNode(maskDiv);
        if (unmountResult) {
            maskDiv.parentNode.removeChild(maskDiv);
        }
        const { onCancel } = params;
        onCancel && onCancel(modal, com);
    };
    const _setDisabled = (flag) => {
        modalDom && modalDom.props.switchLoad(flag);
    };
    const _setCancelDisabled = (flag) => {
        modalDom && modalDom.props.switchCancel(flag);
    };
    const _handleOk = (e,param,cd) => {
        cd && cd(true);

        const { onOk } = param;
        onOk && onOk(modal, com, {
            setDisabled: _setDisabled,
            setLoading: _setDisabled,
            setCancelBtn: _setCancelDisabled,
        });
    };
    class ModalBody extends React.Component {
        constructor(props) {
            super(props);
            this.flag = true;
            this.state = {
                height: 0,
                param:params,
            };
        }
        getChildContext(){
            return {
                permission: permission.getCurrentPermission(),
            };
        }
        componentDidMount(){
            /* eslint-disable */
            // setTimeout(this._setComHeight, 100);
            cb && cb(ReactDOM.findDOMNode(modalDom));
            addOnResize(this._setComHeight);
        }
        componentWillUnmount(){
            this.flag = false;
        }
        _setComHeight = () => {
            const { footer } = this.props;
            if (this.flag) {
                const modalHeight = document.documentElement.clientHeight - (footer ? 300 : 250);
                const dom = ReactDOM.findDOMNode(this);
                if (dom.scrollHeight > modalHeight) {
                    this.setState({
                        height: modalHeight
                    })
                } else {
                    this.setState({
                        height: dom.scrollHeight
                    })
                }
            }
        };
        render() {
            const { footer } = this.props;
            const { param } = this.state;
            const obj = {};
            for (let o in param) {
                if (o !== '' || o !== 'title') {
                    obj[o] = param[o];
                }
            }
            // delete param.defaultButton;
            // delete param.title;
            return (
                <div style={{height: this.state.height || 'auto', overflow: 'auto'}}>
                    {React.cloneElement(component, {
                        ref: instance => com = instance,
                        resizeModal: this.props.resizeModal,
                        onCancel: _close,
                        ...obj,
                    })}
                </div>
            );
        }
    }
    ModalBody.childContextTypes = {
        permission: PropTypes.object,
    };

    class ModalWrapper extends React.Component {
        constructor(props){
            super(props);
            this.flag = true;
            this.state = {
                width: props.width || '61.8%',
                minWidth:props.minWidth || '590px',
                param:params,
                cancelDisabled:false,
                cancelLoading:false
            }
        }
        componentWillReceiveProps(nextProps) {
            // console.log(nextProps);
        }
        componentWillUnmount(){
            this.flag = false;
        }
        _resizeModal = () => {
            // 重新计算弹出框和宽度和高度 需要手动触发 推荐是在dataReady方法中调用
            // 设置宽度
            this._setComWidth();
        };
        _setComWidth = () => {
            if (this.flag) {
                const modalWidth = document.documentElement.clientWidth;
                const dom = ReactDOM.findDOMNode(this.modalContent);
                if (dom.scrollWidth > modalWidth) {
                    this.setState({
                        width: modalWidth
                    })
                } else {
                    this.setState({
                        width: dom.scrollWidth
                    })
                }
            }
        };
        _switchLoad = (flag) => {
            this.setState({
                confirmLoading:flag
            });
        };
        _switchCancel = (flag) => {
            this.setState({
                cancelDisabled:flag
            });
        };
        _getFooter = (param,confirmLoading,cancelDisabled) => {
            if (param.defaultButton) {
                return [<Button key="back" disabled={cancelDisabled} onClick={e=>_close(e,param,this._switchCancel)}>取消</Button>,
                    <Button key="submit" type="primary" loading={confirmLoading} onClick={e=>_handleOk(e,param,this._switchLoad)}>确定</Button>];
            } else if (param.footer) {
                return param.footer;
            }
            return null;
        };
        render() {
            const { param,confirmLoading,cancelDisabled } = this.state;
            const footer = this._getFooter(param,confirmLoading,cancelDisabled);
            const dragTitle = param.isDragact ? (<BuildTitle title={param.title ? param.title : '对话框'} />)
                : param.title ? param.title : '对话框';
            return (
                <Modal
                    switchLoad={this._switchLoad}
                    switchCancel={this._switchCancel}
                    closable={!cancelDisabled}
                    keyboard={false}
                    width={param.width ? param.width : this.state.width}
                    style={{minWidth:param.minWidth, top: param.top}}
                    visible
                    title={dragTitle}
                    onCancel={_close}
                    destroyOnClose = {true}
                    maskClosable={false}
                    footer={footer}
                    ref={(instance) => modalDom = instance }
                    bodyStyle={param && param.bodyStyle}
                >
                    <ModalBody footer={footer} resizeModal={this._resizeModal} ref={(instance) => this.modalContent = instance}/>
                </Modal>
            );
        }
    }

    ReactDOM.render(
        <ModalWrapper />,
        maskDiv,
    );
    modal = { close: _close };
    return modal;
};

export default openModal;
