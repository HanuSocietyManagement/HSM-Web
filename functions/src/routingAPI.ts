import { Request, Response } from 'express';
import { validateFirebaseIdToken } from './tokenExtractor';
import { jugnu } from '@fire-fly/jugnu';
import { User } from './model/user';
import { CookieJar } from 'tough-cookie';
import { wrapper } from 'axios-cookiejar-support';

const CryptoJS = require("crypto-js");
const axios = require('axios');
const functions = require('firebase-functions');
const admin = require('firebase-admin');
if (admin.apps.length === 0) {
  admin.initializeApp();
}

const express = require('express');
const cors = require('cors')
const app = express();
const cookieParser = require('cookie-parser')();

const jar = new CookieJar();
const legacyApi = wrapper(axios.create({ baseURL: 'https://ourapartment.app', withCredentials: true, jar }));
//const webApi = wrapper(axios.create({ baseURL: 'http://localhost:5099', withCredentials: true, jar }));

const corsOptions = {origin: "http://localhost:5099"};
app.use(cookieParser);
app.use(validateFirebaseIdToken);
app.use(cors(corsOptions));

const userCollection = jugnu.createFirebaseCollection(User);

app.get('/android/*', async (req: Request, res: Response) => {

  const userId: string = req.user? req.user.user_id : "";
  const userData: User = await userCollection.getDocument(userId);
  const requestPath = req.path.replace("android/", "");
  console.log("Path requested", requestPath);
  
  await _doLogin(userData);
  const apiResponse = await legacyApi.get(requestPath, req.body);
  res.send(apiResponse.data);

});

app.post('/android/*', async (req: Request, res: Response) => {

  const userId: string = req.user? req.user.user_id : "";
  const userData: User = await userCollection.getDocument(userId);
  const requestPath = req.path.replace("android/", "");
  console.log("Path requested", requestPath);
  
  await _doLogin(userData);
  const apiResponse = await legacyApi.post(requestPath, req.body);
  res.send(apiResponse.data);
  
});

async function _doLogin(user: User){

  // Decrypt
  const secret_key = process.env.SECRET_KEY;
  const bytes  = CryptoJS.AES.decrypt(user.temp.p, secret_key);
  const p = bytes.toString(CryptoJS.enc.Utf8);

  const data = {user_name: user.temp.u, password: p};
  await legacyApi.post("/app/api/v1/login", data);
  console.log("Login done");
  return;
}

app.get('/invoice/*', async (req: Request, res: Response) => {

  console.log("GET Invoice called");
  let testData = [
    {
        documentNo:1,
        invoiceDate: "25 Mar 2021",
        description: "Invoice 3",
        amount: 200,
        paymentStatus: "Paid"
    },
    {
        documentNo:2,
        invoiceDate: "15 Mar 2021",
        description: "Invoice 2",
        amount: 200,
        paymentStatus: "Paid"
    }
  ];
  //res.set('Access-Control-Allow-Origin','http://localhost:5099');
  //res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

  //res.header('Access-Control-Allow-Origin','http://localhost:50992');
  res.send(testData);
});

exports.routingAPI = functions.https.onRequest(app);