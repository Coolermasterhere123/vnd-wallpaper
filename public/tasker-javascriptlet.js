// Step 1: Get today's rate
var rateUrl = "https://vnd-wallpaper.vercel.app/api/rates";
var rateConn = new java.net.URL(rateUrl).openConnection();
rateConn.setConnectTimeout(10000);
rateConn.setReadTimeout(10000);
rateConn.connect();

var rateReader = new java.io.BufferedReader(new java.io.InputStreamReader(rateConn.getInputStream()));
var rateLine = "";
var rateStr = "";
while ((rateLine = rateReader.readLine()) != null) { rateStr += rateLine; }
rateReader.close();

// Extract rate number from {"rate":18934}
var rate = "18934";
var match = rateStr.match(/"rate":(\d+)/);
if (match) rate = match[1];

// Step 2: Download wallpaper with live rate
var url = "https://vnd-wallpaper.vercel.app/api/wallpaper?rate=" + rate;
var path = "/sdcard/Pictures/vnd-wallpaper.png";

var conn = new java.net.URL(url).openConnection();
conn.setConnectTimeout(30000);
conn.setReadTimeout(30000);
conn.connect();

var input = conn.getInputStream();
var fos = new java.io.FileOutputStream(path);
var buffer = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, 8192);
var len;
while ((len = input.read(buffer)) != -1) {
  fos.write(buffer, 0, len);
}
fos.close();
input.close();
