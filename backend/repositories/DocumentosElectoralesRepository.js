const BaseRepository = require('./BaseRepository');
const { pool } = require('../config/db');

class DocumentosElectoralesRepository extends BaseRepository {
    constructor() {
        super('repositorio_documentos');
    }

    // Mapear los nombres de columnas de la base de datos a los del frontend
    mapDbToApi(dbRow) {
        if (!dbRow) return null;
        
        return {
            id: dbRow.id,
            title: dbRow.titulo,
            description: dbRow.descripcion,
            type: dbRow.formato_archivo,
            category: dbRow.categoria,
            fileUrl: dbRow.ruta_archivo,
            previewUrl: dbRow.ruta_vista_previa,
            fileSize: dbRow.tamano_texto,
            publishDate: dbRow.fecha_publicacion,
            status: dbRow.estado,
            tags: dbRow.tags,
            authorName: dbRow.autor,
            version: dbRow.version,
            createdAt: dbRow.created_at,
            updatedAt: dbRow.updated_at
        };
    }

    // Mapear del frontend a la base de datos
    mapApiToDb(apiData) {
        const columnMap = {
            title: 'titulo',
            description: 'descripcion',
            type: 'formato_archivo',
            category: 'categoria',
            fileUrl: 'ruta_archivo',
            previewUrl: 'ruta_vista_previa',
            fileSize: 'tamano_texto',
            publishDate: 'fecha_publicacion',
            status: 'estado',
            tags: 'tags',
            authorName: 'autor',
            version: 'version'
        };

        return Object.entries(columnMap).reduce((dbData, [apiKey, dbColumn]) => {
            if (apiData[apiKey] !== undefined) {
                dbData[dbColumn] = apiData[apiKey];
            }
            return dbData;
        }, {});
    }

    // Obtener todos con mapeo
    async findAll(page = 1, limit = 10, filters = {}) {
        try {
            const offset = (page - 1) * limit;
            let whereClause = '';
            const filterValues = [];

            // Aplicar filtros
            const conditions = [];
            if (filters.categoria) {
                filterValues.push(filters.categoria);
                conditions.push(`categoria = $${filterValues.length}`);
            }
            if (filters.estado) {
                filterValues.push(filters.estado);
                conditions.push(`estado = $${filterValues.length}`);
            }
            if (filters.formato_archivo) {
                filterValues.push(filters.formato_archivo);
                conditions.push(`formato_archivo = $${filterValues.length}`);
            }

            if (conditions.length > 0) {
                whereClause = 'WHERE ' + conditions.join(' AND ');
            }

            const query = `
                SELECT * FROM ${this.tableName}
                ${whereClause}
                ORDER BY fecha_publicacion DESC, created_at DESC
                LIMIT $${filterValues.length + 1} OFFSET $${filterValues.length + 2}
            `;

            const countQuery = `
                SELECT COUNT(*) as total FROM ${this.tableName}
                ${whereClause}
            `;

            const [result, countResult] = await Promise.all([
                pool.query(query, [...filterValues, limit, offset]),
                pool.query(countQuery, filterValues)
            ]);

            const total = parseInt(countResult.rows[0].total);
            const totalPages = Math.ceil(total / limit);

            return {
                data: result.rows.map(row => this.mapDbToApi(row)),
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages,
                    hasNext: page < totalPages,
                    hasPrev: page > 1
                }
            };
        } catch (error) {
            throw new Error(`Error al obtener documentos: ${error.message}`);
        }
    }

    // Obtener por ID con mapeo
    async findById(id) {
        try {
            const query = `SELECT * FROM ${this.tableName} WHERE id = $1`;
            const result = await pool.query(query, [id]);
            return result.rows.length > 0 ? this.mapDbToApi(result.rows[0]) : null;
        } catch (error) {
            throw new Error(`Error al obtener documento por ID: ${error.message}`);
        }
    }

    // Crear documento con mapeo
    async create(data) {
        try {
            const dbData = this.mapApiToDb(data);
            const columns = Object.keys(dbData);
            const values = Object.values(dbData);
            const placeholders = values.map((_, index) => `$${index + 1}`);

            const query = `
                INSERT INTO ${this.tableName} (${columns.join(', ')})
                VALUES (${placeholders.join(', ')})
                RETURNING *
            `;

            const result = await pool.query(query, values);
            return this.mapDbToApi(result.rows[0]);
        } catch (error) {
            throw new Error(`Error al crear documento: ${error.message}`);
        }
    }

    // Actualizar documento con mapeo
    async update(id, data) {
        try {
            const dbData = this.mapApiToDb(data);
            dbData.updated_at = new Date();

            const columns = Object.keys(dbData);
            const values = Object.values(dbData);
            const setClause = columns.map((col, index) => `${col} = $${index + 2}`).join(', ');

            const query = `
                UPDATE ${this.tableName}
                SET ${setClause}
                WHERE id = $1
                RETURNING *
            `;

            const result = await pool.query(query, [id, ...values]);
            return result.rows.length > 0 ? this.mapDbToApi(result.rows[0]) : null;
        } catch (error) {
            throw new Error(`Error al actualizar documento: ${error.message}`);
        }
    }

    // Obtener documentos por categoría
    async findByCategory(category, page = 1, limit = 10) {
        return await this.findAll(page, limit, { categoria: category });
    }

    // Obtener documentos por tipo de archivo
    async findByType(type, page = 1, limit = 10) {
        return await this.findAll(page, limit, { formato_archivo: type });
    }

    // Obtener documentos por estado
    async findByStatus(status, page = 1, limit = 10) {
        return await this.findAll(page, limit, { estado: status });
    }

    // Obtener documentos publicados
    async findPublished(page = 1, limit = 10) {
        try {
            const offset = (page - 1) * limit;
            
            const query = `
                SELECT * FROM ${this.tableName}
                WHERE estado = 'publicado'
                ORDER BY fecha_publicacion DESC, created_at DESC
                LIMIT $1 OFFSET $2
            `;
            
            const countQuery = `
                SELECT COUNT(*) as total FROM ${this.tableName}
                WHERE estado = 'publicado'
            `;

            const [result, countResult] = await Promise.all([
                pool.query(query, [limit, offset]),
                pool.query(countQuery)
            ]);

            const total = parseInt(countResult.rows[0].total);
            const totalPages = Math.ceil(total / limit);

            return {
                data: result.rows.map(row => this.mapDbToApi(row)),
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages,
                    hasNext: page < totalPages,
                    hasPrev: page > 1
                }
            };
        } catch (error) {
            throw new Error(`Error al obtener documentos publicados: ${error.message}`);
        }
    }

    // Obtener documentos más recientes
    async findRecent(limit = 10) {
        try {
            const query = `
                SELECT * FROM ${this.tableName}
                WHERE estado = 'publicado'
                ORDER BY fecha_publicacion DESC, created_at DESC
                LIMIT $1
            `;
            const result = await pool.query(query, [limit]);
            return result.rows.map(row => this.mapDbToApi(row));
        } catch (error) {
            throw new Error(`Error al obtener documentos recientes: ${error.message}`);
        }
    }

    // Búsqueda en documentos
    async searchDocuments(searchTerm, page = 1, limit = 10) {
        try {
            const offset = (page - 1) * limit;
            const searchPattern = `%${searchTerm.toLowerCase()}%`;

            const query = `
                SELECT * FROM ${this.tableName}
                WHERE (
                    LOWER(titulo) LIKE $1 OR
                    LOWER(descripcion) LIKE $1 OR
                    LOWER(tags) LIKE $1 OR
                    LOWER(autor) LIKE $1
                )
                ORDER BY fecha_publicacion DESC, created_at DESC
                LIMIT $2 OFFSET $3
            `;

            const countQuery = `
                SELECT COUNT(*) as total FROM ${this.tableName}
                WHERE (
                    LOWER(titulo) LIKE $1 OR
                    LOWER(descripcion) LIKE $1 OR
                    LOWER(tags) LIKE $1 OR
                    LOWER(autor) LIKE $1
                )
            `;

            const [result, countResult] = await Promise.all([
                pool.query(query, [searchPattern, limit, offset]),
                pool.query(countQuery, [searchPattern])
            ]);

            const total = parseInt(countResult.rows[0].total);
            const totalPages = Math.ceil(total / limit);

            return {
                data: result.rows.map(row => this.mapDbToApi(row)),
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages,
                    hasNext: page < totalPages,
                    hasPrev: page > 1
                }
            };
        } catch (error) {
            throw new Error(`Error en búsqueda de documentos: ${error.message}`);
        }
    }
}

module.exports = DocumentosElectoralesRepository;
