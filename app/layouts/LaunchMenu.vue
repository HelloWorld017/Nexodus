<template>
	<div class="LaunchMenu">
		<img class="LaunchMenu__logo" :src="src">

		<div class="LaunchMenu__row">
			<div class="LaunchMenu__icon">
				<i class="mdi mdi-play"></i>
			</div>

			<div class="LaunchMenu__actions">
				<button class="LaunchMenu__action" @click="$emit('launch')">
					게임 시작
				</button>
			</div>
		</div>

		<div class="LaunchMenu__row">
			<div class="LaunchMenu__icon">
				<i class="mdi mdi-heart-outline"></i>
			</div>

			<div class="LaunchMenu__actions">
				<button class="LaunchMenu__action" @click="$emit('homepage')">
					홈페이지
				</button>
			</div>
		</div>

		<div class="LaunchMenu__row">
			<div class="LaunchMenu__icon">
				<i class="mdi mdi-chart-line-variant"></i>
			</div>

			<div class="LaunchMenu__label">
				<div class="LaunchMenu__stacked">
					<div class="LaunchMenu__label__key">
						총 플레이 시간
					</div>

					<div class="LaunchMenu__label__key">
						최근 플레이 날짜
					</div>
				</div>

				<div class="LaunchMenu__stacked">
					<div class="LaunchMenu__label__value">
						{{stats.total}}
					</div>

					<div class="LaunchMenu__label__value">
						{{recent}}
					</div>
				</div>
			</div>

			<div class="LaunchMenu__label">
				<div class="LaunchMenu__stacked">
					<div class="LaunchMenu__label__key">
						연간 하루 평균 플레이 시간
					</div>

					<div class="LaunchMenu__label__key">
						연간 주 평균 플레이 시간
					</div>
				</div>

				<div class="LaunchMenu__stacked">
					<div class="LaunchMenu__label__value">
						{{stats.average}}
					</div>

					<div class="LaunchMenu__label__value">
						{{stats.avgWeek}}
					</div>
				</div>
			</div>

			<div class="LaunchMenu__label">
				<div class="LaunchMenu__stacked">
					<div class="LaunchMenu__label__key">
						최근 일주일 간 플레이 시간
					</div>
				</div>
				<div class="LaunchMenu__stacked">
					<div class="LaunchMenu__label__value">
						{{stats.week}}
					</div>
				</div>
			</div>
		</div>

		<slot></slot>
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
			margin-bottom: 30px;
		}

		&__row {
			display: flex;
			align-items: stretch;
			margin-top: 10px;
			padding: 10px 30px;

			background: rgba(0, 0, 0, .6);
			color: #fff;
		}

		&__icon {
			display: flex;
			justify-content: center;
			align-items: center;
			margin-right: 20px;

			font-size: 2.5rem;
		}

		&__actions {
			display: flex;
			align-items: center;
		}

		&__action {
			padding: 10px;

			background: transparent;
			border: 1px solid #fff;
			outline: none;

			color: #fff;
			font-family: 'Noto Sans CJK KR', sans-serif;

			cursor: pointer;
			transition: all .4s ease;

			&:hover {
				background: #fff;
				color: #202020;
			}
		}

		&__stacked {
			display: flex;
			flex-direction: column;
			margin-right: 10px;
		}

		&__label {
			display: flex;
			margin-right: 20px;

			font-family: 'Noto Sans CJK KR', sans-serif;
			font-size: .9rem;
			font-weight: 200;

			&__key {
				color: rgba(255, 255, 255, .6);

				&::after {
					content: ':';
					margin-left: -4px;
					margin-right: 5px;
				}
			}
		}
	}
</style>

<script>
	export default {
		props: {
			game: {
				type: String,
				required: true
			},

			src: String
		},

		computed: {
			stats() {
				return this.$store.state.statistics[this.game] || {
					total: 0,
					recent: null,
					weeks: [0],
					currentWeek: 0
				};
			},

			week() {
				return this.stats.currentWeek;
			},

			avgWeek() {
				return this.stats.weeks.reduce((prev, curr) => prev + curr, 0) / this.stats.weeks.length;
			},

			average() {
				return this.avgWeek / 7;
			},

			recent() {
				return this.stats.recent || '없음';
			}
		}
	};
</script>
