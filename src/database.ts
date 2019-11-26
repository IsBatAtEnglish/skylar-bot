import { MongoClient, Db } from 'mongodb'

/**
 * Conecta ao banco de dados
 * @param conf Configurações da Luma
 */
const connect = async (conf: Map<string, string>) : Promise<Db> => {
    const connection: MongoClient = await MongoClient.connect(conf.get('db_url'), {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })

    const db: Db = connection.db(conf.get('db_name'))
    
    // Inicializar o banco de dados
    await db.createCollection('stats')

    return db
}

export default connect