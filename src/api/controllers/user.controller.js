const { User } = require('../../models');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

// Lista todos os utilizadores (exceto as suas senhas)
exports.listarUsuarios = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] } // Nunca envie senhas para o front-end
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar utilizadores.' });
  }
};

// Cria um novo utilizador (com a função 'admin' por padrão)
exports.criarAdmin = async (req, res) => {
  try {
    // Verifica se houve erros de validação definidos na rota
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Se houver erros, retorna 400 com a lista de erros
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // O super_admin só pode criar novos utilizadores com a função 'admin'
    const newUser = await User.create({ 
        email, 
        password: hashedPassword,
        role: 'admin' 
    });

    // Remove a senha antes de enviar a resposta
    const userResponse = newUser.toJSON();
    delete userResponse.password;

    res.status(201).json(userResponse);
  } catch (error) {
    // Trata o erro caso o email já exista
    if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({ error: 'Este email já está em uso.' });
    }
    res.status(400).json({ error: 'Erro ao criar utilizador: ' + error.message });
  }
};

// Apaga um utilizador
exports.deletarUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    // Impede que o super_admin se apague a si mesmo
    if (req.user.id === Number(id)) {
        return res.status(403).json({ error: 'Não é possível apagar a sua própria conta.' });
    }

    const deleted = await User.destroy({
      where: { id: id }
    });

    if (deleted) {
      res.status(204).send(); // 204 No Content
    } else {
      res.status(404).json({ error: 'Utilizador não encontrado.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao apagar utilizador.' });
  }
};

// --- FUNÇÃO DE LOGIN ADICIONADA ---
/**
 * @description Autentica um usuário e retorna um token JWT.
 */
exports.login = async (req, res) => {
  try {
    // Verifica se houve erros de validação definidos na rota
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Encontrar o usuário pelo email no banco de dados
    const user = await User.findOne({ where: { email } });
    if (!user) {
      // Usamos uma mensagem genérica por segurança, para não informar se o email existe ou não
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    // Comparar a senha fornecida com a senha criptografada no banco
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    // Se as credenciais estiverem corretas, gerar o token JWT
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role, // Incluir a 'role' no token é muito útil para autorização
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'seu_segredo_super_secreto',
      { expiresIn: '1h' } // O token expira em 1 hora
    );

    // Enviar o token para o cliente
    res.status(200).json({ token });

  } catch (error) {
    console.error('Erro no processo de login:', error);
    res.status(500).json({ error: 'Ocorreu um erro interno no servidor.' });
  }
};
