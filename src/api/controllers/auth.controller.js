const { User } = require('../../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); // Criptografa a senha
    const newUser = await User.create({ email, password: hashedPassword });
    res.status(201).json({ message: 'Usuário criado com sucesso!', userId: newUser.id });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao registrar usuário: ' + error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado!' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Senha inválida!' });
    }

    // Gera o Token JWT se o login for bem-sucedido
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'seu_segredo_super_secreto', // Crie JWT_SECRET no seu .env
      { expiresIn: '8h' }
    );

    res.status(200).json({ token });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao fazer login: ' + error.message });
  }
};