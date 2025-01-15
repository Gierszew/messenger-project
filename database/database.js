const cassandra = require("cassandra-driver");
const { checkPassword, hashPassword } = require("../utility/hash");

const client = new cassandra.Client({
    contactPoints: ["172.17.0.2"],
    localDataCenter: "datacenter1",
    keyspace: "messenger"
});

async function addUser(user) {
    // Najpierw sprawdź, czy użytkownik o tym samym loginie już istnieje
    const checkQuery = 'SELECT user_id FROM users WHERE login = ?';
    const checkParams = [user.login];

    try {
        // Sprawdzenie, czy istnieje już użytkownik o tym loginie
        const result = await client.execute(checkQuery, checkParams, { prepare: true });

        // Jeśli wynik jest pusty, to możemy dodać użytkownika
        if (result.rowLength === 0) {
            const query = 'INSERT INTO users (user_id, phone, email, login, password, first_name, last_name, created_at) VALUES (uuid(), ?, ?, ?, ?, ?, ?, ?)';
            const password = await hashPassword(user.password);
            const params = [user.phone, user.email, user.login, password, user.first_name, user.last_name, user.created_at];
            
            await client.execute(query, params, { prepare: true });
            console.log("Użytkownik został dodany");
        } else {
            console.log("Użytkownik o tym loginie już istnieje");
            throw new Error("Login already exists");
        }
    } catch (err) {
        console.error("Błąd podczas sprawdzania lub dodawania użytkownika: ", err);
        throw err;
    }
}


async function checkUser(user) {
    const query = "SELECT password FROM users WHERE login = ? AND user_id = ?";
    const params = [user.login, user.user_id];

    try {
        // Wykonaj zapytanie, aby znaleźć użytkownika po loginie
        const result = await client.execute(query, params, { prepare: true });

        // Jeśli użytkownik o podanym loginie istnieje
        if (result.rowLength > 0) {
            return true;
        } else {
            return false;
        }
    } catch (e) {
        console.error("Błąd: ", e);
        throw e;
    }
}

async function getIdByLogin(user) {
    const query = "SELECT user_id FROM users WHERE login = ?";
    const params = [user.login];

    try {
        const result = await client.execute(query, params, {prepare: true});
        if (result.rowLength > 0) {
            const user_id = result.rows[0].user_id;
            return user_id;
        } else {
            throw new Error("Wrong login");
        }
    } catch(e) {
        console.error("Error przy id przy login", e);
    }
}

async function getLoginById(user) {
    const query = "SELECT login FROM users WHERE user_id = ?";
    const params = [user.user_id];

    try {
        const result = await client.execute(query, params, { prepare: true });
        if (result.rowLength > 0) {
            const login = result.rows[0].login;
            return login;
        } else {
            throw new Error("Wrong user ID");
        }
    } catch (e) {
        console.error("Error przy loginie przy ID", e);
        throw e; // Rzucamy błąd, aby móc go obsłużyć na wyższym poziomie
    }
}

async function getAllByLogin(user) {
    const query = "SELECT * FROM users WHERE login = ?";
    const params = [user.login];

    try {
        const result = await client.execute(query, params, {prepare: true});
        if (result.rowLength > 0) {
            return result.rows[0];
        } else {
            throw new Error("No i nic");
        }
    } catch (e) {
        console.error("Error przy wszystkich", e);
    }
}

async function createGroup(user) {
    // sprawdz czy nie ma takiej grupy
    const query = "SELECT * FROM groups_by_user WHERE user_id = ? AND group_name = ?";
    const params = [user.user_id, user.group_name];
    try {
        const result = await client.execute(query, params, {prepare: true});

        if (result.rowLength === 0) {
            // wrzuc taka grupe
            const query2 = "INSERT INTO groups_by_user (group_id, user_id, created_at, group_name, invited_at, invited_by) VALUES (uuid(), ?, ?, ?, ?, ?)";
            const params2 = [user.user_id, user.created_at, user.group_name, user.invited_at, user.invited_by];

            await client.execute(query2, params2, {prepare: true});

            const query3 = "SELECT group_id FROM groups_by_user WHERE user_id = ? AND group_name = ?";
            const params3 = [user.user_id, user.group_name];

            const result2 = await client.execute(query3, params3, {prepare: true});
            const group_id = cassandra.types.Uuid.fromString(result2.rows[0].group_id.toString());

            // dodaj role admina temu uzytkownikowi
            const query4 = "INSERT INTO user_groups (user_id, group_id, invited_at, invited_by, role) VALUES (?, ?, ?, ?, 'admin')";
            const params4 = [user.user_id, group_id, user.invited_at, user.invited_by];

            await client.execute(query4, params4, {prepare: true});
            console.log("Grupa dodana");
        }
    } catch (e) {
        console.error("Problem with creating group: ", e);
    }
}

async function getGroupsByUser(user) {
    const query = "SELECT * FROM groups_by_user WHERE user_id = ?";
    const params = [user.user_id];

    try {
        const result = await client.execute(query, params, {prepare: true});

        if (result.rowLength > 0) {
            return result.rows;
        } else {
            return null;
        }
    } catch (e) {
        console.error("Błąd przy odbieraniu danych grupy: ", e);
        return null;
    }
}

async function isUserInGroup(user, group) {
    const query = "SELECT * FROM user_groups WHERE user_id = ? AND group_id = ?";
    const params = [user.user_id, group.group_id];

    try {
        const result = await client.execute(query, params, {prepare: true});
        if (result.rowLength > 0) {
            return true;
        } else {
            return false;
        }
    } catch (e) {
        console.error("Błąd przy pobieraniu użytkownika z grupy: ", e);
        return false;
    }
}

module.exports = {
    addUser,
    checkUser,
    createGroup,
    getIdByLogin,
    getAllByLogin,
    getLoginById,
    getGroupsByUser,
    isUserInGroup
}