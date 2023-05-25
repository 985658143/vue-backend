<template>
    <div>
        <div class="bg-banner" />
        <div id="login-box">
            <div class="login-banner" />
            <!-- 登录 -->
            <el-form v-if="showLogin" ref="form" :model="form" :rules="rules" class="login-form" auto-complete="on" label-position="left">
                <div class="title-container">
                    <h3 class="title">{{ title }}管理后台</h3>
                </div>
                <div>
                    <el-form-item prop="account">
                        <el-input ref="name" v-model="form.account" placeholder="用户名" type="text" tabindex="1" auto-complete="on">
                            <svg-icon slot="prefix" name="user" />
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input ref="password" v-model="form.password" :type="passwordType" placeholder="密码" tabindex="2" auto-complete="on" @keyup.enter.native="handleLogin">
                            <svg-icon slot="prefix" name="password" />
                            <svg-icon slot="suffix" :name="passwordType === 'password' ? 'eye' : 'eye-open'" @click="showPassword" />
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="verify">
                        <div class="verify_box">
                            <img class="verify" :src="imageUrl" alt="验证码" @click="showCode">
                            <el-input ref="verify" class="verify_input" v-model="form.verify" placeholder="验证码" type="text" tabindex="3"  maxlength="4" auto-complete="on" @keyup.enter.native="handleLogin">
                                <svg-icon slot="prefix" name="fullscreen" />
                            </el-input>
                        </div>
                    </el-form-item>
                </div>
                <div class="item_box">
                    <el-checkbox v-model="form.remember">记住我</el-checkbox>
                    <div class="to_register" @click="toRegister()">注册账号</div>
                </div>
                <el-button :loading="loading" type="primary" style="width: 100%;" @click.native.prevent="handleLogin">登 录</el-button>
                <div style="margin-top: 20px; margin-bottom: -10px; color: #666; font-size: 14px; text-align: center; font-weight: bold;">
                    <span style="margin-right: 5px;">演示帐号一键登录：</span>
                    <el-button type="danger" size="mini" @click="testAccount('张一')">admin</el-button>
                    <el-button type="danger" size="mini" plain @click="testAccount('test')">test</el-button>
                </div>
            </el-form>
            <!-- 注册 -->
            <el-form v-else ref="form2" :model="form2" :rules="rules2" class="login-form" auto-complete="on" label-position="left">
                <div class="title-container">
                    <h3 class="title">{{ title }}管理后台</h3>
                </div>
                <div>
                    <el-form-item prop="account">
                        <el-input ref="name" v-model="form2.account" placeholder="请输入用户名" type="text" tabindex="1" auto-complete="on">
                            <svg-icon slot="prefix" name="user" />
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input ref="password" v-model="form2.password" :type="passwordType" placeholder="请输入密码" tabindex="2" auto-complete="on" @keyup.enter.native="handleRegister">
                            <svg-icon slot="prefix" name="password" />
                            <svg-icon slot="suffix" :name="passwordType === 'password' ? 'eye' : 'eye-open'" @click="showPassword" />
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="password2">
                        <el-input ref="password2" v-model="form2.password2" :type="passwordType" placeholder="确认密码" tabindex="2" auto-complete="on" @keyup.enter.native="handleRegister">
                            <svg-icon slot="prefix" name="password" />
                            <svg-icon slot="suffix" :name="passwordType === 'password' ? 'eye' : 'eye-open'" @click="showPassword" />
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="phone">
                        <el-input ref="phone" v-model="form2.phone" type="number" placeholder="请输入电话" tabindex="2" auto-complete="on" @keyup.enter.native="handleRegister">
                            <svg-icon slot="prefix" name="phone" />
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="address">
                        <el-input ref="address" v-model="form2.address" type="text" placeholder="请输入地址" tabindex="2" auto-complete="on" @keyup.enter.native="handleRegister">
                            <svg-icon slot="prefix" name="address" />
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="verify">
                        <div class="verify_box">
                            <img class="verify" :src="imageUrl" alt="验证码" @click="showCode">
                            <el-input ref="verify" class="verify_input" v-model="form2.verify" placeholder="验证码" type="text" tabindex="3"  maxlength="4" auto-complete="on" @keyup.enter.native="handleRegister">
                                <svg-icon slot="prefix" name="fullscreen" />
                            </el-input>
                        </div>
                    </el-form-item>
                </div>
                <el-button :loading="loading" type="primary" style="width: 100%;" @click.native.prevent="handleRegister">注 册</el-button>
                <div class="had_account">已有账号?<span @click="toRegister()">去登录~</span></div>
            </el-form>
        </div>
        <Copyright v-if="$store.state.settings.showCopyright" />
    </div>
</template>

<script>
export default {
    name: 'Login',
    data() {
        return {
            showLogin: true,
            title: process.env.VUE_APP_TITLE,
            imageUrl: "",
            form: {
                account: localStorage.account || '',
                password: '',
                verify: '',
                code: "",
                remember: !!localStorage.account
            },
            form2: {
                account: '',
                password: '',
                password2: '',
                phone: '',
                address: '',
                verify: '',
                code: "",
            },
            rules: {
                account: [
                    { required: true, trigger: 'blur', message: '请输入用户名' }
                ],
                password: [
                    { required: true, trigger: 'blur', message: '请输入密码' },
                    { min: 6, max: 18, trigger: 'blur', message: '密码长度为6到18位' }
                ],
                verify: [
                    { required: true, trigger: 'blur', message: '请输入验证码' },
                ],
            },
            rules2: {
                account: [
                    { required: true, trigger: 'blur', message: '请输入用户名' }
                ],
                password: [
                    { required: true, trigger: 'blur', message: '请输入密码' },
                    { min: 6, max: 18, trigger: 'blur', message: '密码长度为6到18位' }
                ],
                password2: [
                    { required: true, trigger: 'blur', message: '请输入密码' },
                    { min: 6, max: 18, trigger: 'blur', message: '密码长度为6到18位' }
                ],
                phone: [
                    { required: true, trigger: 'blur', message: '请输入电话' },
                    { min: 11, max: 11, trigger: 'blur', message: '电话长度为11位' }
                ],
                address: [
                    { required: true, trigger: 'blur', message: '请输入地址' }
                ],
                verify: [
                    { required: true, trigger: 'blur', message: '请输入验证码' },
                ],
            },
            loading: false,
            passwordType: 'password',
            redirect: undefined
        }
    },
    watch: {
        $route: {
            handler: function(route) {
                console.log(route)
                this.redirect = route.query && route.query.redirect
            },
            immediate: true
        }
    },
    mounted() {
        this.showCode();
    },
    methods: {
        // 生成验证码
        showCode() {
            let that = this;
            let val = that.showLogin;
            that.$store.dispatch('user/showCode').then((res)=> {
                console.log(res)
                if(res.resultCode == 200) {
                    let img = res.data.img;
                    let code = res.data.code;
                    val ? that.form.code = code : that.form2.code = code
                    that.verifyCode(img)
                }else {
                    this.$message(res.message)
                }
                
            })
        },
        verifyCode(img) {
            const imageBase64 = "data:image/jpeg;base64," + img;
                if (typeof imageBase64 === "string") {
                    // 复制某条消息
                    if (!imageBase64) return; // console.log(data.string) // 正则表达式判断data是否是base64
                    function validDataUrl(s) {
                        return validDataUrl.regex.test(s);
                    }
                    validDataUrl.regex =
                    /^\s*data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:@\/?%\s]*?)\s*$/i; // 如果是base64转换成图片预览
                    if (validDataUrl(imageBase64)) {
                        // debugger;
                        this.imageUrl = imageBase64;
                    }
                }
        },
        showPassword() {
            this.passwordType = this.passwordType === 'password' ? '' : 'password'
            this.$nextTick(() => {
                this.$refs.password.focus()
            })
        },
        // 登录
        handleLogin() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    this.loading = true;
                    this.$store.dispatch('user/login', this.form).then((res) => {
                        if(res.resultCode == 200) {
                            this.$message({
                                type: 'success',
                                message: "登录成功，欢迎你~"
                            })
                            this.$router.push({ path: this.redirect || '/' })
                        }else {
                            this.$message(res.message)
                        }
                        this.loading = false
                    }).catch((err) => {
                        this.loading = false
                    })
                }
            })
        },
        // 注册
        handleRegister() {
            const {password, password2} = this.form2;
            if(password !== password2) {
                this.$message('两次密码不一致');
                return 
            }
            this.$refs.form2.validate(valid => {
                if (valid) {
                    this.loading = true
                    this.$store.dispatch('user/register', this.form2).then((res) => {
                        if(res.resultCode == 200) {
                            this.$message({
                                type: 'success',
                                message: res.message
                            })
                            setTimeout(()=> {
                                this.toRegister();
                            }, 1500)
                         }else {
                            this.$message(res.message)
                         }
                         this.loading = false
                    }).catch(() => {
                        this.loading = false
                    })
                }
            })
        },
        testAccount(account) {
            this.form.account = account;
            // this.form.password = '123456';
            this.form.password = '123456';
            this.form.verify = this.form.code;
            this.handleLogin()
        },
        // 切换注册
        toRegister() {
            this.showLogin = !this.showLogin;
            this.showCode();
        }
    }
}
</script>

<style lang="scss" scoped>

[data-mode=mobile] {
    #login-box {
        max-width: 80%;
        .login-banner {
            display: none;
        }
    }
}
::v-deep input[type=password]::-ms-reveal {
    display: none;
}
.bg-banner {
    position: absolute;
    z-index: 0;
    width: 100%;
    height: 100%;
    background-image: url(../assets/images/login-bg.jpg);
    background-size: cover;
    background-position: center center;
}
#login-box {
    display: flex;
    justify-content: space-between;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    background: rgba(255, 255, 255, 0.8);
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 0 5px #999;
    .login-banner {
        width: 300px;
        background-image: url(../assets/images/login-banner.jpg);
        background-size: cover;
        background-position: center center;
    }
    .login-form {
        width: 450px;
        padding: 50px 35px 30px;
        overflow: hidden;
        .svg-icon {
            vertical-align: -0.35em;
        }
        .title-container {
            position: relative;
            .title {
                font-size: 22px;
                color: #666;
                margin: 0 auto 30px;
                text-align: center;
                font-weight: bold;
                @include text-overflow;
            }
        }
        .verify_box {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            width: 100%;
            .verify {
                position: relative;
                width: 50%;
            }
            .verify_input {
                position: relative;
                width: 40%;
            }
        }
        .item_box {
            display: flex;
            justify-content: space-between;
            align-self: center;
            width: 100%;
            height: 50px;
            .to_register {
                font-size: 15px;
                text-decoration: underline;
                color: #3f9eff;
            }
        }
        .had_account {
            margin-top: 5px;
            width: 100%;
            text-align: center;
            color: #3f9eff;
            letter-spacing: 1px;
            font-size: 15px;
            span {
                color: #e94f4f;
                font-weight: bold;
                text-decoration: underline;
            }
        }
    }
    ::v-deep .el-input {
        display: inline-block;
        height: 48px;
        width: 100%;
        input {
            height: 48px;
        }
        .el-input__prefix {
            left: 10px;
        }
        .el-input__suffix {
            right: 10px;
        }
    }
}
.copyright {
    position: absolute;
    bottom: 30px;
    width: 100%;
    margin: 0;
    mix-blend-mode: difference;
}
</style>
