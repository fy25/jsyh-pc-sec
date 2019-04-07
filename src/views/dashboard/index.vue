<template>
  <div>
    <div class="index-container clearfloat">
      <div class="index-header">
        <div class="index-header-logo">
          <img
            src="http://www.jsbchina.cn/data/tosend/resource/upload/20170113/f89b6579-9a50-4281-9a08-93d867dc452a.png"
            alt
          >
        </div>
        <div class="index-header-menu">
          <el-dropdown @command="handleCommand">
            <el-button type="primary">
              admin
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="a">个人中心</el-dropdown-item>
              <el-dropdown-item command="b">我的历史标记</el-dropdown-item>
              <el-dropdown-item command="c">设置</el-dropdown-item>
              <el-dropdown-item command="d">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="index-content">
        <baidu-map class="map" :center="center" :zoom="zoom" @ready="handler"></baidu-map>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.clearfloat:after {
  display: block;
  clear: both;
  content: "";
  visibility: hidden;
  height: 0;
}
.clearfloat {
  zoom: 1;
}
.index-container {
  width: 1200px;
  margin: 0 auto;
  .index-header {
    display: flex;
    justify-content: space-between;
    height: 56px;
    .index-header-logo {
      width: 300px;
      img {
        width: 180px;
        height: 40px;
        margin-top: 10px;
      }
    }
    .index-header-menu {
      width: 800px;
      background-color: #006ab8;
      text-align: right;
      .el-button {
        border-radius: 0;
        height: 56px;
        font-size: 16px;
      }
      .el-button--primary {
        background-color: #0086e9;
        border-color: #0086e9;
      }
    }
  }
  .index-content {
    .map {
      width: 100%;
      height: 600px;
    }
  }
}
</style>

<script>
export default {
  mounted() {},
  data() {
    return {
      center: { lng: 0, lat: 0 }, //经纬度
      zoom: 3 //地图展示级别
    };
  },
  methods: {
    handler({ BMap, map }) {
      console.log(BMap, map);
      this.center.lng = 117.204369;
      this.center.lat = 34.229422;
      this.zoom = 15;
    },

    handleCommand(command) {
      // this.$message('click on item ' + command);
      if (command == "d") {
        this.$confirm("退出前请及时保存您的数据", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.redirectTo("login");
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消退出"
            });
          });
      }
    },
    // 跳转
    redirectTo(name) {
      this.$router.replace({ path: name });
    }
  }
};
</script>


