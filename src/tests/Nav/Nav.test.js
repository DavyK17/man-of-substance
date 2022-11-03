import React from "react";
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

    test("loads Home page when corresponding button is clicked", () => {
        userEvent.click(screen.getByText("Home"));
        let home = screen.getByTestId("home");
        expect(home).toBeInTheDocument();
    });

    test("loads Contributors page when corresponding button is clicked", () => {
        userEvent.click(screen.getByText("Contributors"));
        let contributors = screen.getByTestId("contributors");
        expect(contributors).toBeInTheDocument();
    });

    test("loads Tracklist page when corresponding button is clicked", () => {
        userEvent.click(screen.getByText("Tracklist"));
        let tracklist = screen.getByTestId("tracklist");
        expect(tracklist).toBeInTheDocument();
    });

    test("loads Credits page when corresponding button is clicked", () => {
        userEvent.click(screen.getByText("Credits"));
        let credits = screen.getByTestId("credits");
        expect(credits).toBeInTheDocument();
    });
});