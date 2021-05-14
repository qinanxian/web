import React from 'react';
import {Row, Col, Slider} from '../../../../src/components';
import './index.css';

export default class GridLayout extends React.Component {
    gutters = {};
    colCounts = {};

    constructor() {
        super();
        this.state = {
            gutterKey: 1,
            colCountKey: 2,
        };
        [0, 10, 20, 30, 40, 50, 60].forEach((value, i) => {
            this.gutters[i] = value;
        });
        [2, 3, 4, 6, 8, 12].forEach((value, i) => {
            this.colCounts[i] = value;
        });
    }

    onGutterChange = (gutterKey) => {
        this.setState({gutterKey});
    }
    onColCountChange = (colCountKey) => {
        this.setState({colCountKey});
    }

    render() {
        const {gutterKey, colCountKey} = this.state;
        const cols = [];
        const colCount = this.colCounts[colCountKey];
        let colCode = '';
        for (let i = 0; i < colCount; i++) {
            cols.push(
                <Col key={i.toString()} span={24 / colCount}>
                    <div>第{i + 1}栏</div>
                </Col>
            );
            colCode += `  <Col span={${24 / colCount}} />\n`;
        }
        return (
            <div>
                <div style={{marginBottom: 16}}>
                    <span style={{marginRight: 6}}>间距 (px): </span>
                    <div style={{width: '50%'}}>
                        <Slider
                            min={0}
                            max={Object.keys(this.gutters).length - 1}
                            value={gutterKey}
                            onChange={this.onGutterChange}
                            marks={this.gutters}
                            step={null}
                        />
                    </div>
                    <span style={{marginRight: 6}}>栏位数:</span>
                    <div style={{width: '50%'}}>
                        <Slider
                            min={0}
                            max={Object.keys(this.colCounts).length - 1}
                            value={colCountKey}
                            onChange={this.onColCountChange}
                            marks={this.colCounts}
                            step={null}
                        />
                    </div>
                </div>


                <div id="components-grid-demo-playground">
                    <Row gutter={this.gutters[gutterKey]}>{cols}</Row>
                    <pre>{`<Row gutter={${this.gutters[gutterKey]}}>\n${colCode}</Row>`}</pre>
                </div>
            </div>
        );
    }
}
