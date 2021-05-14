import React from 'react';
import {DetailInfo, Message, ModalInput, Notify} from '../../../src/components';

export default class UserForShareCustomerAllow extends React.Component {
    constructor(props) {
        super(props);
        this.custId = props.custId,
        this.isAdmin = props.param ? props.param.isAdmin : props.isAdmin

    }

    formReady = (voinfo) => {
        this.voinfo = voinfo;
        this.voinfo.setItemTemplate('userName', () => {
            return (
                <ModalInput
                    dataTable={{ dataFormId: "customer-SelectShareUserList"}}
                    modal={{
                        title: '选择共享人',
                        onOk: (e, row) => {
                            row && row.length && this.voinfo.setData({
                                userId: row[0].id,
                                userName: row[0].name,
                            });
                        }
                    }}
                />
            );
        })

        this.voinfo.setItemOnChange('allowEdit', this.itemOnChange);
        this.voinfo.setItemOnChange('allowBusiness', this.itemOnChange);
    };


    itemOnChange = (value) => {
        if ('Y' === value) {
            this.voinfo.setValue("allowView","Y")
        }
    };

    saveInfo = (cb) => {
        this.voinfo.saveData((err, values) => {
            if (err) {
                Notify.error({
                    message: '客户权限共享失败'
                });
            } else {
                Notify.success({
                    message: '客户权限共享成功'
                });
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
                    dataFormId="customer-UserForShareCustomerAllow"
                    params={{permitId: null, custId:this.custId, isAdmin:this.isAdmin || "N"}}
                    formReady={this.formReady}
                    saveMessageEnable={false}
                    labelwidth="100px"
                />
            </div>

        );
    }
}

