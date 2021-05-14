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
                <Icon className="szc-logo-short-icon" onClick={this.handleHomeClick} type='roic-amix'/>
                <span className="szc-logo-short-text">安硕数科</span>
            </React.Fragment>
        );
    }
}
