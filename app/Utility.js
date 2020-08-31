export default class Utility {
  static getBase64FromArray(arr) {
    var base64 = "data:image/jpg;base64,";
    var chunk = 8 * 1024;
    let i;
    for (i = 0; i < arr.length / chunk; i++) {
      base64 += String.fromCharCode.apply(
        null,
        arr.slice(i * chunk, (i + 1) * chunk)
      );
    }
    base64 += String.fromCharCode.apply(null, arr.slice(i * chunk));
    return base64;
  }
}
