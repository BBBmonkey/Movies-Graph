/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {useState} from 'react';
import {useReadCypher} from 'use-neo4j';
import styled from 'styled-components';
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import TextField from '@mui/material/TextField';
import { TransitionProps } from '@mui/material/transitions';
import ModalContent from './ModalContent';
import Graph3 from './Graph3';

interface Link {
    target: string,
    source: string,
    label: string
}

interface Node {
    id: string
}

const Container = styled.div`
    height: 100%;
    width: 100%;
    overflow: scroll;
`

const GraphContainer: React.FC = (): JSX.Element => {
    const query = `MATCH (m:Movie)<-[:ACTED_IN | :DIRECTED]-(p:Person) RETURN m,p LIMIT 100`
    const params = {}
    const [openModal, setOpenModal] = useState(false)
    const [modalContent, setModalContent] = useState({})
    const [filterString, setFilterString] = useState('')
    const { loading, records } = useReadCypher(query, params)

    if ( loading ) return (<div>Loading...</div>)

    let PinM:any
    const movies:Record<string, unknown> = {}
    const people: Record<string, unknown> = {}
    if (records) {
        PinM = records.map((record) => ({ //TODO filter out only the relevant data and add interface
            m: record.get('m'),
            p: record.get('p')
        }))
        PinM.forEach((PrM:any)=>{
            const movieName:string = PrM.m.properties.title // has uniqe constraint in db
            if(!movies[movieName]) { 
                movies[movieName] = PrM.m
            }
            const peopleName:string = PrM.p.properties.name // has uniqe constraint in db
            if(!people[peopleName]) {
                people[peopleName] = PrM.p
            }
        })
    }
    else return (<div>Loading...</div>)

    const filteredPinM = PinM.filter(({m, p}: any) =>(
        m.properties.title === filterString || p.properties.name === filterString
    ))

    const calcData = (PinM:Record<string, unknown>[]) => {
        const movies:Record<string, unknown> = {}
        const people:Record<string, unknown> = {}
        const links:Link[] = []
        const nodes:Node[] = []
        // const debugLinks:any = []

        PinM.forEach((PrM:any)=>{
            const movieName:string = PrM.m.properties.title // has uniqe constraint in db
            if(!movies[movieName]) { 
                movies[movieName] = PrM.m
                nodes.push({id: PrM.m.properties.title})
            }
            const peopleName:string = PrM.p.properties.name // has uniqe constraint in db
            if(!people[peopleName]) {
                people[peopleName] = PrM.p
                nodes.push({id: PrM.p.properties.name})
            }
    
            links.push({ target: PrM.m.properties.title, source: PrM.p.properties.name, label : PrM.m.properties.title+' '+PrM.p.properties.name })
            // debugLinks.push(PrM.m.properties.title + PrM.p.properties.name)
        })
        // console.log(new Set(debugLinks).size + ' vs ' + debugLinks.length)
        return {links, nodes}
    }

    const {links, nodes} = calcData(filterString !== '' ? filteredPinM : PinM)
    const data = {nodes,links};
    
    const onClickNode = (nodeId:string) => {
        const modContent:any = people[nodeId] || movies[nodeId]
        setModalContent(modContent)
        setOpenModal(true)
    };
    
    const onClickLink = (source:string, target:string) => {
      console.log(`Clicked link between ${source} and ${target}`);
    };

    return (
        <Container>
            <TextField 
                id="filled-basic" label="Search" variant="filled"
                onChange={(event)=>{
                    const value = event.target.value
                    if(movies[value] || people[value] || value === ''){
                        setFilterString(value)
                    }
                }}
            />
            <Graph3
                data={data}
                onClickNode={onClickNode}
                onClickLink={onClickLink}
            />
            <Dialog
                open={openModal}
                TransitionComponent={Transition}
            >
            <ModalContent 
                closeFunc={setOpenModal}
                currentNode={modalContent}
            />
            </Dialog> 
        </Container>
    )
  }

export default GraphContainer;



const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

