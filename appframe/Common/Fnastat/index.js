import React from 'react';
import {Row, Col, Tabs,Button} from '../../../src/components/index';
import FnastatSheet from './FnastatSheet';
import './style.css';
/**
 * Created by dswang on 2018/3/13.
 */
export default class FnastatBook extends React.Component {
    constructor(props) {
        super(props);
        const{param} = this.props;
        this.bookId=param.bookId;
        this.state={
            tabsOptions : []
        }

    }


    componentDidMount(){
        const { rest } = this.props;
        rest.get('/common/Fnastat/getBook?bookId='+this.bookId).then(data =>{
            // console.error("this is eror");
            const {fnastats} = data;
            const tabsOptions = [];
            //取出tab
            fnastats.forEach(fnastat => {
                let arr = {tab:fnastat.name,key:fnastat.unifiedCode,content:<FnastatSheet fnastat={fnastat}/>};
                tabsOptions.push(arr);
            });
            this.setState({tabsOptions:tabsOptions});
        });
    }



    render() {
        return (
            <div>
                <Row>
                    <Col span={24}>
                        <Tabs options={this.state.tabsOptions}/>
                    </Col>
                </Row>
            </div>
        );
    }
}

