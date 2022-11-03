import { render, screen } from "@testing-library/react";
import VersionSelect from "../../components/Tracks/VersionSelect";
import userEvent from "@testing-library/user-event";

test("calls handleChange() when option is selected", () => {
    const changeMock = jest.fn();

    render(<VersionSelect handleChange={changeMock()} />);
    userEvent.click(screen.getByText("Base"));
    expect(changeMock).toBeCalled();
});