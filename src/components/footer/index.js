/**
 * Created by xgwen on 17/12/14.
 */
import React from 'react';
import { Layout } from 'antd';
import './index.less';

const { Footer } = Layout;

export default class RoFooter extends React.Component {
    render() {
        const footerText = this.props.footerText || `©2001-${new Date().getFullYear()}  苏州安硕数科数据技术有限公司`;
        return (
          <Footer className="footer">{footerText}</Footer>
        );
    }
}
