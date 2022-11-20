import { render, fireEvent } from "@testing-library/react";
import Result from "../../components/Challenge/Result";

test("calls handleSubmit when details are submitted", () => {
    let resultMock = jest.fn();
    const { getByLabelText, getByTestId, debug } = render(<Result handleSubmit={resultMock} />);

    let name = getByLabelText("Name");
    let number = getByLabelText("M-Pesa number")
    fireEvent.input(name, { target: { "challenge-name": { value: "John Doe" }}});
    fireEvent.input(number, { target: { "challenger-phone": { value: "254712345678 "}}});
    fireEvent.submit(getByTestId("challenge-result"));

    expect(resultMock).toBeCalled();
});