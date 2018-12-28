<template>
	<div class="Nexodus">
		<div class="Nexodus__about">
			<img class="Nexodus__logo" src="../images/nexodus.svg">

			<div class="Nexodus__info">
				<h1 class="Nexodus__title">Nexodus</h1>
				<div class="Nexodus__description">
					<div class="Nexodus__version">Version {{version}}</div>
					<div class="Nexodus__builddate">{{builddate}}</div>
				</div>
			</div>
		</div>

		<div class="Nexodus__options">
			<button class="Nexodus__option" @click="openAbout">
				<i class="mdi mdi-information-outline"></i>
				자세히
			</button>

			<button class="Nexodus__option" @click="$refs.configDialog.open()">
				<i class="mdi mdi-cogs"></i>
				설정
			</button>
		</div>

		<nx-dialog ref="aboutDialog">
			<about></about>
		</nx-dialog>

		<nx-dialog ref="configDialog">
			<config></config>
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
</style>

<script>
	import About from "./About.vue";
	import Config from "./Config.vue";
	import NxDialog from "../components/NxDialog.vue";

	export default {
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
