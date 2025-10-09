import React from 'react'

export default function page({params}:any) {
  return (
      <div className="flex flex-col items-center justify-center mt-20  ">
      <h1>profile detail page</h1>
      <br />
      <hr/>
      <h2 className='bg-green-600 p-3'>{params.id}</h2>
    </div>
  )
}


