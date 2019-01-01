<template>
	<div class="Battlerite">
		<launch-menu v-if="!launching" :src="require('./assets/Battlerite.png')"></launch-menu>

		<div class="Battlerite__launch" v-if="launching">
			<div class="Battlerite__tab Arena">
				<img class="Battlerite__background" src="./assets/Arena.png">
				<img class="Battlerite__icon Arena__icon" src="./assets/Battlerite.png">
			</div>

			<div class="Battlerite__tab Royale">
				<img class="Battlerite__background" src="./assets/Royale.png">
				<img class="Battlerite__icon" src="./assets/RoyaleLogo.png">
			</div>
		</div>
	</div>
</template>

<style lang="less" scoped>
	.Battlerite {
		height: 100%;
		
		&__launch {
			display: flex;
		}

		&__tab {
			position: relative;
			overflow: hidden;
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
	}

	.Arena {
		&__icon {
			width: 60%;
		}
	}
</style>

<script>
	import LaunchMenu from "../../layouts/LaunchMenu.vue";

	export default {
		components: {
			LaunchMenu
		},

		data() {
			return {
				launching: false
			};
		}
	};
</script>
