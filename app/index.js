import "@mdi/font/css/materialdesignicons.css";
import "./less/index.less";
import trackConfig from "./src/trackConfig";

import App from "./App.vue";
import Battlerite from "./games/battlerite";
import EditSidebar from "./layouts/EditSidebar.vue";
import Games from "./pages/Games.vue";
import Kartrider from "./games/kartrider";
import Launcher from "./src/Launcher";
import Login from "./pages/Login.vue";
import Maple2 from "./games/maple2";
import NexodusLayout from "./layouts/Nexodus.vue";
import Vue from "vue";
import VueRouter from "vue-router";
import Vuex from "vuex";
import WindowHandle from "./src/WindowHandle";

Vue.use(VueRouter);
Vue.use(Vuex);

const Nexodus = {
	version: NEXODUS_VERSION,
	builddate: NEXODUS_BUILDDATE,
	environment: NEXODUS_ENVIRONMENT,
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
		let plugins = [];

		if(this.environment === 'electron-renderer') {
			this.electron = require('electron');
			plugins.push(trackConfig(this.electron));
		}

		this.store = new Vuex.Store({
			state: {
				config: {
					general: {},
					security: {},
					activatedGames: [

					]
				},

				statistics: {},
				id: '',
				username: null
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
				},

				statisticsGameSet(state, {game, data}) {
					Vue.set(state.statistics, game, data);
				},

				activatedGamesSet(state, activated) {
					state.config.activatedGames = activated;
				},

				usernameSet(state, username) {
					state.username = username;
				},

				idSet(state, id) {
					state.id = id;
				}
			},

			plugins
		});

		let mode = 'hash';
		if(this.environment === 'electron-renderer') {
			this.handle = new WindowHandle(this.electron);
			this.launcher = new Launcher(this.electron, this.store);

			const {config, statistics, username, id} = await this.launcher.retrieveSettings();
			this.store.commit('configSet', config);
			this.store.commit('statisticsSet', statistics);
			this.store.commit('usernameSet', username);
			this.store.commit('idSet', id);

			mode = 'history';
		}

		this.router = new VueRouter({
			mode,
			routes: [
				{
					path: '/login',
					name: 'login',
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

		if(this.environment === 'electron-renderer') {
			this.electron.ipcRenderer.on('showGame', (evt, game) => {
				this.router.push(`/${game}/`);
			});
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
$nexodus.registerGame(Kartrider);
$nexodus.registerGame(Maple2);
$nexodus.init();
