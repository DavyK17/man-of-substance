import { MemoryRouter } from "react-router-dom";
import { render, fireEvent, within } from "@testing-library/react";
import App from "../../App";
import userEvent from "@testing-library/user-event";

global.scrollTo = jest.fn();

describe("Track page", () => {
    let id = 2;
    let page;
    beforeEach(() => {
        const { getByText, getByTestId, queryByTestId, getByLabelText } = render(
            <MemoryRouter initialEntries={[`/tracks/${id}`]}>
                <App />
            </MemoryRouter>
        );
        page = { getByText, getByTestId, queryByTestId, getByLabelText};
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
            let message = page.getByText("This content will be available on release day.");
            expect(message).toBeInTheDocument();
        });
    });

    describe("Pre-release", () => {
        beforeAll(() => {
            jest.useFakeTimers();
            jest.setSystemTime(new Date(1667422800001));
        });

        afterAll(() => {
            jest.runOnlyPendingTimers();
            jest.useRealTimers();
        });

        test("shows track header", () => {
            let head = page.getByTestId("track-head");
            expect(head).toBeInTheDocument();
        });

        test("shows lock message", () => {
            let message = page.getByText("This content will be available on release day.");
            expect(message).toBeInTheDocument();
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

        test("shows track header", () => {
            let head = page.getByTestId("track-head");
            expect(head).toBeInTheDocument();
        });

        describe("Body", () => {
            describe("General", () => {
                test("shows track links", () => {
                    let links = page.getByTestId("track-links");
                    expect(links).toBeInTheDocument();
                });
        
                test("shows track synopsis", () => {
                    let synopsis = page.queryByTestId("track-synopsis");
                    expect(synopsis).toBeInTheDocument();
        
                    let lyrics = page.queryByTestId("track-lyrics");
                    expect(lyrics).not.toBeInTheDocument();
        
                    let credits = page.queryByTestId("track-credits");
                    expect(credits).not.toBeInTheDocument();
                });
        
                test("renders credits when corresponding button is clicked", () => {
                    let track = page.getByTestId(`track-${id}`);
                    userEvent.click(within(track).getByText("Credits"));
        
                    let credits = page.queryByTestId("track-credits");
                    expect(credits).toBeInTheDocument();
        
                    let synopsis = page.queryByTestId("track-synopsis");
                    expect(synopsis).not.toBeInTheDocument();
        
                    let lyrics = page.queryByTestId("track-lyrics");
                    expect(lyrics).not.toBeInTheDocument();
                });
    
                test("renders lyrics when corresponding button is clicked", () => {
                    userEvent.click(page.getByText("Lyrics"));
        
                    let lyrics = page.queryByTestId("track-lyrics");
                    expect(lyrics).toBeInTheDocument();
        
                    let synopsis = page.queryByTestId("track-synopsis");
                    expect(synopsis).not.toBeInTheDocument();
        
                    let credits = page.queryByTestId("track-credits");
                    expect(credits).not.toBeInTheDocument();
                });
        
                test("renders synopsis when corresponding button is clicked", () => {
                    userEvent.click(page.getByText("Lyrics"));
                    userEvent.click(page.getByText("Synopsis"));
                    
                    let synopsis = page.queryByTestId("track-synopsis");
                    expect(synopsis).toBeInTheDocument();
        
                    let lyrics = page.queryByTestId("track-lyrics");
                    expect(lyrics).not.toBeInTheDocument();
        
                    let credits = page.queryByTestId("track-credits");
                    expect(credits).not.toBeInTheDocument();
                });
            });

            describe("Navigation", () => {
                describe("Keydown", () => {
                    test("renders previous track when left arrow key is pressed", () => {
                        expect(id).toEqual(2);
        
                        let track = page.getByTestId(`track-${id}`);
                        fireEvent.keyDown(track, { code: "ArrowLeft" });
                        expect(page.getByTestId(`track-${id - 1}`)).toBeInTheDocument();
                    });
    
                    test("renders next track when right arrow key is pressed", () => {
                        expect(id).toEqual(2);
        
                        let track = page.getByTestId(`track-${id}`);
                        fireEvent.keyDown(track, { code: "ArrowRight" });
                        expect(page.getByTestId(`track-${id + 1}`)).toBeInTheDocument();
                    });
    
                    test("renders credits when C key is pressed", () => {
                        let track = page.getByTestId(`track-${id}`);
    
                        fireEvent.keyDown(track, { code: "KeyC" });
                        let credits = page.queryByTestId("track-credits");
                        expect(credits).toBeInTheDocument();
                    });
    
                    test("renders lyrics when L key is pressed", () => {
                        let track = page.getByTestId(`track-${id}`);
    
                        fireEvent.keyDown(track, { code: "KeyL" });
                        let lyrics = page.queryByTestId("track-lyrics");
                        expect(lyrics).toBeInTheDocument();
                    });
    
                    test("renders synopsis when S key is pressed", () => {
                        let track = page.getByTestId(`track-${id}`);
    
                        fireEvent.keyDown(track, { code: "KeyS" });
                        let synopsis = page.queryByTestId("track-synopsis");
                        expect(synopsis).toBeInTheDocument();
                    });

                    test("renders tracklist when Home key is pressed", () => {
                        let track = page.getByTestId(`track-${id}`);
    
                        fireEvent.keyDown(track, { code: "Home" });
                        let tracklist = page.queryByTestId("tracklist");
                        expect(tracklist).toBeInTheDocument();
                    });
    
                    test("no keydown if key pressed with modifier key", () => {
                        let track = page.getByTestId(`track-${id}`);
    
                        fireEvent.keyDown(track, { code: "KeyC", ctrlKey: true });
                        let synopsis = page.queryByTestId("track-synopsis");
                        expect(synopsis).toBeInTheDocument();
                    });
                });

                describe("Swiping", () => {
                    test("renders previous track when user swipes left", () => {
                        expect(id).toEqual(2);
                        let track = page.getByTestId(`track-${id}`);
    
                        fireEvent.touchStart(track, {
                            touches: [{ clientX: 0, clientY: 0 }]
                        });
                        fireEvent.touchMove(track, {
                            touches: [{ clientX: 75, clientY: 0 }]
                        });
                        fireEvent.touchEnd(track);
                        expect(page.getByTestId(`track-${id - 1}`)).toBeInTheDocument();
                    });
    
                    test("renders next track when user swipes right", () => {
                        expect(id).toEqual(2);
                        let track = page.getByTestId(`track-${id}`);
    
                        fireEvent.touchStart(track, {
                            touches: [{ clientX: 0, clientY: 0 }]
                        });
                        fireEvent.touchMove(track, {
                            touches: [{ clientX: -75, clientY: 0 }]
                        });
                        fireEvent.touchEnd(track);
                        expect(page.getByTestId(`track-${id + 1}`)).toBeInTheDocument();
                    });
    
                    test("no swipe if Y delta above 100", () => {
                        let track = page.getByTestId(`track-${id}`);
                        
                        fireEvent.touchStart(track, {
                            touches: [{ clientX: 0, clientY: 0 }]
                        });
                        fireEvent.touchMove(track, {
                            touches: [{ clientX: 100, clientY: 125 }]
                        });
                        fireEvent.touchEnd(track);
                        expect(track).toBeInTheDocument();
                    });
    
                    test("no swipe if X delta below 50", () => {
                        let track = page.getByTestId(`track-${id}`);
    
                        fireEvent.touchStart(track, {
                            touches: [{ clientX: 0, clientY: 0 }]
                        });
                        fireEvent.touchMove(track, {
                            touches: [{ clientX: 25, clientY: 0 }]
                        });
                        fireEvent.touchEnd(track);
                        expect(track).toBeInTheDocument();
                    });
                });
            });
        });

        describe("Footer", () => {
            test("shows track footer", () => {
                let footer = page.getByTestId("track-footer");
                expect(footer).toBeInTheDocument();
            });

            test("renders previous track when corresponding link is clicked", () => {
                expect(id).toEqual(2);

                let footer = page.getByTestId("track-footer");
                userEvent.click(within(footer).getByText("Straight Bars"));
                expect(page.getByTestId(`track-${id - 1}`)).toBeInTheDocument();
            });

            test("renders next track when corresponding link is clicked", () => {
                expect(id).toEqual(2);

                let footer = page.getByTestId("track-footer");
                userEvent.click(within(footer).getByText("Twenny 21"));
                expect(page.getByTestId(`track-${id + 1}`)).toBeInTheDocument();
            });

            test("renders corresponding track when track number is submitted in input", () => {
                let input = page.getByLabelText("Track number");
                let value = 9;

                fireEvent.change(input, { target: [{ value }]});
                fireEvent.submit(input);
                expect(page.getByTestId(`track-${value}`)).toBeInTheDocument();
            });
        });
    });
});