const express = require("express");
const router = express.Router();

//Passport
const PassportService = require("../app/services/passport-service");
const SessionChallengeStore = require("passport-fido2-webauthn").SessionChallengeStore;
const passportService = new PassportService();
const store = new SessionChallengeStore();
passportService.init(store); //initializing passport store service instance

//routes
const pages = new (require("../app/controllers/pages"))();
const auth = new (require("../app/controllers/auth"))();
const admin = new (require("../app/controllers/admin"))();

//handlers
router.get("/", pages.welcome, admin.dashboard);
router.get("/register", auth.register);
router.get("/login", auth.login);

module.exports = router;