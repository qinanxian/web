import React from "react";

import { DetailInfo, Message } from '../../../src/components';


export default class AssetInfo extends React.Component {
  formReady = (voInfo) => {
      this.voInfo = voInfo;
    };

    saveAssetData = (cb) => {
      return this.voInfo && this.voInfo.saveData((err, values) => {
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
                    dataFormId="customer-AssetInfo"
                    params={{id: this.props.id, custId: this.props.custId}}
                    dataReady={this.formReady}
                    reading = {this.props.readonly}
                />
            </div>
        );
    }
}