const Server = {
    url: `${process.env.NODE_ENV === "production" ? "https://server.mos.davykamanzi.com" : "http://localhost:8000"}/api`,
    getContributors: async() => {
        try {
            const url = `${Server.url}/contributors`;

            let response = await fetch(url);
            if (response.ok) {
                response = response.json();
                return response;
            }
        } catch (err) {
            console.log(err);
        }
    },

    getContributorByEmail: async(email) => {
        try {
            const url = `${Server.url}/contributors?email=${email}`;

            let response = await fetch(url);
            if (response.ok) {
                response = response.json();
                return response;
            }
        } catch (err) {
            console.log(err);
        }
    },

    claimRewards: async(email) => {
        try {
            const url = `${Server.url}/contributors`;
            const data = new URLSearchParams({ email });

            let response = await fetch(url, { method: "POST", body: data });
            if (response.ok) {
                response = response.text();
                return response;
            }
        } catch (err) {
            console.log(err);
        }
    },

    attemptChallenge: async(name, phone, answer) => {
        try {
            let ip = await fetch("https://api.ipify.org/");
            ip = await ip.text();

            const url = `${Server.url}/challenge`;
            const data = new URLSearchParams({ name, phone, ip, answer });

            let response = await fetch(url, { method: "POST", body: data });
            let text = await response.text();
            
            response = { status: response.status, text };
            return response;
        } catch (err) {
            console.log(err);
        }
    },

    getAttempts: async() => {
        try {
            const url = `${Server.url}/challenge`;

            let response = await fetch(url);
            if (response.ok) {
                response = response.json();
                return response;
            }
        } catch (err) {
            console.log(err);
        }
    },
}

export default Server;