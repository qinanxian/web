import React from 'react';
import {DetailInfo, Notify, Message, Modal} from '../../../../src/components';

export default class PrepaymentInfo extends React.Component {
    constructor(props) {
        super(props);
        this.dictCode = null;
        this.dictCategory = 'OTHER';
    }

    formReady = (formInfo) => {
        this.formInfo = formInfo;
        this.formInfo.addButton([{
            name: '触发事件',
            type: 'primary',
            onClick: this.triggerEvent
        }]);
        this.formInfo.setItemOnChange('isUseStandardMoney', this.isUseStandardMoneyOnChange);
    };

    isUseStandardMoneyOnChange = (value) => {
        if ('Y' === value) {
            this.formInfo.setItemVisible("originalCurrency",false);
            this.formInfo.setItemVisible("originalAmt",false);
            this.formInfo.setItemVisible("exchangeRateType",false);
            this.formInfo.setItemVisible("exchangeRate",false);
            this.formInfo.setItemRequired("originalCurrency",false);
            this.formInfo.setItemRequired("originalAmt",false);
            this.formInfo.setItemRequired("exchangeRateType",false);
            this.formInfo.setItemRequired("exchangeRate",false);


            this.formInfo.setItemVisible("occurAmt",true);
            this.formInfo.setItemRequired("occurAmt",true);
        } else {
            this.formInfo.setItemVisible("originalCurrency",true);
            this.formInfo.setItemVisible("originalAmt",true);
            this.formInfo.setItemVisible("exchangeRateType",true);
            this.formInfo.setItemVisible("exchangeRate",true);

            this.formInfo.setItemRequired("originalCurrency",true);
            this.formInfo.setItemRequired("originalAmt",true);
            this.formInfo.setItemRequired("exchangeRateType",true);
            this.formInfo.setItemRequired("exchangeRate",true);

            this.formInfo.setItemVisible("occurAmt",false);
            this.formInfo.setItemRequired("occurAmt",false);
        }
    };

    triggerEvent = () => {
        const data = this.formInfo.getData();
        this.formInfo.invoke('trigger', data).then((data) => {
            Notify.success(data && `事件触发成功`);
        })
            .catch((error) => {
                Modal.info({
                    content: error.message,
                });
            });
    };

    render() {
        return (
            <div>
                <DetailInfo
                    dataFormId="demo-PrepaymentInfo"
                    formReady={this.formReady}
                />
            </div>

        );
    }
}
