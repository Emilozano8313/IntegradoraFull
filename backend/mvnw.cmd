@REM ----------------------------------------------------------------------------
@REM Maven Wrapper Startup Batch Script, version 3.3.2
@REM Licensed to the ASF under the Apache License, Version 2.0
@REM ----------------------------------------------------------------------------
@IF "%__MVNW_ARG0_NAME__%"=="" (SET "__MVNW_ARG0_NAME__=%~nx0")
@SET MAVEN_PROJECTBASEDIR=%~dp0
@IF "%MAVEN_PROJECTBASEDIR:~-1%"=="\" SET "MAVEN_PROJECTBASEDIR=%MAVEN_PROJECTBASEDIR:~0,-1%"

@SET WRAPPER_JAR="%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.jar"
@SET WRAPPER_LAUNCHER=org.apache.maven.wrapper.MavenWrapperMain

@REM -- Find Java --
@SET JAVA_EXE=java.exe
@IF NOT "%JAVA_HOME%"=="" SET JAVA_EXE="%JAVA_HOME%\bin\java.exe"

%JAVA_EXE% ^
  -Dmaven.multiModuleProjectDirectory="%MAVEN_PROJECTBASEDIR%" ^
  -cp %WRAPPER_JAR% ^
  %WRAPPER_LAUNCHER% ^
  %*

@IF "%ERRORLEVEL%"=="0" GOTO :end
@EXIT /B %ERRORLEVEL%

:end
