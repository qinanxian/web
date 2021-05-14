import React from "react";

import {
  Row,
  Col,
  DetailInfo,
  Message,
  openModal,
  Modal,
  Icon,
  TimePicker,
  TimeRangPicker
} from '../../../src/components';


export default class SpecialOpenTimeInfo extends React.Component {

  constructor(props) {
    super(props);
    const {openTimeId, netWorkId} = props;
    this.openTimeId = openTimeId;
    this.netWorkId = netWorkId;
  }


  dataReadyOtherInfo = (voInfo) => {
    this.voInfo = voInfo;
    this.voInfo.setValue("networkNo", this.netWorkId);
    this.voInfo.setItemTemplate(
        "startTime",
        <TimeRangPicker
            format="HH:mm"
        />
    );
    this.voInfo.setItemTemplate(
        "endTime",
        <TimeRangPicker
            format="HH:mm"
        />
    );
    this.voInfo.setItemOnChange('isBusiness',this.itemOnChange);
  }

  itemOnChange = (value) => {
    console.log(value);
    if (value == '0001') {
      this.voInfo.setItemRequired("startTime", false);
      this.voInfo.setItemRequired("endTime", false);
    }else if (value == '0002') {
      this.voInfo.setItemRequired("startTime", true);
      this.voInfo.setItemRequired("endTime", true);
    }
  }

  openTimeInfoSave = (cb) => {
    this.voInfo.saveData((err, values) => {
      if (err) {
        Message.error(err.message);
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
                  dataFormId="codetodo-ParticularOpenTimeInfo"
                  dataReady={this.dataReadyOtherInfo}
                  params={{openTimeId: this.openTimeId}}
                  reading={this.props.readonly}
                  labelWidth={158}
              />
            </Col>
          </Row>
        </div>

    );
  }

}