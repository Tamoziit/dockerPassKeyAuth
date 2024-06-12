const uuid = require("uuid").v4;
const base64url = require("base64url");
const passport = require("passport");

class AuthController {
    passportCheck() {
        return passport.authenticate("webauthn", {
            failureMessage: true,
            failWithError: true,
        });
    }

    admitUser(req, res, next) {
        res.json({ ok: true, destination: "/" }); //setting the user to "/" route if authenticated
    }

    denyUser(err, req, res, next) {
        const cxx = Math.floor(err.status / 100);
        if (cxx != 4) return next(err); //checking if error status is not 400 code

        res.json({ ok: false, destination: "/login" }); //If 400 code, redirecting back to "/login"
    }

    register(req, res) {
        res.render("auth/register");
    }

    login(req, res) {
        res.render("auth/login");
    }

    logout(req, res, next) {
        req.logout((err) => {
            if (err) return next(err);
            req.redirect("/");
        })
    }

    createChallengeFrom(store) {
        return (req, res, next) => {
            const user = {
                id: uuid({}, Buffer.alloc(16)), //generating a uid of length 16
                name: req.body.email,
            }

            //setting up the challenge to be relayed to client
            store.challenge(req, { user: user }, (err, challenge) => {
                if (err) return next(err);
                user.id = base64url.encode(user.id);
                res.json({
                    user: user,
                    challenge: base64url.encode(challenge),
                })
            })
        }
    }

    getChallengeFrom(store) {
        return (req, res, next) => {
            store.challenge(req, (err, challenge) => {
                if (err) return next(err);
                res.json({ challenge: base64url.encode(challenge) });
            })
        }
    }
}

module.exports = AuthController;