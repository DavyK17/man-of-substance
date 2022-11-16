import { render } from "@testing-library/react";
import Rewards from "../../components/Contributors/Rewards";

describe("Contributors - Rewards component", () => {
    test("renders corresponding reward for Supporter tier", () => {
        const { getByText } = render(<Rewards tier="supporter" />);
        let reward = getByText("Single track");
        expect(reward).toBeInTheDocument();
    });

    test("renders corresponding reward for Bronze tier", () => {
        const { getByText } = render(<Rewards tier="bronze" />);
        let reward = getByText("Triple pack");
        expect(reward).toBeInTheDocument();
    });

    test("renders corresponding reward for Silver tier", () => {
        const { getByText } = render(<Rewards tier="silver" />);
        let reward = getByText("Personalised pack");
        expect(reward).toBeInTheDocument();
    });

    test("renders corresponding rewards for Gold tier", () => {
        const { getByText } = render(<Rewards tier="gold" />);

        let rewards = ["Personalised pack", "Early bird download"];
        rewards.forEach(reward => {
            let element = getByText(reward);
            expect(element).toBeInTheDocument();
        });
    });

    test("renders corresponding rewards for Platinum tier", () => {
        const { getByText } = render(<Rewards tier="platinum" />);

        let rewards = ["Personalised pack", "Early bird download", "Project commentary"];
        rewards.forEach(reward => {
            let element = getByText(reward);
            expect(element).toBeInTheDocument();
        });
    });

    test("renders corresponding rewards for Executive tier", () => {
        const { getAllByText } = render(<Rewards tier="executive" />);

        let rewards = ["Personalised pack", "Early bird download", "Project commentary", "Executive producer credit"];
        rewards.forEach(reward => {
            let elements = getAllByText(reward);
            elements.forEach(el => expect(el).toBeInTheDocument());
        });
    });
});