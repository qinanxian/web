import React from 'react';

import {DetailInfo, Button, Upload, Message} from '../../../../src/components';

export default class DetailInfoFromExcel extends React.Component {
    formReady = (formInfo) => {
        this.formInfo = formInfo;
    };
    dataReady = (dataInfo) => {
        this.dataInfo = dataInfo;
    };


    downTemplateData = () => {
        const {rest} = this.props;
        rest.download('/showcase/DataListImportControllerDemo/downloadTemplate')
    };

    downloadTestDataInfo = () => {
        const {rest} = this.props;
        rest.download('/showcase/DataListImportControllerDemo/downloadTestDataInfo')
    };

    uploadTestDataCallback = (status,ret) => {
        // console.log(status);
        if(status === 'done'){
            const dataOne = ret.response;
            console.log(dataOne);
            this.dataInfo.setData(dataOne);
            Message.success('上传解析成功');
        }
    };

    render() {
        return (
            <div>
                <Button onClick={this.downTemplateData}>下载映射模板</Button>
                <Button onClick={this.downloadTestDataInfo}>下载案例数据</Button>
                <Upload
                    name={"导入"}
                    action={`/showcase/DataListImportControllerDemo/uploadParseDataInfo/DemoId001`}
                    onChange={this.uploadTestDataCallback}
                />

                <DetailInfo
                    params={{id: 0}}
                    buttonFixed={true}
                    dataFormId="demo-PersonSimpleInfo4Import"
                    formReady={this.formReady}
                    dataReady={this.dataReady}/>
            </div>
        );
    }
}

