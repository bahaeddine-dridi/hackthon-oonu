@echo off
cd /d "%~dp0"
echo Running migrations...
php artisan migrate --force
echo.
echo Seeding database...
php artisan db:seed --force
echo.
echo Setup complete!
pause
