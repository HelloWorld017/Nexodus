<template>
	<div class="About">
		<div class="About__nexodus">
			<nexodus-black class="About__logo"></nexodus-black>
			<div class="About__info">
				<h1>Nexodus</h1>
				<div class="About__description">서드파티 넥슨 게임 런쳐</div>
				<div class="About__value">Nexodus {{version}}</div>
				<div class="About__value">Released @ {{builddate}}</div>
				<div class="About__value">Developed by Khinenw</div>
			</div>
		</div>

		<div class="About__desclaimer">
			<div class="About__row">
				이 프로그램은 넥슨과는 관련이 없으며, 제 3자에 의해 제작된 소프트웨어입니다.
			</div>

			<div class="About__row">
				이 프로그램을 사용하면서 발생하는 책임은 모두 사용자에게 있습니다.
			</div>
		</div>
	</div>
</template>

<style lang="less" scoped>
	.About {
		display: flex;
		padding: 30px 0;
		flex-direction: column;
		align-items: center;

		&__nexodus {
			display: flex;
			align-items: center;
		}

		&__logo {
			width: 12vw;
			height: 12vw;
		}

		&__info {
			margin-left: 3vw;

			h1 {
				font-weight: 100;
				font-size: 4rem;
				font-family: 'Exo 2', sans-serif;
				margin: 0;
				margin-bottom: 20px;
			}
		}

		&__description, &__value {
			font-family: 'Noto Sans CJK KR', sans-serif;
			font-size: 0.9rem;
			font-weight: 400;

			color: rgba(0, 0, 0, .6);
			text-shadow: 1px 1px rgba(0, 0, 0, .2);
		}

		&__description {
			font-size: 1.2rem;
			color: black;
		}

		&__desclaimer {
			display: flex;
			flex-direction: column;
			width: 100%;
			margin-top: 40px;
			padding: 0 10%;
			box-sizing: border-box;

			color: #202020;

			font-family: 'Noto Sans CJK KR', sans-serif;
			font-weight: 400;
			font-size: 1.1rem;
			text-shadow: 1px 1px rgba(0, 0, 0, .2);
		}

		&__row {
			text-align: justify;
			word-break: keep-all;
			margin-top: 20px;
		}
	}
</style>

<script>
	import NexodusBlack from "../images/NexodusBlack.svg?inline";

	export default {
		computed: {
			version() {
				return $nexodus.version;
			},

			builddate() {
				return $nexodus.builddate;
			}
		},

		components: {
			NexodusBlack
		}
	}
</script>
