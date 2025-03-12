import React, { useState } from 'react'
import './home.scss'
function Home() {
    const [text, setText] = useState("Wispr");

    const handleInput = (event) => {
      const newText = event.target.innerText;
      setText(newText);
    };
  
  return (
    <div className='w-full h-full text-5xl font-extrabold flex items-center justify-center relative top-[-30px] text-amber-100'>
          <h1 data-heading={text}>
    <span
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        data-heading={text}
      >
    {text} 
      </span>
      
    </h1>
    </div>
  )
}

export default Home
