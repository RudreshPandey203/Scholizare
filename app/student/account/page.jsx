// pages/index.js
"use client";
import React, { use } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from 'next/navigation'
import { redirect } from 'next/navigation';
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
  const router = useRouter()
  const [user] = useAuthState(auth);
  // const userSession = sessionStorage.getItem("user");
  const userSession = typeof window !== 'undefined' ? sessionStorage.getItem("user") : null;
  

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [center, setCenter] = useState({ lat: 0, lng: 0 }); // [latitude, longitude
  const [autoComplete, setAutoComplete] = useState(null);
  const [formData, setFormData] = useState({
    dob: "",
    phone: "",
    profilepic: "/user.png",
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
try{
  if(user.uid != router.query.studentid){
    router.push("/");
  }
}
catch(error){
  console.log("Error in try catch:", error);
}
  
  const handleGetLocation = () => {
    try{
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
  }catch(error){
    console.log("Geolocation outer is not supported by this browser.");
  };
};

  const handlePlaceSelect = async(place) => {
    try{
    if (place.geometry) {
      setFormData({
        ...formData,
        latitude: await place.geometry.location.lat(),
        longitude: await place.geometry.location.lng(),
      });
      setCenter({
        lat: await place.geometry.location.lat(),
        lng: await place.geometry.location.lng(),
      });
    }
  }
  catch(error){
    console.log("Error in handlePlaceSelect:", error);
  };
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
      alert("Data updated successfully!")
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (user && userSession) {
        const studentRef = doc(collection(db, "students"), user.uid);
        const studentSnapshot = await getDoc(studentRef);
        console.log(studentSnapshot)
        if (studentSnapshot.exists()) {
          const studentData = studentSnapshot.data();
          setEmail(studentData.email);
          setName(studentData.name);
          setFormData(studentData);
          console.log(formData.profilepic);
          setCenter({ lat: studentData.latitude, lng: studentData.longitude });
        }
      }
    };

    fetchUserData();
  }, [user, userSession]);

  // if (!user && !userSession) {
  //   console.log("yaha aaya");
  //   router.push("/");
  //   // router.replace("/student/signup");
  // }

  return (
    <div className="min-h-screen flex flex-col items-center  gap-6 font-medium bg-white text-black  p-6 ">
      <div className="flex items-center w-full justify-between ">
        <div className="flex gap-4 items-center flex-wrap md:flex-nowrap">
          {formData.profilepic && (
            <img
              className="w-20 h-20  rounded-full "
              src={formData.profilepic}
              alt="profile pic"
            />
          )}
          <div className="pt-4 font-semibold text-xl font-jacques">
            <div className="text-xl mb-4">Email: {email}</div>
            <div className="text-xl mb-4">Name: {name}</div>
          </div>
        </div>
        <button
          className="bg-black text-white md:py-2 md:px-4 md:mt-4 p-1 rounded-md hover:bg-gray-800 focus:outline-none flex items-center gap-2 text-semibold"
          onClick={() => {
            signOut(auth);
            sessionStorage.removeItem("user");
          }}
        >
          <div>Log Out</div>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 5H11C11.55 5 12 4.55 12 4C12 3.45 11.55 3 11 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H11C11.55 21 12 20.55 12 20C12 19.45 11.55 19 11 19H5V5Z"
              fill="white"
            />
            <path
              d="M20.65 11.65L17.86 8.86004C17.7905 8.78859 17.7012 8.73952 17.6036 8.71911C17.506 8.69869 17.4045 8.70787 17.3121 8.74545C17.2198 8.78304 17.1408 8.84733 17.0851 8.93009C17.0295 9.01286 16.9999 9.11033 17 9.21004V11H10C9.45 11 9 11.45 9 12C9 12.55 9.45 13 10 13H17V14.79C17 15.24 17.54 15.46 17.85 15.14L20.64 12.35C20.84 12.16 20.84 11.84 20.65 11.65Z"
              fill="white"
            />
          </svg>
        </button>
      </div>
      <div className="flex md:flex-row md:gap-0 justify-between flex-col gap-6 bg-secondary h-fit w-full pt-6 px-4 md:px-12 py-10 ">
        <div className="flex flex-col items-center justify-center">
          <div>
            <LoadScript
              googleMapsApiKey={
                process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_MAPS_API_KEY
              }
              libraries={libraries}
            >
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={15}
                onClick={handleMapClick}
                className="md:w-96 md:h-96 w-full"
              >
                {selectedLocation && <Marker position={selectedLocation} />}
                <Autocomplete
                  onLoad={(autoComplete) => setAutoComplete(autoComplete)}
                  onPlaceChanged={() =>
                    handlePlaceSelect(autoComplete.getPlace())
                  }
                >
                  <input
                    required
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
          </div>
          <div className="flex flex-row justify-around">
            <button
              className="bg-primary w-48 text-white py-4 font-semibold rounded-md mx-5 hover:bg-blue-700 focus:outline-none shadow-sm mt-10 "
              type="button"
              onClick={handleGetLocation}
            >
              Get Present Location
            </button>
            {selectedLocation && (
              <button
                className="bg-primary w-48 text-white py-4 font-semibold rounded-md hover:bg-blue-700 focus:outline-none shadow-sm mt-10 mx-5 "
                type="button"
                onClick={handleLocationSelect}
              >
                Use this Location
              </button>
            )}
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:items-start items-center gap-3 py-4 px-2 md:px-8 text-black outline-dashed  max-w-md  bg-white rounded-md"
        >
          <div className="flex justify-evenly items-center w-40 md:w-96">
            DOB:
            <input
              required
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              autoComplete="bday"
              className="w-28 md:w-52 block px-2 py-1 border rounded-md focus:outline-none focus:border-blue-300"
            />
          </div>

          <div className="flex justify-evenly items-center w-40 md:w-96">
            Phone:
            <input
              required
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              autoComplete="phone"
              className="w-28 md:w-52 block px-2 py-1 border rounded-md focus:outline-none focus:border-blue-300 peer"
            />
          </div>
          <div className="flex justify-evenly items-center w-40 md:w-96">
            Photo:
            <input
              accept="image/*"
              type="file"
              name="profilepic"
              onChange={picChange}
              autoComplete="profilepic"
              className="w-28 md:w-52 block px-2 py-1 border rounded-md focus:outline-none focus:border-blue-300"
            />
          </div>
          <div className="flex justify-evenly items-center w-40 md:w-96 gap-2">
            Class:
            <input
              required
              type="text"
              name="className"
              value={formData.className}
              onChange={handleChange}
              autoComplete="className"
              className="w-28 md:w-52 block px-2 py-1 border rounded-md focus:outline-none focus:border-blue-300"
            />
          </div>
          <div className="flex justify-evenly items-center w-40 md:w-96 ">
            School:
            <input
              required
              type="text"
              name="school"
              value={formData.school}
              onChange={handleChange}
              autoComplete="school"
              className="w-28 md:w-52 block px-2 py-1 border rounded-md focus:outline-none focus:border-blue-300"
            />
          </div>
          <div className="flex justify-evenly items-center w-40 md:w-96">
            Address:
            <input
              required
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              autoComplete="address"
              className="w-28 md:w-52 block px-2 py-1 border rounded-md focus:outline-none focus:border-blue-300"
            />
          </div>

          <div className="flex justify-evenly items-center w-40 md:w-96 gap-8">
            City:
            <input
              required
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              autoComplete="city"
              className="w-28 md:w-52 block px-2 py-1 border rounded-md focus:outline-none focus:border-blue-300"
            />
          </div>

          <div className="flex justify-evenly items-center w-40 md:w-96 gap-2 md:gap-6">
            State:
            <input
              required
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              autoComplete="state"
              className="w-28 md:w-52 block px-2 py-1 border rounded-md focus:outline-none focus:border-blue-300"
            />
          </div>

          <div className="flex justify-evenly items-center w-40 md:w-96 ">
            Pincode:
            <input
              required
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              autoComplete="pincode"
              className="w-28 md:w-52 block px-2 py-1 border rounded-md focus:outline-none focus:border-blue-300"
            />
          </div>

          <div className="flex w-full justify-center gap-2">
            <div>
              <button
                className="bg-primary w-48 text-white py-3 font-semibold rounded-md hover:bg-blue-700 focus:outline-none shadow-sm  "
                type="submit"
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;