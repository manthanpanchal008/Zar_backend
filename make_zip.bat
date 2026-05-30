@echo off
echo Creating exclude.txt...
(
echo node_modules\
echo .next\
echo .git\
echo deploy_temp\
echo zar_deployment.zip
) > exclude.txt

echo Cleaning old folders...
if exist deploy_temp rmdir /S /Q deploy_temp
if exist zar_deployment.zip del /F /Q zar_deployment.zip

echo Creating deploy_temp structure...
mkdir deploy_temp
mkdir deploy_temp\backend
mkdir deploy_temp\frontend
mkdir deploy_temp\frontend\admin-dashboard

echo Copying Backend...
xcopy backend deploy_temp\backend /E /I /Y /exclude:exclude.txt

echo Copying Admin Dashboard...
xcopy frontend\admin-dashboard deploy_temp\frontend\admin-dashboard /E /I /Y /exclude:exclude.txt

echo Copying config files...
copy ecosystem.config.js deploy_temp\
copy .htaccess deploy_temp\
copy deploy.sh deploy_temp\
copy cpanel-deployment-guide.md deploy_temp\

echo Compressing files to zar_deployment.zip...
cd deploy_temp
tar -acf ..\zar_deployment.zip *
cd ..

echo Cleaning up temp files...
rmdir /S /Q deploy_temp
del exclude.txt

echo Zip file created successfully at zar_deployment.zip!
