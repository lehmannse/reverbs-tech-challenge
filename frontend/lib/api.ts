const BASE_URL =
	typeof window === "undefined"
		? process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001"
		: (process.env.NEXT_PUBLIC_API_BASE_URL as string) ?? "http://localhost:3001";

export async function apiGet(path: string) {
	const res = await fetch(`${BASE_URL}${normalize(path)}`, {
		method: "GET",
		headers: { "Content-Type": "application/json" },
		cache: "no-store",
	});
	if (!res.ok) {
		throw new Error(`GET ${path} failed: ${res.status}`);
	}
	return res.json();
}

export async function apiPost(path: string, body: any) {
	const res = await fetch(`${BASE_URL}${normalize(path)}`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body),
	});
	if (!res.ok) {
		const text = await res.text().catch(() => "");
		throw new Error(`POST ${path} failed: ${res.status} ${text}`);
	}
	return res.json();
}

function normalize(path: string) {
	return path.startsWith("/") ? path : `/${path}`;
}


