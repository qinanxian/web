import React from 'react';
import {Row, Col, DetailInfo, Button, Message, Notify,rest} from '../../../../src/components';

export default class OrgInfo extends React.Component {
    constructor(props) {
        super(props);
        this.orgId = props.orgId;
        this.parentId = props.parentId;
    }

    dataReady = (voInfo) => {
        this.voInfo = voInfo;
        if (this.orgId) {
            this.voInfo.setItemVisible('id', true);
        }
        if(this.parentId){
          rest.get('/auth/admin/org/getOrgByOrgId/'+this.parentId)
            .then((data) => {
              this.voInfo.setValue("parentId",data.code)
              this.setState({
                sortCode:data.sortCode
              })
            });
        }
        this.voInfo.setItemOnChange('code',this.itemOnChange);
    };

    itemOnChange = (value) => {
        this.voInfo.setValue("id",value);
        this.voInfo.setValue("sortCode",this.state.sortCode+"/"+value);
    }

    orgInfoSave = (cb) => {
        this.voInfo.saveData((err, values) => {
            if (err) {
                Notify.error('保存失败！');
            } else {
                if (values.orgId) {
                    Notify.success("保存成功!");
                    // this.voInfo.refresh({orgId: this.orgId});
                    const {refresh} = this.props;
                    refresh && refresh();
                } else {
                    const {refresh} = this.props;
                    refresh && refresh();
                }
            }
            cb(err, values);
        });
    };

    infoSave = () => {
        this.voInfo.saveData((err, values) => {
            if (err) {
                Notify.error('保存失败！');
            } else {
                if (values.id) {
                    Notify.success("保存成功!");
                    this.voInfo.refresh({orgId: this.orgId});
                    const {refresh} = this.props;
                    refresh && refresh();
                } else {
                    const {refresh} = this.props;
                    refresh && refresh();
                }
            }
        });
    };

    render() {
        return (
            <div>
                <Row>
                    <Col span={24}>
                        <Button type='primary' style={{display: this.orgId ? '' : 'none'}} onClick={this.infoSave}>保存</Button>
                        <DetailInfo
                            dataFormId="system-OrgInfo"
                            dataReady={this.dataReady}
                            params={{orgId: this.orgId}}
                        />
                    </Col>
                </Row>
            </div>
        );
    }
}

