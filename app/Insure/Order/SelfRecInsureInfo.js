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

export default class SelfRecInsureInfo extends React.Component {

    constructor(props){
        super(props);
        const {id,time} = props;
        this.id = id;
        this.time = time;
    }

    componentDidMount(){
    }

    didMount = ({setImages}) => {
        this.setImages = setImages;
    };

    dataReady = (voInfo) => {
        this.voInfo = voInfo;
    };

    selfRecInsureInfoSave = (cb) => {
        this.voInfo.setValue("isRec", "1");
        this.voInfo.setValue("recTime", this.time);
        this.voInfo.setValue("insStatus", "04");
        this.voInfo.setValue("mgrOaNo", "");
        this.voInfo.setValue("mgrName", "");
        this.voInfo.saveData((err, values) => {
            if (err) {
                Message.error('保存失败！');
            } else {
                const {refresh} = this.props;
                refresh && refresh();
            }
            cb(err, values);
        });
    };

    render() {
        return (
            <div>
                <Row>
                    <Col span={24}>
                        <DetailInfo
                            dataFormId="insure-SelfRecInsureInfo"
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