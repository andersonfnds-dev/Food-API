const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000; // Você pode escolher outra porta, se preferir

// Configura o banco de dados SQLite
const db = new sqlite3.Database('./taco.db');

// Middleware para parsear JSON
app.use(express.json());

// Endpoint para buscar alimentos por ID
app.get('/alimentos/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM alimentos WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (row) {
      res.json(row);
    } else {
      res.status(404).json({ message: 'Alimento não encontrado' });
    }
  });
});

// Endpoint para buscar todos os alimentos
app.get('/alimentos', (req, res) => {
  db.all('SELECT * FROM alimentos', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Endpoint para adicionar um novo alimento
app.post('/alimentos', (req, res) => {
  const { numero, grupo, descricao, energia_kcal, proteina_g, carboidrato_g } = req.body;
  db.run(`INSERT INTO alimentos (numero, grupo, descricao, energia_kcal, proteina_g, carboidrato_g)
          VALUES (?, ?, ?, ?, ?, ?)`, 
    [numero, grupo, descricao, energia_kcal, proteina_g, carboidrato_g], 
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).json({ id: this.lastID });
      }
    }
  );
});

// Endpoint para atualizar um alimento
app.put('/alimentos/:id', (req, res) => {
  const { id } = req.params;
  const { numero, grupo, descricao, energia_kcal, proteina_g, carboidrato_g } = req.body;
  db.run(`UPDATE alimentos 
          SET numero = ?, grupo = ?, descricao = ?, energia_kcal = ?, proteina_g = ?, carboidrato_g = ?
          WHERE id = ?`, 
    [numero, grupo, descricao, energia_kcal, proteina_g, carboidrato_g, id], 
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else if (this.changes > 0) {
        res.json({ message: 'Alimento atualizado com sucesso' });
      } else {
        res.status(404).json({ message: 'Alimento não encontrado' });
      }
    }
  );
});

// Endpoint para deletar um alimento
app.delete('/alimentos/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM alimentos WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (this.changes > 0) {
      res.json({ message: 'Alimento deletado com sucesso' });
    } else {
      res.status(404).json({ message: 'Alimento não encontrado' });
    }
  });
});

// Endpoint para buscar alimentos por descrição
app.get('/alimentos/descricao', (req, res) => {
    const { descricao } = req.query;
    if (!descricao) {
      return res.status(400).json({ error: 'Parâmetro de descrição é necessário' });
    }
    
    db.all('SELECT * FROM alimentos WHERE descricao LIKE ?', [`%${descricao}%`], (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else if (rows.length > 0) {
        res.json(rows);
      } else {
        res.status(404).json({ message: 'Nenhum alimento encontrado com a descrição fornecida' });
      }
    });
  });  

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
