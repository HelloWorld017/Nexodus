<template>
	<div class="Nexodus">
		<transition name="Fade" mode="out-in">
			<config key="config" v-if="configMode"></config>
			<div class="Nexodus__about" key="about" v-else>
				<img class="Nexodus__logo" src="../images/nexodus.svg">

				<div class="Nexodus__info">
					<h1 class="Nexodus__title">Nexodus</h1>
					<div class="Nexodus__description">
						<div class="Nexodus__version">Version {{version}}</div>
						<div class="Nexodus__builddate">{{builddate}}</div>
					</div>
				</div>
			</div>
		</transition>

		<div class="Nexodus__options">
			<transition name="FadeDelayed">
				<button class="Nexodus__option" @click="openAbout" v-if="!configMode">
					<i class="mdi mdi-information-outline"></i>
					자세히
				</button>
			</transition>

			<button class="Nexodus__option" @click="configMode = !configMode">
				<transition name="Fade" mode="out-in">
					<div key="close" v-if="configMode">
						<i class="mdi mdi-close"></i>
						닫기
					</div>
					<div key="config" v-else>
						<i class="mdi mdi-cogs"></i>
						설정
					</div>
				</transition>
			</button>
		</div>

		<nx-dialog ref="aboutDialog">
			<about></about>
		</nx-dialog>
	</div>
</template>

<style lang="less" scoped>
	.Nexodus {
		width: 100%;
		height: 100%;

		display: flex;
		align-items: center;
		justify-content: center;

		position: relative;

		&__about {
			display: flex;
			transform: translate(0, -24px);
		}

		&__logo {
			width: 20vw;
			height: 20vw;
			pointer-events: none;
		}

		&__info {
			display: flex;
			flex-direction: column;
			justify-content: center;

			margin-left: 5vw;
			color: #fff;
		}

		&__title {
			font-family: 'Exo 2', sans-serif;
			font-weight: 100;
			font-size: 5rem;
			margin: 0;
			padding: 0;
		}

		&__description {
			display: flex;
			color: rgba(255, 255, 255, .4);
			font-family: 'Lato', sans-serif;
			font-size: 1.2rem;

			* {
				padding: 0 10px;

				&:not(:last-child) {
					border-right: 2px solid rgba(255, 255, 255, .4);
				}
			}
		}

		&__options {
			display: flex;

			position: absolute;
			bottom: 50px;
			right: 50px;

			font-size: 1.2rem;
		}

		&__option {
			background: transparent;
			border: none;
			outline: none;
			cursor: pointer;
			color: rgba(255, 255, 255, .4);
			font-size: 1.1rem;
			font-family: 'NanumSquare', sans-serif;
			margin: 0 15px;
			transition: all .4s ease;

			&:hover {
				color: rgba(255, 255, 255, .8);
			}
		}
	}

	.FadeDelayed {
		&-leave-active {
			transition: all .3s ease;
		}

		&-enter-active {
			transition: all .3s ease .3s;
		}

		&-enter, &-leave-to {
			opacity: 0;
		}
	}
</style>

<script>
	import About from "./About.vue";
	import Config from "./Config.vue";
	import NxDialog from "../components/NxDialog.vue";

	export default {
		data() {
			return {
				configMode: false
			};
		},

		components: {
			About,
			Config,
			NxDialog
		},

		computed: {
			version() {
				return $nexodus.version;
			},

			builddate() {
				return $nexodus.builddate;
			}
		},

		methods: {
			openAbout() {
				this.$refs.aboutDialog.open();
			}
		}
	};
</script>
