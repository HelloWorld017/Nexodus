<template>
	<div class="Game">
		<div class="Game__background">
			<div class="Game__background__image" :style="{backgroundImage: `url(${background})`}"></div>
			<div class="Game__background__backdrop"></div>
		</div>
		<slot></slot>
	</div>
</template>

<style lang="less" scoped>
	.Game {
		position: relative;
		height: 100%;

		&__background {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;

			overflow: hidden;

			&__image {
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				margin: -10px -10px -10px -10px;

				background-size: cover;
				filter: blur(10px);
			}

			&__backdrop {
				position: absolute;
				top: -10px;
				left: -10px;
				right: -10px;
				bottom: -10px;

				background: linear-gradient(to bottom, #1e272e90 0%, #1e272ef0 50%);
			}
		}
	}
</style>

<script>
	export default {
		props: {
			background: {
				type: String,
				required: true
			}
		}
	};
</script>
