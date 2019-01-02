<template>
	<game class="Battlerite" :background="require('./assets/Background.png')">
		<transition name="Fade" mode="out-in">
			<launch-menu v-if="!launching"
				:src="require('./assets/Battlerite.png')"
				game="battlerite"
				@launch="launching = true"
				@homepage="homepage()">
			</launch-menu>

			<div class="Battlerite__launch" v-if="launching" v-click-outside="hideLaunch">
				<div class="Battlerite__wrapper">
					<div class="Battlerite__tab Arena" @click="launch(false)">
						<img class="Battlerite__background" src="./assets/Arena.png">
						<img class="Battlerite__icon Arena__icon" src="./assets/Battlerite.png">
						<div class="Battlerite__backdrop"></div>
					</div>

					<div class="Battlerite__tab Royale" @click="launch(true)">
						<img class="Battlerite__background" src="./assets/Royale.png">
						<img class="Battlerite__icon" src="./assets/RoyaleLogo.png">
						<div class="Battlerite__backdrop"></div>
					</div>
				</div>
			</div>
		</transition>
	</game>
</template>

<style lang="less" scoped>
	.Battlerite {
		&__launch {
			display: flex;
			align-items: center;
			justify-content: center;
			height: 100%;
		}

		&__wrapper {
			display: flex;
			align-items: center;
			justify-content: center;
		}

		&__tab {
			position: relative;
			overflow: hidden;
			box-sizing: border-box;
			cursor: pointer;

			&::after {
				content: '';

				position: absolute;
				top: 0;
				left: 0;
				bottom: 0;
				right: 0;

				box-shadow: inset 0 0 0 0 #fff;
				transition: all .4s ease;
			}

			&:hover::after {
				box-shadow: inset 0 0 0 20px #fff;
			}
		}

		&__wrapper:hover > &__tab:not(:hover) {
			.Battlerite__backdrop {
				opacity: .9;
			}
		}

		&__background {
			width: 30vw;
			margin: -5px -5px -5px -5px;
			filter: blur(4px);
		}

		&__icon {
			position: absolute;
			top: 50%;
			left: 50%;
			width: 50%;
			transform: translate(-50%, -50%);
		}

		&__backdrop {
			position: absolute;
			top: 0;
			left: 0;
			bottom: 0;
			right: 0;

			background: #000;
			opacity: 0;
			transition: all .6s ease;
		}
	}

	.Arena {
		&__icon {
			width: 60%;
		}
	}
</style>

<script>
	import ClickOutside from "vue-click-outside";
	import Game from "../../layouts/Game.vue";
	import LaunchMenu from "../../layouts/LaunchMenu.vue";

	export default {
		components: {
			Game,
			LaunchMenu
		},

		data() {
			return {
				launching: false
			};
		},

		methods: {
			hideLaunch() {
				this.launching = false;
			},

			homepage() {
				$nexodus.launcher.homepage('battlerite');
			},

			launch(isRoyale) {
				$nexodus.launcher.launch('battlerite', isRoyale);
			}
		},

		directives: {
			ClickOutside
		}
	};
</script>
