import React, { useEffect, useMemo, useState } from "react";
import { TopBar } from "../components";
import { useSelector } from "react-redux";
import { BACKEND_URL } from "../utils/api";

export default function Notifications() {
	const { user } = useSelector((s) => s.user);
	const token = user?.token;
	const [items, setItems] = useState([]);
	const [loading, setLoading] = useState(false);

	const headers = useMemo(
		() => ({
			...(token ? { Authorization: `Bearer ${token}` } : {}),
			"Content-Type": "application/json",
		}),
		[token]
	);

	useEffect(() => {
		(async () => {
			if (!token) return;
			setLoading(true);
			try {
				const res = await fetch(`${BACKEND_URL}/notifications`, { headers });
				const data = await res.json();
				setItems(data?.data || []);
			} catch (e) {}
			setLoading(false);
		})();
	}, [token, headers]);

	const markRead = async (id) => {
		await fetch(`${BACKEND_URL}/notifications/${id}/read`, { method: "PUT", headers });
		setItems((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
	};

	const markAll = async () => {
		await fetch(`${BACKEND_URL}/notifications/read-all`, { method: "PUT", headers });
		setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
	};

	const remove = async (id) => {
		await fetch(`${BACKEND_URL}/notifications/${id}`, { method: "DELETE", headers });
		setItems((prev) => prev.filter((n) => n._id !== id));
	};

	return (
		<div className="w-full px-0 lg:px-10 pb-20 2xl:px-40 bg-[#ffffff] dark:bg-base-100 lg:rounded-lg min-h-screen">
			<TopBar />
			<div className="px-4 lg:px-2 mt-4">
				<div className="flex justify-between items-center mb-3">
					<div className="text-lg font-semibold">Notifications</div>
					<button onClick={markAll} className="px-3 py-2 rounded-full bg-black text-white text-sm">Mark all as read</button>
				</div>
				{loading ? (
					<div className="text-sm">Loading...</div>
				) : items.length === 0 ? (
					<div className="text-center text-gray-500 mt-10">No Updates</div>
				) : (
					<div className="flex flex-col gap-2">
						{items.map((n) => (
							<div key={n._id} className={`p-4 rounded-lg border dark:border-base-300 ${n.isRead ? "opacity-70" : ""}`}>
								<div className="text-sm font-medium">{n.title || n.type}</div>
								<div className="text-xs text-gray-600 dark:text-gray-400 mt-1">{n.message}</div>
								<div className="flex gap-2 mt-2">
									{!n.isRead && (
										<button onClick={() => markRead(n._id)} className="px-3 py-1 rounded-full bg-black text-white text-xs">Mark read</button>
									)}
									<button onClick={() => remove(n._id)} className="px-3 py-1 rounded-full bg-gray-200 dark:bg-base-200 text-xs">Delete</button>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
