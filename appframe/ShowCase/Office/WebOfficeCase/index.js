import React from 'react';
import {
    Button, Icon, Message, Divider, Fieldset, Row, Col, Iframe, rest, weboffice,
    propsCompose
} from '../../../../src/components';
import './index.css';
import ntkoBrowser from './ntko-background-min';


@propsCompose
export default class WebOfficeCase extends React.Component {
    /**
     * 改变按钮为加载中状态，1秒之后复原
     */
    componentDidMount(){
      this.ntkoEle = document.getElementById('ntko')
    }
    clickExec = () => {

    }

    checkInstall = () => {
        // weboffice.openInstall();
        window.POBrowser.openWindowModeless('about:blank','width=1200px;height=800px;');
        // window.POBrowser.openWindowModeless('http://192.168.64.74:8080/amix/showcase/pageoffice/C10WordViewTooSimple?opener=杨小安','width=1200px;height=800px;');

    }
    officeOpen = (url, style) => {
        //http://127.0.0.1:8080/amix/showcase/pageoffice/word
        ///amix/showcase/pageoffice/word1
        // POBrowser.openWindowModeless('http://127.0.0.1:8080/amix/showcase/pageoffice/word', 'width=1200px;height=800px;');
        // weboffice.open('/showcase/pageoffice/word', 'width=1200px;height=800px;');
        //weboffice.open('/showcase/pageoffice/word');
        //http://127.0.0.1:8080/amix/showcase/pageoffice/word
        //PageOffice://|http://_REPLACE_|||
        //window.open('pageoffice://|http://127.0.0.1:8080/amix/showcase/pageoffice/word||DlELURlHBUwPQnNAdzV7QX9DCjEINHoyfTcKQ3k0CkF7NnhAe0R5NwoudzkmYyNjI2ArcHNkF2o5Y3E=|','_self');
        //window.open('PageOffice://|http://127.0.0.1:8080/amix/showcase/pageoffice/word|||','_self');
        const openURL = rest.getRequestURL(url);
        weboffice.open(openURL, style);
    }


    ntkoOpen = (url) => {
      const openURL = rest.getRequestURL(url);
      ntkoBrowser.openWindow(openURL);
    }

    pdfOpen = (title, url, param) => {
        const {flexTabs} = this.props;
        //'ShowCase/Office/PDFViewerCase'
        flexTabs.open(title, url, param);
    }
    render() {
        return (
            <div>
                <Row gutter={10}>
                    <Col span={18}>
                        <div className={'flex-container'}>
                            <div className={'flex-item'}>
                                <Fieldset legend="简单用法">
                                    <ul>
                                        <li><a
                                            onClick={() => this.officeOpen('/showcase/pageoffice/C10WordViewTooSimple?opener=杨小安')}>简单查看</a>
                                        </li>
                                        <li><a
                                            onClick={() => this.officeOpen('/showcase/pageoffice/C10WordViewTooSimpleReadOnly', 'width=1200px;height=800px;')}>简单查看(只读）</a>
                                        </li>

                                        <li><a
                                            onClick={() => this.officeOpen('/showcase/pageoffice/C11WordToolBar')}>工具栏图标</a>
                                        </li>
                                        <li><a
                                            onClick={() => this.officeOpen('/showcase/pageoffice/C13WordEditAndSave')}>编辑并保存（带业务参数）</a>
                                        </li>

                                        <li><a
                                            onClick={() => this.officeOpen('/showcase/pageoffice/C14ServerMakeWaterMark')}>打水印</a>
                                        </li>
                                        <li><a
                                            onClick={() => this.officeOpen('/showcase/pageoffice/C13WordLocalSaveAndOpen')}>打开或保存到本地</a>
                                        </li>
                                        <li><a
                                            onClick={() => this.officeOpen('/showcase/pageoffice/C15ApachePOIWord')}>打开由POI生成的文档</a>
                                        </li>
                                        <li><a
                                            onClick={() => this.officeOpen('/showcase/pageoffice/C16Blank?banner=参数值1')}>使用插件打开IE浏览器</a>
                                        </li>
                                        <li><a
                                            onClick={() => this.ntkoOpen('/showcase/ntko/NtkoC10WordViewTooSimpleReadOnly')}>NTKO简单查看(只读）</a>
                                        </li>
                                        <li><a
                                            onClick={() => this.ntkoOpen('/showcase/ntko/NtkoC13OpenLocal')}>NTKO打开或保存到本地</a>
                                        </li>
                                        <li><a
                                            onClick={() => this.ntkoOpen('/showcase/ntko/NtkoC13WordEditAndSave')}>NTKO编辑并保存（带业务参数）</a>
                                        </li>
                                        <li><a
                                            onClick={() => this.ntkoOpen('/showcase/ntko/NtkoD20TextWaterMark')}>NTKO打水印</a>
                                        </li>
                                        <li><a
                                            onClick={() => this.ntkoOpen('/showcase/ntko/NtkoTwoWord')}>NTKO打开两个文档比对</a>
                                        </li>
                                    </ul>
                                </Fieldset>
                            </div>
                            <div className={'flex-item'}>
                                <Fieldset legend="数据集成">
                                    <ul>
                                        <li><a
                                            onClick={() => this.officeOpen('/showcase/pageoffice/C20WordFillTooSimple')}>简单数据填充</a>
                                        </li>
                                        <li><a
                                            onClick={() => this.officeOpen('/showcase/pageoffice/C23WordViewTooSimpleTpl')}>数据自动填充+部分编辑</a>
                                        </li>
                                        <li><a
                                            onClick={() => this.officeOpen('/showcase/pageoffice/C26WordFillAndDataFetch')}>编辑+数据分离到后台处理</a>
                                        </li>
                                        <li><a
                                            onClick={() => this.officeOpen('/showcase/pageoffice/C27WordMergeMain')}>多个文档合并到一起</a>
                                        </li>
                                        <li><a
                                            onClick={() => this.officeOpen('/showcase/pageoffice/C28TaoHong')}>文件套红</a>
                                        </li>
                                        <li><a
                                            onClick={() => this.pdfOpen('显示PDF', 'ShowCase/Office/PDFViewerCase', {url: rest.getRequestURL('/showcase/pageoffice/C28ServerTaoHong')})}>文件套红(后端)</a>
                                        </li>
                                    </ul>
                                </Fieldset>
                            </div>
                            <div className={'flex-item'}>
                                <Fieldset legend="导入及对比">
                                    <ul>
                                        <li><a
                                            onClick={() => this.officeOpen('/showcase/pageoffice/C30WordCompare')}>文件对比</a>
                                        </li>
                                        <li><a
                                            onClick={() => this.officeOpen('/showcase/pageoffice/C40WordImport')}>导入离线</a>
                                        </li>
                                        <li><a
                                            onClick={() => this.officeOpen('/showcase/pageoffice/C60ExcelEditAndSave')}>打开并编辑EXCEL</a>
                                        </li>
                                    </ul>
                                </Fieldset>
                            </div>
                            <div className={'flex-item'}>
                                <Fieldset legend="审计及清稿">
                                    <ul>
                                        <li><a
                                            onClick={() => this.officeOpen('/showcase/pageoffice/C50RevisionModelEdit')}>修订模式-用户1</a>
                                        </li>
                                        <li><a
                                            onClick={() => this.officeOpen('/showcase/pageoffice/C50RevisionModelEdit1')}>修订模式-用户2</a>
                                        </li>
                                        <li><a
                                            onClick={() => this.officeOpen('/showcase/pageoffice/C51Finalise')}>清稿定稿</a>
                                        </li>
                                        <li><a
                                            onClick={() => this.officeOpen('/showcase/pageoffice/C56WordTwoDocs')}>同时打开两个文档</a>
                                        </li>
                                        <li><a
                                            onClick={() => this.officeOpen('/showcase/pageoffice/C56WordTwoDocsInIframe')}>同时打开两个文档-IFRAME</a>
                                        </li>
                                    </ul>
                                </Fieldset>
                            </div>
                            <div className={'flex-item'}>
                                <Fieldset legend="PDF">
                                    <ul>
                                        <li><a
                                            onClick={() => this.pdfOpen('显示PDF', 'ShowCase/Office/PDFViewerCase', {url: rest.getRequestURL('/showcase/pageoffice/show/CASE-D61.pdf')})}>直接打开PDF</a>
                                        </li>
                                        <li><a
                                            onClick={() => this.pdfOpen('显示PDF', 'ShowCase/Office/PDFViewerCase', {url: rest.getRequestURL('/showcase/pageoffice/showWord2PDF')})}>WORD实时转为PDF</a>
                                        </li>
                                        <li><a
                                            onClick={() => this.pdfOpen('显示PDF', 'ShowCase/Office/PDFViewerCase', {url: rest.getRequestURL('/showcase/pageoffice/showWord2PDFWithWaterMark')})}>WORD实时转为PDF加水印</a>
                                        </li>
                                    </ul>
                                </Fieldset>
                            </div>
                        </div>
                    </Col>
                    <Col span={6}>
                        <div style={{'padding':'10px'}}>
                            <Button onClick={() => this.checkInstall()} icon={"fa-download"} type={"warning"}>下载Office控件</Button>
                        </div>
                        <Iframe url={rest.getRequestURL('/office/pageoffice/static/poserver.zz')}/>
                    </Col>
                </Row>
              <div id='ntko'></div>
            </div>
        );
    }
}

