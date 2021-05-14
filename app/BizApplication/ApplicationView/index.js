import React from "react";
import {Col, Iframe, Row, Tabs} from "../../../src/components";
import ApplicationInfo from "./ApplicationInfo"
import Dossier from "../../../appframe/Common/Dossier"
import Formatdoc from "../../Common/Formatdoc"

export default class ApplicationView extends React.Component {
    static ApplicationInfo = ApplicationInfo;
    static Dossier = Dossier;

    constructor(props) {
        super(props);
        const {closeLoading, openLoading} = props;
        const {applicationId} = props.param;
        this.state = {
            tabsOptions: []
        };

        const {rest} = this.props;
        const tabsOptions = [];


        rest.get(`/application/policy/${applicationId}`)
            .then((applicationPolicy) => {
                tabsOptions.push({
                    tab: '申请信息',
                    key: 'applicationInfo',
                    content: <ApplicationInfo dataformId={applicationPolicy.dataformId} applicationId={applicationId}/>
                });

                //资料清单
                let {dossierId, inquireDocId} = applicationPolicy;
                let urlList = [];
                if (dossierId) urlList.push(`/common/dossier/byId/${dossierId}`);
                if (inquireDocId) urlList.push(`/common/dossier/byId/${inquireDocId}`);

                Promise.all(urlList.map((row,index,rowArrays) => {
                    return rest.get(row);
                })).then((rows) => {
                    // console.log('每一行',index,rows);
                    rows.forEach((row) => {
                        if(row.dossierType=='DOSSIER'){
                            tabsOptions.push({
                                tab: '影像材料',
                                key: 'dossier',
                                content: <Dossier dossierId={row.dossierId}/>
                            });
                        }
                        if(row.dossierType=='INQUIRE'){
                            tabsOptions.push({
                                tab: '调查报告',
                                key: 'inquire',
                                content: <Formatdoc {...this.props} formatdocId={row.dossierId} />
                            });
                        }
                    });
                }).finally(() => {
                    tabsOptions.push({
                        tab: '大数据征信报告',
                        key: 'third',
                        content: <Iframe {...this.props} offsetTop={175} allowNewWindow={true}
                                         url='http://cloud.enjoyqb.com:8888/h5/reportThree.html?applyId=CQ20181119095949921856229'/>
                    });
                    this.setState({tabsOptions: tabsOptions});
                });
            });

    }

    componentDidMount() {

    }


    render() {
        const {param} = this.props;
        return (
            <div>
                <Row>
                    <Col span={24}>
                        <Tabs type='line' style={{color: '#9fa1a3'}} options={this.state.tabsOptions}/>
                    </Col>
                </Row>
            </div>
        );
    }

}