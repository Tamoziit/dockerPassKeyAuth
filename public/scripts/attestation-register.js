class Register {
    async init(event) {
        //Get challenge from server
        const challenge = await this.getChallenge(event);

        //Prompting the authenticator to create public key cred
        const credentials = await this.createPublicKeyPairWith(challenge);

        //Sending publickey & hallenge back to server to create a new user
        const currentUser = await this.loginWith(credentials);

        //Redirecting user to user dashboard, once authenticated
        this.redirect(currentUser);
    }

    async getChallenge(event) {
        const response = await fetch("/register/public-key/challenge", {
            method: "POST",
            headers: {
                Accept: "application/json",
            },
            body: new FormData(event.target),
        })
        return response.json();
    }

    async createPublicKeyPairWith(challengeResponse) {
        const options = {
            publicKey: {
                rp: { name: "tamoziitpasskey" }, //Relying party
                user: { //client
                    id: base64url.decode(challengeResponse.user.id),
                    name: challengeResponse.user.name,
                    displayName: challengeResponse.user.name,
                },
                challenge: base64url.decode(challengeResponse.challenge), //settuing up the signed challenge
                pubKeyCredParams: [ //Encrypting the public key credential
                    {
                        type: 'public-key',
                        alg: -7, //ES256 cryptographic algo - most preffered
                    },
                    {
                        type: 'public-key',
                        alg: -257, //RS256
                    },
                    {
                        type: 'public-key',
                        alg: -8, //Ed25519
                    }
                ],
                authenticatorSelection: {
                    userVerification: "preferred",
                },
            },
        }

        const newCredentials = await navigator.credentials.create(options); //from WebAuth API of JS.
        return newCredentials;
    }

    buildLoginOptionsWith(userCredentials) {
        const body = {
            response: {
                clientDataJSON: base64url.encode(userCredentials.response.clientDataJSON),
                attestationObject: base64url.encode(userCredentials.response.attestationObject),
            }
        }

        if (userCredentials.response.getTransports) {//checking if authenticator supports transports (eg: Bluetooth, uSB, etc.)
            body.response.transports = userCredentials.response.getTransports();
        }

        return body;
    }

    async loginWith(userCredentials) {
        const options = this.buildLoginOptionsWith(userCredentials);

        const response = await fetch("/login/public-key", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(options),
        })
        return response.json();
    }

    redirect(currentUser) {
        window.location.href = currentUser.destination;
    }
}

window.addEventListener("load", async () => {
    document
        .querySelector("#registration-form")
        .addEventListener("submit", async (event) => {
            event.preventDefault();

            const register = new Register();
            await register.init(event);
        })
})