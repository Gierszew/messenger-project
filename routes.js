const express = require("express");
const router = express.Router();
const { addUser, checkUser, createGroup, getIdByLogin, getAllByLogin, getGroupsByUser, isUserInGroup } = require("./database/database");
const { generateToken } = require("./utility/jwt")

router.post("/register", async (req, res) => {
    const { email, password, tel, login } = req.body;

    const user = {
        phone: tel,
        email: email,
        login: login,
        password: password,
        first_name: "janusz",
        last_name: "janusz",
        created_at: new Date()
    };

    try {
        await addUser(user);
    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }

    res.sendStatus(200);
});

router.post("/login", async (req, res) => {
    const { login, password } = req.body;
    let user = {
        login: login,
        password: password
    }

    try {
        const user_id = await getIdByLogin(user);
        user = {
            login: login,
            password: password,
            user_id: user_id
        };
        const check = await checkUser(user);
        if (check) {
            const token = generateToken(user_id, login);
            res.json({ token });
        } else {
            res.status(401).send("Wrong login");
        } 
    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }
});

router.post("/create-group", async (req, res) => {
    const { user_login, user_id, group_name } = req.body;
    
    let user = {
        login: user_login,
        user_id: user_id
    };

    try {
        const check = await checkUser(user);
        if (check) {
            let user = {
                login: user_login,
                user_id: user_id,
                group_name: group_name,
                created_at: new Date(),
                invited_at: new Date(),
                invited_by: user_id,
            };
            createGroup(user);
        } else {
            res.sendStatus(500);
        }
    } catch (e) {
        console.error("Błąd przy dodawaniu grupyyyy", e);
        res.sendStatus(500);
    }
    res.sendStatus(200);
});

router.get("/users/:login/:user_id", async (req, res) => {
    const { login, user_id } = req.params;
    const user = {
        login: login,
        user_id: user_id
    };
    try {
        const check = await checkUser(user);
        if (check) {
            const data = await getAllByLogin(login);
            res.json(data);
        } else {
            res.status(401).send("Wrong login");
        }
    } catch (e) {
        res.sendStatus(500)
        console.error("Errooooor", e);
    }
});

router.get("/groups/:login/:user_id", async (req, res) => {
    const { login, user_id } = req.params;
    const user = {
        login: login,
        user_id: user_id
    };

    try {
        const check = await checkUser(user);
        if (check) {
            const group = await getGroupsByUser(user);
            res.json(group);
        } else {
            res.status(401).send("YOU MUST BE LOGGED IN!!");
        }
    } catch (e) {
        res.sendStatus(500);
        console.error("Error przy dostawaniu grupy: ", e);
    }
});

router.get("/is-user-in-group/:login/:user_id/:group_id", async (req, res) => {
    const { login, user_id, group_id } = req.params;
    const user = {
        login: login,
        user_id: user_id
    };
    const group = {
        group_id: group_id
    };

    try {
        const check = await checkUser(user);
        if (check) {
            const userIsInGroup = await isUserInGroup(user, group);
            res.json(userIsInGroup);
        }
    } catch (e) {
        res.sendStatus(500);
        console.error("Error przy sprawdzaniu usera w grupie");
    }
});

module.exports = router;