const replaceEmpty = function(content) {
  return content.replace(/\n/g, "<br/>").replace(/\s/g, " ");
};

module.exports = {
  replaceEmpty
};
