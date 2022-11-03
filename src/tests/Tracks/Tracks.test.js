import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import App from "../../App";
import userEvent from "@testing-library/user-event";

global.scrollTo = jest.fn();

describe("Tracklist page", () => {
    beforeEach(() => {
        render(
            <MemoryRouter initialEntries={["/tracks"]}>
                <App />
            </MemoryRouter>
        );
    });

    describe("Pre-release day eve", () => {
        beforeAll(() => {
            jest.useFakeTimers();
            jest.setSystemTime(new Date(1667347200000));
        });

        afterAll(() => {
            jest.runOnlyPendingTimers();
            jest.useRealTimers();
        });

        test("shows lock message", () => {
            let message = screen.getByText("This content will be available on the eve of release day.");
            expect(message).toBeInTheDocument();
        });
    });

    describe("Release day eve", () => {
        beforeAll(() => {
            jest.useFakeTimers();
            jest.setSystemTime(new Date(1667433600000));
        });

        afterAll(() => {
            jest.runOnlyPendingTimers();
            jest.useRealTimers();
        });

        test("displays tracklist lead", () => {
            let lead = screen.getByTestId("tracklist-lead");
            expect(lead).toBeInTheDocument();
        });

        test("displays tracklist version select", () => {
            let versionSelect = screen.getByTestId("version-select");
            expect(versionSelect).toBeInTheDocument();
        });
    
        test("displays tracklist", () => {
            let list = screen.getByTestId("tracklist-list");
            expect(list).toBeInTheDocument();
        });
    
        test("renders Track page when track name is clicked", () => {
            userEvent.click(screen.getByText("Straight Bars"));
            let track = screen.getByTestId("track");
            expect(track).toBeInTheDocument();
        });
    });
});