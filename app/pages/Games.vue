<template>
	<main class="Games">
		<aside class="Sidebar">
			<!-- <div class="Sidebar__titlebar"></div> -->
			<div class="Sidebar__tabs">
				<router-link class="Sidebar__tab" to="/">
					<img class="Sidebar__tab__icon" src="../images/nexodus.svg">
				</router-link>
			</div>
		</aside>

		<section class="Tabs">
			<transition>
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

			display: flex;
			align-items: center;
			justify-content: center;

			&.router-link-active {
				background: #232E37;
				cursor: default;
				padding: 10px;
			}

			&__icon {
				width: 48px;
				height: 48px;
			}
		}
	}

	.Tabs {
		flex: 1;
	}
</style>
