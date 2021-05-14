import React from "react";
import {
    DataTable,
    openModal,
    DetailInfo,
    Fieldset,
    Button,
    Icon,
    Dropdown, Menu, Upload, Modal, Message
} from '../../../src/components';

import ScheduleJobHistInfo from  './ScheduleJobHistInfo';
import ScheduleJobIdHistList from './ScheduleJobIdHistList';

export default class ScheduleJobHistList extends React.Component {
    static ScheduleJobHistInfo = ScheduleJobHistInfo;
    static ScheduleJobIdHistList = ScheduleJobIdHistList;

    constructor(props) {
        super(props);
    }

    formReady = (volist) => {
        this.volist = volist;
        this.volist.addButton([{
                name: '刷新',
                type: 'primary',
                onClick: this.tableRefresh,
                disabled:this.readonly
            }]);


    };

    dataReady = (volist) =>{
        this.volist = volist;

        this.volist.setColumnTemplate('id', (text, record, i) => {
            return (<a onClick={() => this.openInfo(record)}>{text}</a>);
        });

        this.volist.setColumnTemplate('result', (text, record, i) => {
            const appStatus = record.result || "";
            if (appStatus === "succeed") {
                return (<span style={{"color": "#008000"}}>{text}</span>);
            } else {
                return (<span style={{"color": "#DC143C","fontWeight": "bold"}}>{text}</span>);
            }
        });
    }

    tableRefresh = () => {
        this.volist.refresh();
    };

    openInfo = (row) => {
        const id = row?row.id:null;
        openModal(<ScheduleJobHistInfo />, {
            title: "任务运行历史详情",
            defaultButton: true,
            minWidth:'1000px',
            id:id,
            onOk: (modal, compnent,but) => {
                modal.close();
            },

        });
    };

    render() {
        return (
            <span>
                <DataTable
                    dataFormId="etl-ScheduleJobHistList"
                    dataReady={this.dataReady}
                    formReady={this.formReady}
                    pageSize={20}
                />
            </span>


    );
}
}


