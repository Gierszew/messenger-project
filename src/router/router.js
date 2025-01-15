import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import About from "../views/About.vue";
import Register from "../views/Register.vue";
import Login from "../views/Login.vue";
import CreateGroup from "@/views/CreateGroup.vue";
import Group from "@/views/Group.vue";

const routes = [
    {
        path: "/",
        name: "Home",
        component: Home
    },
    {
        path: "/about",
        name: "About",
        component: About
    },
    {
        path: "/register",
        name: "Register",
        component: Register
    },
    {
        path: "/login",
        name: "Login",
        component: Login
    },
    {
        path: "/create-group",
        name: "CreateGroup",
        component: CreateGroup
    },
    {
        path: "/group/:group_id",
        name: "Group",
        component: Group,
        props: true,
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;