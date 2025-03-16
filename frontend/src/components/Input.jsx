import React, { useId } from 'react'

function Input({
    classname="",
    name,
    type='text',
    placeholder,
    onChange,
    label,
    value
}) {
    const id=useId()
  return (
    <div className='w-full h-[10vh] ml-2 p-1'>
        
         <label htmlFor={id} className='mb-2 inline'>{label}</label>
        <input type={type} id={id} name={`${name}`} className={`${classname} `} placeholder={`${placeholder}` } onChange={onChange} value={value} autocomplete="off"  />
       
      
    </div>
  )
}

export default Input
