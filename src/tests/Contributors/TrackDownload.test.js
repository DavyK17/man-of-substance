import { render, fireEvent } from "@testing-library/react";
import TrackDownload from "../../components/Contributors/TrackDownload";

describe("Contributors - TrackDownload component", () => {
    let page;
    const max = tier => {
        if (tier === "bronze") return 3;
        if (tier === "silver") return 5;
    };

    describe("Supporter tier", () => {
        beforeEach(() => {
            const { getByLabelText, queryByLabelText, queryByTestId } = render(<TrackDownload tier="supporter" max={max} />);
            page = { getByLabelText, queryByLabelText, queryByTestId };
        });

        test("renders track dropdown", () => {
            let trackDropdown = page.getByLabelText("Select a track to download (MP3):");
            expect(trackDropdown).toBeInTheDocument();
        });

        test("does not render track checklist", () => {
            let checklist = page.queryByTestId("track-checklist");
            expect(checklist).not.toBeInTheDocument();
        });

        test("does not render format dropdown", () => {
            let formatDropdown = page.queryByLabelText("Select your desired format:");
            expect(formatDropdown).not.toBeInTheDocument();
        });
    });

    describe("Bronze tier", () => {
        beforeEach(() => {
            const { getByTestId, getByLabelText, queryByLabelText } = render(<TrackDownload tier="bronze" max={max} />);
            page = { getByTestId, getByLabelText, queryByLabelText };
        });

        test("does not render track dropdown", () => {
            let trackDropdown = page.queryByLabelText("Select a track to download (MP3):");
            expect(trackDropdown).not.toBeInTheDocument();
        });

        test("renders track checklist", () => {
            let checklist = page.getByTestId("track-checklist");
            expect(checklist).toBeInTheDocument();
        });

        test("only allows user to check 3 options", () => {
            let box1 = page.getByLabelText("Straight Bars");
            fireEvent.click(box1);
            expect(box1.checked).toEqual(true);

            let box2 = page.getByLabelText("Not a Rapper, Pt. 2");
            fireEvent.click(box2);
            expect(box2.checked).toEqual(true);

            let box3 = page.getByLabelText("Twenny 21");
            fireEvent.click(box3);
            expect(box3.checked).toEqual(true);

            let box4 = page.getByLabelText("Only");
            fireEvent.click(box4);
            expect(box4.checked).toEqual(false);
        });

        test("does not render format dropdown", () => {
            let formatDropdown = page.queryByLabelText("Select your desired format:");
            expect(formatDropdown).not.toBeInTheDocument();
        });
    });

    describe("Silver tier", () => {
        beforeEach(() => {
            const { getByTestId, getByLabelText, queryByLabelText } = render(<TrackDownload tier="silver" max={max} />);
            page = { getByTestId, getByLabelText, queryByLabelText };
        });

        test("does not render track dropdown", () => {
            let trackDropdown = page.queryByLabelText("Select a track to download (MP3):");
            expect(trackDropdown).not.toBeInTheDocument();
        });

        test("renders track checklist", () => {
            let checklist = page.getByTestId("track-checklist");
            expect(checklist).toBeInTheDocument();
        });

        test("only allows user to check 5 options", () => {
            let box1 = page.getByLabelText("Straight Bars");
            fireEvent.click(box1);
            expect(box1.checked).toEqual(true);

            let box2 = page.getByLabelText("Not a Rapper, Pt. 2");
            fireEvent.click(box2);
            expect(box2.checked).toEqual(true);

            let box3 = page.getByLabelText("Twenny 21");
            fireEvent.click(box3);
            expect(box3.checked).toEqual(true);

            let box4 = page.getByLabelText("Only");
            fireEvent.click(box4);
            expect(box4.checked).toEqual(true);

            let box5 = page.getByLabelText("Masculine (Interlude)");
            fireEvent.click(box5);
            expect(box5.checked).toEqual(true);

            let box6 = page.getByLabelText("Simama Kando");
            fireEvent.click(box6);
            expect(box6.checked).toEqual(false);
        });

        test("renders format dropdown", () => {
            let formatDropdown = page.getByLabelText("Select your desired format:");
            expect(formatDropdown).toBeInTheDocument();
        });
    });

    describe("Gold, Platinum and Executive tiers", () => {
        let tiers = ["gold", "platinum", "executive"];
        tiers.forEach(tier => {
            beforeEach(() => {
                const { getByLabelText, queryByLabelText, queryByTestId } = render(<TrackDownload tier={tier} max={max} />);
                page = { getByLabelText, queryByLabelText, queryByTestId };
            });

            test("does not render track dropdown", () => {
                let trackDropdown = page.queryByLabelText("Select a track to download (MP3):");
                expect(trackDropdown).not.toBeInTheDocument();
            });
    
            test("does not render track checklist", () => {
                let checklist = page.queryByTestId("track-checklist");
                expect(checklist).not.toBeInTheDocument();
            });

            test("renders format dropdown", () => {
                let formatDropdown = page.getByLabelText("Select your desired format:");
                expect(formatDropdown).toBeInTheDocument();
            });
        });
    });
});