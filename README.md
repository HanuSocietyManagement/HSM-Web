[![Deploy to Firebase Hosting on merge](https://github.com/HanuSocietyManagement/HSM-Web/actions/workflows/firebase-hosting-merge.yml/badge.svg?branch=main)](https://github.com/HanuSocietyManagement/HSM-Web/actions/workflows/firebase-hosting-merge.yml)

## Local Testing
### Firebase Emulators
Start the firebase emulators with : `firebase emulators:start --export-on-exit --import=./.data`


To run a specefic site: `firebase emulators:start --only "hosting:app","hosting:routingAPI","functions","auth","firestore" --export-on-exit --import=./.data`