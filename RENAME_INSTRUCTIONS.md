# 照片重命名说明

由于PowerShell脚本在包含中文字符的路径中运行出现问题，请手动重命名照片文件。

## 方法1：手动重命名（推荐）

1. 打开文件夹：`public\gallery`
2. 将以下文件重命名：
   - `devils-gate (1).jpg` → `parque-natural-cerro-verde (1).jpg`
   - `devils-gate (2).jpg` → `parque-natural-cerro-verde (2).jpg`
   - ...
   - `devils-gate (20).jpg` → `parque-natural-cerro-verde (20).jpg`

## 方法2：使用命令提示符

1. 打开命令提示符（cmd.exe）
2. 切换到项目目录：
   ```cmd
   cd "C:\Users\Administrator\Documents\GitHub\萨尔瓦多\parque-natural-cerro-verde"
   ```
3. 运行批处理文件：
   ```cmd
   rename_photos.bat
   ```

## 方法3：使用PowerShell（从gallery文件夹运行）

1. 打开PowerShell
2. 切换到gallery文件夹：
   ```powershell
   cd "C:\Users\Administrator\Documents\GitHub\萨尔瓦多\parque-natural-cerro-verde\public\gallery"
   ```
3. 运行以下命令：
   ```powershell
   Get-ChildItem "devils-gate (*).jpg" | ForEach-Object { 
       $num = $_.Name -replace 'devils-gate \(([0-9]+)\)\.jpg', '$1'
       Rename-Item $_.Name -NewName "parque-natural-cerro-verde ($num).jpg"
   }
   ```

## 验证

重命名完成后，运行以下命令验证：
```cmd
dir "public\gallery\parque-natural-cerro-verde (*).jpg"
```

应该显示20个文件。
