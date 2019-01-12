<template>
	<main class="Login">
		<form class="Login__form" @submit="submit">
			<h1 class="Login__title">Nexodus</h1>
			<nx-text-input v-model="id" placeholder="Email"></nx-text-input>
			<nx-text-input v-model="password" placeholder="Password" type="password" @submit="submit">
				<i class="mdi mdi-arrow-right-bold-circle" v-if="!loggingIn"></i>
				<i class="mdi mdi-loading mdi-spin" v-else></i>
			</nx-text-input>

			<div class="Login__options">
				<label>
					<div class="Login__option__name">
						이메일 저장
					</div>

					<nx-checkbox v-model="saveEmail" background="rgba(0, 0, 0, .3)"></nx-checkbox>
				</label>

				<label>
					<div class="Login__option__name">
						자동 로그인
					</div>

					<nx-checkbox v-model="savePassword"
						background="rgba(0, 0, 0, .3)"
						disabled-background="rgba(200, 200, 200, .4)"
						:disabled="!saveEmail">
					</nx-checkbox>
				</label>
			</div>

			<input type="submit" style="visibility: hidden;">
		</form>
	</main>
</template>

<style lang="less" scoped>
	.Login {
		display: flex;
		flex-direction: column;
		justify-content: center;
		box-sizing: border-box;
		padding: 0 60px;
		width: 100%;
		height: 100%;

		background: linear-gradient(45deg,  #141e30, #243b55);

		&__form {
			& > *:not(:last-child) {
				margin-bottom: 20px;
			}
		}

		&__title {
			margin: 0;
			margin-bottom: 40px !important;

			color: #f1f1f1;
			font-family: 'NanumSquare', sans-serif;
			font-size: 2rem;
			font-weight: 100;
			text-align: center;
			text-transform: uppercase;
		}

		&__options {
			display: flex;
			flex-direction: column;
			align-items: flex-end;

			& > *:not(:last-child) {
				margin-bottom: 10px;
			}
		}

		&__option__name {
			margin-right: 10px;
		}
	}

	label {
		display: flex;
		align-items: center;

		color: rgba(255, 255, 255, .8);
		font-family: 'Noto Sans CJK KR', sans-serif;
	}
</style>

<script>
	import NxCheckbox from "../components/NxCheckbox.vue";
	import NxTextInput from "../components/NxTextInput.vue";

	import swal from "sweetalert2";

	export default {
		data() {
			return {
				id: '',
				password: '',
				loggingIn: false
			};
		},

		methods: {
			async submit(evt) {
				if(evt && evt.preventDefault) {
					evt.preventDefault();
				}

				this.loggingIn = true;
				if(!$nexodus.launcher) {
					alert("Login not implemented!");
				} else {
					try {
						await $nexodus.launcher.login(this.id, this.password);
					} catch(e) {
						const {message, isFatal} = e;

						swal({
							type: 'error',
							title: '로그인에 실패했습니다.',
							text: message
						});
					}
				}

				this.loggingIn = false;
			}
		},

		computed: {
			saveEmail: {
				get() {
					return this.$store.state.config.security.saveEmail;
				},

				set(v) {
					this.$store.commit('configUpdate', {section: 'security', config: 'saveEmail', value: v});
				}
			},

			savePassword: {
				get() {
					return this.$store.state.config.security.saveLogin;
				},

				set(v) {
					this.$store.commit('configUpdate', {section: 'security', config: 'saveLogin', value: v});
				}
			}
		},

		components: {
			NxCheckbox,
			NxTextInput
		}
	};
</script>
