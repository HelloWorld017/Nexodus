<template>
	<input class="NxCheckbox" :style="styleObject" type="checkbox" :id="inputId" v-model="_value" :disabled="disabled">
</template>

<style lang="less" scoped>
	.NxCheckbox {
		appearance: none;
		position: relative;
		outline: none;

		width: 60px;
		height: 30px;
		border-radius: 15px;

		transition: all .4s ease;

		&[disabled]::after {
			background: #cccccc;
		}

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
			&::after {
				left: 31px;

				box-shadow: -2px 4px 3px rgba(0, 0, 0, 0.05);
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
			inputId: String,
			disabled: Boolean,
			value: Boolean,

			activeBackground: {
				type: String,
				default: '#3399cc'
			},

			background: {
				type: String,
				default: '#727374'
			},

			disabledBackground: {
				type: String,
				default: '#444444'
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
			},

			styleObject() {
				return {
					background: this.disabled ?
						this.disabledBackground :
						this.value ? this.activeBackground : this.background
				};
			}
		}
	};
</script>
