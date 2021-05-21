import React from "react";
import {DetailInfo, Message,} from '../../../src/components';
export default class LabelInfo extends React.Component {

  constructor(props) {
    super(props);
    const {id} = props;
    this.id = id;
  }


  dataReady = (voInfo) => {
    this.voInfo = voInfo;
  };

  InfoAddLabelInfo = (cb) => {
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
        <DetailInfo
          dataFormId="othapplications-labelInfo"
          params={{id: this.id}}
          dataReady={this.dataReady}
          reading={this.props.readonly}
          labelWidth={158}
        />
      </div>
    );
  }

}

