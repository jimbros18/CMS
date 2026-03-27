import { useState } from 'react';

/*
  🧠 PARENT COMPONENT
  This is the "brain" that stores the data
*/
export default function App() {
    // 📦 This is our box (state)
    const [name, setName] = useState('');

    /*
    🔧 This is our tool (function)
    It changes what's inside the box
  */
    const changeName = (newName) => {
        setName(newName); // put new value inside the box
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Parent (Brain)</h2>

            {/* 👀 Parent can see the data */}
            <p>Current Name: {name}</p>

            {/* 
        👇 Give data + tool to child
        name = the box
        changeName = the tool
      */}
            <Child name={name} changeName={changeName} />
        </div>
    );
}

/*
  👶 CHILD COMPONENT
  This is the "helper"
  It uses the data and sends updates back
*/
function Child({ name, changeName }) {
    return (
        <div style={{ marginTop: '20px' }}>
            <h3>Child (Helper)</h3>

            {/*
        📥 Child reads the box (name)
        📤 Child uses the tool (changeName)
      */}
            <input
                type="text"
                value={name} // show what's in the box
                onChange={(e) => changeName(e.target.value)}
                // when typing → send new value to parent
                placeholder="Type a name..."
            />
        </div>
    );
}

