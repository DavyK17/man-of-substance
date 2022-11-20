import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Intro from "../../components/Contributors/Intro";

test("calls loginClick when option is selected", () => {
    const loginClickMock = jest.fn();
    const { getByText } = render(<Intro contributors={[]} loginClick={loginClickMock} />);

    let link = getByText("clicking here");
    userEvent.click(link);
    expect(loginClickMock).toBeCalled(); 
});