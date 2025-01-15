export async function getUserData(login, user_id) {
    try {
        const response = await fetch(`http://localhost:3000/users/${login}/${user_id}`, {
            method: "GET",
        });
        if (response.ok) {
            const userData = await response.json();
            console.log(userData);
            return userData;
        } else {
            console.log("Noł uzytkownik");
        }
    } catch (e) {
        console.error("Błąd połączenia:", e);
        return null;
    }
}

export async function getGroups(login, user_id) {
    try {
        const response = await fetch(`http://localhost:3000/groups/${login}/${user_id}`, {
           method: "GET",
        });
        if (response.ok) {
            const groupsData = await response.json();
            return groupsData;
        }
    } catch (e) {
        console.error("Błąd otrzymywania grupy: ", e);
        return null;
    }
}

export async function checkGroup(login, user_id, group_id) {
    try {
        const response = await fetch(`http://localhost:3000/is-user-in-group/${login}/${user_id}/${group_id}`, {
            method: "GET",
        });
        if (response.ok) {
            const groupsData = await response.json();
            return groupsData;
        }
    } catch (e) {
        console.error("Błąd sprawdzania grupy: ", e);
        return null;
    }
}