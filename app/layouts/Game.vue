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

		&__background {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;

			overflow: hidden;

			&__image, &__backdrop {
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
			}

			&__image {
				margin: -10px -10px -10px -10px;

				background-size: cover;
				filter: blur(10px);
			}

			&__backdrop {
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
