import React from 'react';
import { Graph, GraphData, GraphLink, GraphNode } from 'react-d3-graph';
import {myConfig as myGraphConfig} from '../constants'

interface Graph3Props {
    data: GraphData<GraphNode, GraphLink>,
    onClickNode: (nodeId: string) => void,
    onClickLink: (source: string, target: string) => void
}
const Graph3: React.FC<Graph3Props> = ({data, onClickNode, onClickLink}: Graph3Props): JSX.Element => {
    return (
        <Graph
            id="graph-id" // id is mandatory
            data={data}
            config={myGraphConfig}
            onClickNode={onClickNode}
            onClickLink={onClickLink}
        />
    )
}

export default React.memo(Graph3)