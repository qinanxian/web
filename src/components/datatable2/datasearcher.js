 /**
 * Created by hjtu (hjtu@amarsoft.com) on 2018/1/3.
 */
 import React from 'react';
 import { Input, Icon } from 'antd';

 const enterButton = <span><Icon type="search" />&nbsp;搜索</span>;
 class DetailSearcher extends React.Component {
   render() {
     return (
       <Input.Search
         placeholder={this.props.placeholder}
         enterButton={enterButton}
         size="large"
         onSearch={this.props.onSearch} />
     );
   }
 }
 export default DetailSearcher;
