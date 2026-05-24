# Oracle Academy - PostgreSQL Setup Script
# Roda após a instalação do PostgreSQL 17

$pgBin = "C:\Program Files\PostgreSQL\17\bin"
$env:PGPASSWORD = "oracle2024"
$psql = "$pgBin\psql.exe"
$createdb = "$pgBin\createdb.exe"

Write-Host "=== Oracle Academy - Configurando PostgreSQL ===" -ForegroundColor Cyan

# 1. Criar banco de dados principal (usuários, pagamentos, etc.)
Write-Host "[1/4] Criando banco oracle_main..." -ForegroundColor Yellow
& $createdb -U postgres oracle_main 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] oracle_main criado!" -ForegroundColor Green
} else {
    Write-Host "[AVISO] oracle_main já pode existir, continuando..." -ForegroundColor Yellow
}

# 2. Criar banco de dados de cursos (separado conforme arquitetura)
Write-Host "[2/4] Criando banco oracle_courses..." -ForegroundColor Yellow
& $createdb -U postgres oracle_courses 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] oracle_courses criado!" -ForegroundColor Green
} else {
    Write-Host "[AVISO] oracle_courses já pode existir, continuando..." -ForegroundColor Yellow
}

# 3. Testar conexão com os bancos
Write-Host "[3/4] Testando conexões..." -ForegroundColor Yellow
$testMain = & $psql -U postgres -d oracle_main -c "SELECT 'oracle_main OK' as status;" 2>&1
$testCourses = & $psql -U postgres -d oracle_courses -c "SELECT 'oracle_courses OK' as status;" 2>&1

Write-Host $testMain -ForegroundColor Gray
Write-Host $testCourses -ForegroundColor Gray

# 4. Mostrar URLs de conexão para o .env
Write-Host ""
Write-Host "[4/4] URLs de conexão para o arquivo .env:" -ForegroundColor Cyan
Write-Host ""
Write-Host "DATABASE_URL=postgresql://postgres:oracle2024@localhost:5432/oracle_main" -ForegroundColor White
Write-Host "COURSES_DATABASE_URL=postgresql://postgres:oracle2024@localhost:5432/oracle_courses" -ForegroundColor White
Write-Host ""
Write-Host "=== Setup concluído! ===" -ForegroundColor Green
Write-Host "As tabelas serão criadas automaticamente quando o servidor iniciar." -ForegroundColor Gray
