import React from 'react';

interface MovieProps {
    closeFunc: Function,
    currentMovie: string,
}

const Movie = ({closeFunc,currentMovie }:MovieProps) => {
    return (
        <div 
            onClick={()=>{closeFunc(false)}}
        >
            <p>X</p>
            {currentMovie}
        </div>
    )
}

export default Movie