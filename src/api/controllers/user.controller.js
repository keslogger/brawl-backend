const { User } = require('../../models');
const bcrypt = require('bcryptjs');

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
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
    }

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
