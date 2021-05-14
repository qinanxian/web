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

export default class ScheduleJobIdHistList extends React.Component {
    static ScheduleJobHistInfo = ScheduleJobHistInfo;

    constructor(props) {
        super(props);
        const {jobId} = props.params;

        this.state = {
            jobId:jobId
        }
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
            minWidth:'895px',
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
                    dataFormId="etl-ScheduleJobIdHistList"
                    params={{jobId: this.state.jobId}}
                    dataReady={this.dataReady}
                    formReady={this.formReady}
                    pageSize={20}
                />
            </span>


        );
    }
}


