const express = require("express");
const router = express.Router();

//Passport
const PassportService = require("../app/services/passport-service");
const SessionChallengeStore = require("passport-fido2-webauthn").SessionChallengeStore;
const passportService = new PassportService();
const store = new SessionChallengeStore();
passportService.init(store); //initializing passport store service instance

//middlewares & handlers
const pages = new (require("../app/controllers/pages"))();
const auth = new (require("../app/controllers/auth"))();
const admin = new (require("../app/controllers/admin"))();

//routes
router.get("/", pages.welcome, admin.dashboard);
router.get("/register", auth.register);
router.get("/login", auth.login);
router.post(
    "/login/public-key",
    auth.passportCheck(),
    auth.admitUser,
    auth.denyUser
); //actions configured route.
router.post("/login/public-key/challenge", auth.getChallengeFrom(store));
router.post("/logout", auth.logout);
router.post("/register/public-key/challenge", auth.createChallengeFrom(store));

module.exports = router;