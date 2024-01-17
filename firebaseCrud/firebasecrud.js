'use client'
import { firebaseConfig } from "@/app/firebase/config"
import {ref, set, get, update, remove, child} from "firebase/database";
import { useState } from "react";