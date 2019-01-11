<template>
	<main id="app">
		<div class="Titlebar">
			<div class="Titlebar__username" v-if="username" @click="toggleUsermenu" v-click-outside="closeUsermenu">
				<i class="mdi mdi-account"></i>
				{{username}}

				<transition name="Fade">
					<div class="Usermenu" v-if="usermenu">
						<button @click="launcher.logout()">
							로그아웃
						</button>
					</div>
				</transition>
			</div>

			<div class="Titlebar__buttons">
				<button-minmax class="Titlebar__button" @click="handle.minimize()"></button-minmax>
				<button-minmax class="Titlebar__button" @click="handle.maximize()" v-if="maximizable"></button-minmax>
				<button-exit class="Titlebar__button Titlebar__button--exit" @click="handle.exit()"></button-exit>
			</div>
		</div>

		<router-view class="Content"></router-view>
	</main>
</template>

<style lang="less" scoped>
	#app {
		display: flex;
		flex-direction: column;

		width: 100vw;
		height: 100vh;
	}

	.Titlebar {
		display: flex;
		align-items: center;
		justify-content: flex-end;

		width: 100vw;
		height: 48px;

		box-sizing: border-box;
		padding: 0;
		padding-right: 18px;
		position: relative;
		z-index: 1;

		background: #1E272E;
		box-shadow: 0 0 4px 0 rgba(0, 0, 0, .4);
		-webkit-app-region: drag;
		user-select: none;

		&__username {
			position: relative;
			padding: 0 20px;
			margin-right: 20px;
			height: 48px;

			color: rgba(255, 255, 255, .8);
			font-family: 'Noto Sans CJK KR', sans-serif;
			font-size: .8rem;
			line-height: 48px;
			-webkit-app-region: no-drag;
		}

		&__buttons {
			-webkit-app-region: no-drag;

			* {
				width: 18px;
				height: 18px;
				margin: 0 5px;
			}
		}

		&__button {
			circle {
				transition: all .4s ease;
				fill: transparent;
				cursor: pointer;
			}

			circle:hover {
				fill: #fff;
			}

			&--exit circle:hover {
				fill: #e26b6b;
			}
		}
	}

	.Content {
		flex: 1;
	}

	.Usermenu {
		display: flex;
		position: absolute;
		top: 48px;
		right: 0;
		width: 150%;
		z-index: 9;

		button {
			flex: 1;
			padding: 10px 30px;

			background: rgba(0, 0, 0, .8);
			border: none;
			outline: none;

			color: #fff;
			font-family: 'Noto Sans CJK KR', sans-serif;
			font-size: .9rem;

			cursor: pointer;
			transition: all .4s ease;

			&:hover {
				background: #3399cc;
			}
		}
	}
</style>

<script>
	import ButtonExit from "./images/ButtonExit.svg?inline";
	import ButtonMinmax from "./images/ButtonMinmax.svg?inline";
	import ClickOutside from "vue-click-outside";

	export default {
		data() {
			return {
				usermenu: false
			};
		},

		computed: {
			launcher() {
				return $nexodus.launcher;
			},

			handle() {
				return $nexodus.handle;
			},

			username() {
				return this.$store.state.username;
			},

			maximizable() {
				return this.$route.name !== 'login';
			}
		},

		methods: {
			toggleUsermenu() {
				this.usermenu = !this.usermenu;
			},

			closeUsermenu() {
				this.usermenu = false;
			}
		},

		components: {
			ButtonExit,
			ButtonMinmax
		},

		directives: {
			ClickOutside
		}
	};
</script>
