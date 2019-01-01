<template>
	<label class="NxTextInput">
		<input class="NxTextInput__input" :type="type" v-model="_value" :placeholder="placeholder">
		<a class="NxTextInput__icon" @click="submit">
			<slot></slot>
		</a>
	</label>
</template>

<style lang="less" scoped>
	.NxTextInput {
		display: flex;
		position: relative;

		&__input {
			opacity: .3;

			flex: 1;
			padding: 15px 30px;
			border: none;
			border-radius: 5px;
			outline: none;

			color: rgba(0, 0, 0, .8);
			font-family: 'Noto Sans CJK KR', sans-serif;

			transition: all .4s ease;

			&:focus {
				opacity: 1;

				& + .NxTextInput__icon {
					opacity: 1;

					color: #3399cc;
				}
			}
		}

		&__icon {
			cursor: pointer;
			opacity: .3;

			position: absolute;
			color: #fff;
			right: 20px;
			top: 50%;

			font-size: 1.5rem;

			transform: translate(0, -50%);
			transition: all .4s ease;
		}
	}
</style>

<script>
	export default {
		model: {
			prop: 'value',
			event: 'change'
		},

		props: {
			value: {
				type: String
			},

			type: {
				type: String,
				default: 'text'
			},

			placeholder: String
		},

		computed: {
			_value: {
				get() {
					return this.value;
				},

				set(v) {
					this.$emit('change', v);
				}
			}
		},

		methods: {
			submit() {
				this.$emit('submit');
			}
		}
	};
</script>
