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
    defaultLayout: 'main', 
    layoutsDir: "views/app/layouts/",
    partialsDir: "views/app/partials/"
};

app.engine('handlebars', exphbs(hbsConfig));
app.set('view engine', 'handlebars');

app.get('/', async (req: Request, res: Response) => {

    const appSettings = {};
    res.render('index', {
      layout: false,
      settings: appSettings
    });
  
});

exports.homeApp = functions.https.onRequest(app);