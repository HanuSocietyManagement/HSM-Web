## Local Testing
### Firebase Emulators
Start the firebase emulators with : `firebase emulators:start --export-on-exit --import=./.data`


To run a specefic site: `firebase emulators:start --only "hosting:<target>","functions","auth","firestore"`