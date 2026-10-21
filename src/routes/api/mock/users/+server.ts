import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import users from '$lib/mocks/users.json';

export type MockUser = {
	id: string;
	name: string;
	email: string;
	role: string;
	status: string;
	team: string;
	createdAt: string;
};

const SORTABLE = ['name', 'email', 'role', 'status', 'team', 'createdAt'] as const;
const ROLES = ['admin', 'supervisor', 'agent'] as const;
const STATUSES = ['active', 'invited', 'suspended'] as const;

function clamp(n: number, min: number, max: number) {
	return Math.min(Math.max(n, min), max);
}

export const GET: RequestHandler = ({ url }) => {
	const q = url.searchParams;

	const search = (q.get('search') ?? '').trim().toLowerCase();
	const sortParam = q.get('sort') ?? 'name';
	const sort = (SORTABLE as readonly string[]).includes(sortParam)
		? (sortParam as (typeof SORTABLE)[number])
		: 'name';
	const order = q.get('order') === 'desc' ? 'desc' : 'asc';
	const roleParam = q.get('role');
	const role = (ROLES as readonly string[]).includes(roleParam ?? '') ? roleParam : undefined;
	const statusParam = q.get('status');
	const status = (STATUSES as readonly string[]).includes(statusParam ?? '') ? statusParam : undefined;

	const page = clamp(Number(q.get('page')) || 1, 1, 999);
	const pageSize = clamp(Number(q.get('pageSize')) || 10, 5, 50);

	let rows = users as MockUser[];
	if (search) {
		rows = rows.filter((u) => `${u.name} ${u.email} ${u.team}`.toLowerCase().includes(search));
	}
	if (role) rows = rows.filter((u) => u.role === role);
	if (status) rows = rows.filter((u) => u.status === status);

	rows = [...rows].sort((a, b) => {
		const va = a[sort] ?? '';
		const vb = b[sort] ?? '';
		const cmp = va.localeCompare(vb, undefined, { numeric: true });
		return order === 'asc' ? cmp : -cmp;
	});

	const total = rows.length;
	const totalPages = Math.max(1, Math.ceil(total / pageSize));
	const safePage = clamp(page, 1, totalPages);
	const data = rows.slice((safePage - 1) * pageSize, safePage * pageSize);

	return json({ data, meta: { page: safePage, pageSize, total, totalPages, sort, order, filters: { role: role ?? null, status: status ?? null } } });
};
