import React from 'react';
import {useReadCypher} from 'use-neo4j'

const Actors = () => {
    const query = `MATCH (p:Person) RETURN p`
    // const query = ` MATCH (p:Person)-[:ACTED_IN | :DIRECTED]->(someMovies) RETURN p,someMovies`
    const params = { }

    const { loading, records } = useReadCypher(query, params)
  
    if ( loading ) return (<div>Loading...</div>)
    
    let actors:any
    if (records) {
      actors = records.map((record) => (
        record.get('p')
      ))
    }
    else return (<div>Loading...</div>)
  
    console.log(actors)
  
    return (
        <div>
          {
              actors.map((ac:any) => (
                <div
                  key= { ac.identity.getLowBits() }
                >
                  {ac.properties.name}
                </div>
              ))
          }
        </div>
        
    )
  }

export default Actors;