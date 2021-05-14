import {DataTable, propsCompose} from "../../../src/components";
import React from "react";


@propsCompose
export default class DuebillTradeTallyList extends React.Component {
    render() {
        let duebillId = this.props.duebillId||this.props.param.duebillId;
        return (
            <DataTable
                majorKey="tradeId"
                params={{duebillId}}
                dataFormId="obiz-DuebillTradeTallyList"
                showPagination={false}
                pageSize={0}
            />
        );
    }

}
