import React from "react";
import {Icon, Button, rest, Modal,Message} from "../../../src/components";
import './style/index.less';

export default class Formatdoc extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fileEntities: [],
        };
    }

    componentDidMount() {
        this._fetchData();
    }

    _fetchData = () => {
        const {closeLoading, openLoading, formatdocId} = this.props;
        openLoading && openLoading();
        rest.get(`/common/formatdoc/byId/${formatdocId}`).then((ret) => {
            closeLoading && closeLoading();
            const {itemList} = ret;
            let fileEntities = [];
            itemList && itemList.forEach(item => {
                const originalFileEntites = item.fileEntities.map((fileEntity) => {
                    return {
                        ...fileEntity,
                        itemName: item.itemName
                    };
                });
                fileEntities = fileEntities.concat(originalFileEntites);
            });
            this.setState({fileEntities});
        }).catch(error => {
            closeLoading && closeLoading();
            Modal.error(error.message);
        });
    };

    _docInfoConfig = (item) => {
        const docType = item && item.name && item.name.split('.').pop();
        let color = 'E7E7E7', icon = 'unknowfile1';
        switch (docType) {
            case 'pdf':
                icon = 'pdffile1';
                color = '#ce383c';
                break;
            case 'pptx':
            case 'ppt':
                icon = 'pptfile1';
                color = '#e16044';
                break;
            case 'docx':
            case 'doc':
                icon = 'wordfile1';
                color = '#385c9b';
                break;
            case 'xlsx':
            case 'xlx':
                icon = 'exclefile1';
                color = '#347448';
                break;
            case 'jpeg':
            case 'jpg':
                icon = 'jpgfile1';
                color = '#abc6f4';
                break;
            case 'txt':
                icon = 'filetext1';
                color = '#c3c7cb';
                break;
            default :
                icon = 'unknowfile1';
                color = '#E7E7E7';
                break;
        }
        return {color, icon}
    };

    _viewFormatDoc = (item) => {
        const {flexTabs} = this.props;
        const url = `/common/formatdoc/getContentPDF/${item.showCode}`;
        flexTabs.open(`查看[${item.name}]`, 'Common/FormatdocViewer', {url});
    };

    _editFormatDoc = (item) => {
        Message.info('开发中。。。');
    };

    _renderListItem = (item = {}) => {
        const {icon, color} = this._docInfoConfig(item);
        return (
            <div className="fm-doc-list-item" key={item.fileId}>
                <div className="fm-doc-list-item-box" style={{width: '35%'}}>
                    <Icon className="fm-doc-list-item-box-icon" style={{color}} type={icon}/>
                    <div className="fm-doc-list-item-widget">
                        <a style={{marginBottom: 5}} onClick={() => this._viewFormatDoc(item)}>
                            <div style={{color: '#252525'}}>
                                {item.itemName}
                            </div>
                        </a>
                        <div>大小：
                            <span className="fm-doc-list-item-widget-span">
                          {(item.fileSize && item.fileSize > 0) ? (item.fileSize / 1024).toFixed(2) : 0}KB
                        </span>
                        </div>
                    </div>
                </div>

                <div className="fm-doc-list-item-widget" style={{width: '20%'}}>
                    <div>
                        创建人：<span style={{marginRight: 10}}
                                  className="fm-doc-list-item-widget-span">{item.createdByName}</span>
                    </div>
                    <div>创建时间：<span className="fm-doc-list-item-widget-span">{item.createdTime}</span></div>
                </div>

                <div style={{fontSize: '12px', width: '15%', height: '100%', display: 'flex', alignItems: 'center'}}>
                    修改次数：<span className="fm-doc-list-item-widget-span">{item.revision || 0}</span>
                </div>

                <div className="fm-doc-list-item-widget" style={{width: '25%'}}>
                    <div>
                        最后修改人：<span className="fm-doc-list-item-widget-span">{item.updatedByName}</span>
                    </div>
                    <div>最后修改时间：<span className="fm-doc-list-item-widget-span">{item.updatedTime}</span></div>
                </div>

                <div className="fm-doc-list-item-widget" style={{width: '5%'}}>
                    <a onClick={() => this._editFormatDoc(item)}>
                        <Icon type="edit" style={{marginRight: 5}}/>编辑
                    </a>
                </div>
            </div>
        );
    };

    render() {
        const {fileEntities} = this.state;
        return (
            <div>
                {fileEntities.length > 0 ? fileEntities.map(item =>
                    this._renderListItem(item)
                ) : <div className="fm-doc-list-blank">暂无数据</div>
                }
            </div>
        );
    }
}
