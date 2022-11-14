import { MemoryRouter } from "react-router-dom";
import { render, within } from "@testing-library/react";
import App from "../../App";

global.scrollTo = jest.fn();

describe("Album credits page", () => {
    let page;
    beforeEach(() => {
        const { getByText, getByTestId } = render(
            <MemoryRouter initialEntries={["/credits"]}>
                <App />
            </MemoryRouter>
        );
        page = { getByText, getByTestId };
    });

    describe("Locked", () => {
        beforeAll(() => {
            jest.useFakeTimers();
            jest.setSystemTime(new Date(1667422800000));
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

    describe("Unlocked", () => {
        beforeAll(() => {
            jest.useFakeTimers();
            jest.setSystemTime(new Date(1667509200001));
        });

        afterAll(() => {
            jest.runOnlyPendingTimers();
            jest.useRealTimers();
        });

        test("displays credits header", () => {
            let head = page.getByTestId("credits-head");
            expect(head).toBeInTheDocument();
        });

        test("displays credits", () => {
            let body = page.getByTestId("credits-body");
            expect(body).toBeInTheDocument();
            
            const titles = ["execProducers", "photography", "styling", "artwork", "trailer", "visualiser", "website"];
            titles.forEach(title => {
                let element = page.getByTestId(title);
                let heading = within(element).getByRole("heading");
                expect(heading).toBeInTheDocument();

                let paragraph = within(element).getByRole("paragraph");
                expect(paragraph).toBeInTheDocument();
            });
        });
    });
})