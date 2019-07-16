<template>
  <div>
    <div class="index-container clearfloat">
      <div class="index-header">
        <div class="index-header-logo">
          <img
            src="http://www.jsbchina.cn/data/tosend/resource/upload/20170113/f89b6579-9a50-4281-9a08-93d867dc452a.png"
            alt
          />
        </div>
        <div class="index-header-menu">
          <div class="search-input" @click="goWhere('/search')">{{poiname}}</div>
          <el-button @click.native="filter=true">筛选</el-button>
          <el-dropdown @command="handleCommand">
            <el-button type="primary">
              {{USER_NAME}}
              <i class="el-icon-arrow-down el-icon--right" />
            </el-button>
            <el-dropdown-menu slot="dropdown">
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
                  <!-- <span>更多>></span> -->
                </div>
                <div class="history-point">
                  <div class="point-item" v-for="(item,index) in historyList" :key="index">
                    <h4>标记名称: {{item.SIGN_NAME}}</h4>
                    <h4>支行名称: {{item.BUG_NAME}}</h4>
                    <p>
                      <span>社区/企事业单位名称: {{item.CENAME}}</span>
                      <span>{{item.CREATEDATE}}</span>
                    </p>
                  </div>
                </div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="btn-group">
                <button @click="openDialog">添加标记</button>
                <button @click="getPoint" v-if="!showPoint">查看历史标记</button>
                <button @click="deleteText" v-else>关闭历史标记</button>
                <!-- <button>查看活动</button> -->
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <el-dialog title="添加标记" :visible.sync="dialogFormVisible" center>
      <div class="activity">
        <!-- <div class="input-item">
          <el-select v-model="IsPublic" placeholder="请选择类型">
            <el-option
              v-for="item in publiclist"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>-->
        <div class="input-item">
          <el-input v-model="Sign_Name" placeholder="请输入标题" />
        </div>
        <div class="input-item">
          <el-input v-model="CEName" placeholder="请输入企事业单位名称" />
        </div>
        <div class="input-item" v-if="IsPublic=='1'">
          <el-input v-model="Expand" placeholder="请输入拓展人数" />
        </div>
        <div class="input-item" v-if="IsPublic  =='1'">
          <el-input v-model="EndExpand" placeholder="请输入已拓展人数" />
        </div>
        <div class="btn-group">
          <button @click="submitTap">添加</button>
        </div>
      </div>
    </el-dialog>

    <el-dialog title="请选择标记类型" :visible.sync="categoryVisible" center>
      <el-select v-model="IsPublic" placeholder="请选择标记类型">
        <el-option v-for="item in typeList" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <div slot="footer" class="dialog-footer">
        <el-button @click="categoryVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible=true">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 筛选 -->
    <el-dialog title="筛选条件" :visible.sync="filter">
      <div class="filter-item">
        <el-select v-model="ispublic" placeholder="请选择活动区域">
          <el-option v-for="item in filterList" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </div>
      <div class="filter-item">
        <el-input v-model="name" placeholder="请输入标记名称"></el-input>
      </div>
      <div class="filter-item">
        <el-date-picker
          v-model="time"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions0"
        ></el-date-picker>
      </div>
      <div class="filter-item">
        <el-checkbox
          :indeterminate="isIndeterminate"
          v-model="checkAll"
          @change="handleCheckAllChange"
        >全选</el-checkbox>
        <el-checkbox-group v-model="checkList">
          <el-checkbox v-for="(item,index) in branchlist" :key="index" :label="item.USERGROUP_NAME"></el-checkbox>
        </el-checkbox-group>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="filter = false">取 消</el-button>
        <el-button type="primary" @click="filterTap">确 定</el-button>
        <el-button type="warning" @click="clearFilterTap">还原筛选</el-button>
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
      position: relative;
      .search-input {
        cursor: text;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background-color: #fff;
        left: 3%;
        width: 200px;
        text-align: left;
        height: 36px;
        line-height: 36px;
        padding: 0 10px;
        border-radius: 5px;
      }
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
    margin-bottom: 10px;
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
    .img-list {
      margin: 10px;
      img {
        width: 80px;
        height: 80px;
        margin: 0 10px;
      }
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
.point-item {
  padding: 2px 10px;
  box-sizing: border-box;
  border-radius: 6px;
}
.point-item:nth-child(odd) {
  background-color: #eeeeee;
}
.point-item:nth-child(even) {
  background-color: #fff;
}
.point-item p {
  font-size: 16px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}
.point-item p span:first-child {
  width: 80%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.point-item p span:last-child {
  width: 20%;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 14px;
  color: #999;
}
.filter-item {
  margin-bottom: 10px;
}
</style>

<script>
import * as publicApi from "../../api/public";
import { Config } from "../../utils/config";
export default {
  components: {},
  data() {
    return {
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6;
        }
      },
      addressList: [],
      address: [],
      loading: false,
      Config,
      showPoint: false,
      url:
        "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
      dialogFormVisible: false,
      Remark: null,
      Sign_Name: null,
      State: "",
      markerList: [],
      textmarkerList: [],
      addMarkerList: [],
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
      publiclist: [
        {
          value: "0",
          label: "对公"
        },
        {
          value: "1",
          label: "零售"
        }
      ],
      branchlist: [],
      BUG_ID: "",
      IsPublic: null,
      pageIndex: 1,
      pageSize: 100,
      is_all: 1,
      _key: "",
      Province: "",
      City: "",
      Img: "",
      lat: null,
      lng: null,
      USER_NAME: "",
      imgList: [],
      poiname: "输入查询地点",
      uploadImg: [],
      historyList: [],
      categoryVisible: false, //选择分类,
      bug_id: "",
      begin_date: "",
      end_date: "",
      ispublic: "",
      name: "",
      CEName: "",
      Expand: "",
      EndExpand: "",
      filter: false, //筛选
      time: "",
      checkList: [],
      isIndeterminate: true,
      checkAll: false,
      pointList: [],
      nameList: [],
      typeList: [],
      filterList: []
    };
  },
  mounted() {
    let userInfo = localStorage.getItem("userinfo");
    let { typeList, filterList } = this;
    if (!userInfo) {
      this.$router.replace({ path: "/" });
    } else {
      if (localStorage.getItem("lat")) {
        this.lat = localStorage.getItem("lat");
        this.lng = localStorage.getItem("lng");
        this.poiname = localStorage.getItem("poiname");
      }
      userInfo = JSON.parse(userInfo);
      this.userInfo = userInfo;
      this.USER_NAME = userInfo.USER_NAME;
      this.ispublic = userInfo.ISPUBLIC;
      if (userInfo.ISPUBLIC == "") {
        this.is_all = "1";
        typeList = [
          {
            label: "公司业务部",
            value: "0"
          },
          {
            label: "零售业务部",
            value: "1"
          }
        ];
        filterList = [
          {
            label: "公司业务部",
            value: "0"
          },
          {
            label: "零售业务部",
            value: "1"
          },
          {
            label: "公司业务部和零售业务部",
            value: " "
          }
        ];
      } else if (userInfo.ISPUBLIC == "0") {
        this.is_all = "0";
        typeList = [
          {
            label: "公司业务部",
            value: "0"
          }
        ];
        filterList = [
          {
            label: "公司业务部",
            value: "0"
          }
        ];
      } else {
        this.is_all = "0";
        typeList = [
          {
            label: "零售业务部",
            value: "1"
          }
        ];
        filterList = [
          {
            label: "零售业务部",
            value: "1"
          }
        ];
      }
      this.typeList = typeList;
      this.filterList = filterList;
      this.getBranch();
      this.init();
      this.getPoint();
      this.getName();
    }
  },
  destroyed() {
    localStorage.removeItem("lat");
    localStorage.removeItem("lng");
    localStorage.removeItem("poiname");
  },
  methods: {
    // 地图初始化
    init() {
      const that = this;
      let { addMarkerList, markerList, textmarkerList } = this;
      if (this.lat != null) {
        var center = new qq.maps.LatLng(this.lat, this.lng);
      } else {
        var center = new qq.maps.LatLng(34.26056, 117.18864);
      }
      var map = new qq.maps.Map(document.getElementById("container"), {
        center: center,
        zoom: 13
      });
      this.map = map;
      if (this.lat != null) {
        let anchor = new qq.maps.Point(25, 25),
          size = new qq.maps.Size(42, 68),
          origin = new qq.maps.Point(0, 0),
          icon = new qq.maps.MarkerImage(
            "/static/images/location.png",
            size,
            origin,
            anchor
          );
        let storagePoint = new qq.maps.LatLng(this.lat, this.lng);
        var storagemarker = new qq.maps.Marker({
          position: storagePoint,
          map: map
        });
        addMarkerList.push(storagemarker);
        storagemarker.setIcon(icon);
      }
      qq.maps.event.addListener(map, "click", function(event) {
        that.showPoint = false;
        var anchor = new qq.maps.Point(25, 25),
          size = new qq.maps.Size(42, 68),
          origin = new qq.maps.Point(0, 0),
          icon = new qq.maps.MarkerImage(
            "/static/images/location.png",
            size,
            origin,
            anchor
          );
        if (addMarkerList.length != 0) {
          for (let i = 0; i < addMarkerList.length; i++) {
            addMarkerList[i].setMap(null);
          }
          this.addMarkerList = [];
        }
        let position = new qq.maps.LatLng(
          event.latLng.getLat(),
          event.latLng.getLng()
        );
        that.lat = event.latLng.getLat();
        that.lng = event.latLng.getLng();
        let addMarker = new qq.maps.Marker({
          position: position,
          map: map
        });
        addMarker.setIcon(icon);
        addMarkerList.push(addMarker);
        that.addMarkerList = addMarkerList;
      });
    },

    // 全选
    handleCheckAllChange(val) {
      console.log(val);
      let temp = [];
      this.branchlist.forEach(item => {
        temp.push(item.USERGROUP_NAME);
      });
      this.checkList = val ? temp : [];
      this.isIndeterminate = false;
    },

    goWhere(path) {
      this.$router.push({ path: path });
    },

    async logout() {
      localStorage.removeItem("userinfo");
      this.redirectTo("/");
    },

    // 开启弹窗
    openDialog() {
      let { lng, lat } = this;
      if (lng == null || lat == null) {
        this.$message({
          message: "请在地图上点选您要添加的标记点",
          type: "warning"
        });
      } else {
        this.categoryVisible = true;
        let geocoder = new qq.maps.Geocoder();
        var latLng = new qq.maps.LatLng(this.lat, this.lng);
        //对指定经纬度进行解析
        geocoder.getAddress(latLng);
        geocoder.setComplete(result => {
          this.Province = result.detail.addressComponents.province;
          this.City = result.detail.addressComponents.city;
          this.District = result.detail.addressComponents.district;
          this.Street = result.detail.addressComponents.street;
        });
      }
    },

    // 提交新增标记
    submitTap() {
      let data = {
        action: "add_sign_index",
        _key: this._key,
        Sign_Name: this.Sign_Name,
        Remark: encodeURI(this.Remark),
        Longitude: this.lng,
        Latitude: this.lat,
        State: this.State,
        user_id: this.userInfo.USER_ID,
        BUG_ID: this.userInfo.USERGROUP_ID,
        Province: this.Province,
        City: this.City,
        District: this.District,
        Street: this.Street,
        Img: "",
        IsPublic: this.IsPublic,
        CEName: this.CEName
      };
      if (this.IsPublic == 1) {
        data.Expand = this.Expand;
        data.EndExpand = this.EndExpand;
        if (this.Sign_Name == null) {
          this.$message({
            message: "请填写标记名称",
            type: "warning"
          });
        } else if (this.CEName == "") {
          this.$message({
            message: "请输入企事业单位名称",
            type: "warning"
          });
        } else if (this.Expand == "") {
          this.$message({
            message: "请输入拓展人数",
            type: "warning"
          });
        } else if (this.EndExpand == "") {
          this.$message({
            message: "请输入已拓展人数",
            type: "warning"
          });
        } else if (Number(this.Expand) < Number(this.EndExpand)) {
          this.$message({
            message: "已拓展人数需小于等于拓展人数",
            type: "warning"
          });
        } else {
          publicApi
            .publicApi("/ajax/Com_PCInfo.ashx", data)
            .then(res => {
              console.log(res, "llll");
              if (res.code == "success") {
                this.$message({
                  type: "success",
                  message: "添加成功!"
                });
                this.getPoint();
                this.dialogFormVisible = false;
                this.categoryVisible = false;
              }
            })
            .catch(err => {
              this.$message({
                message: "服务器出现错误",
                type: "warning"
              });
            });
        }
      } else {
        if (this.Sign_Name == null) {
          this.$message({
            message: "请填写标记名称",
            type: "warning"
          });
        } else if (this.CEName == "") {
          this.$message({
            message: "请输入企事业单位名称",
            type: "warning"
          });
        } else {
          publicApi
            .publicApi("/ajax/Com_PCInfo.ashx", data)
            .then(res => {
              console.log(res, "llll");
              if (res.code == "success") {
                this.$message({
                  type: "success",
                  message: "添加成功!"
                });
                this.getPoint();
                this.dialogFormVisible = false;
                this.categoryVisible = false;
              }
            })
            .catch(err => {
              this.$message({
                message: "服务器出现错误",
                type: "warning"
              });
            });
        }
      }
    },

    handleCommand(command) {
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
      } else if (command == "b") {
        if (this.markerList.length == 0) {
          this.getPoint();
        }
      }
    },
    // 跳转
    redirectTo(path) {
      this.$router.replace({ path: path });
    },

    // 获取分行信息
    getBranch() {
      let data = {
        action: "get_user_group_index",
        user_id: this.userInfo.USER_ID,
        bug_id: this.userInfo.USERGROUP_ID
      };
      publicApi.publicApi(`/ajax/Com_PCInfo.ashx`, data).then(res => {
        this.branchlist = res.data;
      });
    },

    // 获取所有标记
    getPoint() {
      this.showPoint = true;
      let { map, bug_id, begin_date, end_date, ispublic, name } = this;
      let markerList = [];
      let that = this;
      let data = {
        action: "get_sign_index",
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        is_all: this.is_all,
        user_id: this.userInfo.USER_ID,
        bug_id,
        begin_date,
        end_date,
        ispublic,
        name
      };

      publicApi
        .publicApi(`/ajax/Com_PCInfo.ashx`, data)
        .then(res => {
          console.log(res, "所有标记");
          if (res.code == "error") {
            this.deleteOverlays();
            this.$message({
              message: res.message,
              type: "warning"
            });
          } else {
            res.data.forEach(item => {
              item.REMARK = decodeURI(item.REMARK);
            });
            this.pointList = res.data;
            let pointList = res.data;
            if (pointList.length >= 5) {
              this.historyList = pointList.slice(0, 4);
            } else {
              this.historyList = pointList;
            }

            var info = new qq.maps.InfoWindow({
              map: map
            });

            if (pointList) {
              for (let i = 0; i < pointList.length; i++) {
                let position = new qq.maps.LatLng(
                  pointList[i].LATITUDE,
                  pointList[i].LONGITUDE
                );
                let marker = new qq.maps.Marker({
                  position: position,
                  map: map
                });
                let style = {
                  color: "#006ab8",
                  fontSize: "14px",
                  fontWeight: "bold",
                  background: "#fff",
                  padding: "5px 10px",
                  borderRadius: "5px"
                };
                let textmarker = new qq.maps.Label({
                  position: position,
                  map: map,
                  content: pointList[i].SIGN_NAME,
                  style: style
                });
                this.markerList.push(marker);
                this.textmarkerList.push(textmarker);
                marker.SIGN_NAME = pointList[i].SIGN_NAME;
                marker.SIGN_ID = pointList[i].SIGN_ID;

                var anchor = new qq.maps.Point(0, 39),
                  size = new qq.maps.Size(64, 64),
                  origin = new qq.maps.Point(0, 0);
                let iconPer = new qq.maps.MarkerImage(
                  "/static/images/location-per.png",
                  size,
                  origin,
                  anchor
                );
                let iconPub = new qq.maps.MarkerImage(
                  "/static/images/location-pub.png",
                  size,
                  origin,
                  anchor
                );

                if (pointList[i].ISPUBLIC == "0") {
                  marker.setIcon(iconPub);
                } else {
                  marker.setIcon(iconPer);
                }

                qq.maps.event.addListener(marker, "click", function() {
                  that.goWhere(`/point?_key=${this.SIGN_ID}`);
                });
              }
            }
          }
        })
        .catch(err => {
          this.$message({
            message: err.message,
            type: "warning"
          });
        });
    },
    // 获取所有标记名
    getName() {
      this.showPoint = true;
      let {
        map,
        // markerList,
        bug_id,
        begin_date,
        end_date,
        ispublic,
        name
      } = this;
      let markerList = [];
      let that = this;
      let data = {
        action: "get_sign_index",
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        is_all: this.is_all,
        user_id: this.userInfo.USER_ID,
        bug_id,
        begin_date,
        end_date,
        ispublic,
        name
      };

      publicApi.publicApi(`/ajax/Com_PCInfo.ashx`, data).then(res => {
        console.log(res, "所有标记");
        if (res.code == "error") {
          this.deleteOverlays();
        } else {
          let list = res.data;
          list.unshift({
            SIGN_NAME: "不筛选标记名"
          });
          this.nameList = res.data;
        }
      });
    },

    // 隐藏标记
    deleteOverlays() {
      this.showPoint = false;
      let { markerList, textmarkerList } = this;
      if (markerList.length != 0) {
        for (let i = 0; i < markerList.length; i++) {
          markerList[i].setMap(null);
          textmarkerList[i].setMap(null);
        }
        this.markerList = [];
        this.textmarkerList = [];
      }
    },

    deleteText() {
      this.showPoint = false;
      let { markerList, textmarkerList } = this;
      if (markerList.length != 0) {
        for (let i = 0; i < markerList.length; i++) {
          textmarkerList[i].setMap(null);
        }
        this.textmarkerList = [];
      }
    },

    // 选择图片
    changeImage(e) {
      console.log(e);
      let { uploadImg } = this;
      let file = e.target.files[0];
      if (file) {
        this.file = file;
        console.log(this.file);
        let reader = new FileReader();
        let that = this;
        reader.readAsDataURL(file);
        reader.onload = function(e) {
          // 这里的this 指向reader
          console.log(e);
          that.Img = this.result;
          uploadImg.push(this.result);
          that.uploadImg = uploadImg;
        };
      }
    },

    crtTimeFtt(val, row) {
      if (val != null) {
        var date = new Date(val);
        return (
          date.getFullYear() +
          "-" +
          (date.getMonth() + 1) +
          "-" +
          date.getDate()
        );
      }
    },

    filterTap() {
      let { branchlist, checkList, begin_date, end_date, name } = this;
      if (name == "不筛选标记名") {
        this.name = "";
      }
      this.is_all = 1;
      let tempList = [];
      branchlist.forEach(o => {
        if (checkList.indexOf(o.USERGROUP_NAME) != -1) {
          tempList.push(o.USERGROUP_ID);
        }
      });
      this.bug_id = tempList.join(",");
      if (this.time != "") {
        this.begin_date = this.crtTimeFtt(this.time[0]);
        this.end_date = this.crtTimeFtt(this.time[1]);
      }
      this.deleteOverlays();
      this.getPoint();
      this.filter = false;
    },

    clearFilterTap() {
      let userInfo = localStorage.getItem("userinfo");
      userInfo = JSON.parse(userInfo);
      this.begin_date = "";
      this.end_date = "";
      this.ispublic = userInfo.ISPUBLIC;
      this.bug_id = "";
      this.name = "";
      this.is_all = 1;
      this.ispublic = this.deleteOverlays();
      this.getPoint();
      this.filter = false;
    }
  }
};
</script>

