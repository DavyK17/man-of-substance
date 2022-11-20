import { MemoryRouter } from "react-router-dom";
import { render } from "@testing-library/react";
import App from "../../App";
import userEvent from "@testing-library/user-event";

global.scrollTo = jest.fn();

describe("Contributors page", () => {
    let page;
    beforeEach(() => {
        const { getByText, getByTestId } = render(
            <MemoryRouter initialEntries={["/contributors"]}>
                <App />
            </MemoryRouter>
        );
        page = { getByText, getByTestId };
    });

    test("renders Intro component", () => {
        let lead = page.getByTestId("contributors-lead");
        expect(lead).toBeInTheDocument();

        let list = page.getByTestId("contributors-list");
        expect(list).toBeInTheDocument();
    });

    test("renders Login page when corresponding link is clicked", () => {
        let link = page.getByText("clicking here");
        userEvent.click(link);
        
        let login = page.getByTestId("contributor-login");
        expect(login).toBeInTheDocument();
    });
});