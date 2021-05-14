import React from 'react';
import {Icon,Divider,Spin} from 'roface';
import moment from 'moment';
import './style/index.less';

export default class  VersionNotice extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            dataSource:'',
            loading:true,
        };
    }
    componentDidMount(){
        this.getDataSource();
    }
    getDataSource(){
        this.props.rest.get(`/common/version/latest/`).then(ret => {
            this.setState({
                dataSource:ret,
                loading:false,
            });
        })
    }
    renderContentList(value){
        return (
            value && value.length > 0 ? value.map(item => {
                return (
                    <div key={item.versionChangeId} className='versionnotice-container-body-list'>
                        <span>[{item.changeCategory}]</span><span>{item.changeContent}</span>
                    </div>
                );
            })
                :
                null
        );
    }
    render() {
        const {dataSource,loading} = this.state;
        return (
            <div className='versionnotice-container'>
                <Spin spinning={loading}>
                    <div className='versionnotice-container-header'>
                        <span className='versionnotice-container-header-left'><Icon type='sound'/> 版本公告</span>
                        {/*<span className='versionnotice-container-header-right'>*/}
                            {/*<span>最核心最新版本：{dataSource.versionCode}</span>*/}
                            {/*<span>发布时间：{moment(dataSource.releaseTime).format('YYYY-MM-DD')}</span>*/}
                            {/*<span>下次发布时间：{moment(dataSource.nextReleaseTime).format('YYYY-MM-DD')}</span>*/}
                        {/*</span>*/}
                    </div>
                    <Divider className="versionnotice-container-divider"/>
                    <div className='versionnotice-container-instruction'>
                        <div><span>最核心最新版本：</span><span>{dataSource.versionCode}</span></div>
                        <div><span>发布时间：</span><span>{moment(dataSource.releaseTime).format('YYYY-MM-DD')}</span></div>
                        <div><span>下次发布时间：</span><span>{moment(dataSource.nextReleaseTime).format('YYYY-MM-DD')}</span></div>
                    </div>
                    <Divider dashed={true} className="versionnotice-container-dashed"/>
                    <div className='versionnotice-container-body'>
                        {this.renderContentList(dataSource.versionChanges)}
                    </div>
                </Spin>
            </div>
        );
    }
}