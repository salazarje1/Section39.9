import React, { useEffect, useState, useRef } from 'react'; 
import axios from 'axios'; 

import Card from './Card';

const Board = () => {
    const INITIALSTATE = [
        {}
    ]; 

    const [deckId, setDeckId] = useState(null); 
    const [remaining, setRemaining] = useState(null); 
    const [displayCard, setDisplayCard] = useState([]); 
    const [drawing, setDrawing] = useState(false); 
    const timerId = useRef(); 

    useEffect(() => {
        async function loadDeck() {
            const res = await axios.get("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1");
            console.log(res); 
            setDeckId(res.data.deck_id); 
            setRemaining(res.data.remaining); 
        }

        loadDeck();
    }, []);

    const getCard = async() => {
        if(remaining === 0) {
            alert('No more cards'); 
        }
        const res = await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`)
        const card = res.data.cards[0]; 
        setDisplayCard(cards => [...cards, { image: card.image, id: card.code }]);
        setRemaining(remaining - 1); 
        console.log(remaining); 
    }

    const stopTimer = () => {
        clearInterval(timerId.current); 
    }

    useEffect(() => {
        if(drawing && remaining !== 0) {
            timerId.current = setInterval(() => {
                getCard(); 
            }, 1000)
        } else {
            stopTimer(); 
        }

        return () => {
            clearInterval(timerId.current); 
            timerId.current = null; 
        }

    }, [drawing, remaining])

    const toggleDraw = () => {
        setDrawing(draw => !draw);  
    }


    return (
        <div>
            <h1>Cards</h1>
            { remaining === 0 ? null : 
                <button onClick={toggleDraw}>
                    {drawing ? "Stop Drawing" : "Keep Drawing"}
                </button>
            }

            <div>
                {displayCard.map(({ image, id }) => {
                    return <Card key={id} image={image} />
                })}
            </div>
        </div>
    )
}

export default Board; 



