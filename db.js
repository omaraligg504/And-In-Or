const {Pool} =require('pg');
const pool=new Pool({
    host:process.env.DATABASE_HOST,
    port:process.env.DATABASE_PORT,
    user:process.env.DATABASE_USERNAME,
    password:process.env.DATABASE_PASSWORD,
    database:process.env.DATABASE,
    max:20,
    connectionTimeoutMillis:0,
    idleTimeoutMillis:0
})
async function queryWithTransaction(req, res, next) {
    const client = await pool.connect();
    try {
      // Begin transaction
      await client.query('BEGIN');
  
      // Set the client on the request object for access in route handlers
      req.client = client;
  
      // Continue to the next middleware/route handler
      next();
    } catch (error) {
      // Rollback transaction in case of error
      await client.query('ROLLBACK');
      console.error('Error executing transaction:', error);
      next(error);
    } finally {
      // Release the client back to the pool
      client.release();
    }
  }
module.exports=queryWithTransaction;