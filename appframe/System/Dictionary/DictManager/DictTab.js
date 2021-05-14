import React from "react";

import {Row, Col, Tabs} from '../../../../src/components';
import DictItemList from "./DictItemList";
import DictInfo from "./DictInfo";

export default class DictTab extends React.Component {

    render() {
        const {dictCode, rest} = this.props;
        const tabsOptions = [
            {
                tab: '字典条目',
                key: "dictItemList",
                content: <DictItemList {...this.props} dictCode={dictCode}/>
            },
            {
                tab: '基本信息',
                key: "dictInfo",
                content: <DictInfo {...this.props} dictCode={dictCode}/>
            }
        ]
        return (
            <div>
                <Tabs options={tabsOptions}/>
            </div>
        );
    }
}