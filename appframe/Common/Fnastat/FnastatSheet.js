import React from 'react';
import ReactDom from 'react-dom';
import './fnastat-sheet.css';
import {
    propsCompose,
    Currency,
    Notify,
    Text,
    TextArea,
    NumberInput,
    Button,
    Spin,
    Upload,
    Icon,
    Download, Message
} from '../../../src/components';

/**
 * Created by dswang on 2018/3/13.
 */

@propsCompose
export default class FnastatSheet extends React.Component {

    constructor(props) {
        super(props);
        this.fnastat = this.props.fnastat;
        console.log(this.fnastat);
        this.parseHeaderObject();
        this.colspan={};
        this.state = {
            loading: false,
            subjects: this.fnastat.subjects,
        }
    }

    dataChange = (value, rowIndex, columnIndex) => {
        if(typeof(value) != 'object'){
            this.state.subjects[rowIndex].values[columnIndex] = value;
            this.setState({subjects: this.state.subjects});
        }
    }

    parseColumnExpr = (expr) =>{
        let c = expr.split(';');
        let numberRegexp = /D(\d+)/, stringRegexp = /S(\d+)/;
        let nr = c[1].match(numberRegexp), sr = c[1].match(stringRegexp);
        let idx = -1;
        let type = 'S';
        let style = null;
        if (nr != null) {
            idx = parseInt(nr[1]);//取匹配到的分组1
            type = 'D';
        }
        if (sr != null) {
            idx = parseInt(sr[1]);//取匹配到的分组1
            type = 'S';
        }

        return {'id': c[1], 'name': c[0], 'index': idx, 'type': type, 'editor': c[2]};
    }
    parseSubjectHeader = (expr) => {
        const columns = expr.split("|");
        return columns.map((colExpr,index)=>{
            return this.parseColumnExpr(colExpr);
        });
    }

    parseHeaderObject = () => {
        this.fnastat.columnObjects = [];
        for (let i = 0; i < this.fnastat.columns.length; i++) {
            this.fnastat.columnObjects.push(this.parseColumnExpr(this.fnastat.columns[i]));
        }
    }


    getHeader = () => {
        return this.fnastat.columnObjects.map((item, index) => {
            return (
                <th key={index}><span>{item.name}</span></th>
            )
        })
    }

    getSubjectRows = () => {
        return this.state.subjects.map((subject, index) => {
            const reading = subject.style && subject.style.indexOf('readonly:true') >= 0;
            const className = reading ? 'reading-row' : '';
            return (
                <tr key={index} className={className}>
                    <td>
                        <pre>{subject.name}</pre>
                    </td>
                    {this.getSubjectRow(subject, index)}
                </tr>
            )
        })
    }

    getSubjectRow = (subject, rowIndex) => {
        const values = subject.values;
        const reading = subject.style && subject.style.indexOf('readonly:true') >= 0;
        const dataColumns = subject.dataColumns;  //单独针对一行配置了列属性
        let rowColumnObject;
        if(dataColumns){
            rowColumnObject = this.parseSubjectHeader(dataColumns);
        }
        let preColIndex = -1;
        return values.map((v, vIndex) => {
            const columnObjects = rowColumnObject || this.fnastat.columnObjects;
            const colIdx = vIndex + 1;
            this.colspan[`${rowIndex}-${colIdx}`]=1;
            if(colIdx > columnObjects.length-1){
                if(preColIndex>-1){
                    // console.log('colspan',this.colspan[`${rowIndex}-${preColIndex}`],subject);
                    this.colspan[`${rowIndex}-${preColIndex}`] += 1;  //处理后一个单元格没内容时，前一个单元格自动占用
                }
                return '';
            }
            const colObj = columnObjects[colIdx];

            let content = v;
            if(!colObj||!colObj.editor){
                console.warn('rowIndex:',rowIndex,'col:',colIdx,subject);
                return;
            }
            switch (colObj.editor) {
                case 'LAB':
                    content = colObj.type == 'D' ? (v ? Number(v).toFixed(2) : 0.00) : v;
                    break;
                case 'CCY':
                    content = <Currency
                        value={v} decimalDigits={2}
                        onBlur={(value) => this.dataChange(value, rowIndex, vIndex)}
                        reading={reading}
                    />
                    break;
                case 'INPUT':
                    content = <Text value={v} onBlur={(value) => this.dataChange(value, rowIndex, vIndex)} valuenullholder={' '} reading={reading}/>;
                    break;
                case 'TXT':
                    // content = <TextArea value={v} onBlur={(value) => this.dataChange(value, rowIndex, vIndex)}  reading={reading}/>;
                    content = <Text value={v} onBlur={(value) => this.dataChange(value, rowIndex, vIndex)}  reading={reading}/>;
                    break;
                case 'INT':
                    content = <NumberInput
                        value={v}
                        onBlur={(value) => this.dataChange(value, rowIndex, vIndex)}
                        reading={reading}/>;
                    break;
                case 'NULL':
                    content = <span className="null-holder">&nbsp;</span>;
                    break;
                default:
            }
            preColIndex = colIdx;
            return <td key={vIndex}  id={`C${rowIndex}-${colIdx}`}>{content}</td>
        })
    }

    saveFnastat = () => {
        this.fnastat.subjects = this.state.subjects;
        this.state.loading = true;
        this.setState(this.state);
        const {rest} = this.props;
        rest.post('/common/Fnastat/saveFsSubjectAndCalc', this.fnastat).then(res => {
            if (res) {
                this.state.subjects = res.fnastat.subjects;
                this.state.loading = false;
                this.setState(this.state);
            }
        });
    }
    downloadData = () => {
        const {rest} = this.props;
        const fnastatId = this.fnastat.id;
        rest.download(`/common/Fnastat/downloadFnastatData`,'get',{'fnastatId':fnastatId});

    }
    downloadTemplate = () => {
        const {rest} = this.props;
        const defId = this.fnastat.definitionId;
        const bookId = this.fnastat.objectNo;
        rest.download(`/common/Fnastat/downloadFnastatTemplate`,'get',{'fnstatDefId':defId,'bookId':bookId});
    }

    uploadCallback = (status,ret) => {
        console.log(ret);
        if(status === 'done'){
            this.state.subjects = ret.response.subjects;
            this.setState(this.state);
        }
        if(status === 'error'){
            Notify.error({
                message: ret.response.message
            });
        }
    }

    componentDidMount(){
        const dom = ReactDom.findDOMNode(this);
        const {rest} = this.props;
        for(const k in this.colspan){
            const v = this.colspan[k];
            if(v > 1){
                const domId = `C${k}`;
                const cell = rest.jQuery(`#${domId}`,dom);
                cell.attr("colspan",v);
            }
        }
    }


    render() {
        const {loading} = this.state;
        return (
            loading ? (
                <div style={{textAlign: 'center'}}>
                    <Spin
                        spinning={loading}
                        tip="正在计算,请稍后..."
                    />
                </div>
            ) : (
                <div className='fnastat-btn-bar'>
                    {
                        this.fnastat.unifiedCode != 'Indicator' ? (
                            <div>
                                <Button onClick={this.saveFnastat} type={"success"} icon={"fa-save"}>保存</Button>
                                <Button onClick={this.downloadData} type={"primary"} icon={"fa-file-excel-o"}>下载数据</Button>
                                <Button onClick={this.downloadTemplate} type={"default"} icon={"fa-wheelchair"}>下载模板</Button>
                                <Upload
                                    name={"导入EXCEL"}
                                    action={`/common/Fnastat/importFnastatData?fnastatId=${this.fnastat.id}`}
                                    onChange={this.uploadCallback}
                                />
                            </div>
                        ) : (
                            <div>
                                <Button onClick={this.saveFnastat}>计算数据</Button>
                            </div>
                        )}
                    <div className="fnastat-sheet">
                        <table className="fnastat-sheet-table">
                            <thead>
                            <tr>{this.getHeader()}</tr>
                            </thead>
                            <tbody>
                            {this.getSubjectRows()}
                            </tbody>
                        </table>
                    </div>
                </div>
            )
        )
    }
}

