
<script>
// api
import API from "@/api/apiFactory";

// vuex
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState({
      userInfo: "userInfo"
    })
  },
  methods: {
    /**
     * 路由
     */
    routeLink(path, query) {
      this.$router.push({
        path: path,
        query: query || {}
      });
    }
  }
};
</script>

<style>
</style>
