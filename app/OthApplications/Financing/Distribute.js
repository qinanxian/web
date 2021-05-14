import React from "react";

import {Row, Col, DetailInfo, Message, openModal, Modal, Icon, rest, Notify} from '../../../src/components';
import NewNetWorkInfo from "../../CodeToDo/NetWork/NewNetWorkInfo";
import QueryUserName from './QueryUserName';

export default class Distribute extends React.Component {


  constructor(props) {
    super(props);
    const {loanId, userOrg} = props;
    this.loanId = loanId;
    this.userOrg = userOrg;
  }


  dataReady = (voInfo) => {
    this.voInfo = voInfo;
    this.voInfo.setItemSuffix('branch', () => {
      return (
          <Icon
              type="ellipsis"
              onClick={this.openNetWorkNoModal1}
              style={{height: 20, ...this.props.style, cursor: 'pointer'}}
          />
      );
    })
    this.voInfo.setItemSuffix('creditOperatorname', () => {
      return (
          <Icon
              type="ellipsis"
              onClick={this.queryUserName}
              style={{height: 20, ...this.props.style, cursor: 'pointer'}}
          />
      );
    })
  };


  openNetWorkNoModal1 = () => {
    openModal(
        <NewNetWorkInfo
            {...this.props}
            checkable={false}
            dataReady={handler => {
              this.treeHandler = handler
            }}
        />,
        {
          title: "所属机构网点",
          defaultButton: true,
          onOk: (a, b, c) => {
            const selected = this.treeHandler.getSelectedItem();
            const selectedItem = selected && selected[0];
            console.log(selectedItem.name)
            this.voInfo.setValue("outlets", selectedItem.code);
            this.voInfo.setValue("branch", selectedItem.name);
            a.close();
          },
          onCancel: (a, b) => {
          }
        }
    );
  };

  queryUserName = (voInfo) => {
    const userOrg = this.voInfo.getValue("outlets");
    this.openQueryUserName(userOrg);
  }


  openQueryUserName = (userOrg) => {
    if (userOrg === "") {
      Message.error('保存失败！');
    }
    openModal(<QueryUserName
            userOrg={userOrg}
            dataReady={handler => {
              this.treeHandler = handler
            }}
        />,
        {
          userOrg: userOrg,
          title: "网点操作员",
          defaultButton: true,
          onOk: (a, b, c) => {
            const selected = this.treeHandler.getSelectedRows();
            const selectedItem = selected && selected[0];
            if(selectedItem.phone!=null && this.validatePhone(selectedItem.phone)){
                this.voInfo.setValue("distributionStatus", "WAIT");
                this.voInfo.setValue("creditOperatorname", selectedItem.name);
                this.voInfo.setValue("creditOperator", selectedItem.id);
            }else{
              Message.error(selectedItem.name+'手机号为空或手机号格式不正确，请联系管理员修改或添加该操作员手机号码！');
            }
            a.close();
          },
          onCancel: (a, b) => {
          }
        }
    );
  };

  // 各种格式校验方法
  validatePhone = (phone) => {
    const strTemp = /^1[3|4|5|6|7|8|9][0-9]{9}$/;
    if(!phone)return false;
    if (phone.includes(' ')) {
      return !!(strTemp.test(phone.replace(/ /g, '')));
    }
    return !!(strTemp.test(phone));
  }

  DistributeSave = (cb) => {
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
              dataFormId="othapplications-Distribute"
              dataReady={this.dataReady}
              params={{loanId: this.loanId}}
              reading={this.props.readonly}
              labelWidth={158}
          />
        </div>
    );
  }

}
