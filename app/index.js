import "@mdi/font/css/materialdesignicons.css";
import isElectron from "is-electron";

import App from "./App.vue";
import Games from "./pages/Games.vue";
import Login from "./pages/Login.vue";
import Nexodus from "./layouts/Nexodus.vue";
import Vue from "vue";
import VueRouter from "vue-router";
import WindowHandler from "./src/WindowHandler";

Vue.use(VueRouter);

window.$nexodus = {
	version: '1.1.0',
	builddate: '2018.12.28',
	environment: isElectron() ? 'electron' : 'web'
};

const init = async () => {
	if($nexodus.environment === 'electron') {
		$nexodus.handle = new WindowHandler();
	}

	$nexodus.router = new VueRouter({
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

	$nexodus.vm = new Vue({
		router: $nexodus.router,
		el: "#app",
		render(h) {
			return h(App);
		}
	});
};

init();
