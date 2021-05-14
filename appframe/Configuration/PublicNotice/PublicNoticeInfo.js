import React from 'react';
import {DetailInfo, Message} from '../../../src/components';


export default class PublicNoticeInfo extends React.Component {
    constructor(props) {
        super(props);
    }


    formReady = (voinfo) => {
        this.voinfo = voinfo;

    };

    dataReady = (voinfo) => {
        this.voinfo = voinfo;

        Date.prototype.format = function (fmt) {
            var o = {
                "M+": this.getMonth() + 1,                 //月份
                "d+": this.getDate(),                    //日
                "h+": this.getHours(),                   //小时
                "m+": this.getMinutes(),                 //分
                "s+": this.getSeconds(),                 //秒
                "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                "S": this.getMilliseconds()             //毫秒
            };
            if (/(y+)/.test(fmt))
                fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt))
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        };

        if (this.props.operate == "add") {
            this.voinfo.setData({'publishTime': new Date().format("yyyy-MM-dd")});
            // this.voinfo.setData({'publishTime': this.formatTime(new Date().Format("yyyy-MM-dd"))});
            this.voinfo.setData({'status': this.props.statusDict[0].code});
        }
    };


    formatTime = (date) => {
        const year = date.getFullYear()
        const month = date.getMonth() + 1
        const day = date.getDate()
        const hour = date.getHours()
        const minute = date.getMinutes()
        const second = date.getSeconds()

        return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')

    }
    summarySave = (cb) => {
        this.voinfo.saveData((err, values) => {
            if (err) {
                Message.error('保存失败！');
            } else {
                const {refresh} = this.props;
                refresh && refresh();
            }
            cb(err, values);
        })
    };


    render() {
        return (
            <DetailInfo
                dataFormId="configuration-PublicNoticeInfo"
                params={{id: this.props.publicNoticeId}}
                formReady={this.formReady}
                dataReady={this.dataReady}
                reading={this.props.isReadOnly}
            />
        )
    }


}