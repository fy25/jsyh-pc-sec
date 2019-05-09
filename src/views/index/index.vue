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
              <i class="el-icon-arrow-down el-icon--right"/>
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
        <div id="container" class="map"/>
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
          <el-input v-model="Sign_Name" placeholder="请输入标题"/>
        </div>
        <div class="input-item">
          <el-input
            v-model="Remark"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入内容"
          />
        </div>
        <div class="input-item">
          <el-select v-model="BUG_ID" placeholder="请选择分行">
            <el-option
              v-for="item in branchlist"
              :key="item.USERGROUP_ID"
              :label="item.USERGROUP_NAME"
              :value="item.USERGROUP_ID"
            ></el-option>
          </el-select>
        </div>
        <div class="input-item">
          <el-select v-model="State" placeholder="请选择分行">
            <el-option
              v-for="item in statelist"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="btn-group">
          <button @click="submitTap">添加</button>
        </div>
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
  cursor: pointer;
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
</style>

<script>
import * as publicApi from "../../api/public";
import { Config } from "../../utils/config";
export default {
  components: {},
  data() {
    return {
      Config,
      url:
        "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
      dialogFormVisible: false,
      Remark: null,
      Sign_Name: null,
      State: "",
      statelist: [
        {
          value: "0",
          label: "未开发"
        },
        {
          value: "1",
          label: "正在开发"
        },
        {
          value: "2",
          label: "已开发"
        }
      ],
      branchlist: [],
      BUG_ID: "",
      pageIndex: 1,
      pageSize: 10,
      is_all: 1,
      _key: "",
      Province: "",
      City: "",
      Img: ""
    };
  },
  mounted() {
    let userInfo = localStorage.getItem("userinfo");
    if (!userInfo) {
      this.$router.replace({ path: "/" });
    } else {
      userInfo = JSON.parse(userInfo);
      this.userInfo = userInfo;
      this.getBranch();
      this.getPoint();
    }
  },
  methods: {
    //位置信息在地图上展示
    setMap(pointList) {
      var center = new qq.maps.LatLng(34.26056, 117.18864);
      var map = new qq.maps.Map(document.getElementById("container"), {
        center: center,
        zoom: 13
      });
      //添加到提示窗
      var info = new qq.maps.InfoWindow({
        map: map
      });

      if (pointList) {
        for (let i = 0; i < pointList.length; i++) {
          let marker = new qq.maps.Marker({
            position: new qq.maps.LatLng(
              pointList[i].LATITUDE,
              pointList[i].LONGITUDE
            ),
            map: map
          });
          marker.SIGN_NAME = pointList[i].SIGN_NAME;

          qq.maps.event.addListener(marker, "click", function() {
            info.open();
            info.setContent(
              `<div style="text-align:center;white-space:nowrap;
                margin:10px;font-size:14px;color:#333;font-family:Microsoft Yahei;">${
                  this.SIGN_NAME
                }</div><button "goWhere('/point')" style="font-size:12px;border:1px solid #006ab8;background:#006ab8;color:#fff;padding:5px 10px;border-radius:5px;margin:0 auto;display:block;cursor: pointer;outline:none;">查看详情</button>`
            );
            info.setPosition(
              new qq.maps.LatLng(pointList[i].LATITUDE, pointList[i].LONGITUDE)
            );
          });
        }
      }

      // qq.maps.event.addListener(map, "click", event => {
      //   console.log(event);
      //   const center = new qq.maps.LatLng(event.latLng.lat, event.latLng.lng);
      //   this.lat = event.latLng.lat;
      //   this.lng = event.latLng.lng;
      //   var marker = new qq.maps.Marker({
      //     position: center,
      //     map: map
      //   });
      // });
    },

    goWhere(path) {
      // this.$router.push({ path: path });
      alert("123")
    },

    async logout() {
      localStorage.removeItem("userinfo");
      this.redirectTo("/");
    },

    // 开启弹窗
    openDialog() {
      this.dialogFormVisible = true;
      console.log(this.lng);
    },

    // 提交新增标记
    submitTap() {
      const data = {
        action: "add_sign_index",
        _key: this._key,
        Sign_Name: this.Sign_Name,
        Remark: this.Remark,
        Longitude: this.lng,
        Latitude: this.lat,
        State: this.State,
        user_id: this.userInfo.USER_ID,
        BUG_ID: this.BUG_ID,
        Province: this.Province,
        City: this.City,
        District: "鼓楼区",
        Street: "和风雅致",
        Img: this.Img
      };
      console.log(data, "[[[[[");
      publicApi
        .publicApi("/ajax/Com_PCInfo.ashx", data)
        .then(res => {
          console.log(res, "llll");
        })
        .catch(err => {
          this.$message({
            message: "服务器出现错误",
            type: "warning"
          });
        });
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
            this.logout();
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
    redirectTo(path) {
      this.$router.replace({ path: path });
    },

    // 获取分行信息
    getBranch() {
      let data = {
        action: "get_user_group_index"
      };
      publicApi.publicApi(`/ajax/Com_PCInfo.ashx`, data).then(res => {
        console.log(res, "88888");
        this.branchlist = res.data;
      });
    },

    // 获取所有标记
    getPoint() {
      let data = {
        action: "get_sign_index",
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        is_all: this.is_all,
        user_id: this.userInfo.USER_ID
      };
      publicApi.publicApi(`/ajax/Com_PCInfo.ashx`, data).then(res => {
        console.log(res, "所有标记");
        this.pointList = res.data;
        this.setMap(res.data);
      });
    }
  }
};
</script>

