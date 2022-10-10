const MPesa = {
    getAccessToken: async() => {
        const url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
        let headers = { "Authorization": "Bearer cFJZcjZ6anEwaThMMXp6d1FETUxwWkIzeVBDa2hNc2M6UmYyMkJmWm9nMHFRR2xWOQ==" };

        try {
            const response = await fetch(url, { headers });
            if (response.ok) {
                const text = await response.text();
                console.log(text);
            }
        } catch (err) {
            console.log(err);
        }
    },

    makePayment: async() => {
        const url = "https://sandbox.safaricom.co.ke/mpesa/b2c/v1/paymentrequest";
        let headers = { "Content-Type": "application/json", "Authorization": "Bearer YXlG5gbzv0iDr4cwOag97O6DcKWa" };
        let body = JSON.stringify({
            "InitiatorName": "testapi",
            "SecurityCredential": "e4G1kDrf2UC97Y2/8lNHscBJvAebbNOXXLSSflI7naogtjpF5qIqDU/oZFYwydo0jvYdMMJOeC/Tj+W5jk21XtOwt/Hpa9a2loSd/BBE2cjvNxqVCpJUJ6NyzHwAUl94gVevNv8yPH/XbTwTQYgzdcnZ3+gnleplIPRlEVlEa+Oz/79T7ClYoOL5KODbtit3pSQHB8U5g790xvpclwUm/vMicBekOP+U6/IfZYxM0qFpXRejM8V3XHM9OuHImqh92b+F6kKfajOJUkuUN2l0+PLvq4TL9pOHw1bwI4OyxEItgdBaa7UBY0o4eyy21X7Znx7QUNe/autep6kHipoZQg==",
            "CommandID": "BusinessPayment",
            "Amount": 5000,
            "PartyA": 600983,
            "PartyB": 254708374149,
            "Remarks": "Test remarks",
            "QueueTimeOutURL": "https://mydomain.com/b2c/queue",
            "ResultURL": "https://mydomain.com/b2c/result",
            "Occassion": "",
        });

        try {
            const response = await fetch(url, { method: "POST", headers, body });
            if (response.ok) {
                const text = await response.text();
                console.log(text);
            }
        } catch (err) {
            console.log(err);
        }
    },
}

export default MPesa;