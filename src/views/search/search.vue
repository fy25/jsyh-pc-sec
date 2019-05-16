<template>
  <div>
    <iframe
      id="mapPage"
      width="100%"
      height="800"
      frameborder="0"
      src="http://apis.map.qq.com/tools/locpicker?search=1&type=1&key=OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77&referer=myapp"
    ></iframe>
  </div>
</template>

<script>
import { Config } from "../../utils/config";
export default {
  data() {
    return {
      Config
    };
  },
  mounted() {
    window.addEventListener(
      "message",
      function(event) {
        var loc = event.data;
        if (loc && loc.module == "locationPicker") {
          console.log("location", loc);
          localStorage.setItem("lat", loc.latlng.lat);
          localStorage.setItem("lng", loc.latlng.lng);
          localStorage.setItem("poiname", loc.poiname);
          window.history.go(-1);
        }
      },
      false
    );
  },
  methods: {
    // 跳转
    redirectTo(path) {
      this.$router.replace({ path: path });
    }
  }
};
</script>

