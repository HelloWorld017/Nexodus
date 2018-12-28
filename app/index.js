import "@mdi/font/css/materialdesignicons.css";

import App from "./App.vue";
import Games from "./pages/Games.vue";
import Login from "./pages/Login.vue";
import Nexodus from "./layouts/Nexodus.vue";
import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

window.$nexodus = {
	version: '1.1.0',
	builddate: '2018.12.28'
};

const router = new VueRouter({
	routes: [
		{
			path: '/login',
			component: Login
		},
		{
			path: '/',
			component: Games,
			children: [
				{
					path: '',
					component: Nexodus
				}
			]
		}
	]
});

new Vue({
	router,
	el: "#app",
	render(h) {
		return h(App);
	}
});
