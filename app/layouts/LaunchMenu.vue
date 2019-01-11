<template>
	<div class="LaunchMenu">
		<img class="LaunchMenu__logo" :src="src">

		<div class="LaunchMenu__row">
			<div class="LaunchMenu__icon">
				<i class="mdi mdi-chart-line-variant"></i>
			</div>

			<div class="LaunchMenu__list">
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
							{{total}}
						</div>

						<div class="LaunchMenu__label__value">
							{{recent}}
						</div>
					</div>
				</div>

				<div class="LaunchMenu__label">
					<div class="LaunchMenu__stacked">
						<div class="LaunchMenu__label__key">
							하루 평균 플레이 시간
						</div>

						<div class="LaunchMenu__label__key">
							주 평균 플레이 시간
						</div>
					</div>

					<div class="LaunchMenu__stacked">
						<div class="LaunchMenu__label__value">
							{{average}}
						</div>

						<div class="LaunchMenu__label__value">
							{{avgWeek}}
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
							{{week}}
						</div>
					</div>
				</div>
			</div>
		</div>

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
			align-items: center;
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

		&__list {
			display: flex;
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
	import moment from "moment";
	moment.locale('ko');

	export default {
		props: {
			game: {
				type: String,
				required: true
			},

			src: String
		},

		computed: {
			running() {
				return this.$store.state.running[this.game];
			},

			stats() {
				return this.$store.state.statistics[this.game] || {
					total: 0,
					recent: null,
					elapsedDate: 1,
					currentWeek: 0
				};
			},

			total() {
				return this.pretty(this.stats.total);
			},

			week() {
				return this.pretty(this.stats.currentWeek);
			},

			avgWeek() {
				return this.pretty(this.stats.total / (moment.duration(this.stats.elapsedDate, 'days').weeks() + 1));
			},

			average() {
				return this.pretty(this.stats.total / this.stats.elapsedDate);
			},

			recent() {
				if(!this.stats.recent) return '없음';
				const date = moment(this.stats.recent);
				const today = moment();

				if(date.week() === today.week()) {
					if(date.date() === today.date()) {
						return '오늘';
					}

					if(date.dayOfYear() + 1 === today.dayOfYear()) {
						return '어제';
					}

					return date.format('dddd');
				}

				return date.format('YYYY-MM-DD');
			}
		},

		methods: {
			launch() {
				this.$emit('launch');
			},

			homepage() {
				$nexodus.launcher.homepage(this.game);
			},

			pretty(hrs) {
				if(hrs < 1) {
					return Math.round(hrs * 60) + '분';
				}

				return Math.round(hrs) + '시간';
			}
		}
	};
</script>
