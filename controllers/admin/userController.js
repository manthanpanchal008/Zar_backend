const bcrypt = require('bcrypt');
const {
  listUsers,
  findUserById,
  createUser,
  updateUserById,
  deleteUserById,
  findUserByEmail,
  emailExistsForOtherId,
} = require('../../models/userModel');
const { listUserRoles } = require('../../models/metaModel');

const PASSWORD_MIN_LENGTH = 6;
const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

function validateUserPayload({ name, email, role, password }, roles, isCreate) {
  if (!name || !email || !role || (isCreate && !password)) return 'All required fields must be provided.';
  if (!EMAIL_REGEX.test(String(email).trim())) return 'Please provide a valid email address.';
  if (!roles.includes(role)) return 'Invalid role selected.';
  if (password && password.length < PASSWORD_MIN_LENGTH) return `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`;
  return null;
}

async function index(_req, res) {
  try {
    const users = await listUsers();
    return res.json({ success: true, users });
  } catch (error) {
    console.error('Failed to fetch admin users:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch users.' });
  }
}

async function roles(_req, res) {
  try {
    return res.json({ success: true, roles: await listUserRoles() });
  } catch (error) {
    console.error('Failed to fetch roles:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch roles.' });
  }
}

async function store(req, res) {
  const rolesList = await listUserRoles();
  const validationError = validateUserPayload(req.body, rolesList, true);
  if (validationError) return res.status(400).json({ success: false, error: validationError });

  try {
    const email = req.body.email.trim().toLowerCase();
    const existing = await findUserByEmail(email);
    if (existing) return res.status(409).json({ success: false, error: 'A user with this email already exists.' });

    const password = await bcrypt.hash(req.body.password, 10);
    const id = await createUser({
      name: req.body.name.trim(),
      email,
      password,
      role: req.body.role,
    });
    return res.status(201).json({ success: true, message: 'User created successfully.', user: await findUserById(id) });
  } catch (error) {
    console.error('Failed to create admin user:', error);
    return res.status(500).json({ success: false, error: 'Failed to create user.' });
  }
}

async function update(req, res) {
  const rolesList = await listUserRoles();
  const validationError = validateUserPayload(req.body, rolesList, false);
  if (validationError) return res.status(400).json({ success: false, error: validationError });

  try {
    const current = await findUserById(req.params.id);
    if (!current) return res.status(404).json({ success: false, error: 'User not found.' });

    const email = req.body.email.trim().toLowerCase();
    if (await emailExistsForOtherId(email, req.params.id)) {
      return res.status(409).json({ success: false, error: 'Another user already has this email address.' });
    }

    await updateUserById(req.params.id, {
      name: req.body.name.trim(),
      email,
      role: req.body.role,
      password: req.body.password ? await bcrypt.hash(req.body.password, 10) : null,
    });
    return res.json({ success: true, message: 'User updated successfully.', user: await findUserById(req.params.id) });
  } catch (error) {
    console.error('Failed to update admin user:', error);
    return res.status(500).json({ success: false, error: 'Failed to update user.' });
  }
}

async function destroy(req, res) {
  if (String(req.user.id) === String(req.params.id)) {
    return res.status(400).json({ success: false, error: 'You cannot delete your own account.' });
  }

  try {
    const existing = await findUserById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, error: 'User not found.' });

    await deleteUserById(req.params.id);
    return res.json({ success: true, message: 'User deleted successfully.' });
  } catch (error) {
    console.error('Failed to delete admin user:', error);
    return res.status(500).json({ success: false, error: 'Failed to delete user.' });
  }
}

async function show(req, res) {
  try {
    const user = await findUserById(req.params.id);
    if (!user) return res.status(404).json({ success: false, error: 'User not found.' });
    return res.json({ success: true, user });
  } catch (error) {
    console.error('Failed to fetch admin user:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch user.' });
  }
}

module.exports = {
  index,
  show,
  roles,
  store,
  update,
  destroy,
};
