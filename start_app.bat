@echo off
chcp 65001 >nul
echo ===================================================
echo   啟動 3D 太陽系全景互動模擬系統
echo   3D Solar System Telemetry & Azimuth Visualizer
echo ===================================================
echo 正在開啟瀏覽器...
start "" "%~dp0index.html"
echo 完成！您可於瀏覽器中直接進行 3D 互動與天文遙測觀測。
pause
