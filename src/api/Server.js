const Server = {
    url: process.env.NODE_ENV === "production" ? "https://man-of-substance-server.herokuapp.com" : "http://localhost:8000",
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

    attemptChallenge: async(name, phone, answer) => {
        try {
            let ip = await fetch("https://api.ipify.org/");
            ip = await ip.text();

            const url = `${Server.url}/challenge`;
            const data = new URLSearchParams({ name, phone, ip, answer });

            let response = await fetch(url, { method: "POST", body: data });
            if (response.ok) {
                response = response.text();
                return response;
            }
        } catch (err) {
            console.log(err);
        }
    },

    getAttempts: async() => {
        try {
            let ip = await fetch("https://api.ipify.org/");
            ip = await ip.text();

            const url = `${Server.url}/challenge?ip=${ip}`;

            let response = await fetch(url);
            if (response.ok) {
                response = response.json();
                return response;
            }
        } catch (err) {
            console.log(err);
        }
    }
}

export default Server;