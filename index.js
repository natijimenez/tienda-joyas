//Importación dependencias
const express = require('express')
const { Pool } = require('pg')
const morgan = require('morgan')

//Config. DB
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'joyas',
  password: '******',
  port: 5432,
})

//Iniciar app
const app = express()
const PORT = 3000

//Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})

//Middlewares
app.use(morgan('dev'))

app.use((req, res, next) => {
  console.log(`Se realizó una consulta a la ruta: ${req.method} ${req.url}`)
  next()
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Error de servidor')
})

//Ruta GET/joyas
app.get('/joyas', async (req, res) => {
  try {
    const { limits = 10, page = 1, order_by } = req.query
    const offset = (page - 1) * limits

    let orderQuery = ''
    if (order_by) {
      const [field, direction] = order_by.split('_')
      orderQuery = `ORDER BY ${field} ${direction}`
    }

    const query = `SELECT * FROM inventario ${orderQuery} LIMIT $1 OFFSET $2`
    const values = [Number(limits), offset]
    const result = await pool.query(query, values)

    const hateoas = result.rows.map(joya => ({
      name: joya.nombre,
      href: `/joyas/${joya.id}`,
    }))

    res.json({
      total: result.rowCount,
      joyas: hateoas,
    })
  } catch (error) {
    console.error('Error al obtener data de joyas:', error)
    res.status(500).json({ error: 'Error de servidor' })
  }
})

//Ruta GET/joyas/filtros
app.get('/joyas/filtros', async (req, res) => {
  try {
    const { precio_max, precio_min, categoria, metal } = req.query
    const filters = []
    const values = []

    if (precio_max) {
      filters.push('precio <= $1')
      values.push(Number(precio_max))
    }
    if (precio_min) {
      filters.push('precio >= $2')
      values.push(Number(precio_min))
    }
    if (categoria) {
      filters.push('categoria = $3')
      values.push(categoria)
    }
    if (metal) {
      filters.push('metal = $4')
      values.push(metal)
    }

    const query = `SELECT * FROM inventario WHERE ${filters.join(' AND ')}`
    const result = await pool.query(query, values)

    res.json(result.rows)
  } catch (error) {
    console.error('Error al filtrar joyas:', error)
    res.status(500).json({ error: 'Error de servidor' })
  }
})


