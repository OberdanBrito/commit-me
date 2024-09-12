#!/usr/local/bin/node

const fs = require('fs');
const childProcess = require('child_process');

/**
 * Executa uma comando shell e retorna uma promessa com o resultado.
 * @param {string} command - O comando shell a ser executado.
 * @returns {Promise} Uma promessa que resolve com os resultados do comando ou rejeita se houver erro.
 */
function executeShellCommand(command) {
  return new Promise((resolve, reject) => {
    childProcess.exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(stdout, stderr)
        // Se ocorrer um erro durante a execução do comando, rejeitamos a promessa com o erro.
        reject(error);
      } else {
        try {

          // Tenta parsear o stdout como JSON para obter dados estruturados.
          resolve(JSON.parse(stdout));
        } catch (parseError) {

          // Se não for possível parsear como JSON, retorna o stdout como objeto com sucesso.
          resolve({ success: true, stdout });
        }
      }
    });
  });
}

/**
 * Verifica se um arquivo está bloqueado (usando).
 * @param {string} filePath - O caminho do arquivo a ser verificado.
 * @returns {boolean} True se o arquivo estiver bloqueado, false caso contrário.
 */
function isFileLocked(filePath) {
  try {
    fs.accessSync(filePath, fs.constants.F_OK + fs.constants.W_OK);
    return false;
  } catch (err) {
    return true;
  }
}

/**
 * Processa os commits automaticamente.
 * Esta função realiza os seguintes passos:
 * 1. Adiciona todos os arquivos modificados ao staging.
 * 2. Verifica quais arquivos foram modificados.
 * 3. Processa cada arquivo modificado.
 * 4. Faz o push dos commits para o repositório remoto.
 * @returns {Promise<void>} Uma promessa que resolve quando o processo for concluído.
 */
async function processCommits() {
  try {
    await executeShellCommand('git add .');
    const gitstatus = await executeShellCommand('git status --porcelain');
    const files = gitstatus.stdout.split('\n');

    if (files.length > 0) {
      await processFiles(files);
      await executeShellCommand(`git push`);
    }
  } catch (error) {
    console.error('Erro:', error);
  }
}

/**
 * Processa os arquivos modificados.
 * Itera sobre os itens de status do Git, excluindo certos arquivos e verificando se estão bloqueados.
 * Para cada arquivo válido, chama processSingleFile().
 * @param {Array<string>} files - Array de strings contendo o status dos arquivos.
 */
async function processFiles(files) {
  for (const statusItem of files) {
    if (statusItem === '' || statusItem.includes('update.sh') || statusItem.includes('update.js')) {
      continue;
    }

    const file = statusItem.split(' ')[2];
    console.log(file);
    if (!isFileLocked(file)) {
      await processSingleFile(file);
    }
  }
}

/**
 * Processa um único arquivo modificado.
 * Lê o conteúdo do arquivo, procura por uma linha específica e faz um commit com ela.
 * @param {string} file - O caminho do arquivo a ser processado.
 */
async function processSingleFile(file) {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp} processando commits`);
  
  const data = await fs.promises.readFile(file, 'utf8');
  
  // Procura por uma linha que comece com "// COMMIT:" até o final da linha
  const matchLine = data.match(/\/\/\s*COMMIT:\s*.*/m)?.[0] || '';
  const message = matchLine.replace('// COMMIT:', '').trim();
  const commitMessage = `${timestamp} ${message}`;
  await executeShellCommand(`git commit -m "${commitMessage}"`);
  console.log(commitMessage);
}

/**
 * Inicia o processo de commit em intervalos regulares.
 * Usa a variável de argumento de linha de comando para definir o intervalo entre os commits.
 * @returns {void}
 */
function startRegular() {
  const intervalTime = parseInt(process.argv[2]) || 600000;
  setInterval(async () => {
    await processCommits();
  }, intervalTime);
}

processCommits().then(() => {
  console.log('Iniciando o processo de commit em intervalos');
  startRegular();
});
