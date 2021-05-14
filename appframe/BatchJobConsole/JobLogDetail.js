import React from 'react';

import {rest, Message, Divider} from '../../src/components';

export default class JobLogDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            logText: ''
        }
    }

    componentDidMount() {
        // console.log(this.props.param);
        const {rest} = this.props;
        const {jobId} = this.props.param;

        rest.get(`/batch/logs/${jobId}`).then((ret) => {
            const logList = [];
            for (let i = 0; i < ret.length; i++) {
                let row = ret[i];
                var pad = "    ";
                let rowNo = "" + row.lineNumber;
                let rowNoText = pad.substring(0, pad.length - rowNo.length) + rowNo;
                let logDateTime = new Date(row.logTimestamp);
                let timeStamp = this.formatDate(logDateTime,'yyyy-MM-dd hh:mm:ss.S')
                let lineText = `${rowNoText}. [${timeStamp}] [${row.logLevel}] ${row.logMessage}`;
                logList.push(lineText);
            }
            this.setState({logText: logList.join('\r\n')});
        });
    }

    formatDate = (date, fmt) => { //author: meizz
        var o = {
            "M+": date.getMonth() + 1,                 //月份
            "d+": date.getDate(),                    //日
            "h+": date.getHours(),                   //小时
            "m+": date.getMinutes(),                 //分
            "s+": date.getSeconds(),                 //秒
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds()             //毫秒
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (let k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    }

    render() {
        return (<div>
            <div>
                <Divider dashed>日志</Divider>
                <div className='ro-develop-console-right-border'>
                    <pre className="ro-develop-console-right-bash">
                    {this.state.logText}
                    </pre>
                </div>
            </div>
        </div>);
    }

}