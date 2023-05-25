<template>
    <AbsoluteContainer>
        <page-header title="用户列表">
            <!-- <template #content>
                <p>AbsoluteContainer</p>
                <p style="margin-bottom: 0;">该组件是一个 absolute 固定容器，表格自适应需要自行实现，可参考演示源码，缩小浏览器窗口高度可查看最终效果</p>
            </template> -->
        </page-header>
        <page-main>
            <el-table :data="userList" border stripe highlight-current-row>
                <el-table-column type="index" label="id" width="50" />
                <el-table-column prop="uname" label="姓名" width="80" />
                <el-table-column prop="upwd" label="密码" width="150" />
                <el-table-column prop="utel" label="电话" width="150" />
                <el-table-column prop="uloc" label="地址" />
                <el-table-column prop="func" label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <Drawer ref="child" :title="title" @submitConfirm="sumRequest(0)">
                <template v-slot:form-content >
                    <el-form :model="form">
                        <el-form-item label="uid" :label-width="formLabelWidth">
                            <el-input disabled v-model="form.uid" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="用户名" :label-width="formLabelWidth">
                            <el-input v-model="form.uname" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="密码" :label-width="formLabelWidth">
                            <el-input v-model="form.upwd" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="电话" :label-width="formLabelWidth">
                            <el-input v-model="form.utel" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="地址" :label-width="formLabelWidth">
                            <el-input v-model="form.uloc" type="textarea" :rows="2" autocomplete="off"></el-input>
                        </el-form-item>
                        
                        <!-- <el-form-item label="活动区域" :label-width="formLabelWidth">
                            <el-select v-model="form.region" placeholder="请选择活动区域">
                            <el-option label="区域一" value="shanghai"></el-option>
                            <el-option label="区域二" value="beijing"></el-option>
                            </el-select>
                        </el-form-item> -->
                    </el-form>
                </template>
            </Drawer>
        </page-main>
    </AbsoluteContainer>
</template>

<script>
export default {
    name: 'member',
    props: {},
    data() {
        return {
            title: "修改用户",
            form: {},
            uid: 0,
            formLabelWidth: '80px',
            userList: []
        }
    },
    created() {},
    mounted() {
        this.$nextTick(() => {
            // 获取表头高度，然后设置 .el-table__body-wrapper 的 height
            let height = document.getElementsByClassName('el-table__header-wrapper')[0].offsetHeight
            document.getElementsByClassName('el-table__body-wrapper')[0].style.height = `calc(100% - ${height}px)`
        })
        this.getList();
    },
    methods: {
      // 获取用户列表
      getList() {
        this.$store.dispatch('user/userList').then((res) => {
            if(res.resultCode == 200) {
                let list = res.data;
                this.userList = list;
                console.log(list)
            }else {
                this.$message(res.message)
            }
        })
      },
      // 修改用户弹窗打开
      handleEdit(index, obj) {
        console.log(index, obj);
        this.form = {...obj};
        this.$refs.child.showDialog();
      },
      // 删除用户
      handleDelete(index, obj) {
        console.log(index, obj);
        let that = this;
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            // 删除请求api
            that.uid = obj.uid;
            that.$nextTick(()=> {
                console.log(that.uid)
                this.sumRequest(1);
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
      // 请求
      sumRequest(val) {
        let url = "";
        let data = "";
        val == 0 ? url = "user/updateUser" : url = "user/deleteUser";
        val == 0 ? data = this.form : data = {uid: this.uid};
        this.$store.dispatch(url, data).then((res) => {
            if(res.resultCode == 200) {
                // 请求成功
                this.$message({
                    type: 'success',
                    message: res.message
                })
                setTimeout(()=> {
                    // 刷新列表数据
                    this.getList();
                    // 关闭弹窗
                    this.$refs.child.showDialog();
                }, 1500)
                console.log(res)
            }else {
                this.$message(res.message)
            }
        })
      },
    }
}
</script>

<style lang="scss" scoped>
.page-main {
    display: flex;
    flex-direction: column;

    // 减去的 40px 为 page-main 的上下 margin
    // 减去的 130px 为 page-header 的高度，如果没有设置，可以去掉

    height: calc(100% - 40px - 130px);
    ::v-deep .el-table {
        height: 100%;
        .el-table__body-wrapper {
            overflow-y: auto;
        }
    }
}
</style>
