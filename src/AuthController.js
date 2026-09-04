const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const makeToken = user => jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Nome, email e senha são obrigatórios' });
    if (await User.findOne({ email })) return res.status(400).json({ message: 'Email já cadastrado' });
    const user = await new User({ name, email, password }).save();
    res.status(201).json({ token: makeToken(user), user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) { res.status(500).json({ message: 'Erro ao registrar usuário', error: error.message }); }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !user.password || !(await user.comparePassword(password))) return res.status(401).json({ message: 'Credenciais inválidas' });
    user.lastLogin = new Date(); await user.save();
    res.json({ token: makeToken(user), user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar } });
  } catch (error) { res.status(500).json({ message: 'Erro ao fazer login', error: error.message }); }
};

exports.googleLogin = async (req, res) => {
  try {
    const { token: googleToken } = req.body;
    const ticket = await googleClient.verifyIdToken({ idToken: googleToken, audience: process.env.GOOGLE_CLIENT_ID });
    const { sub: googleId, email, name, picture } = ticket.getPayload();
    let user = await User.findOne({ $or: [{ googleId }, { email }] });
    if (!user) user = await new User({ googleId, email, name, avatar: picture }).save();
    else { user.googleId = user.googleId || googleId; user.avatar = picture || user.avatar; await user.save(); }
    user.lastLogin = new Date(); await user.save();
    res.json({ token: makeToken(user), user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar } });
  } catch (error) { res.status(401).json({ message: 'Token Google inválido', error: error.message }); }
};