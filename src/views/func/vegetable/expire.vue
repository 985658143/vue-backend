<template>
  <AbsoluteContainer>
      <page-header title="过期列表">
          <!-- <template #content>
              <p>AbsoluteContainer</p>
              <p style="margin-bottom: 0;">该组件是一个 absolute 固定容器，表格自适应需要自行实现，可参考演示源码，缩小浏览器窗口高度可查看最终效果</p>
          </template> -->
      </page-header>
      <page-main>
          <el-table :data="outList" border stripe highlight-current-row>
              <el-table-column type="index" label="id" width="50" />
              <el-table-column prop="vid" label="蔬菜编号" width="80"/>
              <el-table-column prop="vname" label="蔬菜姓名" width="100" />
              <el-table-column prop="vpurchasedate" label="保质期" width="100"/>
              <el-table-column prop="vprice" label="价格" width="100"/>
              <el-table-column prop="vtotal" label="总量" width="100"/>
              <el-table-column prop="storage" label="仓库" width="120"/>
              <el-table-column prop="supplier" label="供应商" width="120"/>
              <el-table-column prop="func" label="操作">
                  <template slot-scope="scope">
                      <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                  </template>
              </el-table-column>
          </el-table>
      </page-main>
  </AbsoluteContainer>
</template>

<script>
export default {
  name: 'vegetable',
  props: {},
  data() {
      return {
        vid: "",
        outList: []
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
      // 获取过期蔬菜列表
      getList() {
          this.$store.dispatch('vegetable/outList').then((res) => {
              if(res.resultCode == 200) {
                  let list = res.data;
                  list.forEach((item)=> {
                        item.vpurchasedate = item.vpurchasedate.slice(0, 10);
                        item.storage = item.storage.stname;
                        item.supplier = item.supplier.sname;
                    })
                  this.outList = list;
                  console.log(list)
              }else {
                  this.$message(res.message)
              }
          }).catch(() => {
          })
      },
      // 打开删除弹窗
      handleDelete(index, obj) {
            console.log(index, obj);
            let that = this;
            this.$confirm('此操作将永久删除该蔬菜, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
                // 删除请求api
                that.vid = obj.vid;
                that.$nextTick(()=> {
                    this.deleteVege();
                })
            }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消删除'
            });          
            });
        },
        deleteVege() {
            let data = {
                vid: this.vid
            }
            this.$store.dispatch("vegetable/deleteVege", data).then((res) => {
                if(res.resultCode == 200) {
                    // 请求成功
                    this.$message({
                        type: 'success',
                        message: res.message
                    })
                    setTimeout(()=> {
                        // 刷新列表数据
                        this.getList();
                    }, 1500)
                    console.log(res)
                }else {
                    this.$message(res.message)
                }
            })
        }
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
