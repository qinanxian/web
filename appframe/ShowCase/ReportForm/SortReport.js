/**
 * Created by dswang (dswang@amarsoft.com) on 2018/7/28.
 */
import React from "react";
import {Iframe,Input,Button} from '../../../src/components';
import "./reportForm.css";
import $ from 'jquery';

export default class SortReport extends React.Component {

  constructor(props) {
    super(props);
    this.state={
      report: <Iframe key="/ureport/preview?_u=innerfile:base_demo2.ureport.xml" url="/ureport/preview?_u=innerfile:base_demo2.ureport.xml"/>
    }
  }


  _searchOnclick = ()=>{
    let eduName = $("#search-input").val();
    let s_url = "/ureport/preview?_u=innerfile:base_demo2.ureport.xml&eduName="+eduName;
    this.setState({report: <Iframe key={s_url} url={s_url}/>});
  }

  render() {
    return (
      <div>
        <div id="search-area">
          <Input id="search-input" placeholder="按学历搜索"/>
          <Button id="rep-search-btn" type={'primary'} onClick={this._searchOnclick}>搜索</Button>
        </div>
        {this.state.report}
      </div>);
  }
}



