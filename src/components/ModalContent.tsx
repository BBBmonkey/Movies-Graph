import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import styled from 'styled-components';


const Container = styled.div`
    padding: 20px 15px;
`

const TextContainer = styled.div`
    padding: 19px;
    max-width: 280px;
`

interface MovieProps {
    closeFunc: React.Dispatch<React.SetStateAction<boolean>>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    currentNode: any,
}

const imgPrefix = "https://neo4j-documentation.github.io/developer-resources/language-guides/assets/posters/"

const ModalContent: React.FC<MovieProps> = ({closeFunc,currentNode}: MovieProps): JSX.Element => {
    console.log(currentNode)
    return (
        <Container>
            <CloseIcon 
                style={{cursor: 'pointer'}}
                onClick={()=>{closeFunc(false)}}
            />
            {
                currentNode.labels[0] === 'Movie' ? 
                <Card 
                    sx={{ maxWidth: 450 }}
                    key= { currentNode.identity.getLowBits() }
                    style={{
                        display: 'flex',
                        minWidth: '410px',
                        cursor: 'pointer',
                    }}  
                >
                <img
                    src={`${imgPrefix}${currentNode.properties.title}.jpg`}
                    alt={currentNode.properties.title}
                    style={{
                        maxHeight: '138px',
                        maxWidth: '92px'
                    }}
                />
                <TextContainer>
                    <Typography gutterBottom variant="h5" component="div">
                        { currentNode.properties.title }
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
                        { currentNode.properties.tagline }
                    </Typography>
                </TextContainer>
            </Card> : currentNode.labels[0] === 'Person' ?
            <TextContainer>
                <Typography gutterBottom variant="h5" component="div">
                    Name: {currentNode.properties.name}
                </Typography>
                <Typography gutterBottom variant="h5" component="div">
                    Age: {new Date().getFullYear()-currentNode.properties.born.getLowBits()}
                </Typography>

            </TextContainer> : 
            <p> What have you sent me?!</p> // TODO: add movie and actor interfaces
            }
        </Container>
    )
}

export default ModalContent