<template>
	<main id="app">
		<div class="Titlebar">
			<div class="Titlebar__buttons" v-if="handle">
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

		<router-view></router-view>
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

		&__buttons * {
			width: 18px;
			height: 18px;
			margin: 0 5px;
		}
	}
</style>

<script>
	export default {
		computed: {
			handle() {
				return $nexodus.handle;
			}
		}
	};
</script>
