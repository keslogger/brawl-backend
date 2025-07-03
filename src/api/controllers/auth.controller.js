const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Melhoria de segurança: Verifica se já existe um super_admin no sistema.
    const superAdminExists = await User.findOne({ where: { role: 'super_admin' } });

    if (superAdminExists) {
      return res.status(403).json({
        error: 'Registro falhou: um super_admin já existe no sistema.',
      });
    }

    // Criptografa a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Correção: Adiciona a 'role' ao criar o usuário para evitar o erro notNull.
    const newUser = await User.create({
      email,
      password: hashedPassword,
      role: 'super_admin',
    });

    res.status(201).json({ message: 'Usuário super_admin registrado com sucesso!', userId: newUser.id });
  } catch (error) {
    // Trata erros específicos como email duplicado (409 Conflict)
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: 'Erro ao registrar usuário: o email já está em uso.' });
    }
    // Para outros erros, retorna um erro de servidor genérico.
    res.status(500).json({ error: 'Erro ao registrar usuário: ' + error.message });
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
