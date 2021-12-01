const functions = require('firebase-functions');
import { Request, Response } from 'express';
const admin = require('firebase-admin');

/**
 * Express middleware that validates Firebase ID Tokens passed in the Authorization HTTP header.
 * The Firebase ID token needs to be passed as a Bearer token in the Authorization HTTP header like this:
 *  `Authorization: Bearer <Firebase ID Token>`.
 * when decoded successfully, the ID Token content will be added as `req.user`.
 * 
 * @param req The request object
 * @param res The response object
 * @param next Next handler
 * @returns 
 */
export async function validateFirebaseIdToken(req: Request, res: Response, next: any) {
  
    //functions.logger.log('Check if request is authorized with Firebase ID token');
  
    let idToken = extractTokenFromRequest(req);
  
    try {
      //console.log("ID Token: ",  idToken);
      const decodedIdToken: any = await admin.auth().verifyIdToken(idToken);
      //functions.logger.log('ID Token correctly decoded', decodedIdToken);
      //console.log("Decoded ID Token: ",  decodedIdToken);
      req.user = decodedIdToken;
      next();
      return;
    } catch (error) {
      functions.logger.error('Error while verifying Firebase ID token:', error);
      res.redirect('/admin/login')
      return;
    }
};

export function extractTokenFromRequest(req: Request): string | null {
  
  if ((!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) &&
      !(req.cookies && req.cookies.__session)) {
    functions.logger.error(
      'No Firebase ID token was passed as a Bearer token in the Authorization header.',
      'Make sure you authorize your request by providing the following HTTP header:',
      'Authorization: Bearer <Firebase ID Token>',
      'or by passing a "__session" cookie.'
    );
    //res.status(403).send('Unauthorized');
    return null;
  }

  let idToken;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    functions.logger.log('Found "Authorization" header');
    // Read the ID Token from the Authorization header.
    idToken = req.headers.authorization.split('Bearer ')[1];
  } else if(req.cookies) {
    functions.logger.log('Found "__session" cookie');
    // Read the ID Token from cookie.
    idToken = req.cookies.__session;
  } else {
    // No cookie
    return null;
  }

  return idToken;
};