import React from 'react';

import {Button, DataTable, DetailInfo, Notify} from '../../../src/components';

export default class LactLoanInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}

    }


    componentDidMount(){
        this.setState({lactLoanId:this.props.lactLoanId||this.props.param.lactLoanId});
    }

    listFormReady = (voList) => {
        this.voList = voList;
        // this.voList.addTemplate([
        //     <Button type="primary"
        //             icon={'fa-calculator'}
        //             onClick={this.exeCalc}
        //     >计算</Button>
        // ])
    };

    listDataReady = (voList) => {
        this.voList = voList;
    };



    formReady = (voInfo) => {
        this.voInfo = voInfo;
        this.voInfo.setGroupTemplate('30', <DataTable
            dataFormId="obiz-LacPaymentScheduleList"
            params={{loanId: this.state.lactLoanId}}
            formReady={this.listFormReady}
            dataReady={this.listDataReady}
            showPagination={false}
            pageSize={0}
            size={'small'}
        />);
    }

    dataReady = () => {
        this.props.doneCallback&&this.props.doneCallback();
    }

    refreshMe = () => {
        this.voInfo.refresh();
        this.voList.refresh();
    }


    saveInfo = () => {
        this.voInfo.saveData((err, values) => {
            if (err) {
                Notify.error({
                    message: '保存失败',
                });
            } else {
            }
        });
    }

    render() {
        return (
            <DetailInfo dataFormId="obiz-LacLoanInfo" formReady={this.formReady} dataReady={this.dataReady} params={{loanId:this.state.lactLoanId}} reading={true}/>
        );
    }
}

