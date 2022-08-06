const Server = {
    url: "https://man-of-substance-server.herokuapp.com",
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
    }
}

export default Server;