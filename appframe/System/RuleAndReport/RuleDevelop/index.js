import React from "react";
import {rest,Iframe} from "roface";

export default class RuleDevelop extends React.Component {

    render() {
        return (<Iframe url={rest.getRequestURL('/urule/frame')}></Iframe>);
    }
}