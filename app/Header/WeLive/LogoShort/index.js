import React from 'react';
import {Icon,propsCompose} from 'roface';
import "./index.less"

@propsCompose
export default class LogoShort extends React.Component{

    handleHomeClick = () => {
        this.props.flexTabs.goToTab && this.props.flexTabs.goToTab();
    };

    render() {
        return (
            <React.Fragment>
                {/*<Icon className="we-logo-short-icon" onClick={this.handleHomeClick} type='fa-bank'/>*/}
                {/*<span className="we-logo-short-text">演示公司</span>*/}
                <div style={{paddingTop: '0px',overflow: 'hidden',height: '50px'}}>
                    <img src="asset/logo.png" style={{height: '50px'}} />
                </div>
            </React.Fragment>
        );
    }
}
