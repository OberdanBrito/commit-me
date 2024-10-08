#!/usr/local/bin/node

//COMMIT: inclusão do script bash
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

async function init() {
  try {
    const result = await executeShellCommand("git ls-files -m");
    const modifiedFiles = result.stdout
        .trim()
        .split("\n")
        .filter((file) => file !== "");

    const commitMarkers = await findCommitMarkers(modifiedFiles);

    for (const marker of commitMarkers) {
      await executeShellCommand(`git add ${marker.file}`);
      await executeShellCommand(`git commit -m "${marker.message}"`);
    }

    console.log(`${new Date().toISOString()} All changes committed successfully.`);

    // Add push operation
    await executeShellCommand('git push origin main');

    console.log("Changes pushed successfully.");

  } catch (error) {
    console.error("Error committing changes:", error);
  }
}

// Helper function to read file contents
async function readFile(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, "utf8", (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

async function findCommitMarkers(files) {

  const commitContents = [];
  for (const file of files) {
    const content = await readFile(file);
    console.log(`Checking file ${file}:`);
    const matchLine = content.match(/\/\/\s*COMMIT:\s*.*/m)?.[0] || '';
    if (matchLine) {
      const message = matchLine.split(':')[1].trim()
      commitContents.push({ file, message: `${new Date().toISOString()} ${message}` });
    } else {
      commitContents.push({ file, message: `${new Date().toISOString()} Sem comentários` });
    }
  }
  return commitContents;
}

init().then(() => {});
setInterval(init, 300000); // 300000 milliseconds = 5 minutes
