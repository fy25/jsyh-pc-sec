<template>
  <div>
    <div class="index-container clearfloat">
      <div class="index-header">
        <div class="index-header-logo">
          <!-- <img
            src="http://www.jsbchina.cn/data/tosend/resource/upload/20170113/f89b6579-9a50-4281-9a08-93d867dc452a.png"
            alt
          >-->
        </div>
        <div class="index-header-menu">
          <el-dropdown @command="handleCommand">
            <el-button type="primary">
              admin
              <i class="el-icon-arrow-down el-icon--right" />
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
        <div id="container" class="map" />
        <div class="index-info">
          <el-row :gutter="20">
            <el-col :span="12">
              <div class="grid-content bg-purple">
                <div class="tit">
                  <strong>历史标记展示栏</strong>
                  <span>更多>></span>
                </div>
                <div class="img-wrapper">
                  <img
                    style="width: 100px; height: 100px"
                    src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
                  >
                </div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="btn-group">
                <button @click="openDialog">添加标记</button>
                <button>查看历史标记</button>
                <button>查看活动</button>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <el-dialog title="添加活动" :visible.sync="dialogFormVisible" center>
      <div class="activity">
        <div class="input-item">
          <el-input v-model="Sign_Name" placeholder="请输入标题" />
        </div>
        <div class="input-item">
          <el-input
            v-model="Remark"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入内容"
          />
        </div>
        <div class="img-list" />
      </div>
    </el-dialog>
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
.index-info {
  margin-top: 20px;
  .tit {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    strong {
      font-size: 16px;
    }
    span {
      font-size: 12px;
    }
  }
  .img-wrapper {
    margin: 10px 0;
    img {
      width: 100px;
      height: 100px;
      padding: 5px;
      box-sizing: border-box;
    }
  }
  .btn-group {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    button {
      border-radius: 5px;
      font-size: 14px;
      color: #fff;
      width: 350px;
      outline: none;
      border: 1px solid #ccc;
      height: 50px;
      margin: 10px 0;
      background-color: #fff;
      color: #666;
      cursor: pointer;
    }
    button:first-child {
      background-color: #006ab8;
      color: #fff;
    }
  }
}
.activity {
  .input-item {
    margin: 30px 0;
  }
}
</style>

<script>
import * as publicApi from '../../api/public'
export default {
  components: {},
  data() {
    return {
      url:
        'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
      dialogFormVisible: false,
      Remark: null,
      Sign_Name: null
    }
  },
  mounted() {
    console.log(localStorage.getItem('userinfo'))
    const userInfo = localStorage.getItem('userinfo')
    if (!userInfo) {
      this.$router.replace({ path: '/' })
    } else {
      this.init()
    }
  },
  methods: {
    init() {
      // 步骤：定义map变量 调用 qq.maps.Map() 构造函数   获取地图显示容器
      // 设置地图中心点
      var myLatlng = new qq.maps.LatLng(39.916527, 116.397128)
      // 定义工厂模式函数
      var myOptions = {
        zoom: 8, // 设置地图缩放级别
        center: myLatlng, // 设置中心点样式
        mapTypeId: qq.maps.MapTypeId.ROADMAP // 设置地图样式详情参见MapType
      }
      // 获取dom元素添加地图信息
      var map = new qq.maps.Map(
        document.getElementById('container'),
        myOptions
      )

      qq.maps.event.addListener(map, 'click', event => {
        console.log(event)
        const center = new qq.maps.LatLng(event.latLng.lat, event.latLng.lng)
        this.lat = event.latLng.lat
        this.lng = event.latLng.lng
        var marker = new qq.maps.Marker({
          position: center,
          map: map
        })
      })
    },
    async logout() {
      localStorage.removeItem('userinfo')
      this.redirectTo('/')
    },

    // 开启弹窗
    openDialog() {
      this.dialogFormVisible = true
      console.log(this.lng)
    },

    // 提交新增标记
    submitTap() {
      const data = {
        action: 'add_sign_index',
        Sign_Name: this.Sign_Name,
        Remark: this.Remark,
        Longitude: this.Longitude
      }
      return publicApi.publicApi('/ajax/Com_PCInfo.ashx', data).then(res => {})
    },

    handleCommand(command) {
      // this.$message('click on item ' + command);
      if (command == 'd') {
        this.$confirm('退出前请及时保存您的数据', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.logout()
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消退出'
            })
          })
      }
    },
    // 跳转
    redirectTo(path) {
      this.$router.replace({ path: path })
    }
  }
}
</script>

