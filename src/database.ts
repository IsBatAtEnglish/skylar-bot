import { open, Database } from 'sqlite'

/**
 * Conecta ao banco de dados
 * @param conf Configurações da Luma
 */
const connect = async (conf: Map<string, string>) : Promise<Database> => {
    const db: Database = await open(conf.get('db_path'))
    
    // Inicializar o banco de dados
    await db.exec(`
        CREATE TABLE IF NOT EXISTS stats (
            id TEXT PRIMARY KEY NOT NULL UNIQUE,
            login_count INTEGER DEFAULT 0,
            command_count INTEGER DEFAULT 0
        );
    `)

    return db
}

export default connect