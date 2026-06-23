with open("main.js", "r") as f:
    content = f.read()

# Fix the literal \n and missing export
content = content.replace("module.exports.loop = function () {\\n",
                          "module.exports.loop = function () {\n")

with open("main.js", "w") as f:
    f.write(content)
