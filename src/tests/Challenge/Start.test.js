import { render, fireEvent } from "@testing-library/react";
import Start from "../../components/Challenge/Start";

test("calls handleSubmit() when answer is submitted", () => {
    let startMock = jest.fn();
    const { getByLabelText } = render(<Start handleSubmit={startMock} />);

    let answer = getByLabelText("Answer");
    fireEvent.input(answer, { target: { "challenge-answer": { value: "2" }}});
    fireEvent.submit(answer);

    expect(startMock).toBeCalled();
});