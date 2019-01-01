<template>
	<input class="NxCheckbox" type="checkbox" :id="inputId" v-model="_value">
</template>

<style lang="less" scoped>
	.NxCheckbox {
		appearance: none;
		position: relative;
		outline: none;

		width: 60px;
		height: 30px;
		background: #727374;
		border-radius: 15px;

		transition: all .4s ease;

		&::after {
			content: "";
			position: absolute;
			top: 2px;
			left: 3px;

			width: 26px;
			height: 26px;
			background: #fff;
			border-radius: 13px;

			box-shadow: 2px 4px 6px rgba(0, 0, 0, .2);
			transition: all .4s ease;
		}

		&:checked {
			background: #3399cc;

			&::after {
				left: 31px;

				box-shadow: -2px 4px 3px rgba(0,0,0,0.05);
			}
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
			inputId: {
				type: String
			},

			value: {
				type: Boolean
			}
		},

		computed: {
			_value: {
				get() {
					return this.value;
				},

				set(v) {
					return this.$emit('change', v);
				}
			}
		}
	};
</script>
