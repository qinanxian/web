/**
 * Created by jkwu on 18-1-24.
 */
import React from "react";
import { DetailInfo, Message, DataTablePicker } from '../../../src/components';

export default class InvestInfo extends React.Component {
  formReady = (voinfo) => {
    this.voinfo = voinfo;
    if (!this.props.readonly) {
        this.voinfo.setItemSuffix('relationCustName', () => {
            return (
                <DataTablePicker
                    dataFormId="customer-EnterpriseCustomerSummaryList"
                    pageSize={5}
                    title="选择投资企业信息"
                    onOk={(e, row) => {
                        row && voinfo.setData({
                            relationCustId: row.custId,
                            relationCustName: row.custName,
                        });
                    }}
                />
            );
        })
    }
  };


  saveInvestData = (cb) => {
    const { tableRefresh } = this.props;
    this.voinfo && this.voinfo.saveData((errors, values) => {
        if (errors) {
          Message.error('保存失败...');
          return;
        }
      tableRefresh && tableRefresh();
      cb && cb(errors, values);
    })
  };

  render() {
    const { relationId, custId } = this.props;
    return (
      <div>
        <DetailInfo
          dataFormId="customer-InvestInfo"
          params={{ relationId, custId }}
          formReady={this.formReady}
          reading = {this.props.readonly}
          labelWidth={158}
        />
      </div>
    );
  }
}