import React from 'react';
import {Button, Icon, Message, Divider, Menu, Row, Col} from '../../../../src/components';


export default class RofaceStarter extends React.Component {
    /**
     * 改变按钮为加载中状态，1秒之后复原
     */
    clickExec = () => {
    }

    render() {
        return (
            <div style={{margin: '15px'}}>
                <fieldset>
                    <legend>基础按钮</legend>
                    <div>
                        <Button onClick={this.clickExec}>默认按钮</Button>
                        <Divider type="vertical"/>
                        <Button type="primary">主要按钮</Button>
                        <Divider type="vertical"/>
                        <Button type="dashed">虚线按钮</Button>
                        <Divider type="vertical"/>
                        <Button type="danger">易冲动的按钮</Button>
                    </div>
                </fieldset>
            </div>

        );
    }
}

