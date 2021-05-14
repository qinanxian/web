import React from "react";

import {Row, Col, Tabs} from '../../../../src/components';
import ParamItemList from "./ParamItemList";
import ParamInfo from "./ParamInfo";

export default class ParamTab extends React.Component {

    render() {
        const {paramCode, rest} = this.props;
        const tabsOptions = [
            {
                tab: '参数条目',
                key: "paramItemList",
                content: <ParamItemList {...this.props} paramCode={paramCode}/>
            },
            {
                tab: '基本信息',
                key: "paramInfo",
                content: <ParamInfo paramCode={paramCode}/>
            }
        ]
        return (
            <div>
                <Tabs options={tabsOptions}/>
            </div>
        );
    }
}