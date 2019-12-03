const path = require("path");
const createAssetName = function(fileOriginalName, account) {
  const time = new Date().getTime();
  const fileName = account + time;
  const extArr = fileOriginalName.split(".");
  const ext = extArr[extArr.length - 1];
  const name = `${fileName}.${ext}`;
  return {
    filePath: path.join(__dirname, "../public/uploads/avator") + "/" + name,
    name
  };
};

module.exports = {
  createAssetName
};
