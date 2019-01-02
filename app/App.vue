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
				<object :data="require('./images/button-minmax.svg')"
					type="image/svg+xml"
					@click="handle.minimize()">
				</object>

				<object :data="require('./images/button-minmax.svg')"
					type="image/svg+xml"
					@click="handle.maximize()">
				</object>

				<object :data="require('./images/button-exit.svg')"
					type="image/svg+xml"
					@click="handle.exit()">
				</object>
			</div>
		</div>

		<router-view class="Content"></router-view>
	</main>
</template>

<style lang="less">
	body, html {
		background: #1E272E;
		margin: 0;
		padding: 0;
	}

	* {
		user-select: none;

		&::-webkit-scrollbar {
			background: rgba(255, 255, 255, .2);
			border-radius: 8px;
			width: 15px;
			height: 8px;
		}

		&::-webkit-scrollbar-thumb {
			background: rgba(255, 255, 255, .4);
			border-radius: 8px;
		}
	}

	.Fade {
		&-enter-active, &-leave-active {
			transition: all .3s ease;
		}

		&-enter, &-leave-to {
			opacity: 0;
		}
	}

</style>

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
		padding: 0 32px;

		background: #1E272E;

		-webkit-user-select: none;
		-webkit-app-region: drag;

		&__username {
			position: relative;
			padding: 0 20px;
			margin-right: 20px;
			height: 48px;

			color: rgba(255, 255, 255, .8);
			font-family: 'Noto Sans CJK KR', sans-serif;
			font-size: .8rem;
			line-height: 48px;
		}

		&__buttons * {
			width: 18px;
			height: 18px;
			margin: 0 5px;
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
			}
		},

		methods: {
			toggleUsermenu() {
				this.usermenu = !this.usermenu
			},

			closeUsermenu() {
				this.usermenu = false;
			}
		},

		directives: {
			ClickOutside
		}
	};
</script>
