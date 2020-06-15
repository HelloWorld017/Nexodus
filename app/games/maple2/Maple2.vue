<template>
	<game class="Battlerite" :background="require('./assets/Background.jpg')">
		<launch-menu
			:src="require('./assets/Maplestory2.png')"
			game="maple2"
			@launch="launch()"
			@homepage="homepage()">
		</launch-menu>
	</game>
</template>


<script>
	import Game from "../../layouts/Game.vue";
	import LaunchMenu from "../../layouts/LaunchMenu.vue";

	export default {
		components: {
			Game,
			LaunchMenu
		},

		methods: {
			homepage() {
				$nexodus.launcher.homepage('maple2');
			},

			launch() {
				$nexodus.launcher.launch('maple2');
			}
		}
	};
</script>
