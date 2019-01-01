import "@mdi/font/css/materialdesignicons.css";
import isElectron from "is-electron";

import App from "./App.vue";
import Games from "./pages/Games.vue";
import Login from "./pages/Login.vue";
import Nexodus from "./layouts/Nexodus.vue";
import Vue from "vue";
import VueRouter from "vue-router";
import Vuex from "vuex";
import WindowHandle from "./src/WindowHandle";

Vue.use(VueRouter);
Vue.use(Vuex);

window.$nexodus = {
	version: '1.1.0',
	builddate: '2018.12.28',
	environment: isElectron() ? 'electron' : 'web'
};

const init = async () => {
	if($nexodus.environment === 'electron') {
		$nexodus.handle = new WindowHandle(require('electron'));
	}

	$nexodus.store = new Vuex.Store({
		state: {
			config: {
				general: {},
				security: {}
			}
		},

		mutations: {
			configSet(state, config) {
				state.config = config;
			},

			configUpdate(state, {section, config, value}) {
				Vue.set(state.config[section], config, value);
			}
		}
	});

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
		store: $nexodus.store,
		el: "#app",
		render(h) {
			return h(App);
		}
	});
};

init();
