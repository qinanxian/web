import React from 'react';
import { Charts } from 'roface';
const { Chart, Geom, Axis, Tooltip } = Charts;

export default class OrgPer extends React.Component{
    render(){
        const data = [
            {
                grade: "第一",
                orgper: 10000
            },
            {
                grade: "第二",
                orgper: 30000
            },
            {
                grade: "第三",
                orgper: 20000
            }
        ];
        const cols = {
            orgper: {
                tickInterval: 10000
            }
        };
        const { prefix = 'ro' } = this.props;
        return (
            <div className={`${prefix}-orgper ${prefix}-block`}>
                <div className={`${prefix}-block-title`}>组织业绩排行</div>
                <Chart height={330} data={data} scale={cols} forceFit padding={[80,50,70,60]}>
                    <Axis
                        name="grade"
                        label={{
                            textStyle:{
                                fill:'#ffffff'
                            }
                        }}
                    />
                    <Axis
                        name="orgper"
                        label={{
                            textStyle:{
                                fill:'#ffffff'
                            }
                        }}
                    />
                    <Tooltip
                        crosshairs={{
                            type: "y"
                        }}
                    />
                    <Geom type="interval" position="grade*orgper" />
                </Chart>
            </div>
        );
    }
}
