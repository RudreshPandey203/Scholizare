import express from 'express';
import { google, } from 'googleapis'
import dotenv from 'dotenv';
dotenv.config();

const app = express();

const PORT = 8000;

console.log("hello")

console.log(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

const auth2Client = new google.auth.OAuth2(
    "329972626495-3ljhka68saeml9oqj3aidnmi5354ipmq.apps.googleusercontent.com",
    // process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    "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",
    "http://localhost:8000/google/redirect"
);

const scopes = [
    'https://www.googleapis.com/auth/calendar',
];


app.get('/google', (req, res) => {

    const url = auth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes
    });

    res.redirect(url);

});

app.get('/google/redirect', async (req, res) => {
    res.send("it is working")
}
);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    }
);
