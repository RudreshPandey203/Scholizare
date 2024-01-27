'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '../../../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { auth } from '../../../firebase/config';
import { useAuthState } from 'react-firebase-hooks/auth';
import Link from 'next/link';


const Page = () => {
    const [courseData, setCourseData] = useState(null);
    const router = useRouter();
    const [user] = useAuthState(auth);
    const userSession = sessionStorage.getItem('user');
    const [hostedCourses, setHostedCourses] = useState([]);

    useEffect(() => {
        const getData = async () => {
                // Check if user is authenticated
                if (user || userSession) {
                        try {
                                const docRef = doc(db, 'teachers', user ? auth.currentUser.uid : userSession);
                                const docSnap = await getDoc(docRef);

                                console.log(docSnap.data().courses);

                                if (docSnap.exists()) {
                                        const courses = docSnap.data().courses;
                                        const hostedCoursesData = [];

                                        for (const courseId of courses) {
                                                const courseDocSnap = await getDoc(doc(db, 'courses', courseId));

                                                if (courseDocSnap.exists()) {
                                                        hostedCoursesData.push(courseDocSnap.data());
                                                } else {
                                                        console.log(`No course found with id: ${courseId}`);
                                                }
                                        }

                                        setHostedCourses(hostedCoursesData);
                                } else {
                                        console.log('No such document!');
                                }
                        } catch (error) {
                                console.error('Error getting document:', error.message);
                        }
                } else {
                        // router.replace('/teacher/signin');
                }
        };

        getData();
    }, [user, userSession]);

    return (
        <div>
            Course Page
            <br/>
            {hostedCourses.map((course) => (
                <Link className="block m-5 p-5 bg-slate-400" key={course.courseName}
                href={`class/${course._id}`}>
                    <h3>{course.courseName}</h3>
                    <p>{course.studentConstraints}</p>
                    <p>{course.location}</p>
                    <p>{course.fees}</p>
                </Link>
            ))}
        </div>
    );
};

export default Page;
