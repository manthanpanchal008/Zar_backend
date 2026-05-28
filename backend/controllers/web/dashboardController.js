const { listJewels } = require('../../models/jewelModel');
const { getDashboardSummary } = require('../../models/metaModel');

async function index(req, res) {
  if (req.session.user) return res.redirect('/dashboard');
  return res.redirect('/login');
}

async function dashboard(req, res) {
  try {
    const [jewels, summary] = await Promise.all([
      listJewels(),
      getDashboardSummary(),
    ]);

    return res.render('dashboard', {
      user: req.session.user,
      jewels,
      summary,
      message: res.locals.flashMessage,
    });
  } catch (error) {
    console.error('Failed to load dashboard:', error);
    return res.render('dashboard', {
      user: req.session.user,
      jewels: [],
      summary: null,
      message: 'Unable to load inventory right now.',
    });
  }
}

module.exports = {
  index,
  dashboard,
};
