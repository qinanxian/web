/**
 * Created by jkwu on 18-2-1.
 */
import React from 'react';
import {DetailInfo,Message} from '../../../src/components/index';

export default class MeetingSummary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      meetingId: props.meetingId ? props.meetingId:null
    };
  }

  dataReady = (voInfo) => {
    this.voInfo = voInfo;
  };

  accountInfo = (cb) => {
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
        <DetailInfo
          dataFormId="common-MeetingSummary"
          params={{meetingId: this.state.meetingId}}
          dataReady={this.dataReady}
        />
      </div>


    );
  }
}

