'use client'
import React from 'react'
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps'


const page = () => {
    const position = {lat: 37.78, lng: -122.45}
  return (
    <APIProvider apiKey={process.env.GOOGLE_MAPS_API_KEY}>
    <div className='h-[100vh]'>
      Map page
      <Map mapStyle={{ width: '100%', height: '100%' }} zoom={9} center={position}>
        </Map>
    </div>
    </APIProvider>
  )
}

export default page
