import React from "react";

import {DataTable, Button, Notify, Message, Tabs, Slider, Radio} from '../../../../src/components';

const TabPane = Tabs.TabPane;

export default class CustomizeSearchFilter extends React.Component {
    constructor(props) {
        super(props);
    }

    /**
     * 表格源数据（表头信息）加载完成后，调用
     * @param formList1
     */
    formReady1 = (formList1) => {
        this.formList1 = formList1;
        formList1.setFilterExpanded(true);
        formList1.setFilterValue({code: 'P1'});
        // formList1.setFilterValue("code",function(){return "P1"});

        //使用自定义组件设置生日搜索器
        formList1.setFilterItemTemplate('age', (filter) => {
            const marks = {
                10: '10',
                20: '20',
                30: {
                    style: {
                        color: '#f50',
                    },
                    label: <strong>30</strong>,
                },
                40: {
                    style: {
                        color: '#f50',
                    },
                    label: <strong>40</strong>,
                },
                50: '50',
                60: '60',
            };
            return (
                <div>
                    <h4>{filter.name}:</h4>
                    <Slider range marks={marks} defaultValue={[18, 36]} min={8} max={68}
                            onAfterChange={this.ageOnChange}/>
                </div>
            );
        });
        //使用自定义组件设置性别搜索
        formList1.setFilterItemTemplate('gender', (filter, dict) => {
            // console.log(filter,dict);
            return (
                <div>
                    <span style={{display: 'inline-block', width: '84px'}}>{filter.name}:</span>
                    <Radio.Group defaultValue="horizontal" onChange={this.genderOnChange}>
                        <Radio.Button value="1">男</Radio.Button>
                        <Radio.Button value="2">女</Radio.Button>
                        <Radio.Button value="0">未知性别</Radio.Button>
                    </Radio.Group>
                </div>
            );
        });
    };

    genderOnChange = (e) => {
        const genderValue = e.target.value;
        this.formList1.setFilterValue({'gender': genderValue}, () => {
            this.formList1.doSearch();
        });
    };

    ageOnChange = (value) => {
        console.log('age', value);
        this.formList1.setFilterValue({'age': value}, () => {
            this.formList1.doSearch();
        });
    };

    /**
     * 表格数据加载完成后，调用
     * @param dataList1
     */
    dataReady1 = (dataList1) => {

    };

    formReady2 = (formList2) => {
        this.formList2 = formList2;
        formList2.setFilterExpanded(true);
        formList2.setFilterFooterVisible(false);
        formList2.setFilterTemplate(() => {
            const marks = {
                10: '10',
                20: '20',
                30: {
                    style: {
                        color: '#f50',
                    },
                    label: <strong>30而立</strong>,
                },
                40: {
                    style: {
                        color: '#f50',
                    },
                    label: <strong>40不惑</strong>,
                },
                50: '50',
                60: '60',
            };


            return (
                <div style={{ width: '100%' }}>
                    <h4>年龄:</h4>
                    <Slider range marks={marks} defaultValue={[18, 36]} min={8} max={68}
                            onAfterChange={this.ageOnChange2}/>
                    <h4>性别:</h4>
                    <Radio.Group defaultValue="horizontal" onChange={this.genderOnChange2}>
                        <Radio.Button value="1">男</Radio.Button>
                        <Radio.Button value="2">女</Radio.Button>
                        <Radio.Button value="0">未知性别</Radio.Button>
                    </Radio.Group>
                </div>
            );
        })
    }
    /**
     * 表格数据加载完成后，调用
     * @param dataList2
     */
    dataReady2 = (dataList2) => {

    };

    ageOnChange2 = (value) => {
        this.formList2.setFilterValue({'age': value}, () => {
            this.formList2.doSearch();
        });
    };

    genderOnChange2 = (e) => {
        const genderValue = e.target.value;
        this.formList2.setFilterValue({'gender': genderValue}, () => {
            this.formList2.doSearch();
        });
    };


    render() {
        return (
            <Tabs defaultActiveKey="A" tabPosition={"left"}>
                <TabPane tab="修改单个过滤项" key="A">
                    <DataTable
                        dataFormId="demo-CustomizeFilterBeanPersonList"
                        dataReady={this.dataReady1}
                        formReady={this.formReady1}
                        requestData={false}
                    />
                </TabPane>
                <TabPane tab="整个过滤器重新定义" key="B">
                    <DataTable
                        dataFormId="demo-CustomizeFilterBeanPersonList"
                        dataReady={this.dataReady2}
                        formReady={this.formReady2}
                        requestData={false}
                    />
                </TabPane>
            </Tabs>
        );
    }
}