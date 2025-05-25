const bcrypt = require('bcryptjs');

const plainPassword = 'admin123';

const hashedPassword = bcrypt.hashSync(plainPassword, 10);
console.log('Hashed Password:', hashedPassword);