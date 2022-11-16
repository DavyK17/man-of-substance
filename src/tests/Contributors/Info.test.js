import { render, screen } from "@testing-library/react";
import Info from "../../components/Contributors/Info";

describe("Contributors - Info page", () => {
    let contributorMock = { id: 1, name: "John Doe", email: "john@doe.com", amount: 100, rewardsClaimed: false };

    describe("General", () => {
        let page;
        beforeEach(() => {
            const { getByTestId } = render(<Info contributor={contributorMock} validUser={contributorMock} />);
            page = { getByTestId };
        });
    
        test("renders info section", () => {
            let info = page.getByTestId("contributor-info");
            expect(info).toBeInTheDocument();
        });
    
        test("renders rewards section", () => {
            let rewards = page.getByTestId("contributor-rewards");
            expect(rewards).toBeInTheDocument();
        });
    
        test("renders rewards claim form", () => {
            let form = page.getByTestId("contributor-rewards-claim");
            expect(form).toBeInTheDocument();
        });
    });

    describe("Personalised video", () => {
        test("does not render personalised video for Supporter and Bronze contributors", () => {
            const { queryByTestId } = render(<Info contributor={contributorMock} validUser={contributorMock} />);

            let video = queryByTestId("contributor-video");
            expect(video).not.toBeInTheDocument();
        });

        test("renders personalised video for Silver+ contributors", () => {
            contributorMock.amount = 2000;
            const { queryByTestId } = render(<Info contributor={contributorMock} validUser={contributorMock} />);

            let video = queryByTestId("contributor-video");
            expect(video).toBeInTheDocument();
        });
    });
});