<template>
	<div class="EditSidebar">
		<h1 class="EditSidebar__title">
			<i class="mdi mdi-pencil"></i> 메뉴 편집
		</h1>

		<div class="Sidebar">
			<h2 class="Sidebar__title">현재 메뉴</h2>
			<draggable v-model="sidebar" class="Sidebar__draggable" :options="dragOptions">
				<transition-group class="Sidebar__list" name="Move" el="div">
					<div class="Sidebar__tab" v-for="game in sidebar" :key="game">
						<img class="Sidebar__tab__icon" :src="getIcon(game)">
					</div>
				</transition-group>
			</draggable>
		</div>

		<div class="Sidebar">
			<h2 class="Sidebar__title">추가 가능한 게임</h2>
			<draggable v-model="notSidebar" class="Sidebar__draggable" :options="dragOptions">
				<transition-group class="Sidebar__list" name="Move" el="div">
					<div class="Sidebar__tab" v-for="game in notSidebar" :key="game">
						<img class="Sidebar__tab__icon" :src="getIcon(game)">
					</div>
				</transition-group>
			</draggable>
		</div>
	</div>
</template>

<style lang="less" scoped>
	.EditSidebar {
		padding: 10px 60px;

		&__title {
			margin: 0;
			margin-bottom: 30px;

			color: #fff;
			font-family: 'Noto Sans CJK KR', sans-serif;
			font-weight: 100;
			font-size: 3.3rem;
		}
	}

	.Sidebar {
		background: #1b2329;
		box-shadow: 0 1px 4px 0 rgba(0, 0, 0, .3);

		&:not(:last-child) {
			margin-bottom: 30px;
		}

		&__title {
			color: #f1f1f1;
			font-family: 'Noto Sans CJK KR', sans-serif;

			margin: 0;
			margin-left: 30px;
			padding-top: 20px;
		}

		&__list {
			display: flex;
			height: 88px;
		}

		&__tab {
			display: flex;
			align-items: center;
			justify-content: center;
			box-sizing: content-box;
			padding: 20px 20px;
			width: 48px;
			height: 48px;
		}
	}

	.Move {
		&-enter-active, &-leave-active {
			transition: all .4s ease;
		}

		&-enter, &-leave-to {
			opacity: 0;
		}

		&-move {
			//transition: all .4s ease;
		}
	}

	.Ghost {
		opacity: .6;
	}
</style>

<script>
	import Draggable from "vuedraggable";

	export default {
		computed: {
			sidebar: {
				get() {
					return this.$store.state.config.activatedGames;
				},

				set(v) {
					this.$store.commit('activatedGamesSet', v);
				}
			},

			notSidebar: {
				get() {
					const activatedGames = this.sidebar;
					return Object.keys($nexodus.games).filter(v => !activatedGames.includes(v));
				},

				set() {}
			},

			dragOptions() {
				return {
					animation: 150,
					ghostClass: 'Ghost',
					group: 'sidebar'
				};
			}
		},

		methods: {
			getIcon(game) {
				return $nexodus.games[game].logo;
			}
		},

		components: {
			Draggable
		}
	};
</script>
