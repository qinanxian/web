import React from 'react';
import { Fieldset, Icon, Upload, ImageViewer, openModal, Modal, Message } from 'roface';

import './style/index.less';
import {Spin} from '../../src/components';

export default class PicCardList extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      imageLoading: {},
      show: {},
      data: {},
      loading: true,
      tip: '正在获取资料信息'
    };
  }
  componentDidMount() {
    const { rest, param: { custId } } = this.props;
    // 获取图片列表
    rest.get(`/cust/doclist/indCustDocList/${custId}`).then(res => {
      this.setState({
        data: this._calcGroup(res),
        loading: false,
      });
    })
  }

  _calcGroup = (data) => {
    return data.reduce((pre, next) => {
      const tempPre = {...pre};
      if (!tempPre[next.groupId]) {
        tempPre[next.groupId] = {
          groupName: next.groupName,
          list: [],
        };
      }
      tempPre[next.groupId].list.push(next);
      return tempPre;
    }, {});
  };

  _mouseOver = (id) => {
    const { show } = this.state;
    this.setState({
      show: {
        ...show,
        [id]: 'show'
      }
    });
  };
  _mouseLeave = (id) => {
    const { show } = this.state;
    this.setState({
      show: {
        ...show,
        [id]: 'hidden'
      }
    });
  };
  didMount = ({setImages}, fileList) => {
    const { rest } = this.props;
    setImages(fileList.map(f => {
      return {
        url: rest.getRequestURL(`/common/FileOperateController/showFile/${f.fileId}`),
        thumbnailUrl: rest.getRequestURL(`/common/FileOperateController/showFile/${f.fileId}`),
        containSession: true,
        info: f.itemName,
        title: f.itemName
      }
    }));
  };
  _deleteImg = (group, {itemId}) => {
    Modal.confirm({
      title: '删除确认',
      content: '确定删除图片吗？删除不可恢复！',
      onOk: () => {
        const { rest } = this.props;
        const { data } = this.state;
        this.setState({
          loading: true,
          tip: '正在删除文件，请稍候。。。'
        });
        rest.put(`/cust/doclist/clearIndCustDocListItem/${itemId}`).then(() => {
          Message.success('文件删除成功');
          this.setState({
            loading: false,
            data: {
              ...data,
              [group]: {
                ...data[group],
                list: (data[group].list || []).map(d => {
                  if (d.itemId === itemId) {
                    return {
                      ...d,
                      fileId: null
                    };
                  }
                  return d;
                })
              }
            },
          });
        }).catch(err => {
          Modal.error({
            title: '删除失败！',
            context: '文件删除失败！',
          })
        });
      },
    })
  };
  _viewImage = (group, itemId) => {
    const { data } = this.state;
    const fileList = (data[group].list || []).filter(d => !!d.fileId);
    openModal(
      <div className='crops-pic-card-list-image-view'>
        <ImageViewer
          pick={fileList.findIndex(d => d.itemId === itemId)}
          didMount={(image) => this.didMount(image, fileList)}
          width={600}
          height={500}
        />
      </div>,
      {
        title: '查看资料',
        width: 800
      }
    )
  };
  _beforeUpload = () => {
    this.setState({
      loading: true,
      tip: '文件上传中请稍后。。。'
    });
    return true;
  };
  _uploadChange = (status, file, itemId, group) => {
    if (status === 'done') {
      const { response } = file;
      const { data } = this.state;
      Message.success('文件上传成功');
      this.setState({
        loading: false,
        data: {
          ...data,
          [group]: {
            ...data[group],
            list: (data[group].list || []).map(d => {
              if (d.itemId === itemId) {
                return {
                  ...d,
                  fileId: response
                };
              }
              return d;
            })
          }
        },
      });
    } else if (status === 'error') {
      this.setState({
        loading: false,
      });
      Message.error('文件上传失败');
    }
  };
  _imageOnLoad = (fileId) => {
    const { imageLoading } = this.state;
    this.setState({
      imageLoading: {
        ...imageLoading,
        [fileId]: true,
      },
    });
  };
  render() {
    const { rest } = this.props;
    const { data, show, loading, tip, imageLoading } = this.state;
    return <div>
      <Spin spinning={loading} tip={tip}>
        {
          Object.keys(data).map(g => {
            return (
              <Fieldset
                expanded
                legend={data[g].groupName}
                id={g}
                key={g}
              >
                <div className='crops-pic-card-list-container'>
                  {
                    (data[g].list || []).map(d => {
                      return (
                        <div key={d.itemId} className='crops-pic-card-list-container-item-container'>
                          <div
                              className='crops-pic-card-list-container-item'
                              onMouseOver={() => this._mouseOver(d.itemId)}
                              onMouseLeave={() => this._mouseLeave(d.itemId)}
                            >
                              <Spin
                                spinning={d.fileId && !imageLoading[d.fileId]}
                                style={{width: 100, height: 100, display: (d.fileId && !imageLoading[d.fileId]) ? '' : 'none'}}
                              >
                                <div
                                  className='crops-pic-card-list-container-item-modal'
                                  style={{
                                    opacity: show[d.itemId] === 'show' ? 1 : 0,
                                    display: (d.fileId && imageLoading[d.fileId]) ? '' : 'none'
                                  }}
                                >
                                  <div
                                    className='crops-pic-card-list-container-item-modal-container'
                                  >
                                    <Upload
                                      beforeUpload={this._beforeUpload}
                                      showUploadList={false}
                                      style={{color: '#FFFFFF'}}
                                      action={`/common/FileOperateController/uploadFile/${d.itemId}/IndCustomerDocList/${null}`}
                                      buttonType={'a'}
                                      title={'上传'}
                                      onChange={(status, file) => this._uploadChange(status, file, d.itemId, g)}
                                    />
                                    <Icon
                                      className='crops-pic-card-list-container-item-context-delete'
                                      type='delete'
                                      title='删除'
                                      onClick={() => this._deleteImg(g, d)}
                                    />
                                    <Icon
                                      className='crops-pic-card-list-container-item-context-eyeo'
                                      type='eyeo'
                                      title='查看'
                                      onClick={() => this._viewImage(g, d)}
                                    />
                                  </div>
                                </div>
                                <div
                                  className='crops-pic-card-list-container-item-context'
                                >
                                  <Upload
                                    beforeUpload={this._beforeUpload}
                                    showUploadList={false}
                                    style={{display: d.fileId ? 'none' : ''}}
                                    action={`/common/FileOperateController/uploadFile/${d.itemId}/IndCustomerDocList/${null}`}
                                    buttonType={'a'}
                                    title={'上传'}
                                    onChange={(status, file) => this._uploadChange(status, file, d.itemId, g)}
                                  />
                                  <img
                                    onError={() => this._imageOnLoad(d.fileId)}
                                    onLoad={() => this._imageOnLoad(d.fileId)}
                                    className='crops-pic-card-list-container-item-context-img'
                                    alt={d.itemName}
                                    style={{width: 100, height: 100, display: d.fileId ? '' : 'none'}}
                                    src={d.fileId && rest.getRequestURL(`/common/FileOperateController/showFile/${d.fileId}`, true)}
                                  />
                                </div>
                              </Spin>
                            </div>
                          <div className='crops-pic-card-list-container-item-title'>{d.itemName}</div>
                        </div>
                      );
                    })
                  }
                </div>
              </Fieldset>
            );
          })
        }
      </Spin>
    </div>;
  }
}
