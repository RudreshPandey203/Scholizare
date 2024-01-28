"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, auth } from "../../../../firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";
import GooglePayButton from "@google-pay/button-react";
import QRCode from "react-qr-code";
import { PaymentRequest } from 'google-pay';

function Page({ params }) {
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);
  const [student, setStudent] = useState(null);
  const [enroll, setEnroll] = useState(true);


  useEffect(() => {
    if (user) {
      getDoc(doc(db, "courses", params.courseid)).then((doc) => {
        if (doc.exists()) {
          setCourse(doc.data());
        }
        setLoading(false);
      });
    }
  }, [user]);

  const handleEnroll = async () => {
    const studentRef = doc(db, "students", params.studentid);
    const courseRef = doc(db, "courses", params.courseid);
    const studentSnap = await getDoc(studentRef);
    const courseSnap = await getDoc(courseRef);
    if (studentSnap.exists() && courseSnap.exists()) {
      const studentData = studentSnap.data();
      const courseData = courseSnap.data();
      if (studentData.courses) {
        studentData.courses.push(courseData._id);
      } else {
        studentData.courses = [courseData._id];
      }
      if (courseData.students) {
        courseData.students.push(studentData._id);
      } else {
        courseData.students = [studentData._id];
      }
      await setDoc(studentRef, studentData);
      await setDoc(courseRef, courseData);
      setEnroll(false);

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
              setEnroll(false);
            }
          }
        }
      }
    };
    getStudent();
  }, [params.studentid]);

  console.log(student);
  console.log(course);

  return (
    <div>
      <div className="flex flex-row justify-between items-center">
        {course && (
          <div>
            <p>{course.courseName}</p>
            <p>{course.latitude}</p>
            <p>{course.longitude}</p>
          </div>
        )}

        {enroll && (
          <button className="bg-slate-300" onClick={handleEnroll}>
            Enroll
          </button>
        )}
        {!enroll && <button className="bg-slate-300">Unenroll</button>}
        <Link
          href={`/student/${params.studentid}/class/${params.courseid}`}
          className="bg-slate-300"
        >
          Messages
        </Link>
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

// "use client";
// import React, { useEffect, useState } from "react";
// import Link from "next/link";
// import { doc, getDoc,setDoc, collection, getDocs } from "firebase/firestore";
// import { db, auth } from "../../../../firebase/config";
// import { useAuthState } from "react-firebase-hooks/auth";
// import GooglePayButton from "@google-pay/button-react";

// function page({ params }) {
//   const [user] = useAuthState(auth);
//   const [loading, setLoading] = useState(true);
//   const [course, setCourse] = useState(null);
//   const [student, setStudent] = useState(null);
//   const [enroll, setEnroll] = useState(true);

//   useEffect(() => {
//     if (user) {
//       getDoc(doc(db, "courses", params.courseid)).then((doc) => {
//         if (doc.exists()) {
//           setCourse(doc.data());
//         }
//         setLoading(false);
//       });
//     }
//   }, [user]);

//   const handleEnroll = async () => {
//     const studentRef = doc(db, "students", params.studentid);
//     const courseRef = doc(db, "courses", params.courseid);
//     const studentSnap = await getDoc(studentRef);
//     const courseSnap = await getDoc(courseRef);
//     if (studentSnap.exists() && courseSnap.exists()) {
//       const studentData = studentSnap.data();
//       const courseData = courseSnap.data();
//       console.log('studentData', studentData);
//       console.log('courseData', courseData);
//       if (studentData.courses) {
//         studentData.courses.push(courseData._id);
//       } else {
//         studentData.courses = [courseData._id];
//       }
//       console.log(studentData)
//       if (courseData.students) {
//         courseData.students.push(studentData._id);
//       } else {
//         courseData.students = [studentData._id];
//       }
//       await setDoc(studentRef, studentData);
//       await setDoc(courseRef, courseData);
//       setEnroll(false);
//     }
//   }

//   useEffect(() => {
//     const getStudent = async () => {
//       const studentRef = doc(db, "students", params.studentid);
//       const studentSnap = await getDoc(studentRef);
//       if (studentSnap.exists()) {
//         setStudent(studentSnap.data());
//         if (studentSnap.data().courses) { // Add null check here
//           for (let i = 0; i < studentSnap.data().courses.length; i++) {
//             if (studentSnap.data().courses[i] === params.courseid) {
//               setEnroll(false);
//             }
//           }
//         }
//       }
//     };
//     getStudent();
//   }, [params.studentid]);

//   console.log(student);
//   console.log(course);

//   return (
//     <div>
//       <div className="flex flex-row justify-between items-center">
//         {course && (
//           <div>
//             <p>{course.courseName}</p>
//             <p>{course.latitude}</p>
//             <p>{course.longitude}</p>
//           </div>
//         )}

//         {enroll && <button className="bg-slate-300" onClick={handleEnroll}>Enroll</button>}
//         {!enroll && <button className="bg-slate-300">Unenroll</button>}
//         <Link href={`/student/${params.studentid}/class/${params.courseid}`} className="bg-slate-300">Messages</Link>
//         {/* <GooglePayButton
//         environment="TEST"
//         buttonSizeMode="fill"
//         paymentRequest={{
//           apiVersion: 2,
//           apiVersionMinor: 0,
//           allowedPaymentMethods: [
//             {
//               type: "CARD",
//               parameters: {
//                 allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
//                 allowedCardNetworks: ["MASTERCARD", "VISA"],
//               },
//               tokenizationSpecification: {
//                 type: "PAYMENT_GATEWAY",
//                 parameters: {
//                   gateway: "example",
//                   gatewayMerchantId: "exampleGatewayMerchantId",
//                 },
//               },
//             },
//           ],
//           merchantInfo: {
//             merchantId: "12345678901234567890",
//             merchantName: "Demo Merchant",
//           },
//           transactionInfo: {
//             totalPriceStatus: "FINAL",
//             totalPriceLabel: "Total",
//             totalPrice: "100.00",
//             currencyCode: "INR",
//             countryCode: "IN",
//           },
//           onLoadingPaymentData: (paymentRequest) => {
//             console.log("Loading payment data", paymentRequest);
//             history.push("/confirm");
//           }
//         }}
//         /> */}
//       </div>
//     </div>
//   );
// }

// export default page;
