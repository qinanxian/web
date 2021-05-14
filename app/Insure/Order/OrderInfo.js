import React from "react";
import {
    Row,
    Col,
    DetailInfo,
    Message,
    openModal,
    Modal,
    Icon,
    Fieldset,
    DataTable,
    rest, Notify
} from '../../../src/components';
import {ImageViewer, Button, openMask} from 'roface';
import EditDetailInfo from "./EditDetailInfo";

export default class OrderInfo extends React.Component {

    constructor(props) {
        super(props);
        const {id,v1,v2,v3} = props.params;
        //保单ID
        this.id = id;
        //凭证缩略图
        this.state = ({
            //凭证1
            ver1ImageOb: {},
            //凭证2
            ver2ImageOb: {},
            //凭证3
            ver3ImageOb: {},
        })
    }

    componentWillMount(){
        this.showCompressedImg();
    }
    formReadyOrder = (voinfo) => {
        this.orderVoInfo = voinfo;
    }
    formReadyTran = (voList) => {
        this.tranList = voList;
    }
    formReadyUpdate = (voList) => {
        this.updateList = voList;
    }
    dataReadyUpdate = (voList) => {
        this.updateList = voList;
        this.updateList.setColumnTemplate('dataAuditId', (text, record, i) => {
            return (<a onClick={() => this.clickName(record)}>{text}</a>);
        });
        this.updateList.setColumnTemplate('actionSummary', (text, record, i) => {
            return (<a onClick={() => this.clickName(record)}>{text}</a>);
        });
    };
    clickName = (row) => {
        //修改记录ID
        const dataAuditId = row.dataAuditId;
        if(dataAuditId === ""){
            Notify.error("修改记录ID为空，无法查看修改记录详情！");
        }else{
            openModal(<EditDetailInfo
                    dataAuditId={dataAuditId}
                    dataReady={handler => {
                        this.treeHandler = handler
                    }}
                />,
                {
                    dataAuditId: dataAuditId,
                    title: "修改记录详情",
                    defaultButton: false,
                    onOk: (a, b, c) => {
                        a.close();
                    },
                    onCancel: (a, b) => {
                    }
                }
            );
        }
    };

    showCompressedImg = () => {
        if(this.id != null){
            rest.get(`/insure/network/getCompressedImgById/${this.id}`)
                .then((response)=>{
                    if(response.status == 1){
                        if(response.count> 0){
                            const ver1ImageOb = response.voucher[0] || {};
                            this.setState({
                                ver1ImageOb
                            })
                        }
                        if(response.count> 1){
                            const ver2ImageOb = response.voucher[1] || {};
                            this.setState({
                                ver2ImageOb
                            })
                        }
                        if(response.count> 2){
                            const ver3ImageOb = response.voucher[2] || {};
                            this.setState({
                                ver3ImageOb
                            })
                        }
                    }else {
                        Notify.error("获取缴费凭证信息失败！");
                    }
                }).catch((error)=>{
                Notify.error("未加载到客户意愿图片");
            })
        }
    }

    didMount = ({setImages}) => {
        this.setImages = setImages;
    };
    openImg = (imgBaseId,e) => {
        console.log("openImg id:"+imgBaseId);
        openMask(<div style={{margin: '0 auto', width: document.documentElement.clientWidth, height:document.documentElement.clientHeight}}>
            <ImageViewer didMount={this.didMount} width={document.documentElement.clientWidth - 110} height={document.documentElement.clientHeight}/>
        </div>);
        this._imageChange(2,imgBaseId);
    }
    _imageChange = (num,imgBaseId) => {
        this.setImages([
            {
                url: `/api/network/getBigImgById/${imgBaseId}`,
                thumbnailUrl: `/api/network/getBigImgById/${imgBaseId}`,
                containSession: false,
                info: '缴费凭证',
                title: '缴费凭证'
            }
        ].splice(0, 11 - (11-num)), 0);
    };

    renderImageItem = (title, imageOb) => {
        let base64Str = imageOb.imageBase || '';
        if (!base64Str.includes('data:image/')) {
            base64Str = `data:image/png;base64,${imageOb.imageBase}`
        }
        return (
            <div>
                <div>{title}：</div>
                {imageOb.bigImageId
                    ? <img
                        src={base64Str}
                        onClick={() => this.openImg(imageOb.bigImageId)}
                    />
                    : <div>{"\<当前无图片\>"}</div>
                }
            </div>
        )
    }

    render() {
        const { ver1ImageOb, ver2ImageOb, ver3ImageOb} = this.state;
        return (
            <div>
                <Fieldset  legend="保单信息" showArrow={true}>
                    <DetailInfo
                        dataFormId="insure-OrderInfo"
                        params={{id: this.id}}
                        labelWidth={158}
                        dataReady = {this.dataReadyOrder}
                        formReady = {this.formReadyOrder}
                    />
                </Fieldset>
                <Fieldset  legend="缴费凭证" showArrow={true}>
                    <Row span={100}>
                        <Col style={{marginLeft:'150px'}}>{this.renderImageItem("缴费凭证1", ver1ImageOb)}</Col>
                        <Col style={{marginLeft:'100px'}}>{this.renderImageItem("缴费凭证2", ver2ImageOb)}</Col>
                        <Col style={{marginLeft:'100px'}}>{this.renderImageItem("缴费凭证3", ver3ImageOb)}</Col>
                    </Row>
                </Fieldset>
                <Fieldset  legend="保单移交记录" showArrow={true}>
                    <DataTable
                        dataFormId="insure-TranRecord"
                        formReady={this.formReadyTran}
                        dataReady={this.dataReadyTran}
                        params={{id: this.id}}
                        labelWidth={158}
                    />
                </Fieldset>
                <Fieldset  legend="保单修改记录" showArrow={true}>
                    <DataTable
                        dataFormId="insure-UpdateRecord"
                        formReady={this.formReadyUpdate}
                        dataReady={this.dataReadyUpdate}
                        params={{id: this.id}}
                        labelWidth={158}
                    />
                </Fieldset>
            </div>
        );
    }
}
