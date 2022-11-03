import { MemoryRouter } from "react-router-dom";
import { render, fireEvent, within } from "@testing-library/react";
import App from "../../App";
import userEvent from "@testing-library/user-event";

global.scrollTo = jest.fn();

describe("Tracklist page", () => {
    let page;
    beforeEach(() => {
        const { getByText, getByTestId, getByLabelText } = render(
            <MemoryRouter initialEntries={["/tracks"]}>
                <App />
            </MemoryRouter>
        );
        page = { getByText, getByTestId, getByLabelText};
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
            let message = page.getByText("This content will be available on the eve of release day.");
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
            let lead = page.getByTestId("tracklist-lead");
            expect(lead).toBeInTheDocument();
        });

        test("displays tracklist version select", () => {
            let versionSelect = page.getByLabelText("Version");
            expect(versionSelect).toBeInTheDocument();
        });
    
        test("displays full tracklist", () => {
            let tracklist = page.getByTestId("tracklist-list");
            expect(tracklist).toBeInTheDocument();

            let tracks = within(tracklist).getAllByRole("listitem");
            expect(tracks.length).toEqual(17);
        });

        test("alters tracklist when version select is clicked", () => {
            let versionSelect = page.getByLabelText("Version");
            let tracklist = page.getByTestId("tracklist-list");
            let tracks;

            let versions = ["base", "mixtape", "expanded", "full"];
            versions.forEach(version => {
                fireEvent.change(versionSelect, { target: { value: version }});
                tracks = within(tracklist).getAllByRole("listitem");

                let length = version === "base" ? 10 : version === "mixtape" ? 12 : version === "expanded" ? 14 : 17;
                expect(tracks.length).toEqual(length);
            });
        });
    
        test("renders Track page when track name is clicked", () => {
            userEvent.click(page.getByText("Straight Bars"));
            let track = page.getByTestId("track");
            expect(track).toBeInTheDocument();
        });
    });
});