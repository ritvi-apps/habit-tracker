import { beforeEach, describe, expect, it, vi } from "vitest";

const store = new Map<string, string>();

vi.mock("@react-native-async-storage/async-storage", () => ({
	default: {
		getItem: async (key: string) => store.get(key) ?? null,
		setItem: async (key: string, value: string) => {
			store.set(key, value);
		},
	},
}));

import {
	addHabit,
	deleteHabit,
	type Habit,
	loadHabits,
	renameHabit,
	STORAGE_KEY,
	saveHabits,
	toggleDay,
} from "./storage";

const now = new Date("2026-11-17T08:00:00.000Z");

beforeEach(() => {
	store.clear();
});

describe("addHabit", () => {
	it("adds a habit with a trimmed name", () => {
		const list = addHabit([], "  Read  ", now);
		expect(list).toHaveLength(1);
		expect(list[0].name).toBe("Read");
		expect(list[0].createdAt).toBe(now.toISOString());
		expect(list[0].id).not.toBe("");
		expect(list[0].doneDays).toEqual([]);
	});

	it("gives each habit its own id", () => {
		const list = addHabit(addHabit([], "Read", now), "Walk", now);
		expect(list[0].id).not.toBe(list[1].id);
	});

	it("refuses empty and blank names", () => {
		const start: Habit[] = [];
		expect(addHabit(start, "", now)).toBe(start);
		expect(addHabit(start, "   ", now)).toBe(start);
	});
});

describe("renameHabit", () => {
	const list = addHabit(addHabit([], "Read", now), "Walk", now);

	it("renames only the matching habit", () => {
		const renamed = renameHabit(list, list[0].id, " Read 10 pages ");
		expect(renamed[0].name).toBe("Read 10 pages");
		expect(renamed[0].id).toBe(list[0].id);
		expect(renamed[1]).toEqual(list[1]);
	});

	it("refuses a blank name", () => {
		expect(renameHabit(list, list[0].id, "  ")).toBe(list);
	});

	it("leaves the list alone for an unknown id", () => {
		expect(renameHabit(list, "nope", "Run")).toBe(list);
	});
});

describe("deleteHabit", () => {
	const list = addHabit(addHabit([], "Read", now), "Walk", now);

	it("removes the matching habit", () => {
		const left = deleteHabit(list, list[0].id);
		expect(left).toEqual([list[1]]);
	});

	it("leaves the list alone for an unknown id", () => {
		expect(deleteHabit(list, "nope")).toBe(list);
	});
});

describe("toggleDay", () => {
	const list = addHabit(addHabit([], "Read", now), "Walk", now);
	const day = "2026-11-17";

	it("ticks a day on the matching habit only", () => {
		const ticked = toggleDay(list, list[0].id, day);
		expect(ticked[0].doneDays).toEqual([day]);
		expect(ticked[1]).toEqual(list[1]);
	});

	it("unticks a day that is already ticked", () => {
		const ticked = toggleDay(list, list[0].id, day);
		expect(toggleDay(ticked, list[0].id, day)[0].doneDays).toEqual([]);
	});

	it("leaves the list alone for an unknown id", () => {
		expect(toggleDay(list, "nope", day)).toBe(list);
	});
});

describe("loadHabits and saveHabits", () => {
	it("loads an empty list when nothing is stored", async () => {
		expect(await loadHabits()).toEqual([]);
	});

	it("loads back the list it saved", async () => {
		const list = addHabit(addHabit([], "Read", now), "Walk", now);
		await saveHabits(list);
		expect(await loadHabits()).toEqual(list);
	});

	it("loads an empty list from broken JSON", async () => {
		store.set(STORAGE_KEY, "{not json");
		expect(await loadHabits()).toEqual([]);
	});

	it("loads an empty list when the data is not a list", async () => {
		store.set(STORAGE_KEY, JSON.stringify({ name: "Read" }));
		expect(await loadHabits()).toEqual([]);
	});

	it("drops entries that are not habits", async () => {
		const good = {
			id: "a",
			name: "Read",
			createdAt: now.toISOString(),
			doneDays: ["2026-11-17"],
		};
		store.set(STORAGE_KEY, JSON.stringify([good, { id: 1 }, null]));
		expect(await loadHabits()).toEqual([good]);
	});

	it("drops entries saved before doneDays existed", async () => {
		const old = { id: "a", name: "Read", createdAt: now.toISOString() };
		store.set(STORAGE_KEY, JSON.stringify([old]));
		expect(await loadHabits()).toEqual([]);
	});

	it("drops entries whose doneDays are not strings", async () => {
		const bad = {
			id: "a",
			name: "Read",
			createdAt: now.toISOString(),
			doneDays: [1],
		};
		store.set(STORAGE_KEY, JSON.stringify([bad]));
		expect(await loadHabits()).toEqual([]);
	});
});
