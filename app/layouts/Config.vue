<template>
	<div class="Config">
		<div class="Config__section" v-for="(sectionObject, sectionKey) in descriptor">
			<div class="Config__row" v-for="(configObject, configKey) in sectionObject"
				:style="getStyleObj(configObject)">

				<div class="Config__key">
					<span class="Config__name">
						{{configObject.name}}
					</span>

					<span class="Config__description">
						{{configObject.desc}}
					</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import configDescriptor from "../src/config";

	export default {
		computed: {
			descriptor() {
				return configDescriptor;
			},

			config() {
				return $nexodus.config;
			}
		}
	}
</script>
