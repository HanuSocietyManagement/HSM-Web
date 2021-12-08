## Local Testing
### Firebase Emulators
Start the firebase emulators with : `firebase emulators:start --export-on-exit --import=./.data`


To run a specefic site: `firebase emulators:start --only "hosting:routingAPI","hosting:app","functions","auth","firestore" --export-on-exit --import=./.data`