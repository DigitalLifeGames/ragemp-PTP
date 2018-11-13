@echo off

IF "%RageMpServer%" == "" GOTO NOPATH

:YESPATH

REM server packages
xcopy /Y /S packages "%RageMpServer%\packages"

REM client packages
xcopy /Y /S client_packages "%RageMpServer%\client_packages"

REM package-json
xcopy /Y "package.json" "%RageMpServer%\packages\ptp"
xcopy /Y "package-lock.json" "%RageMpServer%\packages\ptp"

cd /D "%RageMpServer%\packages\ptp"
npm install

GOTO END

:NOPATH
	set /p NewPath="Path to Rage MP server directory (with server.exe in it): "
	setx RageMpServer "%NewPath%"
GOTO YESPATH

:END
echo Done
pause