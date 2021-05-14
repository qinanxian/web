import React from "react";
import {Tabs,Iframe} from '../../../src/components';
import SortReport from "./SortReport";

export default class ReportForm extends React.Component {

  constructor(props) {
    super(props);
    this.tabsOptions = [
      {
        tab: '简单报表带按钮',
        key: 'simpleCase',
        content: <Iframe url="/ureport/preview?_u=innerfile:base_demo1.ureport.xml"/>
  },
    {
      tab: '简单报表不带按钮',
        key: 'simpleCase_copy',
      content: <Iframe url="/ureport/preview?_u=innerfile:base_demo1.ureport.xml&_t=0"/>
    },
    {
      tab: '分类报表',
        key: 'simpleCase2',
      content:<SortReport/>
      // content: <Iframe url="/ureport/preview?_u=innerfile:base_demo2.ureport.xml"/>
    },
    {
      tab: '交叉报表',
        key: 'simpleCase3',
      content: <Iframe url="/ureport/preview?_u=innerfile:base_demo3.ureport.xml"/>
    },
    {
      tab: '图形报表',
        key: 'chartCase',
      content: <Iframe url="/ureport/preview?_u=innerfile:demoPerson.ureport.xml"/>
    }
  ]
  }

  render() {
    return (
      <div>
        <Tabs options={this.tabsOptions}/>
      </div>);
}
}



