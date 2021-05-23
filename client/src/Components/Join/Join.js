import React, { useState } from "react";
import { Link } from "react-router-dom";
import './Join.css';
/* Passing the data through query params */
const Join = () => {

    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    return (
        // When user joins, connection request is fired, 
        // When user leaves, disconnect event is fired.

        <div className="joinOuterContainer">
            <div className="joinInnerContainer">
                <div>
                    <h1 className="heading">Join</h1>
                </div>
                <div>
                    <input placeholder="Name" className="joinInput" type="text" onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                    <input placeholder="Room" className="joinInput mt-20" type="text" onChange={(e) => setRoom(e.target.value)} />
                </div>

                <Link onClick={e => (!name || !room) ? e.preventDefault() : null} to={`/chat?name=${name}&room=${room}`}>
                    <button className={'button mt-20'} type="submit">Join</button>
                </Link>
            </div>
        </div>
    );
};

export default Join;