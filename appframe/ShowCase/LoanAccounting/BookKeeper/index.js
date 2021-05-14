import React from 'react';
import {Tabs} from '../../../../src/components';
import FiscEventTriggerTab from './FiscEventTriggerTab';
import EventLogList from './EventLogList';
import BookList from './BookList';
import VoucherList from './VoucherList';

export default class BookKeeperTab extends React.Component {
    static VoucherList = VoucherList;
    constructor(props) {
        super();
        const {param} = props;
        this.state = {
            planName: null
        };
        this.tabsOptions = [
            {
                tab: '会计事件触发',
                key: 'investPlanInfo',
                content: <FiscEventTriggerTab/>
            },
            {
                tab: '事件日志',
                key: 'roleToPrivilegeList',
                content: <EventLogList/>
            },
            {
                tab: '账套数据',
                key: 'financialInformation',
                content: <BookList/>
            }
        ]
    }

    dataReady = (voinfo) => {
        this.voinfo = voinfo;
    };

    render() {
        return (
            <div>
                <Tabs type='line' style={{ color: '#9fa1a3' }} options={this.tabsOptions}/>
            </div>
        );
    }
}

