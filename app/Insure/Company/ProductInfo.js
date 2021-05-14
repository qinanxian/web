import React from "react";
import {
    Row, Col, DetailInfo, Message,
    openModal, Modal, Icon, TimePicker, TimeRangPicker, Notify,
} from '../../../src/components';

export default class ProductInfo extends React.Component {

  constructor(props) {
    super(props);
    const {proId, comId} = props;
    this.proId = proId
    this.comId = comId;
      this.flag = '0';
  }

  dataReady = (voInfo) => {
    this.voInfo = voInfo;
    this.voInfo.setValue("comId", this.comId);
  }

  productInfoSaves = (cb) => {
    this.voInfo.setValue("flag", this.flag);
    const startTime = this.voInfo.getValue("startTime");
    const expireTime = this.voInfo.getValue("expireTime");
    if(expireTime < startTime){
        Notify.info('截止日期不能比起始日期早');
        cb(new Error("截止日期不能比起始日期早"));
    }else{
        this.voInfo.saveData((err, values) => {
        if (err) {
            Message.error(err.message);
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
                  dataFormId="insure-ProductInfo"
                  dataReady={this.dataReady}
                  params={{proId: this.proId, comId: this.comId}}
                  reading={this.props.readonly}
                  labelWidth={120}
              />
            </Col>
          </Row>
        </div>

    );
  }

}
