# Corrección de columnas de timestamp en la base de datos

## Problema

El sistema tenía inconsistencia en los nombres de las columnas de timestamp entre diferentes tablas:
- Algunas usaban `created_at` / `updated_at` (con guion bajo)
- Otras usaban `createdAt` / `updatedAt` (CamelCase)
- La función trigger `update_updated_at_column()` esperaba `updatedat` (sin guion bajo)

Esto causaba errores como:
```
Error: el registro «new» no tiene un campo «updatedat»
Error: el registro «new» no tiene un campo «updated_at»
```

## Solución

Se estandarizaron todas las tablas para usar `createdat` y `updatedat` (sin guión bajo, todo minúsculas) y se configuraron los triggers correctamente.

## Scripts ejecutados

1. **fix_verificadores_columns.sql** - Corrigió la tabla `verificadores`
2. **fix_publicaciones_tendencias_columns.sql** - Corrigió la tabla `publicaciones_tendencias`
3. **fix_all_remaining_tables.sql** - Corrigió `publicaciones_coalicion` y `usuarios`
4. **fix_repositorio_documentos.sql** - Corrigió `repositorio_documentos`

## Tablas actualizadas

Todas estas tablas ahora tienen:
- Columna `createdat` (timestamp)
- Columna `updatedat` (timestamp)
- Trigger que actualiza automáticamente `updatedat` en cada UPDATE

Lista de tablas corregidas:
1. ✅ verificadores
2. ✅ publicaciones_tendencias
3. ✅ publicaciones_coalicion
4. ✅ usuarios
5. ✅ repositorio_documentos

## Verificación

Para verificar que todo está correcto, ejecuta:

```sql
-- Ver todos los triggers
SELECT c.relname as tabla, t.tgname as trigger 
FROM pg_trigger t 
JOIN pg_class c ON t.tgrelid = c.oid 
WHERE NOT t.tgisinternal 
ORDER BY c.relname;

-- Ver la función del trigger
SELECT pg_get_functiondef(oid) 
FROM pg_proc 
WHERE proname = 'update_updated_at_column';
```

## Resultado esperado

Ahora todas las operaciones UPDATE deberían funcionar correctamente sin errores de campos faltantes.
