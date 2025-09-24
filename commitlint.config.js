module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat", // 新功能
        "fix", // 修复问题
        "docs", // 文档更新
        "style", // 格式化代码
        "refactor", // 重构代码
        "test", // 添加测试
        "chore", // 构建或辅助工具变更
        "revert" // 回滚提交
      ]
    ],
    "subject-case": [0]
  }
};
