// pages/index.js
"use client";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { useState, useEffect } from "react";
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/config";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  LoadScript,
  Autocomplete,
} from "@react-google-maps/api";

const mapContainerStyle = {
  width: "40vw",
  height: "400px",
};

const libraries = ["places"]; // Add the "places" library


const Page = () => {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const userSession = sessionStorage.getItem("user");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [center, setCenter] = useState({ lat: 0, lng: 0 }); // [latitude, longitude
  const [autoComplete, setAutoComplete] = useState(null);
  const [formData, setFormData] = useState({
    dob: "",
    phone: "",
    profilepic: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    longitude: null,
    latitude: null,
    className: "",
    school: "",
  });

  const getAddressComponent = (addressComponents, type) => {
    const addressComponent = addressComponents.find((component) =>
      component.types.includes(type)
    );
    return addressComponent ? addressComponent.long_name : "";
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&key=${process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_MAPS_API_KEY}`;
          const response = await fetch(apiUrl);
          const data = await response.json();
          if (data.status === "OK" && data.results.length > 0) {
            const result = data.results[0];
            setFormData({
              ...formData,
              address: result.formatted_address,
              city: getAddressComponent(result.address_components, "locality"),
              state: getAddressComponent(
                result.address_components,
                "administrative_area_level_1"
              ),
              pincode: getAddressComponent(
                result.address_components,
                "postal_code"
              ),
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          }
        } catch (error) {
          console.error("Error fetching location details:", error);
        }
      });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  };

  const handlePlaceSelect = (place) => {
    if (place.geometry) {
      setFormData({
        ...formData,
        latitude: place.geometry.location.lat(),
        longitude: place.geometry.location.lng(),
        // address: place.formatted_address,
        // city: getAddressComponent(place.address_components, 'locality'),
        // state: getAddressComponent(place.address_components, 'administrative_area_level_1'),
        // pincode: getAddressComponent(place.address_components, 'postal_code'),
      });
      setCenter({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      });
    }
  };

  const handleMapClick = (event) => {
    setSelectedLocation({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
  };

  const handleLocationSelect = () => {
    setFormData({
      ...formData,
      latitude: selectedLocation.lat,
      longitude: selectedLocation.lng,
    });
    setSelectedLocation(null);
  };

  useEffect(() => {
    const getAddress = async () => {

    setCenter({ lat: formData.latitude, lng: formData.longitude });

    console.log("formData.latitude:", formData.latitude);
    console.log("formData.longitude:", formData.longitude);


    try {
      const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${formData.latitude},${formData.longitude}&key=${process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_MAPS_API_KEY}`;
      const response = await fetch(apiUrl);
      const data = await response.json();
      if (data.status === "OK" && data.results.length > 0) {
        const result = data.results[0];
        setFormData({
          ...formData,
          address: result.formatted_address,
          city: getAddressComponent(result.address_components, "locality"),
          state: getAddressComponent(
            result.address_components,
            "administrative_area_level_1"
          ),
          pincode: getAddressComponent(
            result.address_components,
            "postal_code"
          ),
        });
      }
    } catch (error) {
      console.error("Error fetching location details:", error);
    }
  };

  getAddress();
  }, [formData.latitude, formData.longitude]);

  const picChange = (e) => {
    var reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = function () {
      setFormData({ ...formData, [e.target.name]: reader.result });
    };
    reader.onerror = function (error) {
      console.log("Error: ", error);
    };
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateDoc(doc(db, "students", user.uid), {
        dob: formData.dob,
        phone: formData.phone,
        profilepic: formData.profilepic,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        latitude: formData.latitude,
        longitude: formData.longitude,
        className: formData.className,
        school: formData.school,
      });

      console.log("Data updated successfully!");
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (user && userSession) {
        const studentRef = doc(collection(db, "students"), user.uid);
        const studentSnapshot = await getDoc(studentRef);
        if (studentSnapshot.exists()) {
          const studentData = studentSnapshot.data();
          setEmail(studentData.email);
          setName(studentData.name);
          setFormData(studentData);
          setCenter({ lat: studentData.latitude, lng: studentData.longitude });
        }
      }
    };

    fetchUserData();
  }, [user, userSession]);

  if (!user && !userSession) {
    router.replace("/student/signup");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-500 text-white">
      <h1 className="text-4xl mb-4">Email: {email}</h1>
      <h1 className="text-4xl mb-4">Name: {name}</h1>
      {formData.profilepic && (
        <img
          className="w-40 h-40 border-spacing-3 rounded-full"
          src={formData.profilepic}
          alt="profile pic"
        />
      )}
      <div className="flex flex-row">
      <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_MAPS_API_KEY} libraries={libraries}>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={15}
            onClick={handleMapClick}
          >
            {selectedLocation && <Marker position={selectedLocation} />}
            <Autocomplete
              onLoad={(autoComplete) => setAutoComplete(autoComplete)}
              onPlaceChanged={() => handlePlaceSelect(autoComplete.getPlace())}
            >
              <input required
                type="text"
                placeholder="Search for places"
                style={{
                  boxSizing: `border-box`,
                  border: `1px solid transparent`,
                  width: `240px`,
                  height: `32px`,
                  padding: `0 12px`,
                  borderRadius: `3px`,
                  boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                  fontSize: `14px`,
                  outline: `none`,
                  textOverflow: `ellipses`,
                  position: "absolute",
                  left: "50%",
                  marginLeft: "-120px",
                  color: "black",
                }}
                onChange={handlePlaceSelect}
              />
            </Autocomplete>
          </GoogleMap>
        </LoadScript>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col text-center p-10 text-black outline-dashed m-10 max-w-md mx-auto bg-white rounded-md"
        >
          <label>
            DOB:
            <input required
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              autoComplete="bday"
              className="mt-2 p-2 border rounded-md focus:outline-none focus:border-blue-300"
            />
          </label>
          <br />
          <label>
            Phone:
            <input required
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              autoComplete="phone"
            />
          </label>
          <br />
          <label>
            Profile Picture:
            <input 
              accept="image/*"
              type="file"
              name="profilepic"
              onChange={picChange}
              autoComplete="profilepic"
            />
          </label>
          <br />
          <label>
            Address:
            <input required
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              autoComplete="address"
            />
          </label>
          <br />
          <label>
            City:
            <input required
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              autoComplete="city"
            />
          </label>
          <br />
          <label>
            State:
            <input required
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              autoComplete="state"
            />
          </label>
          <br />
          <label>
            Pincode:
            <input required
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              autoComplete="pincode"
            />
          </label>
          <br />
          <label>
            Location:
            <input required
              type="text"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              autoComplete="latitude"
            />
            <input required
              type="text"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              autoComplete="longitude"
            />
            <button
              className="bg-blue-500 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none mt-4"
              type="button"
              onClick={handleGetLocation}
            >
              Get Present Location
            </button>
            {selectedLocation && (
              <div>
                <p>Selected Location:</p>
                <p>Latitude: {selectedLocation.lat}</p>
                <p>Longitude: {selectedLocation.lng}</p>
                <button
                  className="rounded-lg bg-blue-500 p-2"
                  onClick={handleLocationSelect}
                >
                  Use this Location
                </button>
              </div>
            )}
          </label>
          <br />
          <label>
            Class:
            <input required
              type="text"
              name="className"
              value={formData.className}
              onChange={handleChange}
              autoComplete="className"
            />
          </label>
          <br />
          <label>
            School:
            <input required
              type="text"
              name="school"
              value={formData.school}
              onChange={handleChange}
              autoComplete="school"
            />
          </label>
          <br />
          <button
            className="bg-blue-500 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none mt-4"
            type="submit"
          >
            Submit
          </button>
        </form>

        <button
          className="bg-black text-white py-2 px-4 mt-4 rounded-md hover:bg-gray-800 focus:outline-none"
          onClick={() => {
            signOut(auth);
            sessionStorage.removeItem("user");
          }}
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Page;


// 'use client'
// import React from 'react'
// import { useAuthState } from 'react-firebase-hooks/auth'
// // import { auth } from '../../firebase/config';
// import { useRouter } from 'next/navigation';
// import { signOut } from 'firebase/auth';

// import { useState, useEffect } from 'react';
// import { collection, doc, getDoc, updateDoc } from 'firebase/firestore';
// // // import { db } from '../../firebase/config';
// // import firebase from 'firebase/app'; // Import the firebase module
// import { auth, db } from '../../firebase/config';

// const page = () => {
//     const router = useRouter();
//     const [user] = useAuthState(auth);
//     const userSession = sessionStorage.getItem("user");
//     const [email, setEmail] = useState('');
//     const [name, setName] = useState('');
//     const [formData, setFormData] = useState({
//         dob:'',
//         phone:'',
//         profilepic:'',
//         address:'',
//         city:'',
//         state:'',
//         pincode:'',
//         location:'',
//         className:'',
//         school:'',
//       });

//     //picture update
//     const picChange = (e) => {
//         console.log(e.target.name)
//         console.log("profile pic")
//         console.log(e);
//         var reader = new FileReader();
//         reader.readAsDataURL(e.target.files[0]);
//         reader.onload = function () {
//           console.log("profile pic base 64: ",reader.result);
//           setFormData({ ...formData, [e.target.name]: reader.result });
//         };
//         reader.onerror = function (error) {
//           console.log('Error: ', error);
//         };
//       }

//       const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     //handle submit
//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         try {
//             // Update the database in Firebase
//             console.log(formData)
//             await updateDoc(doc(db, 'students', user.uid), {
//                 dob: formData.dob,
//                 phone: formData.phone,
//                 profilepic: formData.profilepic,
//                 address: formData.address,
//                 city: formData.city,
//                 state: formData.state,
//                 pincode: formData.pincode,
//                 location: formData.location,
//                 className: formData.className,
//                 school: formData.school,
//               });
        

//             console.log('Data updated successfully!');
//         } catch (error) {
//             console.error('Error updating data:', error);
//         }
//     };

//     useEffect(() => {
//         const fetchUserData = async () => {
//             if (user && userSession) {
//                 const studentRef = doc(collection(db, 'students'), user.uid);
//                 const studentSnapshot = await getDoc(studentRef);
//                 if (studentSnapshot.exists()) {
//                     const studentData = studentSnapshot.data();
//                     setEmail(studentData.email);
//                     setName(studentData.name);
//                     setFormData(studentData);
//                 }
//             }
//         };

//         fetchUserData();
//     }, [user, userSession]);

//     if (!user && !userSession) {
//         router.replace("/student/signup");
//     }

//     return (
//         <div>
//             <h1>Email: {email}</h1>
//             <h1>Name: {name}</h1>
//             {formData.profilepic && <img className='w-40 h-40 border-spacing-3 rounded-full' src={formData.profilepic} alt="profile pic" />}
   
//       <form className="flex flex-col text-center p-10 outline-dashed m-10 w-60" onSubmit={handleSubmit}>
//         <label>
//           DOB:
//           <input required
//             type="date" // Update the input type to "date"
//             name="dob"
//             value={formData.dob}
//             onChange={handleChange}
//             autoComplete="bday"
//           />
//         </label>
//         <br />
//         <label>
//           Phone:
//           <input required
//             type="text"
//             name="phone"
//             value={formData.phone}
//             onChange={handleChange}
//             autoComplete="phone"
//           />
//         </label>
//         <br />
//         <label>
//           Profile Picture:
//           <input required
//             accept='image/*'
//             type="file"
//             name="profilepic"
//             onChange={picChange}
//             autoComplete="profilepic"
//           />
//         </label>
//         <br />
//         <label>
//           Address:
//           <input required
//             type="text"
//             name="address"
//             value={formData.address}
//             onChange={handleChange}
//             autoComplete="address"
//           />
//         </label>
//         <br />
//         <label>
//           City:
//           <input required
//             type="text"
//             name="city"
//             value={formData.city}
//             onChange={handleChange}
//             autoComplete="city"
//           />
//         </label>
//         <br />
//         <label>
//           State:
//           <input required
//             type="text"
//             name="state"
//             value={formData.state}
//             onChange={handleChange}
//             autoComplete="state"
//           />
//         </label>
//         <br />
//         <label>
//           Pincode:
//           <input required
//             type="text"
//             name="pincode"
//             value={formData.pincode}
//             onChange={handleChange}
//             autoComplete="pincode"
//           />
//         </label>
//         <br />
//         <label>
//           Location:
//           <input required
//             type="text"
//             name="location"
//             value={formData.location}
//             onChange={handleChange}
//             autoComplete="location"
//           />
//         </label>
//         <br />
//         <label>
//           Class:
//           <input required
//             type="text"
//             name="className"
//             value={formData.className}
//             onChange={handleChange}
//             autoComplete="className"
//           />
//         </label>
//         <br />
//         <label>
//           School:
//           <input required
//             type="text"
//             name="school"
//             value={formData.school}
//             onChange={handleChange}
//             autoComplete="school"
//           />
//         </label>
//         <br />
//         <button
//           className="bg-red-400 bg-blend-screen text-center"
//           type="submit"
//           >Submit</button>
//       </form>
//             <button className='bg-black text-blue-50' onClick={() => {
//                 signOut(auth);
//                 sessionStorage.removeItem('user');
//             }}>Log Out</button>
//         </div>
//     );
// };

// export default page
