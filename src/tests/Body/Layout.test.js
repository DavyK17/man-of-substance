import React from "react";
import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import App from "../../App";

describe("Layout", () => {
    beforeEach(() => {
        render(
            <MemoryRouter initialEntries={["/"]}>
                <App />
            </MemoryRouter>
        );
    });

    test("hides navigation on home page", () => {
        const nav = screen.queryByRole("navigation");
        expect(nav).not.toBeInTheDocument();
    });

    test("shows navigation away from home page", () => {
        userEvent.click(screen.getByText("Tracklist"));
        const nav = screen.queryByRole("navigation");
        expect(nav).toBeInTheDocument();
    });
});