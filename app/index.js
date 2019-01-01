import "@mdi/font/css/materialdesignicons.css";
import isElectron from "is-electron";

import App from "./App.vue";
import Battlerite from "./games/battlerite";
import EditSidebar from "./layouts/EditSidebar.vue";
import Games from "./pages/Games.vue";
import Launcher from "./src/Launcher";
import Login from "./pages/Login.vue";
import NexodusLayout from "./layouts/Nexodus.vue";
import Vue from "vue";
import VueRouter from "vue-router";
import Vuex from "vuex";
import WindowHandle from "./src/WindowHandle";

Vue.use(VueRouter);
Vue.use(Vuex);

const Nexodus = {
	version: '1.1.0',
	builddate: '2018.12.28',
	environment: isElectron() ? 'electron' : 'web',
	games: {},

	registerGame(game) {
		this.games[game.name] = game;
	},

	getRoutes() {
		return Object.keys(this.games).map(name => {
			const game = this.games[name];

			return {
				path: name,
				component: game.layout
			};
		});
	},

	async init() {
		this.store = new Vuex.Store({
			state: {
				config: {
					general: {},
					security: {},
					activatedGames: [
						'battlerite'
					]
				},

				statistics: {}
			},

			mutations: {
				configSet(state, config) {
					state.config = config;
				},

				configUpdate(state, {section, config, value}) {
					Vue.set(state.config[section], config, value);
				},

				statisticsSet(state, stats) {
					state.statistics = stats;
				}
			}
		});

		this.router = new VueRouter({
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
							component: NexodusLayout
						},

						{
							path: 'add',
							component: EditSidebar
						},

						...this.getRoutes()
					]
				}
			]
		});

		if(this.environment === 'electron') {
			const electron = require('electron');
			this.handle = new WindowHandle(electron);
			this.launcher = new Launcher(electron);

			this.store.commit('configSet', await this.launcher.retrieveSettings());
		}

		this.vm = new Vue({
			router: this.router,
			store: this.store,
			el: "#app",
			render(h) {
				return h(App);
			}
		});
	}
};

window.$nexodus = Nexodus;

$nexodus.registerGame(Battlerite);
$nexodus.init();
