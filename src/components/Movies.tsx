import React, {useState} from 'react';
import {useReadCypher} from 'use-neo4j'
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';

import Movie from './Movie'

const Movies = () => {
    const query = `MATCH (m:Movie) RETURN m`
    // const query = `MATCH (m:Movie)<-[:ACTED_IN]-(actor) RETURN m`
    const params = {}

    const [openMovie, setOpenMovie] = useState(false)
    const [currentMovie, setCurrentMovie] = useState('')

    const { loading, records } = useReadCypher(query, params)

    if ( loading ) return (<div>Loading...</div>)

    let movies:any
    if (records) {
      movies = records.map((record) => (
        record.get('m')
      ))
    }
    else return (<div>Loading...</div>)

    const imgPrefix = "https://neo4j-documentation.github.io/developer-resources/language-guides/assets/posters/"
    console.log(movies)

    return (
        <>
            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '20px',
                    padding: '50px',
                    width: '100%',
                }}
                >
              {
                  movies.map((mv:any) => (
                    <Card 
                        sx={{ maxWidth: 450 }}
                        key= { mv.identity.getLowBits() }
                        style={{
                            display: 'flex',
                            minWidth: '410px',
                            cursor: 'pointer',
                        }}
                        onClick={()=>{
                            setOpenMovie(true)
                            setCurrentMovie(mv.properties.title)
                        }}    
                    >
                        <img
                            src={`${imgPrefix}${mv.properties.title}.jpg`}
                            alt={mv.properties.title}
                            style={{
                                maxHeight: '138px',
                                maxWidth: '92px'
                            }}
                        />
                        <div style={{
                            padding: '19px',
                            maxWidth: '280px',
                        }}>
                            <Typography gutterBottom variant="h5" component="div">
                                { mv.properties.title }
                            </Typography>
                            <Typography variant="body2" color="text.secondary"
                                style={{
                                    display: '-webkit-box',
                                    WebkitLineClamp: 3,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                }}
                            >
                                { mv.properties.tagline }
                            </Typography>
                        </div>
                    </Card>
                  ))
              }
            </div>
            <Dialog
                fullScreen
                open={openMovie}
                TransitionComponent={Transition}
            >
                <Movie
                    closeFunc={setOpenMovie}
                    currentMovie={currentMovie}
                />
            </Dialog> 
        </>
    )
  }

export default Movies;



const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});