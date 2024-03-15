import type { Contributor } from "$lib/ambient";
import { Tiers } from "./contributors";

it("get tier", () => {
	const contributor: Contributor = {
		id: 1,
		name: "John",
		email: "john@example.com",
		amount: 1500,
		rewardsClaimed: false
	};
	const tier = Tiers.get(contributor);
	expect(tier).toBe("bronze");
});

it("get tier with amount exceeding any tier", () => {
	const contributor: Contributor = {
		id: 2,
		name: "Jane",
		email: "jane@example.com",
		amount: 100000,
		rewardsClaimed: false
	};
	const tier = Tiers.get(contributor);
	expect(tier).toBe("executive");
});

it("get max tracks for bronze tier", () => {
	const maxTracks = Tiers.maxTracks("bronze");
	expect(maxTracks).toBe(3);
});

it("get max tracks for silver tier", () => {
	const maxTracks = Tiers.maxTracks("silver");
	expect(maxTracks).toBe(5);
});

it("get max tracks for invalid tier", () => {
	const maxTracks = Tiers.maxTracks("gold");
	expect(maxTracks).toBe(-1);
});
