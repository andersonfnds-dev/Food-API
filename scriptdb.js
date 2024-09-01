const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const readline = require('readline');

// Caminho completo para o arquivo CSV
const csvFilePath = 'Taco.xlsx';

// Conectar ao banco de dados SQLite
const db = new sqlite3.Database('./taco.db');

db.serialize(() => {
  // Cria a tabela alimentos
  db.run(`CREATE TABLE IF NOT EXISTS alimentos (
    id INTEGER PRIMARY KEY,
    numero INTEGER,
    grupo TEXT,
    descricao TEXT,
    energia_kcal REAL,
    proteina_g REAL,
    carboidrato_g REAL,
  )`, (err) => {
    if (err) {
      console.error('Erro ao criar a tabela alimentos:', err.message);
    } else {
      console.log('Tabela alimentos criada ou já existente.');
    }
  });

  // Configurar leitura do arquivo CSV
  const rl = readline.createInterface({
    input: fs.createReadStream(csvFilePath),
    crlfDelay: Infinity
  });

  // Ignorar a primeira linha (cabeçalho)
  let firstLine = true;

  rl.on('line', (line) => {
    if (firstLine) {
      firstLine = false;
      return; // Pular a linha do cabeçalho
    }

    const columns = line.split(';');
    if (columns.length === 29) { // Verifica se há 29 colunas
      const [
        numero,
        grupo,
        descricao,
        umidade,
        energia_kcal,
        energia_kJ,
        proteina_g,
        lipideos_g,
        colesterol_mg,
        carboidrato_g,
        fibra_alimentar_g,
        cinzas_g,
        calcio_mg,
        magnesio_mg,
        manganes_mg,
        fosforo_mg,
        ferro_mg,
        sodio_mg,
        potassio_mg,
        cobre_mg,
        zinco_mg,
        retinol_mcg,
        re_mcg,
        rae_mcg,
        tiamina_mg,
        riboflavina_mg,
        piridoxina_mg,
        niacina_mg,
        vitamina_c_mg
      ] = columns;

      // Inserir dados na tabela alimentos
      db.run(`INSERT INTO alimentos (
        numero, grupo, descricao, umidade, energia_kcal, energia_kJ, proteina_g, lipideos_g, colesterol_mg, carboidrato_g,
        fibra_alimentar_g, cinzas_g, calcio_mg, magnesio_mg, manganes_mg, fosforo_mg, ferro_mg, sodio_mg, potassio_mg, cobre_mg,
        zinco_mg, retinol_mcg, re_mcg, rae_mcg, tiamina_mg, riboflavina_mg, piridoxina_mg, niacina_mg, vitamina_c_mg
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          parseInt(numero),
          grupo,
          descricao,
          parseFloat(umidade),
          parseFloat(energia_kcal),
          parseFloat(energia_kJ),
          parseFloat(proteina_g),
          parseFloat(lipideos_g),
          parseFloat(colesterol_mg),
          parseFloat(carboidrato_g),
          parseFloat(fibra_alimentar_g),
          parseFloat(cinzas_g),
          parseFloat(calcio_mg),
          parseFloat(magnesio_mg),
          parseFloat(manganes_mg),
          parseFloat(fosforo_mg),
          parseFloat(ferro_mg),
          parseFloat(sodio_mg),
          parseFloat(potassio_mg),
          parseFloat(cobre_mg),
          parseFloat(zinco_mg),
          parseFloat(retinol_mcg),
          parseFloat(re_mcg),
          parseFloat(rae_mcg),
          parseFloat(tiamina_mg),
          parseFloat(riboflavina_mg),
          parseFloat(piridoxina_mg),
          parseFloat(niacina_mg),
          parseFloat(vitamina_c_mg)
        ],
        (err) => {
          if (err) {
            console.error('Erro ao inserir dados na tabela alimentos:', err.message);
          }
        });
    } else {
      console.error('Linha mal formatada:', line);
    }
  });

  rl.on('close', () => {
    console.log('Dados importados com sucesso!');
    db.close();
  });
});
