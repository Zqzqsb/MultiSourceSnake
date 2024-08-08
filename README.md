# 🐍 Multi-Source Git Contribution Animation

Generate a fun snake game animation from your contributions on both Gitee and GitHub platforms!

<p align="center">
  <img
    alt="GitHub Contribution Grid Snake Animation"
    src="https://alicloud-pic.oss-cn-shanghai.aliyuncs.com/MultiSourceSnake/contributions.png"
  />
</p>

<p align="center">
  <picture>
    <source
      media="(prefers-color-scheme: dark)"
      srcset="https://alicloud-pic.oss-cn-shanghai.aliyuncs.com/MultiSourceSnake/github-snake-dark.svg"
    />
    <source
      media="(prefers-color-scheme: light)"
      srcset="https://alicloud-pic.oss-cn-shanghai.aliyuncs.com/MultiSourceSnake/github-snake.svg"
    />
    <img
      alt="GitHub Contribution Grid Snake Animation"
      src="https://alicloud-pic.oss-cn-shanghai.aliyuncs.com/MultiSourceSnake/github-snake.svg"
    />
  </picture>
</p>

## 🚀 Usage

### 🔄 Cron Job with GitHub Actions

```yaml
name: Generate MultiSnake

on:
  schedule:
    - cron: "0 */6 * * *" # Runs every six hours
  workflow_dispatch: # Allows manual launch

jobs:
  generate:
    runs-on: ubuntu-latest
    timeout-minutes: 10

    steps:
      # Checkout repository
      - name: 📥 Checkout the repository
        uses: actions/checkout@v2

      # Generate Snake animation
      - name: 🐍 Generate MultiSource Snake animation
        uses: Zqzqsb/MultiSourceSnake@v1.0
        with:
          GITHUB_USER: # Your GitHub username {required}
          GITEE_USER: # Your Gitee username {required}
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          GITEE_TOKEN: # Your Gitee API access token {required}
          outputs: |
            dist/github-snake.svg
            dist/github-snake-dark.svg?palette=github-dark
            dist/ocean.gif?color_snake=orange&color_dots=#bfd6f6,#8dbdff,#64a1f4,#4b91f1,#3c7dd9

      # Push outputs
      - name: 🚀 Push GitHub Snake animation to the output branch
        uses: crazy-max/ghaction-github-pages@v2.5.0
        with:
          target_branch: output
          build_dir: dist
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Example of Mine

you can checkout [my profile](https://github.com/Zqzqsb/Zqzqsb) to figure how to use this scipt.

after you put the scipt under `.github/workflows`, you can manually run this action to test it.

![](https://alicloud-pic.oss-cn-shanghai.aliyuncs.com/MultiSourceSnake/UsageExample.png)

## 🌙 Dark Mode

For dark mode support on GitHub, use this special syntax in your README:

```html
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="github-snake-dark.svg" />
  <source media="(prefers-color-scheme: light)" srcset="github-snake.svg" />
  <img alt="github-snake" src="github-snake.svg" />
</picture>
```

## 🔑 Gitee Token Setup

To set up your Gitee token, simply create an API token with minimal privileges.

<p align="center">
  <img src="https://alicloud-pic.oss-cn-shanghai.aliyuncs.com/MultiSourceSnake/GiteeApiSetup.png" alt="Gitee Token Setup"/>
</p>

## 📝 Acknowledgement

A big thanks to [Platane/snk](https://github.com/Platane/snk) for the original idea and implementation.

This project makes minor modifications to the original project.
