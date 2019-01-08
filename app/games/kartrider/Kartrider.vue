<template>
	<game class="Battlerite" :background="require('./assets/Background.jpg')">
		<launch-menu
			:src="require('./assets/KartriderTraced.svg')"
			game="kartrider"
			@launch="launch()">
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
			launch() {
				$nexodus.launcher.launch('kartrider', isRoyale);
			}
		}
	};
</script>
