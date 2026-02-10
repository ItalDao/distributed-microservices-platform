# Security - Secrets Management

> [!WARNING]
> NUNCA commits credenciales reales al repositorio.

## Credenciales Expuestas Detectadas

GitHub detectó credenciales en:
- `docs/CONFIGURATION.md` - **ARREGLADO**
- `docs/deployment.md` - **ARREGLADO**

Todas reemplazadas con placeholders genéricos.

## Cómo Manejar Secretos

### LOCAL (Desarrollo)

```bash
# 1. Copiar template (nunca está en git)
cp .env.example .env

# 2. Editar .env con credenciales REALES
nano .env

# 3. .env está en .gitignore (no se sube a git)
```

**Archivo `.gitignore` (verificar que existe):**
```
.env
.env.local
.env.*.local
secrets/
*.key
```

### PRODUCCIÓN

Usar Secrets Manager del proveedor:

**AWS:**
```bash
aws secrets create-secret \
  --name prod/db-password \
  --secret-string 'actual_password'
```

**Google Cloud:**
```bash
gcloud secrets create db-password \
  --data-file=- <<< 'actual_password'
```

**Azure:**
```bash
az keyvault secret set \
  --vault-name myVault \
  --name db-password \
  --value 'actual_password'
```

**Kubernetes Secrets:**
```bash
kubectl create secret generic db-secret \
  --from-literal=password='actual_password'
```

## En Documentación

### PERMITIDO (Ejemplos):
```
DB_URL=postgresql://<USERNAME>:<PASSWORD>@<HOST>:5432/db
JWT_SECRET=<GENERATE_SECURE_32_CHAR_SECRET>
SMTP_PASSWORD=<YOUR_APP_PASSWORD>
```

### PROHIBIDO (Credenciales reales):
```
DB_URL=postgresql://user:myRealPassword@prod.example.com:5432/db
JWT_SECRET=abc123xyz789abc123xyz789abc123xyz
SMTP_PASSWORD=gmail_app_password_12345678901234567
```

> [!IMPORTANT]
> Usa siempre placeholders en documentación y ejemplos públicos.

## Checklist de Seguridad

- [ ] `.env` está en `.gitignore`
- [ ] Ningún `.env` en git history
- [ ] Documentación solo con `<PLACEHOLDERS>`
- [ ] Production secrets en Secrets Manager
- [ ] Credenciales rotadas regularmente
- [ ] No compartir `.env` por email/chat
- [ ] `.env` solo en máquinas autorizadas

## Si Ya Fue Expuesto

1. **Cambiar la credencial inmediatamente:**
   ```bash
   # MongoDB
   db.changeUserPassword("admin", "new_password")
   
   # PostgreSQL
   ALTER USER admin WITH PASSWORD 'new_password';
   ```

2. **Revisar logs de acceso** a esa cuenta

3. **Auditar cambios** en datos sensibles

4. **Notificar al equipo**

## Variables de Entorno Críticas

Nunca commitear:
- `DATABASE_PASSWORD`
- `JWT_SECRET`
- `API_KEYS`
- `SMTP_PASSWORD`
- `AWS_SECRET_ACCESS_KEY`
- `GITHUB_TOKEN`
- `ENCRYPTION_KEY`
- `PAYMENT_API_KEY`

## Referencias

- [OWASP - Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [GitHub - Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)
- [12Factor App - Config](https://12factor.net/config)
