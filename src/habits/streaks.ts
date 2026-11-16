// Days are local calendar days as YYYY-MM-DD strings.

function pad(n: number): string {
	return String(n).padStart(2, "0");
}

export function dayKey(date: Date): string {
	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

// Date math in UTC, so a daylight-saving change cannot skip or repeat a day.
export function addDays(key: string, n: number): string {
	const [y, m, d] = key.split("-").map(Number);
	const date = new Date(Date.UTC(y, m - 1, d + n));
	return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
}

// Days in a row ending today. When today is not ticked yet, the run may end
// yesterday, so a streak does not drop to 0 every morning.
export function currentStreak(doneDays: string[], today: string): number {
	const done = new Set(doneDays);
	let day = done.has(today) ? today : addDays(today, -1);
	let count = 0;
	while (done.has(day)) {
		count++;
		day = addDays(day, -1);
	}
	return count;
}

export function bestStreak(doneDays: string[]): number {
	const days = [...new Set(doneDays)].sort();
	let best = 0;
	let run = 0;
	let prev: string | null = null;
	for (const day of days) {
		run = prev !== null && addDays(prev, 1) === day ? run + 1 : 1;
		if (run > best) best = run;
		prev = day;
	}
	return best;
}
