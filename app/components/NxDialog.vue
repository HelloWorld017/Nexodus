<template>
	<div class="DialogComposed">
		<transition name="Backdrop">
			<div class="Backdrop" v-if="opened" @click="close"></div>
		</transition>

		<transition name="Dialog">
			<div class="Dialog" v-if="opened" :style="{background}">
				<a class="Dialog__close" @click="close">
					<i class="mdi mdi-close"></i>
				</a>
				<slot></slot>
			</div>
		</transition>
	</div>
</template>

<style lang="less" scoped>
	.Backdrop {
		background: rgba(0, 0, 0, .6);
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;

		&-enter-active, &-leave-active {
			transition: opacity .4s;
		}

		&-enter, &-leave-to {
			opacity: 0;
		}
	}

	.Dialog {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);

		width: 50vw;
		height: 70vh;
		overflow: auto;

		border-radius: 5px;

		&-enter-active, &-leave-active {
			transition: all .4s;
		}

		&-enter, &-leave-to {
			opacity: 0;
			transform: translate(-50%, -50%) translate(0, 20px);
		}

		&__close {
			position: absolute;
			top: 10px;
			right: 20px;
			font-size: 1.6rem;
			cursor: pointer;
		}
	}
</style>

<script>
	export default {
		data() {
			return {
				opened: false
			};
		},

		props: {
			background: {
				type: String,
				default: '#f1f1f1'
			}
		},

		methods: {
			open() {
				this.opened = true;
			},

			close() {
				this.opened = false;
			}
		}
	};
</script>
