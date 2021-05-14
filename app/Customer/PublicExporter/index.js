import {Message} from "../../../src/components";
import React from "react";


export default class PublicExporter {
    static openCustomerViewById = (flexTabs, rest, custId) => {
        rest.get(`/cust/byId/${custId}`)
            .then((cust) => {
                const {custId,custName,custType} = cust;
                if (custType == 'ENT') {
                    flexTabs.open(`公司：${custName}`, 'Customer/Enterprise/EnterpriseTree', {
                        custId,
                        readonly: true
                    });
                } else if (custType == 'IND') {
                    flexTabs.open(`个人：${custName}`, 'Customer/Individual/IndividualTabs', {
                        custId,
                        readonly: true
                    });
                } else {
                    Message.error(`客户类型值：{custType}不合法`);
                }
            });
    };
}

