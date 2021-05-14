import React from 'react';
import {Modal,Upload as RUpload} from 'antd';
import Upload from './lib';
import { Button, Icon, Notify } from '../index';
import config from '../../lib/config';
import * as cache from '../../lib/cache';
import './style/index.less';

const documentSuffix = config.uploadAllowedSuffix;
/* eslint-disable */
export default class RoUpload extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      fileList: [],
      previewVisible: false,
      previewImage: '',
      status: props.status,
      disable: this.getDisableStatus(props.disable),
    };
  }
  componentDidMount(){
    const { didMount } = this.props;
    didMount && didMount({setLoading: this.setLoading, setDisable: this.setDisable});
  }
  getDisableStatus = (disable) => {
    if (disable === 'true') {
      return true;
    } else if (disable === 'false') {
      return false;
    }
    return disable;
  };
  setLoading = (status) => {
    this.setState({
      status,
    });
  };
  setDisable = (status) => {
    this.setState({
      disable: status,
    });
  };
  handleChange=(info) => {
    const {onChange} = this.props;
    this.setState({
      fileList:info.fileList,
    });
    if (info.file.status !== 'uploading') {
      onChange && onChange('uploading', info.file, {setLoading: this.setLoading});
    }
    if (info.file.status === 'done') {
      onChange && onChange('done', info.file, {setLoading: this.setLoading});
    } else if (info.file.status === 'error') {
      onChange && onChange('error', info.file, {setLoading: this.setLoading});
    }
  };
  uploadList = (prefix,fileList,num) => {
    return (
      fileList.length > num ? null :
      <div className={`${prefix}-picture-card`}>
        <Icon type="plus" />
      </div>
    );
  };
  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };
  handleCancel = () => this.setState({ previewVisible: false });
  beforeUpload = (file, fileList) => {
    const { beforeUpload } = this.props;
    if (documentSuffix.length > 0 && !documentSuffix.includes((/\.[^\.]+$/.exec(file.name))[0])) {
      Notify.error('当前所上传的文件格式不合规范！');
      return false;
    }
    if (beforeUpload) {
      if (typeof beforeUpload === 'function') {
        return beforeUpload(file, fileList, {setLoading: this.setLoading});
      }
      return beforeUpload;
    }
    return true;
  };
  filterProps = (props, fields) => {
    const temp = {};
    Object.keys(props).forEach((p) => {
      if (!fields.includes(p)) {
        temp[p] = props[p];
      }
    });
    return temp;
  };
  render(){
    const { prefix = 'ro',action, onChange, name, buttonType, type = 'fa-upload',listType,number} = this.props;
    const {fileList,previewVisible,previewImage, status, disable} = this.state;
    let tempAction = action;
    if (typeof action === 'function') {
      tempAction = action();
    }
    const props = {
      ...this.filterProps(this.props, ['disable']), // 此处需要过滤掉disable属性
      beforeUpload:this.beforeUpload,
      action: `${config.baseUrl}${tempAction}`,
      withCredentials: true,
      headers: {
        'X-SESSION-TOKEN': cache.getSessionId(),
      },
      accept: (documentSuffix || []).join(','),
       onChange: (info) => {
        if (info.file.status !== 'uploading') {
          onChange && onChange('uploading', info.file, {setLoading: this.setLoading});
        }
        if (info.file.status === 'done') {
          onChange && onChange('done', info.file, {setLoading: this.setLoading});
        } else if (info.file.status === 'error') {
          onChange && onChange('error', info.file, {setLoading: this.setLoading});
        }
      },
    };
    if (listType === 'picture-card') {
      return (
        <div>
          <Upload
            {...props}
            disabled={disable || status}
            fileList={fileList}
            prefixCls='ro'
            onPreview={this.handlePreview}
            onChange={this.handleChange}
          >
            {this.uploadList(prefix,fileList,number - 1)}
          </Upload>
          <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
            <img alt="example" style={{ width: '100%' }} src={previewImage} />
          </Modal>
        </div>
      );
    }
    // status 控制上传组件的loading状态
    // disable 控制上传组件的禁用状态
    // 以上两种状态都会使得上传组件无法点击
    return (
      <RUpload {...props} name='file' disabled={status || disable}>
        {
          buttonType && buttonType === 'a' ?
          (
            <Icon
              style={{whiteSpace: 'nowrap'}}
              type={status ? 'loading1' : type}
              disable={disable ? 'true' : 'false'}
              className={status ? 'anticon-spin' : ''}
            />
          ) :
          (
            <Button loading={status} disabled={status || disable} icon={status ? '' : type}>
              {name}
            </Button>
          )
        }
      </RUpload>
      );
  }
}
