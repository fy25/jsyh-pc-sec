import { post, get } from "./axios.js";
const Base = {
  get (url, data) {
    return get(url, data);
  },
  post (url, data) {
    return post(url, data);
  }
}

export { Base };
