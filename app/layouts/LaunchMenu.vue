<template>
	<div class="LaunchMenu">
		<img class="LaunchMenu__logo" :src="src">

		<button class="LaunchMenu__button" @click="$emit('launch')">
			<span class="LaunchMenu__button__text">
				게임 시작
			</span>
		</button>
	</div>
</template>

<style lang="less" scoped>
	.LaunchMenu {
		position: relative;
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		padding: 30px 80px;

		&__logo {
			max-height: 100px;
		}

		&__button {
			position: absolute;
			left: 80px;
			bottom: 60px;
			width: 25vw;
			height: 15vh;

			background: transparent;
			border: none;
			border-radius: 5px;
			outline: none;

			color: #fff;
			font-size: 2rem;
			font-family: 'Noto Sans CJK KR', sans-serif;
			font-weight: 900;

			cursor: pointer;
			transition: all .4s ease;

			&::before {
				content: '';
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;

				background: linear-gradient(45deg, #1fabff, #1d88de);
				border-radius: 3px;
				box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .2);
				opacity: .8;
				transition: all .4s ease;
			}

			&:hover {
				box-shadow: 0 3px 16px 4px rgba(0, 0, 0, .2), 0 6px 18px 3px rgba(0, 0, 0, .13);

				&::before {
					opacity: 1;
				}

				.LaunchMenu__button__text {
					color: #fff;
				}
			}

			&:active {
				.LaunchMenu__button__text {
					color: rgba(255, 255, 255, .3);
				}
			}

			&__text {
				position: relative;
				color: rgba(255, 255, 255, .5);
				transition: all .4s ease;
			}
		}
	}
</style>

<script>
	export default {
		props: {
			src: String
		}
	};
</script>
