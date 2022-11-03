import { MemoryRouter } from "react-router-dom";
import { render, fireEvent, within } from "@testing-library/react";
import App from "../../App";
import userEvent from "@testing-library/user-event";

global.scrollTo = jest.fn();

describe("Tracklist page", () => {
    const { getByText, getByTestId, getByLabelText } = render(
        <MemoryRouter initialEntries={["/tracks"]}>
            <App />
        </MemoryRouter>
    );

    beforeEach(() => {
        render(
            <MemoryRouter initialEntries={["/tracks"]}>
                <App />
            </MemoryRouter>
        );
    });

    describe("Locked", () => {
        beforeAll(() => {
            jest.useFakeTimers();
            jest.setSystemTime(new Date(1667336400000));
        });

        afterAll(() => {
            jest.runOnlyPendingTimers();
            jest.useRealTimers();
        });

        test("shows lock message", () => {
            let message = getByText("This content will be available on the eve of release day.");
            expect(message).toBeInTheDocument();
        });
    });

    describe("Unlocked", () => {
        beforeAll(() => {
            jest.useFakeTimers();
            jest.setSystemTime(new Date(1667422800001));
        });

        afterAll(() => {
            jest.runOnlyPendingTimers();
            jest.useRealTimers();
        });

        test("displays tracklist lead", () => {
            let lead = getByTestId("tracklist-lead");
            expect(lead).toBeInTheDocument();
        });

        test("displays tracklist version select", () => {
            let versionSelect = getByLabelText("Version");
            expect(versionSelect).toBeInTheDocument();
        });
    
        test("displays full tracklist", () => {
            let tracklist = getByTestId("tracklist-list");
            expect(tracklist).toBeInTheDocument();

            let tracks = within(tracklist).getAllByRole("listitem");
            expect(tracks.length).toEqual(17);
        });

        test("alters tracklist when version select is clicked", () => {
            let versionSelect = getByLabelText("Version");
            let tracklist = getByTestId("tracklist-list");
            let tracks;

            const change = value => {
                fireEvent.change(versionSelect, { target: { value: value }});
                tracks = within(tracklist).getAllByRole("listitem");

                let length = value === "base" ? 10 : value === "mixtape" ? 12 : value === "expanded" ? 14 : 17;
                expect(tracks.length).toEqual(length);
            }

            change("base");
            change("mixtape");
            change("expanded");
            change("full");
        });
    
        test("renders Track page when track name is clicked", () => {
            userEvent.click(getByText("Straight Bars"));
            let track = getByTestId("track");
            expect(track).toBeInTheDocument();
        });
    });
});