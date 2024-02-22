"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, auth } from "../../../../firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";
import GooglePayButton from "@google-pay/button-react";
import QRCode from "react-qr-code";
import { PaymentRequest } from "google-pay";

function Page({ params }) {
  const [user] = useAuthState(auth);
  const userSession =
    typeof window !== "undefined" ? sessionStorage.getItem("user") : null;
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);
  const [student, setStudent] = useState(null);
  const [enroll, setEnroll] = useState(0);

  //setting course data
  useEffect(() => {
    if (user) {
      getDoc(doc(db, "courses", params.courseid)).then((doc) => {
        if (doc.exists()) {
          setCourse(doc.data());
        }
        setLoading(false);
        if (course && course.pendingStudents) {
          for (let i = 0; i < course.pendingStudents.length; i++) {
            if (course.pendingStudents[i] === params.studentid) {
              setEnroll(1);
            }
          }
        }
        if (course && course.students) {
          for (let i = 0; i < course.students.length; i++) {
            if (course.students[i] === params.studentid) {
              setEnroll(2);
            }
          }
        }
      });
    }
  }, [user]);

  const handleEnroll = async () => {
    // const studentRef = doc(db, "students", params.studentid);
    const courseRef = doc(db, "courses", params.courseid);
    // const studentSnap = await getDoc(studentRef);
    const courseSnap = await getDoc(courseRef);
    if (
      // studentSnap.exists() &&
      courseSnap.exists()
    ) {
      // const studentData = studentSnap.data();
      const courseData = courseSnap.data();
      // if (studentData.courses) {
      //   studentData.courses.push(courseData._id);
      // } else {
      //   studentData.courses = [courseData._id];
      // }
      if (courseData.pendingStudents) {
        courseData.pendingStudents.push(student._id);
      } else {
        courseData.pendingStudents = [student._id];
      }
      // await setDoc(studentRef, studentData);
      await setDoc(courseRef, courseData);
      setEnroll(1);
    }
  };

  const handleUnenroll = async () => {
    const studentRef = doc(db, "students", params.studentid);
    const courseRef = doc(db, "courses", params.courseid);
    const studentSnap = await getDoc(studentRef);
    const courseSnap = await getDoc(courseRef);
    if (studentSnap.exists() && courseSnap.exists()) {
      const studentData = studentSnap.data();
      const courseData = courseSnap.data();
      if (studentData.courses) {
        studentData.courses.pop(courseData._id);
      }
      if (courseData.students) {
        courseData.students.pop(studentData._id);
      }
      await setDoc(studentRef, studentData);
      await setDoc(courseRef, courseData);
      setEnroll(0);
    }
  };

  useEffect(() => {
    const getStudent = async () => {
      const studentRef = doc(db, "students", params.studentid);
      const studentSnap = await getDoc(studentRef);
      if (studentSnap.exists()) {
        setStudent(studentSnap.data());
        if (studentSnap.data().courses) {
          for (let i = 0; i < studentSnap.data().courses.length; i++) {
            if (studentSnap.data().courses[i] === params.courseid) {
              setEnroll(2);
            }
          }
        }
      }
    };
    getStudent();
  }, [params.studentid]);

  console.log(student);
  console.log(course);

  const handlePending = async () => {
    const courseRef = doc(db, "courses", params.courseid);
    const courseSnap = await getDoc(courseRef);
    if (courseSnap.exists()) {
      const courseData = courseSnap.data();
      if (courseData.pendingStudents) {
        courseData.pendingStudents.pop(student._id);
      }
      await setDoc(courseRef, courseData);
      setEnroll(0);
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      {course && <Link className="absolute text-white top-6 left-6 bg-blue-500 hover:bg-blue-700 rounded-md p-2" href={`/student/${params.studentid}/teacherProfile/teacher/${course.teacherId}`}>
      Visit Teacher Profile
      </Link>}
      <h1 className="font-merriweather text-5xl"> Course </h1>
      <div className="flex flex-col justify-between items-center p-4 mt-10 gap-4 bg-secondary">
        {course && (
          <div>
            <p className="text-xl font-bold">{course.courseName}</p>
            <p>Latitude: {course.latitude}</p>
            <p>Longitude: {course.longitude}</p>
          </div>
        )}
        {enroll === 0 && (
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            onClick={handleEnroll}
          >
            Enroll
          </button>
        )}
        {enroll === 1 && (
          <button
            className="bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed"
            onClick={handlePending}
            disabled
          >
            Pending
          </button>
        )}
        {enroll === 2 && (
          <div className="flex items-center space-x-4">
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              onClick={handleUnenroll}
            >
              Unenroll
            </button>
            <Link
              href={`/student/${params.studentid}/class/${params.courseid}`}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
            >
              Messages
            </Link>
          </div>
        )}

        {course && (
          <div>
            <GooglePayButton
              environment="TEST"
              buttonSizeMode="fill"
              paymentRequest={{
                apiVersion: 2,
                apiVersionMinor: 0,
                allowedPaymentMethods: [
                  {
                    type: "CARD",
                    parameters: {
                      allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
                      allowedCardNetworks: ["MASTERCARD", "VISA"],
                    },
                    tokenizationSpecification: {
                      type: "PAYMENT_GATEWAY",
                      parameters: {
                        gateway: "example",
                        gatewayMerchantId: "exampleGatewayMerchantId",
                      },
                    },
                  },
                ],
                merchantInfo: {
                  merchantId: "12345678901234567890",
                  merchantName: "Demo Merchant",
                },
                transactionInfo: {
                  totalPriceStatus: "FINAL",
                  totalPriceLabel: "Total",
                  totalPrice: course && course.fees,
                  currencyCode: "USD",
                  countryCode: "US",
                },
                onPaymentAuthorized: (paymentData) => {
                  // Handle the payment authorization
                  console.log("Payment authorized:", paymentData);
                  return { transactionState: "SUCCESS" };
                },
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Page;
