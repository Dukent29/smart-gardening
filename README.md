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
        psql -U postgres -d smart_gardening -f db/smart_garden.sql
        ```
        MongoDB
      - Assurez-vous que MongoDB est en cours d'exécution sur votre machine.
      - Importez la base de données MongoDB située dans` :
        ```bash
        db/smart_garden/ :
         mongorestore --db smart_garden
        ```
4. lancer le serveur :
   ```bash
   node index.js
   ```
Accédez à l'api à l'adresse http://localhost:5000.

# Structure du projet
Le projet est structuré comme suit :

projet-final-2/
├── config/
│   ├── mongo.js                # Configuration pour MongoDB
│   ├── pg.js                   # Configuration pour PostgreSQL
│   ├── multer.js               # Configuration pour le téléchargement de fichiers
├── controllers/
│   ├── articleController.js    # Contrôleur pour les articles
│   ├── plantController.js      # Contrôleur pour les plantes
│   ├── sensorController.js     # Contrôleur pour les capteurs
│   ├── sensorMockController.js # Contrôleur pour les capteurs simulés
│   ├── notificationController.js # Contrôleur pour les notifications
├── middleware/
│   ├── auth.js                 # Middleware pour l'authentification JWT
│   ├── validateUser.js         # Middleware pour valider les données utilisateur
├── models/
│   ├── plantModel.js           # Modèle pour les plantes
│   ├── sensorModel.js          # Modèle pour les capteurs
│   ├── userModel.js            # Modèle pour les utilisateurs
├── routes/
│   ├── users.js                # Routes pour les utilisateurs
│   ├── plants.js               # Routes pour les plantes
│   ├── sensors.js              # Routes pour les capteurs
│   ├── mock.js                 # Routes pour les données simulées
│   ├── articles.js             # Routes pour les articles
│   ├── notifications.js        # Routes pour les notifications
├── services/
│   ├── simulateLoop.js         # Service pour simuler des boucles automatiques
│   ├── sendEmail.js            # Service pour envoyer des emails
├── uploads/                    # Dossier pour les fichiers téléchargés (images, etc.)
├── server.js                   # Point d'entrée principal du serveur
├── package.json                # Dépendances et scripts du projet
├── README.md                   # Documentation du projet