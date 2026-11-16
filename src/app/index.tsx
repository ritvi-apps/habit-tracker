import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import {
	Button,
	FlatList,
	StyleSheet,
	Text,
	TextInput,
	View,
} from "react-native";
import {
	addHabit,
	cleanName,
	deleteHabit,
	type Habit,
	loadHabits,
	renameHabit,
	saveHabits,
} from "../habits/storage";

export default function Home() {
	const [habits, setHabits] = useState<Habit[]>([]);
	const [loaded, setLoaded] = useState(false);
	const [newName, setNewName] = useState("");
	const [editingId, setEditingId] = useState<string | null>(null);
	const [editName, setEditName] = useState("");

	useEffect(() => {
		loadHabits().then((list) => {
			setHabits(list);
			setLoaded(true);
		});
	}, []);

	function update(next: Habit[]) {
		if (next === habits) return;
		setHabits(next);
		saveHabits(next);
	}

	function add() {
		update(addHabit(habits, newName));
		setNewName("");
	}

	function startRename(habit: Habit) {
		setEditingId(habit.id);
		setEditName(habit.name);
	}

	function saveRename() {
		if (editingId !== null) update(renameHabit(habits, editingId, editName));
		setEditingId(null);
	}

	return (
		<View style={styles.screen}>
			<Stack.Screen options={{ title: "Habit Tracker" }} />
			<View style={styles.row}>
				<TextInput
					style={styles.input}
					value={newName}
					onChangeText={setNewName}
					onSubmitEditing={add}
					placeholder="New habit"
					accessibilityLabel="New habit name"
				/>
				<Button
					title="Add"
					onPress={add}
					disabled={cleanName(newName) === null}
				/>
			</View>
			{loaded && habits.length === 0 ? (
				<Text style={styles.empty}>No habits yet.</Text>
			) : null}
			<FlatList
				data={habits}
				keyExtractor={(h) => h.id}
				renderItem={({ item }) =>
					item.id === editingId ? (
						<View style={styles.row}>
							<TextInput
								style={styles.input}
								value={editName}
								onChangeText={setEditName}
								onSubmitEditing={saveRename}
								autoFocus
								accessibilityLabel={`New name for ${item.name}`}
							/>
							<Button
								title="Save"
								onPress={saveRename}
								disabled={cleanName(editName) === null}
							/>
							<Button title="Cancel" onPress={() => setEditingId(null)} />
						</View>
					) : (
						<View style={styles.row}>
							<Text style={styles.name}>{item.name}</Text>
							<Button title="Rename" onPress={() => startRename(item)} />
							<Button
								title="Delete"
								onPress={() => update(deleteHabit(habits, item.id))}
							/>
						</View>
					)
				}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	screen: { flex: 1, padding: 16, gap: 12 },
	row: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
		paddingVertical: 4,
	},
	input: {
		flex: 1,
		borderWidth: 1,
		borderColor: "#999",
		borderRadius: 4,
		paddingHorizontal: 8,
		paddingVertical: 6,
	},
	name: { flex: 1, fontSize: 16 },
	empty: { color: "#666" },
});
