import React from 'react';
import {GroupDataTable, Upload, Download, propsCompose, Notify} from '../../../../src/components';


@propsCompose
export default class GroupDataTableCase extends React.Component {
    /**
     * 表格模版加载完成后，调用
     * @param formList
     */
    formReady = (formList) => {
        this.formList = formList;
        this.formList.setColumnTemplate('operator', (text, record, i) => {
            const operate = (<div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around'}}>
                <Upload
                    style={{whiteSpace: 'nowrap', margin: '2px'}}
                    action={`/showcase/FileOperateController/updatePersonFile/${record.id}/${record.fileId}`}
                    onChange={this.uploadChange}
                    name={"上传"}
                    buttonType={'a'}
                />
                <Download
                    style={{whiteSpace: 'nowrap', margin: '2px'}}
                    action={`/showcase/FileOperateController/downloadPersonFile/${record.fileId}`}
                    onChange={this.uploadChange}
                    name={"下载"}
                    buttonType={'a'}
                />
            </div>);

            if (['16', '18', '38'].indexOf(record.id) >= 0) {
                return <span></span>;
            }

            return operate;
        });
    };

    uploadChange = (fileStatus) => {
        if (fileStatus === "done"){
            Notify.info('上传成功');
            this.formList.refresh();
        }else if(fileStatus === "uploading"){

        } else {
            Notify.info('上传失败');
        }

    };

    /**
     *
     * @param volist volist组件
     * @param dataList 当前页所有数据列表
     * @param subList 分组数据列表
     * @returns {string}
     */
    formatGroupName = (volist, dataList, subList) => {
        //根据代码表值，取代代码表标签，并设置为分组名称
        let groupName = "未分组";
        const gender = subList[0].gender;
        const dicts = this.formList.getColumnDict('gender');

        for (let i = 0; i < dicts.length; i++) {
            const item = dicts[i];
            if (item.code == gender) {
                groupName = item.name;
            }
        }

        let groupHeader = <span>未分组</span>

        if (groupName) {
            groupHeader = <span>{groupName}<i style={{color: '#F00'}}>({subList.length})</i></span>;
        }
        return groupHeader;
    };

    render() {
        return (
            <GroupDataTable
                dataFormId="demo-PersonListFile"
                params={{code: 'BeanPersonList'}}
                formReady={this.formReady}
                groupIdField={"gender"}
                // groupName={"groupName"}
                // defaultOpenKeys={['START_PROJECT_REPORT', '__ungroup']}
                groupName={this.formatGroupName}
                defaultOpenAllKeys={true}
                closePagination={true}
                pageSize={999}
            />

        );
    }
}

