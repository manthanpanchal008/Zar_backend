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

function setFlash(req, type, message) {
  req.session.flash = { type, message };
}

async function index(req, res) {
  try {
    const users = await listUsers();
    return res.render('users/index', {
      user: req.session.user,
      users,
      message: res.locals.flashMessage,
      error: res.locals.flashError,
    });
  } catch (error) {
    console.error('Failed to load users:', error);
    return res.render('users/index', {
      user: req.session.user,
      users: [],
      message: null,
      error: 'Unable to load users right now.',
    });
  }
}

async function add(req, res) {
  try {
    const roles = await listUserRoles();
    return res.render('users/add', {
      user: req.session.user,
      roles,
      error: null,
      formData: {},
    });
  } catch (error) {
    console.error('Failed to load user roles:', error);
    return res.redirect('/users');
  }
}

async function store(req, res) {
  const { name, email, password, role } = req.body;
  const roles = await listUserRoles();

  // Required fields
  if (!name || !email || !password || !role) {
    return res.render('users/add', {
      user: req.session.user,
      roles,
      error: 'All fields are required.',
      formData: { name, email, role },
    });
  }

  // Email format
  if (!EMAIL_REGEX.test(email.trim())) {
    return res.render('users/add', {
      user: req.session.user,
      roles,
      error: 'Please provide a valid email address.',
      formData: { name, email, role },
    });
  }

  // Password length
  if (password.length < PASSWORD_MIN_LENGTH) {
    return res.render('users/add', {
      user: req.session.user,
      roles,
      error: `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`,
      formData: { name, email, role },
    });
  }

  // Valid role
  if (!roles.includes(role)) {
    return res.render('users/add', {
      user: req.session.user,
      roles,
      error: 'Invalid role selected.',
      formData: { name, email, role },
    });
  }

  try {
    const existing = await findUserByEmail(email.trim().toLowerCase());
    if (existing) {
      return res.render('users/add', {
        user: req.session.user,
        roles,
        error: 'A user with this email already exists.',
        formData: { name, email, role },
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await createUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      role,
    });

    setFlash(req, 'success', 'User created successfully.');
    return res.redirect('/users');
  } catch (error) {
    console.error('Failed to create user:', error);
    return res.render('users/add', {
      user: req.session.user,
      roles,
      error: 'Failed to create user. Please try again.',
      formData: { name, email, role },
    });
  }
}

async function edit(req, res) {
  const { id } = req.params;
  try {
    const roles = await listUserRoles();
    const editUser = await findUserById(id);
    if (!editUser) {
      setFlash(req, 'error', 'User not found.');
      return res.redirect('/users');
    }
    return res.render('users/edit', {
      user: req.session.user,
      roles,
      editUser,
      error: null,
    });
  } catch (error) {
    console.error('Failed to load user:', error);
    setFlash(req, 'error', 'Unable to load user.');
    return res.redirect('/users');
  }
}

async function update(req, res) {
  const { id } = req.params;
  const { name, email, role, password } = req.body;
  const roles = await listUserRoles();

  // Helper to re-render with error
  async function renderEditWithError(errorMsg) {
    const editUser = await findUserById(id).catch(() => ({ id, name, email, role }));
    return res.render('users/edit', {
      user: req.session.user,
      roles,
      editUser: editUser || { id, name, email, role },
      error: errorMsg,
    });
  }

  if (!name || !email || !role) {
    return renderEditWithError('Name, email and role are required.');
  }

  if (!EMAIL_REGEX.test(email.trim())) {
    return renderEditWithError('Please provide a valid email address.');
  }

  if (!roles.includes(role)) {
    return renderEditWithError('Invalid role selected.');
  }

  // New password provided — validate length
  if (password && password.trim() && password.trim().length < PASSWORD_MIN_LENGTH) {
    return renderEditWithError(`New password must be at least ${PASSWORD_MIN_LENGTH} characters.`);
  }

  try {
    const duplicate = await emailExistsForOtherId(email.trim().toLowerCase(), id);
    if (duplicate) {
      return renderEditWithError('Another user already has this email address.');
    }

    let hashedPassword = null;
    if (password && password.trim()) {
      hashedPassword = await bcrypt.hash(password.trim(), 10);
    }

    await updateUserById(id, {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role,
      password: hashedPassword,
    });

    // If admin edited their own profile, refresh the session data
    if (String(req.session.user.id) === String(id)) {
      req.session.user = {
        ...req.session.user,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role,
      };
    }

    setFlash(req, 'success', 'User updated successfully.');
    return res.redirect('/users');
  } catch (error) {
    console.error('Failed to update user:', error);
    setFlash(req, 'error', 'Update failed. Please try again.');
    return res.redirect(`/users/edit/${id}`);
  }
}

async function destroy(req, res) {
  const { id } = req.params;

  if (String(req.session.user.id) === String(id)) {
    setFlash(req, 'error', 'You cannot delete your own account.');
    return res.redirect('/users');
  }

  try {
    await deleteUserById(id);
    setFlash(req, 'success', 'User deleted successfully.');
    return res.redirect('/users');
  } catch (error) {
    console.error('Failed to delete user:', error);
    setFlash(req, 'error', 'Failed to delete user. Please try again.');
    return res.redirect('/users');
  }
}

module.exports = {
  index,
  add,
  store,
  edit,
  update,
  destroy,
};
