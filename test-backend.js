// Backend de test simple pour démontrer la connexion
const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Données de test
let users = [
    { id: 1, email: 'admin@demo.com', firstName: 'Admin', lastName: 'Demo', role: 'admin' },
    { id: 2, email: 'user@demo.com', firstName: 'User', lastName: 'Test', role: 'user' }
];

let accounts = [
    { id: 1, name: 'Compte Courant', balance: 2500.00, type: 'checking' },
    { id: 2, name: 'Livret A', balance: 5000.00, type: 'savings' }
];

let transactions = [
    { id: 1, description: 'Salaire', amount: 3000, type: 'income', date: '2024-01-01', accountId: 1 },
    { id: 2, description: 'Loyer', amount: -800, type: 'expense', date: '2024-01-02', accountId: 1 }
];

// Routes de santé
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: '1.0.0'
    });
});

// Routes d'authentification
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    
    const user = users.find(u => u.email === email);
    if (!user || password !== 'Admin123!') {
        return res.status(401).json({ error: 'Identifiants invalides' });
    }
    
    const token = Buffer.from(JSON.stringify({
        sub: user.id,
        email: user.email,
        exp: Date.now() / 1000 + 3600 // 1 heure
    })).toString('base64');
    
    res.json({
        token,
        user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role
        }
    });
});

app.post('/api/auth/register', (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    
    if (users.find(u => u.email === email)) {
        return res.status(400).json({ error: 'Email déjà utilisé' });
    }
    
    const newUser = {
        id: users.length + 1,
        firstName,
        lastName,
        email,
        role: 'user'
    };
    
    users.push(newUser);
    
    const token = Buffer.from(JSON.stringify({
        sub: newUser.id,
        email: newUser.email,
        exp: Date.now() / 1000 + 3600
    })).toString('base64');
    
    res.json({
        token,
        user: newUser
    });
});

app.post('/api/auth/logout', (req, res) => {
    res.json({ message: 'Déconnexion réussie' });
});

app.get('/api/auth/me', (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({ error: 'Token manquant' });
    }
    
    try {
        const payload = JSON.parse(Buffer.from(token, 'base64').toString());
        const user = users.find(u => u.id === payload.sub);
        
        if (!user) {
            return res.status(401).json({ error: 'Utilisateur non trouvé' });
        }
        
        res.json(user);
    } catch (error) {
        res.status(401).json({ error: 'Token invalide' });
    }
});

// Routes des comptes
app.get('/api/accounts', (req, res) => {
    res.json(accounts);
});

app.post('/api/accounts', (req, res) => {
    const { name, balance, type } = req.body;
    
    const newAccount = {
        id: accounts.length + 1,
        name,
        balance: parseFloat(balance),
        type
    };
    
    accounts.push(newAccount);
    res.json(newAccount);
});

// Routes des transactions
app.get('/api/transactions', (req, res) => {
    res.json(transactions);
});

app.post('/api/transactions', (req, res) => {
    const { description, amount, type, date, accountId } = req.body;
    
    const newTransaction = {
        id: transactions.length + 1,
        description,
        amount: parseFloat(amount),
        type,
        date,
        accountId
    };
    
    transactions.push(newTransaction);
    res.json(newTransaction);
});

// Routes des statistiques
app.get('/api/statistics', (req, res) => {
    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    res.json({
        totalIncome,
        totalExpenses,
        balance: totalIncome - totalExpenses,
        transactionCount: transactions.length,
        accountCount: accounts.length
    });
});

app.get('/api/statistics/balance-history', (req, res) => {
    res.json([
        { date: '2024-01-01', balance: 2500 },
        { date: '2024-01-02', balance: 1700 },
        { date: '2024-01-03', balance: 4700 }
    ]);
});

// Routes d'export
app.get('/api/export/excel', (req, res) => {
    res.json({ message: 'Export Excel généré', downloadUrl: '/downloads/export.xlsx' });
});

app.get('/api/export/csv', (req, res) => {
    res.json({ message: 'Export CSV généré', downloadUrl: '/downloads/export.csv' });
});

app.get('/api/export/pdf', (req, res) => {
    res.json({ message: 'Export PDF généré', downloadUrl: '/downloads/export.pdf' });
});

// Middleware de gestion d'erreur
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Erreur interne du serveur' });
});

// Démarrage du serveur
app.listen(port, () => {
    console.log(`🚀 Backend de test démarré sur http://localhost:${port}`);
    console.log(`📊 Endpoints disponibles:`);
    console.log(`   GET  /api/health - Santé du serveur`);
    console.log(`   POST /api/auth/login - Connexion`);
    console.log(`   POST /api/auth/register - Inscription`);
    console.log(`   GET  /api/accounts - Liste des comptes`);
    console.log(`   GET  /api/transactions - Liste des transactions`);
    console.log(`   GET  /api/statistics - Statistiques`);
    console.log(`\n🔐 Comptes de test:`);
    console.log(`   admin@demo.com / Admin123!`);
    console.log(`   user@demo.com / Admin123!`);
});