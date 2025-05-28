async function checkIfFriend(currentUserId: number, targetUserId: number): Promise<boolean> {
	try {
		const res = await fetch(`/users/:${currentUserId}/relationship/:${targetUserId}`, {
			credentials: 'include'
		});
		if (!res.ok)
			return false;
		const data = await res.json();
		return data.status === 'true';
	} catch {
		return false;
	}
}

async function addFriend(
	currentUserId: number,
	targetUserId: number,
	friendRequestBtn: HTMLButtonElement
) {
	try {
		const response = await fetch("/friends", {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ userId: currentUserId, friendId: targetUserId }),
			credentials: 'include'
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.message || 'Failed to add friend');
		}

		const result = await response.json();
		alert('Friend added successfully!');
		friendRequestBtn.classList.add('hidden');
	} catch (err) {
		console.error('Error adding friend:', err);
	}
}
