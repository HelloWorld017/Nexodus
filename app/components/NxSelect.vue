<template>
	<div class="NxSelect" :class="{'NxSelect--expanded': expanded}">
		<button class="NxSelect__select" @click="expanded = !expanded">
			<div class="NxSelect__selected">
				{{selected}}
			</div>
			<i class="NxSelect__icon mdi mdi-chevron-down"></i>
		</button>

		<div class="NxSelect__options">
			<button class="NxSelect__option" v-for="option in options" @click="setValue(option.value)">
				{{option.name}}
			</button>
		</div>
	</div>
</template>

<style lang="less" scoped>
	.NxSelect {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		position: relative;

		&__select {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 10px 20px;
			height: 50px;

			background: #101519;
			border: 1px solid #404040;
			border-radius: 5px;
			outline: none;

			color: #f1f1f1;
			font-size: 1.1rem;
			font-family: 'Noto Sans CJK KR', sans-serif;

			transition: all .4s ease;
		}

		&__options {
			display: flex;
			flex-direction: column;

			position: absolute;
			top: 50px;
			left: 0;
			right: 0;

			background: #101519;
			border: 1px solid #3399cc;
			border-top: 1px solid #404040;

			border-radius: 0 0 5px 5px;
			box-shadow: 0 2px 5px 1px rgba(0, 0, 0, .3);
			transition: all .4s ease;

			z-index: 1;
		}

		&__option {
			border: none;
			box-sizing: border-box;
			padding: 10px 20px;
			height: 50px;

			background: transparent;
			color: #f1f1f1;
			outline: none;
			font-size: 1.1rem;
			font-family: 'Noto Sans CJK KR', sans-serif;
			text-align: left;

			&:hover {
				background: lighten(#101519, 5%);
			}
		}

		&__icon {
			transition: all .4s ease;
		}

		&:not(&--expanded) {
			.NxSelect__options {
				opacity: 0;
				pointer-events: none;
			}
		}

		&--expanded {
			.NxSelect__select {
				border-radius: 5px 5px 0 0;
				border-color: #3399cc;
				border-bottom-color: transparent;
				box-shadow: 0 -1px 5px 1px rgba(0, 0, 0, .3);
			}

			.NxSelect__icon {
				transform: rotate(180deg);
			}
		}
	}
</style>

<script>
	export default {
		data() {
			return {
				expanded: false
			};
		},

		model: {
			prop: 'value',
			event: 'change'
		},

		props: {
			value: {},

			options: {
				type: Array,
				required: true
			}
		},

		methods: {
			setValue(v) {
				this.$emit('change', v);
				this.expanded = false;
			}
		},

		computed: {
			selected() {
				const selected = this.options.find(v => v.value === this.value);
				if(selected === undefined || selected === null) {
					return '';
				}

				return selected.name;
			}
		}
	};
</script>
