import { render, fireEvent } from "@testing-library/react";
import TopLink from "../../components/Track/TopLink";

test("calls handleSubmit when form is submitted", () => {
    const tracksMock = [1, 2, 3];
    const submitMock = jest.fn();

    const { getByLabelText } = render(<TopLink id={"1"} tracks={tracksMock} handleSubmit={submitMock} />);
    let input = getByLabelText("Track number");

    fireEvent.change(input, { target: { value: "2" }});
    fireEvent.submit(input);
    expect(submitMock).toBeCalled();
});
