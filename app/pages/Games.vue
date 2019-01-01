<template>
	<main class="Games">
		<aside class="Sidebar">
			<div class="Sidebar__tabs">
				<router-link class="Sidebar__tab" to="/">
					<img class="Sidebar__tab__icon" src="../images/nexodus.svg">
				</router-link>

				<router-link class="Sidebar__tab" v-for="game in activatedGames" :key="game" :to="`/${game}`">
					<img class="Sidebar__tab__icon" :src="getIcon(game)">
				</router-link>
			</div>
		</aside>

		<section class="Tabs">
			<transition name="Tabs" mode="out-in">
				<router-view></router-view>
			</transition>
		</section>
	</main>
</template>

<style lang="less" scoped>
	.Games {
		display: flex;
		height: 100%;
	}

	.Sidebar {
		background: #1C2125;
		display: flex;
		flex-direction: column;
		width: 92px;
		margin-top: -48px;

		&__titlebar {
			height: 48px;

			-webkit-user-select: none;
			-webkit-app-region: drag;
		}

		&__tabs {
			display: flex;
			flex-direction: column;
		}

		&__tab {
			width: 72px;
			height: 72px;
			padding: 10px;

			display: flex;
			align-items: center;
			justify-content: center;

			&.router-link-exact-active {
				background: #232E37;
				cursor: default;
			}

			&__icon {
				width: 48px;
				height: 48px;
			}
		}
	}

	.Tabs {
		flex: 1;

		&-enter-active, &-leave-active {
			transition: all .3s ease;
		}

		&-enter, &-leave-to {
			opacity: 0;
		}
	}
</style>

<script>
	export default {
		computed: {
			activatedGames() {
				return this.$store.state.config.activatedGames;
			}
		},

		methods: {
			getIcon(game) {
				return $nexodus.games[game].logo;
			}
		}
	};
</script>
