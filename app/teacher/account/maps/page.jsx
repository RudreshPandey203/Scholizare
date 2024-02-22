'use client'
import React from 'react'
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps'

//13.073226, 80.260918

const page = () => {
  const position = {lat: 13.073226, lng: 80.260918}
  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_MAPS_API_KEY}>
      <div className='h-[100vh]'>
        Map page
        <Map mapStyle={{ width: '100%', height: '100%' }} zoom={9} center={position}>
        </Map>
      </div>
    </APIProvider>
  )
}

export default page
