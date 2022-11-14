import { BrowserRouter as Router } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import App from "../../App";
import userEvent from "@testing-library/user-event";

global.scrollTo = jest.fn();

describe("Home page", () => {
    beforeEach(() => {
        render(
            <Router>
                <App />
            </Router>
        );
    });

    describe("Locked", () => {
        beforeAll(() => {
            jest.useFakeTimers();
            jest.setSystemTime(new Date(1666818000000));
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

    describe("Unlocked", () => {
        describe("Pre-release", () => {
            beforeAll(() => {
                jest.useFakeTimers();
                jest.setSystemTime(new Date(1666904400001));
            });
    
            afterAll(() => {
                jest.runOnlyPendingTimers();
                jest.useRealTimers();
            });

            test("displays placeholder cover art", () => {
                let cover = screen.getByAltText("Man of Substance cover art");
                expect(cover.src).toContain("placeholder");
            });
        });

        describe("Post-release", () => {
            beforeAll(() => {
                jest.useFakeTimers();
                jest.setSystemTime(new Date(1667509200001));
            });
    
            afterAll(() => {
                jest.runOnlyPendingTimers();
                jest.useRealTimers();
            });

            test("displays actual cover art", () => {
                let cover = screen.getByAltText("Man of Substance cover art");
                expect(cover.src).toContain("cover");
            });
        });

        describe("General", () => {
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
    });
});