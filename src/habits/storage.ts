import AsyncStorage from "@react-native-async-storage/async-storage";

// AsyncStorage writes to localStorage on the web, so one path covers both.
export const STORAGE_KEY = "habits.v1";

export type Habit = {
	id: string;
	name: string;
	createdAt: string;
};

// Trimmed name, or null when nothing is left.
export function cleanName(name: string): string | null {
	const trimmed = name.trim();
	return trimmed === "" ? null : trimmed;
}

function newId(now: Date): string {
	return `${now.getTime().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

// Each change returns the same list when the input is refused.
export function addHabit(
	habits: Habit[],
	name: string,
	now: Date = new Date(),
): Habit[] {
	const clean = cleanName(name);
	if (clean === null) return habits;
	return [
		...habits,
		{ id: newId(now), name: clean, createdAt: now.toISOString() },
	];
}

export function renameHabit(
	habits: Habit[],
	id: string,
	name: string,
): Habit[] {
	const clean = cleanName(name);
	if (clean === null || !habits.some((h) => h.id === id)) return habits;
	return habits.map((h) => (h.id === id ? { ...h, name: clean } : h));
}

export function deleteHabit(habits: Habit[], id: string): Habit[] {
	if (!habits.some((h) => h.id === id)) return habits;
	return habits.filter((h) => h.id !== id);
}

function isHabit(value: unknown): value is Habit {
	if (typeof value !== "object" || value === null) return false;
	const v = value as Record<string, unknown>;
	return (
		typeof v.id === "string" &&
		typeof v.name === "string" &&
		typeof v.createdAt === "string"
	);
}

// Missing or broken data loads as an empty list.
export async function loadHabits(): Promise<Habit[]> {
	const raw = await AsyncStorage.getItem(STORAGE_KEY);
	if (raw === null) return [];
	try {
		const parsed: unknown = JSON.parse(raw);
		return Array.isArray(parsed) ? parsed.filter(isHabit) : [];
	} catch {
		return [];
	}
}

export async function saveHabits(habits: Habit[]): Promise<void> {
	await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
}
