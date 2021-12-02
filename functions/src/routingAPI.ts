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
const app = express();
const cookieParser = require('cookie-parser')();

const jar = new CookieJar();
const axiosApi = wrapper(axios.create({ baseURL: 'https://ourapartment.app', withCredentials: true, jar }));

app.use(cookieParser);
app.use(validateFirebaseIdToken);

const userCollection = jugnu.createFirebaseCollection(User);

app.get('/*', async (req: Request, res: Response) => {

  const userId: string = req.user? req.user.user_id : "";
  const userData: User = await userCollection.getDocument(userId);
  
  await _doLogin(userData);
  const apiResponse = await axiosApi.get(req.path, req.body);
  res.send(apiResponse.data);

});

app.post('/*', async (req: Request, res: Response) => {

  const userId: string = req.user? req.user.user_id : "";
  const userData: User = await userCollection.getDocument(userId);
  
  await _doLogin(userData);
  const apiResponse = await axiosApi.post(req.path, req.body);
  res.send(apiResponse.data);
  
});

async function _doLogin(user: User){

  // Decrypt
  const secret_key = process.env.SECRET_KEY;
  const bytes  = CryptoJS.AES.decrypt(user.temp.p, secret_key);
  const p = bytes.toString(CryptoJS.enc.Utf8);

  const data = {user_name: user.temp.u, password: p};
  await axiosApi.post("/app/api/v1/login", data);
  //console.log("Login done", loginResponse.data);
  return;
}


exports.routingAPI = functions.https.onRequest(app);