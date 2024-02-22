// components/RegisterCourseformData.js
"use client";
import React, { useState, useEffect } from "react";
import { Link } from 'next/link'; // or 'react-router-dom'
import { auth } from "@/app/firebase/config";
import { db } from "@/app/firebase/config";
import { useRouter } from "next/navigation";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { ImCross } from "react-icons/im";
import {
  GoogleMap,
  LoadScript,
  Marker,
  Autocomplete,
  InfoWindow,
} from "@react-google-maps/api";
import { useAuthState } from "react-firebase-hooks/auth";
// const [user] = useAuthState(auth);
//   const userSession = typeof window !== "undefined" ? sessionStorage.getItem("user") : null;

const mapContainerStyle = {
  width: "40vw",
  height: "70vh",
};

const libraries = ["places"]; // Add the "places" library

const RegisterCourseForm = () => {
  const [formData, setFormData] = useState({
    courseName: "",
    studentConstraints: "",
    latitude: 0,
    longitude: 0,
    fees: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    address: "",
  });
  const [user] = useAuthState(auth);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [center, setCenter] = useState({ lat: 24.941553, lng: 82.127167 });
  const [autoComplete, setAutoComplete] = useState(null);
  const [error, setError] = useState("");
  const router = useRouter();

  //Map code:
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
                country: getAddressComponent(
                  result.address_components,
                  "country"
                ),
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              });
            }
          } catch (error) {
            console.error("Error fetching location details:", error);
          }
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
              country: getAddressComponent(
                result.address_components,
                "country"
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
            country: getAddressComponent(result.address_components, "country"),
          });
        }
      } catch (error) {
        console.error("Error fetching location details:", error);
      }
    };

    getAddress();
  }, [formData.latitude, formData.longitude]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if all elements are filled
    if (
      !formData.courseName ||
      !formData.studentConstraints ||
      !formData.city ||
      !formData.fees ||
      !formData.state ||
      !formData.country ||
      !formData.pincode ||
      !formData.latitude ||
      !formData.longitude
    ) {
      setError("Please fill all the fields");
      return;
    }

    try {
      const teacherData = await getDoc(
        doc(db, "teachers", auth.currentUser.uid)
      );
      const teachers = teacherData.data();
      console.log({ teachers });

      // Check if teachers and courses are defined
      const courses = teachers && teachers.courses ? teachers.courses : [];

      console.log({ courses });

      const courseid = teachers._id + formData.courseName;

      // Check if course already exists
      if (courses.some((course) => course === courseid)) {
        setError("Course already exists");
        console.log("already exists");
        return;
      }

      // Update courses array
      courses.push(courseid);

      console.log({ courses });

      // Update courses array in teachers collection
      await updateDoc(doc(db, "teachers", teachers._id), {
        courses,
      });

      console.log("works");

      const currentDate = new Date();

      const options = {
        weekday: 'long',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      };
      
      const formattedDate = currentDate.toLocaleString('en-US', options);
 
      const mess ="Welcome to the course. Say Hi to your teacher " + teachers.name;

      // const courseid = teachers._id + formData.courseName;

      // Update courses collection
      await setDoc(doc(db, "courses", courseid), {
        teacherName: teachers.name,
        teacherId: teachers._id,
        _id: courseid,
        courseName: formData.courseName,
        studentConstraints: formData.studentConstraints,
        longitude: formData.longitude,
        latitude: formData.latitude,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        pincode: formData.pincode,
        fees: formData.fees,
        profilePic: teachers.profilepic,
        students: [],
        pendingStudents: [],
        messages: [{message:mess, sender:"admin", timestamp:formattedDate}],
      });
      
      console.log("works");
      setFormData({
        courseName: "",
        studentConstraints: "",
        location: "",
        fees: "",
      });

      alert("Course Registered Successfully");

      router.replace(`/teacher/${teachers._id}`);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="px-4 py-2 flex flex-col md:gap-4">
      <div className="flex items-center justify-between px-3">
        <div className="text-3xl text-black font-['Merriweather'] font-semibold  ">
        Add a New Course:
      </div>
      {/* <Link href={`/teacher/${user.uid}`}></Link> */}
      <div>
      <ImCross />
</div>


      </div>
    <div className="w-content h-fit mx-auto  bg-secondary rounded-md px-6 py-4">
      
      
      <div className=" flex justify-between  gap-20 flex-wrap-reverse">
        <form name="fillform" className="flex flex-col gap-2 " onSubmit={handleSubmit}>
          <div className="">
            <label
              htmlFor="courseName"
              className="block text-black text-sm font-medium mb-2"
            >
              Course Name
            </label>
            <input
              type="text"
              id="courseName"
              name="courseName"
              value={formData.courseName}
              onChange={handleChange}
              className="w-96 px-4 py-2 border rounded-md focus:outline-none focus:border-primary"
              placeholder="Enter the course name"
            />
          </div>

          <div className="">
            <label
              htmlFor="studentConstraints"
              className="block text-black text-sm font-medium mb-2"
            >
              Student Constraints
            </label>
            <input
              type="text"
              id="studentConstraints"
              name="studentConstraints"
              value={formData.studentConstraints}
              onChange={handleChange}
              className="w-96 px-4 py-2 border rounded-md focus:outline-none focus:border-primary"
              placeholder="Enter student constraints"
            />
          </div>
          <div>
            <div className="">
            <label
              htmlFor="fees"
              className="block text-black text-sm font-medium mb-2"
            >
              Fees
            </label>
            <input
              type="text"
              id="fees"
              name="fees"
              value={formData.fees}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-primary"
              placeholder="Enter the fees"
            />
            </div>
          </div>

          <div className="">
            <label className="block text-black text-sm font-medium mb-2">
              Address:
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                autoComplete="address"
                className="w-96 px-4 py-2 border rounded-md focus:outline-none focus:border-primary"
              placeholder="Enter student address"
              />
              </div>
            
            <div>
            <label className="block text-black text-sm font-medium mb-2">
              City:
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                autoComplete="city"
                className="w-96 px-4 py-2 border rounded-md focus:outline-none focus:border-primary"
              placeholder=""
              />
              </div>
            
            <div>
            <label className="block text-black text-sm font-medium mb-2">
              State:
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                autoComplete="state"
                className="w-96 px-4 py-2 border rounded-md focus:outline-none focus:border-primary"
              placeholder=""
              />
              </div>
            
            <div>
            <label className="block text-black text-sm font-medium mb-2">
              Pincode:
              </label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                autoComplete="pincode"
                className="w-96 px-4 py-2 border rounded-md focus:outline-none focus:border-primary"
              placeholder=""
              />
              </div>
            
            <div>
            <label className="block text-black text-sm font-medium mb-2">
              Country:
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                autoComplete="country"
                className="w-96 px-4 py-2 border rounded-md focus:outline-none focus:border-primary"
              placeholder=""
              />
              </div>
            <label>
              {/* Location:
              <input
                type="text"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                autoComplete="latitude"
              />
              <input
                type="text"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                autoComplete="longitude"
              /> */}
              
              
            </label>
            <div className="flex justify-between">
        
          <button
            type="submit"
            className="bg-blue-500 w-36 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none "
          >
            Register
          </button>
          <button
                className="bg-blue-500 w-36 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none "
                type="button"
                onClick={handleGetLocation}
              >
                Present Location
              </button>
          </div>
        </form>
        <div className="h-100vh w-full md:flex justify-start items-center flex-col  xl:gap-9">
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
          >
            {selectedLocation && <Marker position={selectedLocation} />}
            <Autocomplete
              onLoad={(autoComplete) => setAutoComplete(autoComplete)}
              onPlaceChanged={() => handlePlaceSelect(autoComplete.getPlace())}
            >
              <input
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
        {selectedLocation && (
                <div>
                  {/* <p>Selected Location:</p>
                  <p>Latitude: {selectedLocation.lat}</p>
                  <p>Longitude: {selectedLocation.lng}</p> */}
                  <button
                    className="bg-blue-500 w-36 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none "
                    onClick={handleLocationSelect}
                  >
                    Use this Location
                  </button>
                </div>
              )}
        </div>
      </div>
    </div>
    </div>
  );
};

export default RegisterCourseForm;
