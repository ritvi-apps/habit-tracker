import { describe, expect, it } from "vitest";
import { addHabit, toggleDay } from "./storage";
import { addDays, bestStreak, currentStreak, dayKey } from "./streaks";

const today = "2026-11-17";

describe("dayKey and addDays", () => {
	it("uses the local calendar day", () => {
		expect(dayKey(new Date(2026, 10, 17, 23, 59))).toBe(today);
		expect(dayKey(new Date(2026, 0, 5, 0, 0))).toBe("2026-01-05");
	});

	it("moves across month and year ends", () => {
		expect(addDays("2026-11-30", 1)).toBe("2026-12-01");
		expect(addDays("2026-01-01", -1)).toBe("2025-12-31");
		expect(addDays("2028-02-28", 1)).toBe("2028-02-29");
	});
});

describe("currentStreak and bestStreak", () => {
	it("is 0 with no days ticked", () => {
		expect(currentStreak([], today)).toBe(0);
		expect(bestStreak([])).toBe(0);
	});

	it("is 1 with only today ticked", () => {
		expect(currentStreak([today], today)).toBe(1);
		expect(bestStreak([today])).toBe(1);
	});

	it("still counts when only yesterday is ticked", () => {
		expect(currentStreak(["2026-11-16"], today)).toBe(1);
		expect(currentStreak(["2026-11-15", "2026-11-16"], today)).toBe(2);
	});

	it("is 0 once yesterday is missed too", () => {
		expect(currentStreak(["2026-11-15"], today)).toBe(0);
	});

	it("breaks the current streak at a missed day", () => {
		const days = [
			"2026-11-12",
			"2026-11-13",
			"2026-11-15",
			"2026-11-16",
			today,
		];
		expect(currentStreak(days, today)).toBe(3);
	});

	it("keeps the best streak after a missed day", () => {
		const days = [
			"2026-11-10",
			"2026-11-11",
			"2026-11-12",
			"2026-11-13",
			today,
		];
		expect(currentStreak(days, today)).toBe(1);
		expect(bestStreak(days)).toBe(4);
	});

	it("handles days out of order or given twice", () => {
		const days = [today, "2026-11-15", "2026-11-16", today, "2026-11-15"];
		expect(currentStreak(days, today)).toBe(3);
		expect(bestStreak(days)).toBe(3);
	});

	it("counts a run across a month end", () => {
		const days = ["2026-10-30", "2026-10-31", "2026-11-01", "2026-11-02"];
		expect(currentStreak(days, "2026-11-02")).toBe(4);
		expect(bestStreak(days)).toBe(4);
	});

	it("shows 0 and 0 for a habit added today, then 1 and 1 after a tick", () => {
		const added = addHabit([], "Read", new Date(2026, 10, 17, 8));
		const habit = added[0];
		expect(currentStreak(habit.doneDays, today)).toBe(0);
		expect(bestStreak(habit.doneDays)).toBe(0);
		const ticked = toggleDay(added, habit.id, today)[0];
		expect(currentStreak(ticked.doneDays, today)).toBe(1);
		expect(bestStreak(ticked.doneDays)).toBe(1);
	});
});
