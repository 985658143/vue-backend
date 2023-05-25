<template>
    <AbsoluteContainer>
        <page-header title="供应商列表">
            <!-- <template #content>
                <p>AbsoluteContainer</p>
                <p style="margin-bottom: 0;">该组件是一个 absolute 固定容器，表格自适应需要自行实现，可参考演示源码，缩小浏览器窗口高度可查看最终效果</p>
            </template> -->
        </page-header>
        <!-- 搜索栏 -->
        <page-main style="height: auto;">
            <el-form :model="search" size="small" label-width="120px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="搜索供应商">
                            <div class="search_wrap">
                                <el-input v-model="search.name" placeholder="请输入供应商名称，支持模糊查询" clearable />
                                <el-button type="primary" icon="el-icon-search" @click="searchClick()">搜索</el-button>
                                <el-button v-auth="'member.addSupplier'" type="primary" @click="handleAdd()">添加</el-button>
                            </div>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </page-main>
        
        <!-- 列表 -->
        <page-main>
            <el-table :data="supplierList" border stripe highlight-current-row>
                <el-table-column type="index" label="id" width="50" />
                <el-table-column prop="sid" label="sid" width="80" />
                <el-table-column prop="sname" label="姓名" width="80" />
                <el-table-column prop="stel" label="电话" width="150" />
                <el-table-column prop="vegetables" label="蔬菜">
                    <template slot-scope="scope">
                        <el-button v-for="(item, index) in scope.row.vegetables" :key="index" size="mini" @click="searchVege(item)">{{item}}</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="sloc" label="地址" />
                <el-table-column prop="func" label="操作">
                    <template slot-scope="scope">
                        <AuthAll :value="['member.updateSupplier', 'member.deleteSupplier']">
                            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                        </AuthAll>
                        </template>
                </el-table-column>
            </el-table>
            
            <!-- 弹窗 -->
            <Drawer ref="child" :title="title" @submitConfirm="sumRequest()" @clearForm="clearForm()">
                <template v-slot:form-content >
                    <el-form :model="form">
                        <el-form-item label="用户名" :label-width="formLabelWidth">
                            <el-input v-model="form.sname" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="电话" :label-width="formLabelWidth">
                            <el-input v-model="form.stel" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="地址" :label-width="formLabelWidth">
                            <el-input v-model="form.sloc" type="textarea" :rows="2" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-form>
                </template>
            </Drawer>
        </page-main>
    </AbsoluteContainer>
</template>

<script>
import { deflate } from 'zlib'

export default {
    name: 'supplier',
    props: {},
    data() {
        return {
            search: {
                name: '',
            },
            sid: "",
            title: "",
            form: {},
            node: "",
            empty: {
                sname: "",
                stel: "",
                sloc: "",
            },
            formLabelWidth: '80px',
            supplierList: []
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
        // 获取供应商列表
        getList() {
            this.$store.dispatch('user/supplierList').then((res) => {
                if(res.resultCode == 200) {
                    let list = res.data;
                    list.forEach((item, index)=> [
                        item.vegetables = item.vegetables.map((node)=>node.vname)
                    ])
                    this.supplierList = list;
                    console.log(list)
                }else {
                    this.$message(res.message)
                }
                
            })
        },
        // 模糊查询
        searchClick() {
            let data = {
                vague: this.search.name
            }
            this.$store.dispatch('user/searchSupplier', data).then((res) => {
                if(res.resultCode == 200) {
                    console.log(res.data)
                    let list = res.data;
                    this.supplierList = list;
                }else {
                    this.$message(res.message)
                }
                
            })
        },
        // 蔬菜跳转
        searchVege(val) {
            let name = val;
            this.$router.push({ path: '/func/vegetable/vegetable?vname=' + name })
        },
        // 打开添加弹窗
        handleAdd() {
            this.form = {...this.empty};
            this.title = "添加供应商";
            this.node = "add";
            this.$refs.child.showDialog();
        },
        // 打开修改弹窗
        handleEdit(index, obj) {
            this.form = {
                sid: obj.sid,
                sname: obj.sname,
                stel: obj.stel,
                sloc: obj.sloc,
            };
            this.title = "修改供应商";
            this.node = "edit";
            this.$refs.child.showDialog();
        },
        // 打开删除弹窗
        handleDelete(index, obj) {
            let that = this;
            this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
                // 删除请求api
                that.sid = obj.sid;
                that.node = "delete";
                that.$nextTick(()=> {
                    console.log(that.sid)
                    this.sumRequest();
                })
            }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消删除'
            });          
            });
        },
        // 请求
        sumRequest() {
            let val = this.node;
            let url = "";
            let data = "";
            switch(val) {
                case "add": 
                    url = "user/addSupplier";
                    data = this.form;
                    break;
                case "edit":
                    url = "user/updateSupplier";
                    data = this.form;
                    break;
                case "delete":
                    url = "user/deleteSupplier";
                    data = {sid: this.sid};
                    break;
                default: return false
            }
            this.$store.dispatch(url, data).then((res) => {
                console.log(res)
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
                        val !== 'delete' && this.$refs.child.showDialog();
                    }, 1500)
                    console.log(res)
                }else {
                    this.$message(res.message)
                }
            })
        },
        // 清空添加表单
        clearForm() {
            // let list = this.empty;
            // list.forEach((item) => item = "")
            this.form = {};
        }
        
    }
}
</script>

<style lang="scss" scoped>

.search_wrap {
    display: flex;
    width: 100%;
    height: 100%;
}
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
