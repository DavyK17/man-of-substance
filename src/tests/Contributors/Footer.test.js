import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Footer from "../../components/Contributors/Footer";

describe("Contributors - Footer component", () => {
    const introMock = jest.fn(), submitMock = jest.fn(), logoutMock = jest.fn();
    const validUserMock = { id: 1, name: "John Doe", email: "john@doe.com", amount: 100, rewardsClaimed: false, signedIn: true };

    let page;
    beforeEach(() => {
        const { getByText } = render(<Footer validUser={validUserMock} submitClick={submitMock} introClick={introMock} logoutClick={logoutMock} />);
        page = { getByText };
    });

    test("calls submitClick when 'Claim rewards' button is clicked", () => {
        let submit = page.getByText("Claim rewards");
        userEvent.click(submit);
        expect(submitMock).toBeCalled();
    });

    test("calls introClick when 'Back to Intro' button is clicked", () => {
        let intro = page.getByText("Back to Intro");
        userEvent.click(intro);
        expect(introMock).toBeCalled();
    });

    test("calls logoutClick when logout button is clicked", () => {
        let logout = page.getByText("Logout");
        userEvent.click(logout);
        expect(logoutMock).toBeCalled();
    });
});

