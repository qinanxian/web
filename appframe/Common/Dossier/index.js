import React from "react";
import {propsCompose} from "../../../src/components";
import {Fieldset, Icon, Upload, ImageViewer, openModal,openMask, Modal, Message, Spin} from '../../../src/components';
import ImgSelector from './imgSelector';
import './style/index.less';

@propsCompose
export default class Dossier extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imageLoading: {},
            show: {},
            data: [],
            loading: true,
            tip: '正在获取资料信息'
        }
    }

    componentDidMount() {
        const {rest} = this.props;

        rest.get(`/common/dossier/byId/${this.props.dossierId}`)
            .then((res) => {
                const data = this._arrayToGroupArray(res.itemList, 'itemGroup');
                this.setState({
                    data,
                    loading: false,
                });
            });
    }

    _arrayToGroupArray = (array, id) => {
        if (!(array instanceof Array)) return array;
        const newArray = [[array[0]]];
        for (let j = 1; j < array.length; j++) {
            let checkFlag = false;
            for (let i = 0; i < newArray.length; i++) {
                const ax = newArray[i].filter(itemB => itemB[id] === array[j][id]);
                if (ax.length !== 0) {
                    newArray[i].push(array[j]);
                    checkFlag = true;
                    break;
                }
            }
            if (!checkFlag) {
                newArray.push([array[j]]);
            }
        }
        return newArray;
    };

    _mouseOver = (id) => {
        const {show} = this.state;
        this.setState({show: {...show, [id]: 'show'}});
    };
    _mouseLeave = (id) => {
        const {show} = this.state;
        this.setState({show: {...show, [id]: 'hidden'}});
    };
    didMount = ({setImages}, fileList) => {
        const {rest} = this.props;
        setImages(fileList.map(f => {
            return {
                url: rest.getRequestURL(`/common/dossier/showFile/${f.showCode}`),
                thumbnailUrl: rest.getRequestURL(`/common/dossier/showFile/${f.showCode}`),
                containSession: true,
                info: f.__itemName,
                title: f.__itemName,
            }
        }));
    };

    _deleteImg = (item, iA, iB) => {
        const fileEntities = item.fileEntities;
        if (fileEntities.length === 0) return Message.info('没有可删除的图片，请先上传');
        const {rest} = this.props;
        let selectArray = [];
        const that = this;
        openModal(
            <ImgSelector
                onChange={(arr) => selectArray = arr}
                fileArray={fileEntities}
                rest={rest}
            />,
            {
                title: '删除资料',
                width: 800,
                defaultButton: true,
                onOk(a, b, c) {
                    if (selectArray.length === 0) {
                        a.close();
                    } else {
                        Modal.confirm({
                            title: '删除确认',
                            content: '确定删除图片吗？删除不可恢复！',
                            onOk: () => {
                                const fileIdList = selectArray.map(item => item.fileId);
                                that.setState({loading: true, tip: '正在删除文件，请稍候。。。'});
                                rest.post(`/common/dossier/remove/${item.itemId}/`, fileIdList).then(() => {
                                    const {data} = that.state;
                                    data[iA][iB].fileEntities = fileEntities.filter(o => !fileIdList.includes(o.fileId));
                                    that.setState({loading: false, tip: '删除成功', data});
                                    Message.success('文件删除成功');
                                    c.setLoading(false);
                                    a.close();
                                }).catch(err => {
                                    c.setLoading(false);
                                    Modal.error({title: '删除失败！', context: '文件删除失败！'})
                                });
                            },
                            onCancel: () => c.setLoading(false),
                        })
                    }
                },
            }
        );

    };
    _viewImage = (item) => {
        const fileEntities = item.fileEntities;
        const {data} = this.state;
        let imageArray = [];
        data.forEach(itemA => {
            itemA.forEach(itemB => {
                imageArray = imageArray.concat(itemB.fileEntities.map((itemC, i) =>
                    ({...itemC, __itemName: itemB.itemName + `-[${i + 1}]`})))
            })
        });
        // openModal(
        //     <div className='crops-pic-card-list-image-view'>
        //         <ImageViewer
        //             pick={imageArray.findIndex(ob => ob.showCode === fileEntities[0].showCode)}
        //             didMount={(image) => this.didMount(image, imageArray)}
        //             width={1000}
        //             height={800}
        //         />
        //     </div>,
        //     {title: '查看资料', width: 1200, top: 50, isDragact: true}
        // );

        openMask(<div style={{
            margin: '0 auto',
            width: document.documentElement.clientWidth * 0.8,
            height: document.documentElement.clientHeight
        }}>
            <ImageViewer didMount={(image) => this.didMount(image, imageArray)}
                         pick={imageArray.findIndex(ob => ob.showCode === fileEntities[0].showCode)}
                         width={document.documentElement.clientWidth * 0.8 - 110}
                         height={document.documentElement.clientHeight}/>
        </div>);
    };
    _beforeUpload = () => {
        this.setState({loading: true, tip: '文件上传中请稍后。。。'});
        return true;
    };
    _uploadChange = (status, file, iA, iB) => {
        if (status === 'done') {
            const {response} = file;
            const {data} = this.state;
            Message.success('文件上传成功');
            data[iA][iB].fileEntities.push(response);
            this.setState({loading: false, data});
        } else if (status === 'error') {
            this.setState({loading: false});
            Message.error('文件上传失败');
        }
    };
    _imageOnLoad = (id, fileId) => {
        const {imageLoading} = this.state;
        this.setState({imageLoading: {...imageLoading, [id]: true}});
    };

    _renderImageTool = (item, iA, iB) => {
        const {show} = this.state;
        return (
            <div
                className='crops-pic-card-list-container-item-modal'
                style={{
                    opacity: show[item.itemId] === 'show' ? 1 : 0,
                    display: show[item.itemId] === 'show' ? '' : 'none'
                }}
            >
                <div className='crops-pic-card-list-container-item-modal-container'>
                    <Upload
                        beforeUpload={this._beforeUpload}
                        showUploadList={false}
                        style={{color: '#FFFFFF'}}
                        action={`/common/dossier/upload/${item.itemId}`}
                        buttonType={'a'}
                        title={'上传'}
                        onChange={(status, file) => this._uploadChange(status, file, iA, iB)}
                    />
                    <Icon
                        className='crops-pic-card-list-container-item-context-delete'
                        type='delete'
                        title='删除'
                        onClick={() => this._deleteImg(item, iA, iB)}
                    />
                    <span>{item.fileEntities.length}张</span>
                </div>
            </div>
        )
    };

    _renderImageItem = (item, iA, iB) => {
        const {rest} = this.props;
        const {imageLoading} = this.state;
        return (
            <div key={item.itemId} className='crops-pic-card-list-container-item-container'>
                <div
                    className='crops-pic-card-list-container-item'
                    onMouseOver={() => this._mouseOver(item.itemId)}
                    onMouseLeave={() => this._mouseLeave(item.itemId)}
                >
                    <Spin
                        spinning={false}
                        style={{
                            width: 100,
                            height: 100,
                            display: (item.itemId && !imageLoading[item.itemId]) ? '' : 'none'
                        }}
                    >
                        {this._renderImageTool(item, iA, iB)}
                        <div className='crops-pic-card-list-container-item-context'>
                            {item.fileEntities.length === 0 && <span>请上传</span>}
                            <img
                                onClick={() => this._viewImage(item)}
                                onError={() => this._imageOnLoad(item.itemId)}
                                onLoad={() => this._imageOnLoad(item.itemId)}
                                className='crops-pic-card-list-container-item-context-img'
                                alt={item.itemName}
                                style={{display: item.fileEntities.length > 0 ? '' : 'none'}}
                                src={rest.getRequestURL(`/common/dossier/showFile/${item.fileEntities[0] && item.fileEntities[0].showCode}`, true)}
                            />
                        </div>
                    </Spin>
                </div>
                <div className='crops-pic-card-list-container-item-title'>
                    {item.importance === 'MUST' && <span style={{color: 'red'}}>*[必需] </span>}
                    {item.itemName}
                </div>
            </div>
        );
    };

    render() {
        const {data, loading, tip} = this.state;
        return (
            <Spin spinning={loading} tip={tip}>
                {data.map((itemA, iA) => {
                    const groupName = itemA[0].itemGroup.split(':').pop();
                    return (
                        <Fieldset expanded legend={groupName} id={iA} key={iA}>
                            <div className='crops-pic-card-list-container'>
                                {(itemA || []).map((itemB, iB) => this._renderImageItem(itemB, iA, iB))}
                            </div>
                        </Fieldset>
                    );
                })
                }
            </Spin>
        )
    }
}
