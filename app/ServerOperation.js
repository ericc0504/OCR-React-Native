import axios from "axios";
import Config from "./Config";

export default class ServerOperation {
  static async processImg(base64) {
    let result = await axios.post(
      Config.API_URI + "/processImg?key=" + Config.API_KEY,
      base64
      // { headers: { "Content-Type": "text/plain" } }
    );
    return result.data;
  }

  static async getPreviousOcrResult() {
    let result = await axios.get(
      Config.API_URI + "/previousOcrResult?key=" + Config.API_KEY
    );
    return result.data;
  }

  static async getFullSizeImg(id) {
    let result = await axios.get(
      Config.API_URI + "/fullSizeImg?key=" + Config.API_KEY + "&id=" + id
    );
    return result.data;
  }
}
