
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const path = require('path');
const fs = require('fs');
const { isValidEmail, hasRequiredFields } = require('./helper');
const {
  getAllUsers,
  getUserById,
  addUser,
  updateUser,
  deleteUser
} = require('./data');

const app = express();
const PORT = 6000;

app.use(morgan('dev')); 
app.use(bodyParser.json());  

// Favicon
const faviconPath = path.join(__dirname, 'public', 'favicon.ico');
if (fs.existsSync(faviconPath)) {
  app.use(favicon(faviconPath));
} else {
  console.warn('favicon.ico introuvable. Le serveur démarre sans favicon.');
}

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ------------------- API USERS ------------------- //

// GET
app.get('/api/users', (req, res) => {
  res.status(200).json(getAllUsers());
});

// GET - ID
app.get('/api/users/:id', (req, res, next) => {
  const user = getUserById(parseInt(req.params.id));
  if (!user) {
    const err = new Error('Utilisateur non trouvé');
    err.status = 404;
    return next(err);
  }
  res.status(200).json(user);
});

app.post('/api/users', (req, res, next) => {
    const { name, email, role } = req.body;
  
    if (!hasRequiredFields(req.body, ['name', 'email', 'role'])) {
      const err = new Error('Champs requis manquants');
      err.status = 400;
      return next(err);
    }
  
    if (!isValidEmail(email)) {
      const err = new Error('Email invalide');
      err.status = 400;
      return next(err);
    }
  
    const newUser = addUser({ name, email, role });
    res.status(201).json(newUser);
  });
  

app.put('/api/users/:id', (req, res, next) => {
  const id = parseInt(req.params.id);
  const updatedUser = updateUser(id, req.body);
  if (!updatedUser) {
    const err = new Error('Utilisateur non trouvé');
    err.status = 404;
    return next(err);
  }
  res.status(200).json(updatedUser);
});

app.delete('/api/users/:id', (req, res, next) => {
  const id = parseInt(req.params.id);
  const success = deleteUser(id);
  if (!success) {
    const err = new Error('Utilisateur non trouvé');
    err.status = 404;
    return next(err);
  }
  res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
});


app.use((err, req, res, next) => {
  console.error('Erreur détectée :', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Erreur serveur',
  });
});


app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
