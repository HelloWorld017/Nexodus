<template>
	<div class="Config">
		<h1><i class="mdi mdi-cogs"></i> 설정</h1>
		<div class="Config__sections">
			<div class="Config__section" v-for="(sectionObject, sectionKey) in descriptor">
				<div class="Config__row" v-for="(conf, configKey) in sectionObject"
					:style="getStyleObj(conf)">

					<div class="Config__line">
						<label class="Config__key" :for="`${sectionKey}.${configKey}`">
							<span class="Config__name">
								{{conf.name}}
							</span>

							<span class="Config__description">
								{{conf.desc}}
							</span>
						</label>

						<div class="Config__button">
							<nx-checkbox :value="config[sectionKey][configKey]"
								:input-id="`${sectionKey}.${configKey}`"
								:disabled="calcRequirement(conf.requirements, sectionKey)"
								@change="updateConfig(sectionKey, configKey, $event)"
								v-if="conf.type === 'boolean'">
							</nx-checkbox>
						</div>
					</div>

					<div class="Config__buttonOuter">
						<nx-select :value="config[sectionKey][configKey]"
							:options="conf.enums"
							:disabled="calcRequirement(conf.requirements, sectionKey)"
							@change="updateConfig(sectionKey, configKey, $event)"
							v-if="conf.type === 'enum'">
						</nx-select>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="less" scoped>
	.Config {
		font-family: 'Noto Sans KR', sans-serif;
		box-sizing: border-box;
		width: 100%;
		height: 100%;
		padding: 10px 60px;
		padding-bottom: 100px;
		overflow: auto;

		& > h1 {
			color: #f1f1f1;
			font-size: 3.3rem;
			font-weight: 700;
			margin-top: 0;
		}

		&__sections {
			display: flex;
			flex-direction: column;
			align-items: center;
		}

		&__section {
			max-width: 600px;
			width: 100%;
			padding: 20px;
			margin: 10px 0;
			background: #1b2329;
			box-shadow: 0 1px 4px 0 rgba(0, 0, 0, .3);
		}

		&__line {
			display: flex;
			justify-content: space-between;
			align-items: center;
		}

		&__row {
			&:not(:first-of-type) {
				margin-top: 20px;
			}
		}

		&__button {
			margin-right: 10px;
		}

		&__buttonOuter * {
			margin-top: 10px;
		}

		&__key {
			display: flex;
			flex-direction: column;
		}

		&__name {
			font-size: 1.3rem;
			font-weight: 400;
			color: #f1f1f1;
			text-shadow: 1px 1px rgba(255, 255, 255, .2);
		}

		&__description {
			font-size: 0.8rem;
			color: rgba(255, 255, 255, .5);
		}
	}
</style>

<script>
	import NxCheckbox from "../components/NxCheckbox.vue";
	import NxSelect from "../components/NxSelect.vue";

	import configDescriptor from "../src/config";

	export default {
		computed: {
			descriptor() {
				return configDescriptor;
			},

			config() {
				return this.$store.state.config;
			}
		},

		methods: {
			getStyleObj(config) {
				return {
					"padding-left": config.level * 40 + "px"
				};
			},

			updateConfig(section, config, value) {
				this.$store.commit('configUpdate', {section, config, value});
			},

			calcRequirement(reqs, sectionKey) {
				if(!reqs) return false;

				return !reqs.every(r => this.config[sectionKey][r]);
			}
		},

		components: {
			NxCheckbox,
			NxSelect
		}
	};
</script>
