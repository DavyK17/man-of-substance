import { render, fireEvent } from "@testing-library/react";
import moment from "moment";
import Login from "../../components/Contributors/Login";

describe("Contributors - Login page", () => {
    test("calls loginClick when submit button is clicked", () => {
        const submitMock = jest.fn();
        const { getByTestId } = render(<Login handleSubmit={submitMock} />);
    
        let form = getByTestId("contributor-login");
        fireEvent.submit(form);
        expect(submitMock).toBeCalled(); 
    });

    const setTypeMock = jest.fn();
    let page, signedIn, validUserMock;
    const submitMock = e => {
        e.preventDefault();

        let data = validUserMock;
        if (!data) return document.getElementById("status").innerHTML = "This email does not exist in the database";
        if (data.rewardsClaimed) return document.getElementById("status").innerHTML = "Rewards have already been claimed for this user";
        if (data.amount) {
            if (data.amount >= 100 && data.amount <= 1999 && Date.now() < 1667509200000)
                return document.getElementById("status").innerHTML = `Your rewards will be available ${moment(1667509200000).fromNow()}`;
            if (data.amount >= 2000 && data.amount <= 49999 && Date.now() < 1667250000000)
                return document.getElementById("status").innerHTML = `Your rewards will be available ${moment(1667250000000).fromNow()}`;
            if (data.amount >= 50000 && Date.now() < 1666904400000)
                return document.getElementById("status").innerHTML = `Your rewards will be available ${moment(1666904400000).fromNow()}`;
        }
        if (!signedIn) return document.getElementById("status").innerHTML = "Login failed. Kindly check your Internet connection and try again.";
        
        validUserMock = { ...data, signedIn };
    }

    describe("Locked", () => {
        beforeEach(() => {
            const { getByText, getByTestId } = render(<Login setType={setTypeMock} validUser={validUserMock} handleSubmit={submitMock} />);
            page = { getByText, getByTestId };
        });

        beforeAll(() => {
            jest.useFakeTimers();
            jest.setSystemTime(new Date(1666818000000));
        });

        afterAll(() => {
            jest.runOnlyPendingTimers();
            jest.useRealTimers();
        });

        test("shows lock message for supporter-bronze contributors", () => {
            validUserMock = { id: 1, name: "John Doe", email: "john@doe.com", amount: 100, rewardsClaimed: false };
            let login = page.getByTestId("contributor-login");
            fireEvent.submit(login);
            
            let status = page.getByText("Your rewards will be available in 8 days");
            expect(status).toBeInTheDocument();
        });

        test("shows lock message for silver-platinum contributors", () => {
            validUserMock = { id: 1, name: "John Doe", email: "john@doe.com", amount: 3000, rewardsClaimed: false };
            let login = page.getByTestId("contributor-login");
            fireEvent.submit(login);
            
            let status = page.getByText("Your rewards will be available in 5 days");
            expect(status).toBeInTheDocument();
        });

        test("shows lock message for executive contributors", () => {
            validUserMock = { id: 1, name: "John Doe", email: "john@doe.com", amount: 75000, rewardsClaimed: false };
            let login = page.getByTestId("contributor-login");
            fireEvent.submit(login);
            
            let status = page.getByText("Your rewards will be available in a day");
            expect(status).toBeInTheDocument();
        });
    });

    describe("Unlocked", () => {
        beforeEach(() => {
            const { getByText, getByTestId } = render(<Login setType={setTypeMock} validUser={validUserMock} handleSubmit={submitMock} />);
            page = { getByText, getByTestId };
        });

        beforeAll(() => {
            jest.useFakeTimers();
            jest.setSystemTime(new Date(1667509200000));
        });

        afterAll(() => {
            jest.runOnlyPendingTimers();
            jest.useRealTimers();
        });

        test("shows error message when AWS login fails", () => {
            signedIn = false;
            validUserMock = { id: 1, name: "John Doe", email: "john@doe.com", amount: 75000, rewardsClaimed: false };
            let login = page.getByTestId("contributor-login");
            fireEvent.submit(login);
            
            let status = page.getByText("Login failed. Kindly check your Internet connection and try again.");
            expect(status).toBeInTheDocument();
        });
    });
});