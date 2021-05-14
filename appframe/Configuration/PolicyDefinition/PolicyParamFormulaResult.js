import React from 'react';

import {Message,Spin} from '../../../src/components';
import * as rest from '../../../src/lib/rest';

export default class PolicyParamFormulaResult extends React.Component{

    constructor(props) {
        super(props);
        this.policyDefinitionData = props.policyDefinitionData;

        this.state = {
            resultData: [],
            loading:true,
        };
        this.getPolicyParam();
    };

    getPolicyParam = () =>  {
        //const {openLoading, closeLoading,rest} = this.props;
        //openLoading();
        this.props.rest.post('/policy/mockTest',this.policyDefinitionData).then((res) => {
            if (res) {
                //closeLoading && closeLoading();
                this.setState({resultData: res},() => {
                    this.setState({
                        loading:false,
                    })
                });
            }
        });
    };

    showResult = () => {
        const { resultData } = this.state;
        let result;
        if (resultData.length > 0) {
            result =  resultData.map((item,index) =>
                    <tr key={index}>
                        <td>{item.paramCode}</td>
                        <td>{item.paramName}</td>
                        <td>{item.valueExpr}</td>
                        <td>{item.expressionValue}</td>
                    </tr>
            );
        }
        return result;
    };

    render() {
        return (
            <Spin spinning={this.state.loading}>
                <table border="1" style={{width:'100%',border:'1px solid #ccc',textAlign:'center'}}>
                    <thead>
                        <tr>
                          <th key='paramCode' style={{background:'#eaeaea'}}>参数代码</th>
                          <th key='paramName' style={{background:'#eaeaea'}}>参数名称</th>
                          <th key='expression' style={{background:'#eaeaea'}}>表达式</th>
                          <th key='expressionValue' style={{background:'#eaeaea'}}>值</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.showResult()}
                    </tbody>
                </table>
            </Spin>
        );
    };


}