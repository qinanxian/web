import React from "react";
import {
    Row,
    Col,
    rest,
    DetailInfo,
    Notify,
    Upload,
    Message,
    openModal,
    Modal,
    Icon,
    MultiPartInput,
    Button
} from '../../../src/components';

import {ImageViewer,  openMask} from 'roface';
import QueryOrderManager from './QueryOrderManager';

export default class TranInsureInfo extends React.Component {

    constructor(props){
        super(props);
        const {id,nowTime,netorgNo,expireTime,mgrName,mgrOaNo} = props;
        this.id = id;
        this.mgrName = mgrName;
        this.mgrOaNo = mgrOaNo;
        this.expireTime = expireTime;
        this.netorgNo = netorgNo;
        this.nowTime = nowTime;
        this.state = {
            role: ''
        };
    }

    componentDidMount(){
    }

    didMount = ({setImages}) => {
        this.setImages = setImages;
    };

    dataReady = (voInfo) => {
        this.voInfo = voInfo;
        this.voInfo.setValue("tranName", this.mgrName);
        this.voInfo.setItemSuffix('revName', () => {
            return (
                <Icon
                    type="ellipsis"
                    onClick={this.queryOrderManager}
                    style={{height: 20, ...this.props.style, cursor: 'pointer'}}
                />
            );
        })
    };
    queryOrderManager = () => {
        if(this.netorgNo === ""){
            Message.error('保单所属网点为空，无法查找网点对应的保单管理员！');
        }
        openModal(<QueryOrderManager
                userOrg={this.netorgNo}
                dataReady={handler => {
                    this.treeHandler = handler
                }}
            />,
            {
                userOrg: this.netorgNo,
                title: "保单管理员",
                defaultButton: true,
                onOk: (a, b, c) => {
                    const selected = this.treeHandler.getSelectedRows();
                    const selectedItem = selected &&　selected[0];
                    this.voInfo.setValue("revName",  selectedItem.manName);
                    this.voInfo.setValue("revOaNo",  selectedItem.manOa);
                    this.setState({role:selectedItem.role});
                    a.close();
                },
                onCancel: (a, b) => {
                }
            }
        );
    };

    tranInsureInfoSave = (cb) => {
        const tranType=this.voInfo.getValue("tranType");
        const revOaNo=this.voInfo.getValue("revOaNo");
        const revName=this.voInfo.getValue("revName");
        if((tranType=='T01')&&(this.nowTime < this.expireTime)){
            Notify.info('保单到期之后，才能到期移交');
            cb(new Error("保单到期之后，才能到期移交"));
        }else if((tranType=='T01')&&(this.state.role != 'R03')){
            Notify.info('到期移交,应统一移交给-档案中心管理员');
            cb(new Error("到期移交,应统一移交给-档案中心管理员"));
        }else if ((tranType=='T02')&&(this.state.role == 'R03')){
            Notify.info('专管员离职移交,不能移交给-档案中心管理员');
            cb(new Error("专管员离职移交,不能移交给-档案中心管理员"));
        }else{
            this.voInfo.setValue("orderId", this.id);
            this.voInfo.setValue("tranTime", this.nowTime);
            this.voInfo.setValue("tranOaNo", this.mgrOaNo);
            this.voInfo.saveData((err, values) => {
                if (err) {
                    Message.error('保存失败！');
                } else {
                    const {refresh} = this.props;

                    rest.post('/insure/network/updateOrderInfo',{orderId: this.id,tranType: tranType,revOaNo: revOaNo,revName: revName}).then((response) => {
                        refresh && refresh();
                    }).catch(error => {
                        Message.error("保存错误！");
                    })
                    refresh && refresh();
                }
                cb(err, values);
            });
        }
    };

    render() {
        return (
            <div>
                <Row>
                    <Col span={24}>
                        <DetailInfo
                            dataFormId="insure-TranInsureInfo"
                            dataReady={this.dataReady}
                            params={{id: this.id}}
                            reading = {this.props.readonly}
                            labelWidth={158}
                        />
                    </Col>
                </Row>
            </div>
        );
    }
}