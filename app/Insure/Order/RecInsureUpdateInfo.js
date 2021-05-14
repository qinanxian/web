import React from "react";
import {getUser} from '../../../src/lib/cache';
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

export default class RecInsureUpdateInfo extends React.Component {

    constructor(props){
        super(props);
        const {id} = props;
        this.id = id;
        this.userOrg = getUser().orgId;
        this.userName = getUser().name
        this.userId = getUser().id;
    }

    componentDidMount(){
    }

    didMount = ({setImages}) => {
        this.setImages = setImages;
    };

    dataReady = (voInfo) => {
        this.voInfo = voInfo;
    };

    recInsureUpdateInfoSave = (cb) => {
        this.voInfo.setValue("isRev", "1");
        this.voInfo.setValue("insStatus", "01");
        this.voInfo.setValue("mgrOaNo", this.userId);
        this.voInfo.setValue("mgrName", this.userName);
        const startTime = this.voInfo.getValue("startTime");
        const expireTime = this.voInfo.getValue("expireTime");
        if(expireTime < startTime){
            Notify.info('保单到期时间不能比起始时间早')
            cb(new Error("保单到期时间不能比起始时间早"));
        }else{
            this.voInfo.saveData((err, values) => {
                if (err) {
                    Message.error('保存失败！');
                } else {
                    const {refresh} = this.props;
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
                            dataFormId="insure-RecInsureUpdateInfo"
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