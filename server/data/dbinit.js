const { Client } = require('pg')
const fsp = require('fs').promises
const path = require('path')

const client = new Client({
    user: 'mapstat',
    host: 'localhost',
    database: 'postgres',
    password: 'mapstat',
    port: 5432,
})

const createSequence = 'CREATE SEQUENCE IF NOT EXISTS public.map_sequence';

async function initSchema() {
    if (!client.connected) {
        await client.connect();
    }
    await client.query(createSequence);

    let tableQueryRes = await client.query(`SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE  table_schema = 'public'
        AND    table_name   = 'maps'
        );`);
    if (!tableQueryRes.rows[0].exists) {
        console.debug('maps table missing, init the schema')
        var file = await fsp.readFile(path.join(__dirname, 'initschema.sql'))
        var initQuery = file.toString();
        await client.query(initQuery)
    } else {
        console.debug('maps table exists, skip creationg')
    }

    tableQueryRes = await client.query(`SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE  table_schema = 'public'
        AND    table_name   = 'users'
        );`);
    if (!tableQueryRes.rows[0].exists) {
        console.debug('users table missing, init the table')
        var usersSql = await fsp.readFile(path.join(__dirname, 'initusers.sql'))
        var usersSqlQuery = usersSql.toString();
        await client.query(usersSqlQuery)
    } else {
        console.debug('users table exists, skip creation');
    }

    tableQueryRes = await client.query(`SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE  table_schema = 'public'
        AND    table_name   = 'map_files'
        );`);
    if (!tableQueryRes.rows[0].exists) {
        console.debug('map_files table missing, init the table')
        var mapfilesSql = await fsp.readFile(path.join(__dirname, 'initfiles.sql'))
        var mapfilesSqlQuery = mapfilesSql.toString();
        await client.query(mapfilesSqlQuery)
    } else {
        console.debug('map_files table exists, skip creation');
    }

    tableQueryRes = await client.query(`SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE  table_schema = 'public'
        AND    table_name   = 'levelshots'
        );`);
    if (!tableQueryRes.rows[0].exists) {
        console.debug('levelshots table missing, init the table')
        var levelshotsFileSql = await fsp.readFile(path.join(__dirname, 'initlevelshots.sql'))
        var levelshotsSqlQuery = levelshotsFileSql.toString();
        await client.query(levelshotsSqlQuery)
    } else {
        console.debug('levelshots table exists, skip creation');
    }

    tableQueryRes = await client.query(`SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE  table_schema = 'public'
        AND    table_name   = 'map_votes'
        );`);
    if (!tableQueryRes.rows[0].exists) {
        console.debug('map_votes table missing, init the table')
        var mapvotesFileSql = await fsp.readFile(path.join(__dirname, 'initvotes.sql'))
        var mapvotesSqlQuery = mapvotesFileSql.toString();
        await client.query(mapvotesSqlQuery)
    } else {
        console.debug('map_votes table exists, skip creation');
    }
}

module.exports = {
    client,
    initSchema
}