# Instructions pour exécuter le projet

## Prérequis
- Node.js installé
- PostgreSQL installé

## Étapes
1. Clonez le dépôt GitHub :
   ```bash
   git clone https://github.com/Dukent29/smart-gardening.git
   cd smart-gardening
   
2. Installez les dépendances :
   ```bash
    npm install
    ```
3. Importez la base de données :
   - Ouvrez PostgreSQL et créez une nouvelle base de données nommée `smart_garden`.
   - Importez le fichier `smart_garden.sql` situé dans le dossier `db` :
     ```bash
     psql -U your_username -d smart_gardening -f path/to/database.sql
     ```
4. lancer le serveur :
   ```bash
   node index.js
   ```
Accédez à l'api à l'adresse http://localhost:5000.