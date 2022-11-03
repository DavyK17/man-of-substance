import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import App from "../../App";
import userEvent from "@testing-library/user-event";

global.scrollTo = jest.fn();

describe("Navigation menu", () => {
    beforeEach(() => {
        render(
            <MemoryRouter initialEntries={["/nope"]}>
                <App />
            </MemoryRouter>
        );
    });

    test("renders Home page when corresponding button is clicked", () => {
        userEvent.click(screen.getByText("Home"));
        let home = screen.getByTestId("home");
        expect(home).toBeInTheDocument();
    });

    test("renders Contributors page when corresponding button is clicked", () => {
        userEvent.click(screen.getByText("Contributors"));
        let contributors = screen.getByTestId("contributors");
        expect(contributors).toBeInTheDocument();
    });

    test("renders Tracklist page when corresponding button is clicked", () => {
        userEvent.click(screen.getByText("Tracklist"));
        let tracklist = screen.getByTestId("tracklist");
        expect(tracklist).toBeInTheDocument();
    });

    test("renders Credits page when corresponding button is clicked", () => {
        userEvent.click(screen.getByText("Credits"));
        let credits = screen.getByTestId("credits");
        expect(credits).toBeInTheDocument();
    });
});