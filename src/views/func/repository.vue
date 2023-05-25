<template>
    <AbsoluteContainer>
        <page-header title="仓库列表">
            <!-- <template #content>
                <p>AbsoluteContainer</p>
                <p style="margin-bottom: 0;">该组件是一个 absolute 固定容器，表格自适应需要自行实现，可参考演示源码，缩小浏览器窗口高度可查看最终效果</p>
            </template> -->
        </page-header>
        <page-main>
            <div class="type_box">
                <el-select clearable  v-model="typeValue" @change="selectType()"  placeholder="仓库类型筛选">
                    <el-option v-for="(item, i) in typeList" :key="i" :label="item.sttname" :value="item.sttid"></el-option>
                </el-select>
                <el-button v-auth="'func.addStorage'" style="margin-left: 20px;" size="mini" type="primary" @click="handleAdd()" >添加</el-button>
                
            <!-- 弹窗 -->
            </div>
            
            <el-table :data="storageList" border stripe highlight-current-row>
                <el-table-column type="index" label="id" width="50" />
                <el-table-column prop="stname" label="仓库姓名" width="80" />
                <el-table-column prop="storageType.sttname" label="仓库类型" width="150" />
                <el-table-column prop="sttotal" label="仓库容量" width="150"/>
                <el-table-column prop="vegetables" label="蔬菜"/>
                <el-table-column prop="stloc" label="仓库地址" />
                <el-table-column prop="func" label="操作">
                    <template slot-scope="scope">
                        <AuthAll :value="['func.updateStorage','func.deleteStorage']">
                            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                        </AuthAll>
                    </template>
                </el-table-column>
            </el-table>
            
            <Drawer ref="child" :title="title" @submitConfirm="sumRequest()" @clearForm="clearForm()">
                <template v-slot:form-content >
                    <el-form :model="form" v-if="node == 'add'">
                        <el-form-item label="仓库姓名" :label-width="formLabelWidth">
                            <el-input v-model="form.stname" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="仓库类型" :label-width="formLabelWidth">
                            <el-select v-model="form.sttype" placeholder="仓库类型选择">
                                <el-option v-for="(item, i) in typeList" :key="i" :label="item.sttname" :value="item.sttid"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="仓库容量" :label-width="formLabelWidth">
                            <el-input v-model="form.sttotal" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="仓库地址" :label-width="formLabelWidth">
                            <el-input v-model="form.stloc" type="textarea" :rows="2" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-form>
                    <el-form :model="form" v-if="node == 'edit'">
                        <el-form-item label="仓库id" :label-width="formLabelWidth">
                            <el-input v-model="form.stid" disabled autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="仓库姓名" :label-width="formLabelWidth">
                            <el-input v-model="form.stname" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-form>
                </template>
            </Drawer>
        </page-main>
    </AbsoluteContainer>
</template>

<script>
export default {
    name: 'repository',
    props: {},
    data() {
        return {
            stid: "",
            title: "",
            form: {},
            node: "",
            empty: {
                stid: "",
                stname: "",
                sttype: "",
                sttotal: "",
                stloc: "",
            },
            formLabelWidth: '80px',
            storageList: [],
            typeList: [],
            typeValue: ""
        }
    },
    created() {},

    beforeMount() {
        this.getType();
    },
    mounted() {
        this.$nextTick(() => {
            // 获取表头高度，然后设置 .el-table__body-wrapper 的 height
            let height = document.getElementsByClassName('el-table__header-wrapper')[0].offsetHeight
            document.getElementsByClassName('el-table__body-wrapper')[0].style.height = `calc(100% - ${height}px)`
        })
        this.getList({sttype: 0});
    },
    methods: {
        // 获取仓库列表
        getList(data) {
            this.$store.dispatch('repository/storageList',data).then((res) => {
                if(res.resultCode == 200) {
                    let list = res.data;
                    list.forEach((item, index)=> {
                        if(item.vegetables) {
                            item.vegetables = item.vegetables.map((node)=>node.vname).toString()
                        }
                })
                    this.storageList = list;
                }else {
                    this.$message(res.message)
                }
                console.log(res)
            })
        },
        // 获取仓库类型
        getType() {
            this.$store.dispatch('repository/searchType').then((res) => {
                if(res.resultCode == 200) {
                    let list = res.data;
                    this.typeList = list;
                }else {
                    this.$message(res.message)
                }
                console.log(res)
            })
        },
        // 筛选仓库类型
        selectType() {
            let val = this.typeValue;
            console.log(val)
            val == "" ? val == 0 : ''
            let data = {
                sttype: val
            }
            this.getList(data)
        },
        // 打开添加弹窗
        handleAdd() {
            this.form = {...this.empty};
            this.title = "添加仓库";
            this.node = "add";
            this.$refs.child.showDialog();
        },
        // 打开修改弹窗
        handleEdit(index, obj) {
            console.log(index, obj);
            this.form = {
                stid: obj.stid,
                stname: obj.stname,
            };
            this.title = "修改仓库";
            this.node = "edit";
            this.$refs.child.showDialog();
        },
        // 打开删除弹窗
        handleDelete(index, obj) {
            console.log(index, obj);
            let that = this;
            this.$confirm('此操作将永久删除该仓库, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
                // 删除请求api
                that.stid = obj.stid;
                that.node = "delete";
                that.$nextTick(()=> {
                    this.sumRequest();
                })
            }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消删除'
            });          
            });
        },
        // 添加 & 删除 & 修改请求
        sumRequest() {
            let val = this.node;
            let url = "";
            let data = "";
            switch(val) {
                case "add": 
                    url = "repository/addStorage";
                    data = this.form;
                    break;
                case "edit":
                    url = "repository/updateStorage";
                    data = this.form;
                    break;
                case "delete":
                    url = "repository/deleteStorage";
                    data = {stid: this.stid};
                    break;
                default: return false
            }
            this.$store.dispatch(url, data).then((res) => {
                if(res.resultCode == 200) {
                    // 请求成功
                    this.$message({
                        type: 'success',
                        message: res.message
                    })
                    setTimeout(()=> {
                        // 刷新列表数据
                        this.getList({sttype: 0});
                        // 关闭弹窗
                        this.$refs.child.showDialog();
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
.type_box {
    position: relative;
    width: 100%;
    height: 70px;
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
