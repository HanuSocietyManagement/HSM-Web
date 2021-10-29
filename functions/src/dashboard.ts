import { Request, Response } from 'express';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
if (admin.apps.length === 0) {
  admin.initializeApp();
}

const express = require('express');
const app = express();
const exphbs = require('express-handlebars');

const hbsConfig = {
    defaultLayout: 'dashboard', 
    layoutsDir: "views/dashboard/layouts/",
    partialsDir: "views/dashboard/partials/"
};

app.engine('handlebars', exphbs(hbsConfig));
app.set('view engine', 'handlebars');

app.get('/dashboard', async (req: Request, res: Response) => {

    const appSettings = {
      appName: "Our Apartment"
    };

    res.render('dashboard/index', {
      appSettings: appSettings
    });
  
});

app.get('/dashboard/society', async (req: Request, res: Response) => {

  const appSettings = {
    appName: "Our Apartment"
  };

  const socDetails = {
    name: "LE",
    address: "ML"
  }

  res.render('dashboard/society', {
    appSettings: appSettings,
    societyDetails: socDetails
  });

});

exports.dashboardApp = functions.https.onRequest(app);