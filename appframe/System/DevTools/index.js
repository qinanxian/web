import React from 'react';
import {Icon, Notify, Divider, Message, Modal} from '../../../src/components';

export default class DevTools extends React.Component {


    _clearDataFormCache = () => {
        const {rest} = this.props;
        rest.post("/devtool/dataform/clearDataformCache")
            .then((res) => {
                if (null !== res) {
                    Message.info("清除模版缓存成功");
                }
            }).catch((res) => {
            Notify.error(res.message)
        });
    };


    _clearDictCache = () => {
        const {rest} = this.props;
        rest.post("/devtool/dict/clearDictCache")
            .then((res) => {
                if (null !== res) {
                    Message.info("清除数据字典缓存成功");
                }
            }).catch((res) => {
            Notify.error(res.message)
        });
    };


    _exportDataFormToJson = () => {
        const {rest} = this.props;
        rest.post("/devtool/dataform/dbTransferToJsonFile")
            .then((res) => {
                if (null !== res) {
                    Modal.info({
                        content: `导出成功，文件路径: ${res}`,
                    });
                }
            }).catch((res) => {
            Notify.error(res.message)
        });
    };

    _exportDictToJson = () => {
        const {rest} = this.props;
        rest.post("/devtool/dict/dbTransferFile")
            .then((res) => {
                if (null !== res) {
                    Modal.info({
                        content: `导出成功，文件路径: ${res}`,
                    });
                }
            }).catch((res) => {
            Notify.error(res.message)
        });
    };


    _importDictToDB = () => {
        const {rest} = this.props;
        rest.post("/devtool/dict/fileTransferDb")
            .then((res) => {
                if (null !== res) {
                    Modal.info({
                        content: `导入数据字典成功，导入数目: ${res}`,
                    });
                }
            }).catch((res) => {
            Notify.error(res.message)
        });
    };


    render() {
        return (
            <div>
                <Divider dashed>缓存处理</Divider>
                <ul>
                    <li onClick={() => this._clearDataFormCache()}><Icon type="laptop"/>&nbsp;<a>清空显示模板缓存</a></li>
                    <li onClick={() => this._clearDictCache()}><Icon type="laptop"/>&nbsp;<a>清空代码表缓存</a></li>
                </ul>
                <Divider dashed>导入</Divider>
                <ul>
                    <li onClick={() => this._importDictToDB()}><Icon type="profile"/>&nbsp;<a>数据字典导入</a></li>
                </ul>
                <Divider dashed>导出</Divider>
                <ul>
                    <li onClick={() => this._exportDataFormToJson()}><Icon type="profile"/>&nbsp;<a>显示模版导出</a></li>
                    <li onClick={() => this._exportDictToJson()}><Icon type="profile"/>&nbsp;<a>数据字典导出</a></li>
                </ul>
            </div>
        );
    }
}
