import { Request, Response } from 'express';
import { extractTokenFromRequest } from './tokenExtractor';

const axios = require('axios');
const functions = require('firebase-functions');
const admin = require('firebase-admin');
if (admin.apps.length === 0) {
  admin.initializeApp();
}

const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const cookieParser = require('cookie-parser')();

const axiosApi = axios.create({baseURL: 'http://localhost:3000'});

app.use(cookieParser);

const hbsConfig = {
    defaultLayout: 'dashboard', 
    layoutsDir: "views/dashboard/layouts/",
    partialsDir: "views/dashboard/partials/"
};

app.engine('handlebars', exphbs(hbsConfig));
app.set('view engine', 'handlebars');

app.get('/', async (req: Request, res: Response) => {

    const appSettings = {
      appName: "Our Apartment"
    };

    res.render('dashboard/index', {
      appSettings: appSettings
    });
  
});

app.get('/login', async (req: Request, res: Response) => {
  res.render('dashboard/login', {
    layout: false,
  });
});

app.get('/society', async (req: Request, res: Response) => {

  const appSettings = {
    appName: "Our Apartment"
  };

  const token = extractTokenFromRequest(req);
  console.log("Token: ", token);
  axiosApi.defaults.headers.common['Authorization'] = "Bearer " + token;
  const socDetails = await _getSocietyDetails();
  
  res.render('dashboard/society', {
    appSettings: appSettings,
    societyDetails: socDetails
  });

});

async function _getSocietyDetails(){

  const socList = await axiosApi.get("/society");
  return socList.data[0];
}

exports.dashboardApp = functions.https.onRequest(app);