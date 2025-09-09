
// This is a placeholder for a users API route.
// You could use this to fetch or manage user data.

import {NextResponse} from 'next/server';

// Mock user data
const users = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' },
];

export async function GET(request: Request) {
    // In a real application, you would fetch this from your database.
    return NextResponse.json(users);
}
