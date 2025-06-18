# 与星星对话

这是一个帮助自闭症儿童家长理解孩子表达的项目。

## 特点

- 上传音视频，自动转录（Whisper）
- 根据转录文本，调用 GPT-4o-mini 生成沟通建议
- 前后端分离，后端安全保存 API Key

## 运行步骤

1. 克隆仓库
2. 安装依赖：

```bash
npm install express cors multer dotenv openai
