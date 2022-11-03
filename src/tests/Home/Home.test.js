import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import App from "../../App";
import userEvent from "@testing-library/user-event";

describe("Home page", () => {
    beforeEach(() => {
        render(
            <Router>
                <App />
            </Router>
        );
    });

    describe("Pre-trailer", () => {
        beforeAll(() => {
            jest.useFakeTimers();
            jest.setSystemTime(new Date(1666828800000));
        });

        afterAll(() => {
            jest.runOnlyPendingTimers();
            jest.useRealTimers();
        });

        test("shows countdown to trailer", () => {
            let countdown = screen.getByTestId("countdown");
            expect(countdown).toBeInTheDocument();
        });
    });

    describe("Post-trailer", () => {
        beforeAll(() => {
            jest.useFakeTimers();
            jest.setSystemTime(new Date(1666915200000));
        });

        afterAll(() => {
            jest.runOnlyPendingTimers();
            jest.useRealTimers();
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
});