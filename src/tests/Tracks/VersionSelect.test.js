import { render, fireEvent } from "@testing-library/react";
import VersionSelect from "../../components/Tracks/VersionSelect";

test("calls handleChange when option is selected", () => {
    const changeMock = jest.fn();

    const { getByLabelText } = render(<VersionSelect handleChange={changeMock()} />);
    let versionSelect = getByLabelText("Version");

    fireEvent.change(versionSelect, { target: { value: "base" }});
    expect(changeMock).toBeCalled(); 
});