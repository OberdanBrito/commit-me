### Estratégia de desenvolvimento
No GitHub (e em qualquer sistema de controle de versão que utiliza Git), as branches (ramificações) são utilizadas para desenvolver funcionalidades ou corrigir bugs de forma isolada, sem afetar o código principal. Existem algumas branches que são mais comumente utilizadas, especialmente em projetos que seguem boas práticas de desenvolvimento e colaboração. Vou explicar as principais:

### 1. **Branch `main` ou `master`**

- **Descrição**: A branch `main` (ou `master`, como era conhecida antes da mudança de nomenclatura para promover inclusão) é a branch principal do repositório. Geralmente, ela contém o código que está em produção ou pronto para ser liberado.
- **Uso Comum**: Essa branch deve estar sempre estável e pronta para ser liberada em produção. Apenas código testado e revisado deve ser mesclado (merged) para essa branch.

### 2. **Branch `develop`**

- **Descrição**: A branch `develop` é frequentemente usada como a principal linha de desenvolvimento. É onde os desenvolvedores integram suas funcionalidades após concluírem suas implementações em branches específicas de funcionalidades (feature branches).
- **Uso Comum**: Utilizada em projetos que seguem o fluxo de trabalho GitFlow. A branch `develop` pode conter código que passou por testes iniciais, mas que ainda não está pronto para produção. As branches de funcionalidade são mescladas com `develop`, e depois `develop` é mesclada em `main` para releases.

### 3. **Branches de Funcionalidade (`feature`)**

- **Descrição**: Estas são branches temporárias criadas a partir de `develop` (ou diretamente de `main`, dependendo do fluxo) para trabalhar em novas funcionalidades específicas ou melhorias.
- **Naming Convention**: Comumente nomeadas como `feature/nome-da-funcionalidade` (por exemplo, `feature/login-usuario`).
- **Uso Comum**: Cada desenvolvedor cria uma branch para cada nova funcionalidade em que está trabalhando, mantendo o código separado e evitando conflitos. Quando a funcionalidade estiver completa e testada, é feito um merge na branch `develop`.

### 4. **Branches de Correção de Bugs (`bugfix`)**

- **Descrição**: Semelhante às branches de funcionalidade, mas criadas especificamente para corrigir bugs.
- **Naming Convention**: Usualmente nomeadas como `bugfix/nome-do-bug` (por exemplo, `bugfix/corrige-login-nulo`).
- **Uso Comum**: Criadas a partir da branch `develop` (ou `main` se for um bug em produção). Após a correção e o teste, são mescladas de volta para `develop` ou `main`.

### 5. **Branches de Hotfix (`hotfix`)**

- **Descrição**: São branches usadas para corrigir problemas críticos que surgem em produção. São semelhantes às branches de correção de bugs, mas o foco é em correções rápidas para o código em produção.
- **Naming Convention**: Normalmente nomeadas como `hotfix/nome-do-hotfix` (por exemplo, `hotfix/corrige-seguranca`).
- **Uso Comum**: Criadas a partir da branch `main` para correções urgentes em produção. Depois de finalizado e testado, o código é mesclado de volta para `main` e `develop`.

### 6. **Branches de Release (`release`)**

- **Descrição**: Essas branches são usadas para preparar uma nova versão para produção. Normalmente, são criadas a partir da branch `develop` quando uma nova versão está pronta para ser lançada.
- **Naming Convention**: Geralmente nomeadas como `release/versao` (por exemplo, `release/v1.2.0`).
- **Uso Comum**: Permitem pequenos ajustes e testes finais antes de serem mescladas na branch `main` para produção e em `develop` para manter a paridade entre elas.

### 7. **Branches de Experimentos ou POCs (Provas de Conceito)**

- **Descrição**: Essas branches são criadas para testar novas ideias, implementações experimentais ou provas de conceito (POCs).
- **Naming Convention**: Podem ser nomeadas como `experiment/nome-do-experimento` ou `poc/nome-da-poc`.
- **Uso Comum**: Utilizadas para validar novas abordagens ou tecnologias. Normalmente, são descartadas após a conclusão do experimento, ou incorporadas como uma nova funcionalidade se o experimento for bem-sucedido.
