@echo off
cd "public\gallery"
echo Renaming photos...
setlocal enabledelayedexpansion

for %%f in ("devils-gate (*).jpg") do (
    set "filename=%%~nf"
    set "num=!filename:~-2,1!"
    if "!filename:~-5,1!"==" " set "num=!filename:~-3,2!"
    echo %%f -> "parque-natural-cerro-verde (!num!).jpg"
    ren "%%f" "parque-natural-cerro-verde (!num!).jpg"
)

echo Done!
pause
