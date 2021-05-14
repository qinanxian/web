import React from 'react';
import {Button, Icon, Message, Divider,Slider,Radio, ListItem} from '../../../../src/components';


export default class ListItemCase extends React.Component {
    constructor(props) {
        super(props);
    }

    openPersonInfo = (row) => {
        const {flexTabs} = this.props;
        flexTabs.open(`${row.name}的详情`,'ShowCase/DataTable/BaseSimpleTable/PersonInfo',{personId:row.id});
    };

    ageOnChange = (value) => {
        this.dataList.setFilterValue({'age': value}, () => {
            this.dataList.doSearch();
        });
    };

    genderOnChange = (e) => {
        const genderValue = e.target.value;
        this.dataList.setFilterValue({'gender': genderValue}, () => {
            this.dataList.doSearch();
        });
    };

    buildFilter = (dataList) => {
        this.dataList = dataList;
        dataList.setFilterExpanded(false);
        dataList.setFilterFooterVisible(false);
        // volist.setFilterTemplate(() => {
        //     const marks = {
        //         10: '10',
        //         20: '20',
        //         30: {
        //             style: {
        //                 color: '#f50',
        //             },
        //             label: <strong>30</strong>,
        //         },
        //         40: {
        //             style: {
        //                 color: '#f50',
        //             },
        //             label: <strong>40</strong>,
        //         },
        //         50: '50',
        //         60: '60',
        //     };


        //     return (
        //         <div style={{width:'100%'}}>
        //             <h4>年龄:</h4>
        //             <Slider range marks={marks} defaultValue={[18, 36]} min={8} max={68}
        //                     onAfterChange={this.ageOnChange}/>
        //             <h4>性别:</h4>
        //             <Radio.Group defaultValue="horizontal" onChange={this.genderOnChange}>
        //                 <Radio.Button value="1">男</Radio.Button>
        //                 <Radio.Button value="2">女</Radio.Button>
        //                 <Radio.Button value="0">未知性别</Radio.Button>
        //             </Radio.Group>
        //         </div>);
        // })
    };
    buildRowTemplate = (dataList) => {
      dataList.setRowTemplate((paginationData,row)=>{
            const dictItem = dataList.getDictItem('gender',row.gender);
            const genderName = (dictItem && dictItem.name) || '';

            const columnMeta = dataList.getColumnMeta('gender');
            const columnName = (columnMeta && columnMeta.name )||'';

            const columnMeta1 = dataList.getColumnMeta('birth');
            const columnName1 = (columnMeta1 && columnMeta1.name )||'';

            return (<div>
                <h4><a onClick={() => this.openPersonInfo(row)}>{row.name}</a><sub>{row.code}</sub></h4>
                <span>{columnName}:{genderName}</span>&nbsp;&nbsp;<span>{columnName1}:{row.birth}</span>
            </div>)
        });
    };

    dataReady = (dataList) => {
        this.buildFilter(dataList);
        this.buildRowTemplate(dataList);
    };

    render() {
        return (
            <div>
                <ListItem
                    dataFormId="demo-CustomizeFilterBeanPersonList"
                    dataReady={this.dataReady}
                />
            </div>
        );
    }
}
