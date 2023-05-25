<template>
    <div>
        <!-- 页面：Setting -->
        <page-main>
            <el-tabs tab-position="left" style="height: 600px;">
                <el-tab-pane label="基本设置" class="basic">
                    <h2>基本设置</h2>
                    <el-row :gutter="20">
                        <el-col :span="16">
                            <el-form ref="form" :model="form" label-width="120px" label-suffix="：">
                                <el-form-item label="uid">
                                    <el-input disabled v-model="form.uid"/>
                                </el-form-item>
                                <el-form-item label="用户名">
                                    <el-input v-model="form.uname" placeholder="请输入你的用户名" />
                                </el-form-item>
                                <el-form-item label="密 码">
                                    <el-input v-model="form.upwd" placeholder="请输入你的密码" />
                                </el-form-item>
                                <el-form-item label="电 话">
                                    <el-input v-model="form.utel" placeholder="请输入你的手机号" />
                                </el-form-item>
                                <el-form-item label="地址">
                                    <el-input v-model="form.uloc" placeholder="请输入你的地址" />
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" @click="updateUser()">保存</el-button>
                                    <el-button type="danger" @click="handleDelete()">注销账号</el-button>
                                </el-form-item>
                            </el-form>
                        </el-col>
                        <!-- <el-col :span="8">
                            <image-upload :url.sync="form.headimg" action="http://scrm.1daas.com/api/upload/upload" name="image" :data="{'token':'TKD628431923530324'}" notip class="headimg-upload" @onSuccess="handleSuccess" />
                        </el-col> -->
                    </el-row>
                </el-tab-pane>
                <!-- <el-tab-pane label="安全设置" class="security">
                    <h2>安全设置</h2>
                    <div class="setting-list">
                        <div class="item">
                            <div class="content">
                                <div class="title">账户密码</div>
                                <div class="desc">当前密码强度：强</div>
                            </div>
                            <div class="action">
                                <el-button type="text" @click="editPassword">修改</el-button>
                            </div>
                        </div>
                        <div class="item">
                            <div class="content">
                                <div class="title">密保手机</div>
                                <div class="desc">已绑定手机：187****3441</div>
                            </div>
                            <div class="action">
                                <el-button type="text">修改</el-button>
                            </div>
                        </div>
                        <div class="item">
                            <div class="content">
                                <div class="title">备用邮箱</div>
                                <div class="desc">当前未绑定备用邮箱</div>
                            </div>
                            <div class="action">
                                <el-button type="text">绑定</el-button>
                            </div>
                        </div>
                    </div>
                </el-tab-pane> -->
            </el-tabs>
        </page-main>
    </div>
</template>

<script>
export default {
    name: 'PersonalSetting',
    beforeRouteLeave(to, from, next) {
        if (['personalEditPassword'].includes(to.name)) {
            this.$store.commit('keepAlive/add', 'PersonalSetting')
        }
        next()
    },
    props: {},
    data() {
        return {
            uid: "",
            form: {}
        }
    },
    created() {},
    mounted() {
        this.getUserInfo();
    },
    methods: {
        // 获取用户个人信息
        getUserInfo() {
            let uid = localStorage.getItem("uid");
            this.uid = uid;
            console.log(uid)
            let data = {
                uid: uid
            }
            this.$store.dispatch('user/singleInfo', data).then((res)=> {
                console.log(res)
                if(res.resultCode == 200) {
                    let list = res.data;
                    this.form = list;
                }else {
                    this.$message(res.message)
                }
            })
        },
        // 修改个人信息
        updateUser() {
            let data = this.form;
            this.$store.dispatch("user/updateUser", data).then((res) => {
            if(res.resultCode == 200) {
                // 请求成功
                this.$message({
                    type: 'success',
                    message: res.message
                })
            }else {
                this.$message(res.message)
            }
        })
        },
        // 注销点击
        handleDelete() {
            let that = this;
            this.$confirm('此操作将永久删除该账号, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
                // 删除请求api
                this.deleteAccount();
            }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消删除'
            });          
            });
        },
        // 注销账号
        deleteAccount() {
            let data = {
                uid: this.uid
            }
            this.$store.dispatch('user/deleteUser', data).then((res)=> {
                if(res.resultCode == 200) {
                // 请求成功
                this.$message({
                    type: 'success',
                    message: res.message
                })
                this.logout();
                console.log(res)
            }else {
                this.$message(res.message)
            }
            })
        },
        // 返回登录页
        logout() {
            this.$store.dispatch('user/logout').then(() => {
                    this.$router.push({
                        name: 'login'
                    })
                })
        },
        editPassword() {
            this.$router.push({
                name: 'personalEditPassword'
            })
        }
    }
}
</script>

<style lang="scss" scoped>
::v-deep .el-tabs {
    .el-tabs__header .el-tabs__nav {
        .el-tabs__active-bar {
            z-index: 0;
            width: 100%;
            background-color: #e1f0ff;
            border-right: 2px solid #409eff;
        }
        .el-tabs__item {
            text-align: left;
            padding-right: 100px;
        }
    }
    .el-tab-pane {
        padding: 0 20px 0 30px;
    }
}
h2 {
    margin: 0;
    margin-bottom: 30px;
    font-weight: normal;
}
.basic {
    ::v-deep .headimg-upload {
        > div {
            text-align: center;
        }
        .el-upload-dragger {
            border-radius: 50%;
        }
    }
}
.security {
    .setting-list {
        .item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #e8e8e8;
            .content {
                .title {
                    margin-bottom: 5px;
                    color: #666;
                }
                .desc {
                    font-size: 14px;
                    color: #999;
                }
            }
            &:last-child {
                border-bottom: 0;
            }
        }
    }
}
</style>
