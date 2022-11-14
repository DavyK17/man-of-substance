import { MemoryRouter } from "react-router-dom";
import { render, fireEvent, act, screen } from "@testing-library/react";
import App from "../../App";
import userEvent from "@testing-library/user-event";

global.scrollTo = jest.fn();

describe("Secret challenge", () => {
    let page;
    beforeEach(() => {
        const { getByText, getByTestId, getByLabelText } = render(
            <MemoryRouter initialEntries={[`/tracks/6`]}>
                <App />
            </MemoryRouter>
        );
        page = { getByText, getByTestId, getByLabelText };
        userEvent.click(page.getByText("Lyrics"));

        let link = page.getByText(process.env.REACT_APP_CHALLENGE_LYRIC);
        fireEvent.mouseOver(link);
        
        act(() => {
            jest.advanceTimersByTime(5000);
        });
        userEvent.click(link);
    });

    beforeAll(() => {
        jest.useFakeTimers();
    });

    afterAll(() => {
        jest.useRealTimers();
    });

    test("renders challenge intro when hidden link is clicked", () => {
        expect(page.getByTestId("challenge-start")).toBeInTheDocument();
    });

    test("asks user for details after answer is submitted", () => {
        let answer = page.getByLabelText("Answer");

        fireEvent.input(answer, { target: { "challenge-answer": { value: "2" }}});
        fireEvent.submit(answer);
        expect(page.getByText("Tulia kiambatasi…")).toBeInTheDocument();

        act(() => {
            jest.advanceTimersByTime(3000);
        });
        expect(page.getByTestId("challenge-result")).toBeInTheDocument();
    });
});